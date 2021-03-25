import Tokenize from '@cyyynthia/tokenize';
import dotenv from 'dotenv';
import fastify from 'fastify';
import fastifyAuth from 'fastify-auth';
import fastifyBlipp from 'fastify-blipp';
import fastifyCookie from 'fastify-cookie';
import fastifyHelmet from 'fastify-helmet';
import fastifyMultipart from 'fastify-multipart';
import fastifyRateLimit from 'fastify-rate-limit';
import fastifySensible from 'fastify-sensible';
import fastifyStatic from 'fastify-static';
import fastifyTokenize from 'fastify-tokenize';
import fs from 'fs-extra';
import helmet from 'helmet';
import MimeMatcher from 'mime-matcher';
import path from 'path';
import { Sequelize } from 'sequelize-typescript';
import { pipeline } from 'stream';
import { keys } from 'ts-transformer-keys';
import { Mutable } from 'type-fest';
import util from 'util';
import { v4 as uuid } from 'uuid';
import models from './models';
import schemas from './schemas';
import {
  Endpoints, EndpointProvider, Query, Response,
} from '../types/Endpoints';
import IUser from '../types/User';
import apiPath from '../util/apiPath';
import currentTokenTime from '../util/currentTokenTime';
import Post from './models/Post';
import { WhereOptions } from 'sequelize/types';

dotenv.config();

const { env } = process;
// TODO: this needs to be set to something else when we actually host it
const media = path.resolve(__dirname, 'media');

/**
 * The main server class
 * Contains methods for interacting with the central backend
 */
export default class Server implements EndpointProvider {
  /**
   * The Fastify instance
   */
  public app = fastify({
    logger: env.NODE_ENV === 'development',
  });

  /**
   * ORM for interacting with the database
   */
  public database: Sequelize;

  private token!: Tokenize<IUser>;

  public constructor() {
    const { app } = this;
    if (env.PGUSER === undefined) {
      throw new Error('Missing Postgres user!');
    } else {
      this.database = new Sequelize(
        `postgres://${env.PGUSER}:${env.PGPASSWORD}@${env.PGHOST}:${env.PGPORT}/${env.PGDATABASE}`,
        {
          models: Object.values(models),
          logging: false,
        },
      );
    }

    // Set up Fastify plugins
    app.register(fastifyAuth);
    app.register(fastifyBlipp);
    app.register(fastifyCookie);
    const helmetOptions: Mutable<Parameters<typeof helmet>[0]> = {};
    if (env.NODE_ENV === 'development') {
      // Uses the least secure CSP possible in dev mode
      helmetOptions.contentSecurityPolicy = {
        directives: {
          defaultSrc: ['*', "'unsafe-inline'", "'unsafe-eval'"],
          scriptSrc: ['*', "'unsafe-inline'", "'unsafe-eval'"],
          connectSrc: ['*', "'unsafe-inline'"],
          imgSrc: ['*', "'unsafe-inline'"],
          frameSrc: ['*'],
          styleSrc: ['*', "'unsafe-inline'"],
        },
      };
    }
    app.register(fastifyHelmet, helmetOptions);
    // TODO: set upload size limits
    app.register(fastifyMultipart);
    // TODO: determine reasonable rate limit
    app.register(fastifyRateLimit, {
      max: 100,
      timeWindow: '1 minute',
    });
    app.register(fastifySensible);
    app.register(fastifyStatic, {
      root: __dirname,
    });

    if (env.AUTHKEY === undefined) {
      throw new Error('Missing encryption key!');
    } else {
      this.token = new Tokenize(env.AUTHKEY as string);
      app.register(fastifyTokenize, {
        fastifyAuth: true,
        fetchAccount: async (id) => {
          const results = await models.User.findOne({
            where: {
              id,
            },
          });
          if (results === null) {
            return {};
          }
          return results.toJSON();
        },
        secret: env.AUTHKEY,
      });
    }
  }

  /**
   * Starts the server
   * @param port The port to run the server on (defaults to 3000)
   */
  public async start(port = 3000): Promise<number> {
    const { app, database } = this;

    // Ensure media directory exists
    await fs.ensureDir(media);

    // Automatically creates endpoints based on Endpoints.ts
    type QueryKeys = {
      [key in keyof Endpoints]: keyof Endpoints[key]['query'];
    };
    keys<Endpoints>().forEach((endpoint) => {
      this.app.post<{
        Body: Record<QueryKeys[typeof endpoint], string>;
      }>(apiPath(endpoint), {
        schema: {
          body: schemas[endpoint].query,
          response: {
            '2xx': {
              title: endpoint,
              properties: schemas[endpoint].response.properties,
            },
          },
        },
        handler: async (request) => this[endpoint](request.body),
      });
    });

    // Uploading has special instructions & can't be automatically generated
    app.post(apiPath('upload'), async (request) => {
      // TODO: convert all images to jpg
      const id = uuid();
      const file = await request.file();
      let valid = false;
      ['image/*', 'video/*', 'audio/*']
        .map((mime) => new MimeMatcher(mime))
        .forEach((mime) => {
          valid = valid || mime.match(file.mimetype);
        });
      if (valid) {
        await util.promisify(pipeline)(
          file.file,
          fs.createWriteStream(path.join(media, file.filename.replace(/.*\.([a-z]+)/, `${id}.$1`))),
        );
      } else {
        throw this.app.httpErrors.forbidden();
      }
      // TODO: validation
      return {
        id,
      };
    });

    // Retrieves media from the media directoryd
    app.get<{
      Params: {
        id: string;
      };
    }>(path.join(apiPath('media'), ':id'), async (request) => fs.readFile(path.join(media, `${request.params.id}.jpg`)));

    // Start the server & establish database connection
    try {
      await database.authenticate();
      await database.sync({
        alter: true,
      });
      await app.listen(port);
      app.blipp();
    } catch (err) {
      app.log.error(err);
    }

    return port;
  }

  /**
   * Stops the HTTP server
   */
  public async stop(): Promise<undefined> {
    return this.app.close();
  }

  /**
   * Creates a new user account
   * @param params Contains POSTed account details
   */
  public async createAccount(params: Query<'createAccount'>): Promise<Response<'createAccount'>> {
    // Check that username isn't already in use
    const results = await models.User.findOne({
      where: {
        username: params.username,
      },
    });
    if (results === null) {
      // TODO: sanitize params, 2 step encryption & https
      const user = await new models.User({
        ...params,
        lastTokenReset: currentTokenTime(),
      }).save();
      return {
        id: user.get('id'),
      };
    }
    throw this.app.httpErrors.conflict();
  }

  /**
   * Creates a post
   * @param params Post metadata
   */
  public async createPost(params: Query<'createPost'>): Promise<Response<'createPost'>> {
    const user = await this.token.validate(params.token, async (id) => {
      const res = await models.User.findOne({
        where: {
          id,
        },
      });
      if (res) {
        return res.toJSON() as IUser;
      }
      return null;
    });
    if (user === false || user === null) {
      throw this.app.httpErrors.unauthorized();
    }
    return {
      id: (
        await new models.Post({
          media: params.media,
          author: user.id,
          created: new Date().toISOString(),
          expires: params.expires,
          description: params.description,
        }).save()
      ).get('id'),
    };
  }

  /**
   * Gets a feed of posts using the specified search parameters
   * @param param parameters for finding posts
   * @returns the list of posts
   */
  public async getFeed({ author }: Query<'getFeed'>): Promise<Response<'getFeed'>> {
    const where: WhereOptions = {};
    if (author != undefined) {
      where.author = author;
    }
    const results = await Post.findAll({
      where,
    });
    return results.map((value) => value.toJSON());
  }

  /**
   * Retrieves a post
   * @param params The post ID
   */
  public async getPost({ id }: Query<'getPost'>): Promise<Response<'getPost'>> {
    // TODO: check that user has permissions to view the post
    try {
      const results = await models.Post.findOne({
        where: {
          id,
        },
      });
      if (results !== null) {
        return results.toJSON();
      }
      throw this.app.httpErrors.badRequest();
    } catch (err) {
      throw this.app.httpErrors.badRequest();
    }
  }

  /**
   * Retrieves a user
   * @param params The user ID
   */
  public async getUser({ id }: Query<'getUser'>): Promise<Response<'getUser'>> {
    const results = await models.User.findOne({
      where: {
        id,
      },
    });
    if (results !== null) {
      return results.toJSON();
    }
    throw this.app.httpErrors.badRequest();
  }

  /**
   * Signs the user in
   * @param params Username & password
   */
  public async signIn({ username, password }: Query<'signIn'>): Promise<Response<'signIn'>> {
    const results = await models.User.findOne({
      where: {
        username,
        password,
      },
    });
    if (results !== null) {
      const id = results.get('id');
      // Update lastTokenReset to the current time
      results.set('lastTokenReset', currentTokenTime());
      await results.save();
      return {
        id,
        token: this.token.generate(id),
      };
    }
    throw this.app.httpErrors.badRequest();
  }
}
