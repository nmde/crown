import Tokenize from '@cyyynthia/tokenize';
import dotenv from 'dotenv';
import fastify from 'fastify';
import fastifyAuth from 'fastify-auth';
import fastifyCookie from 'fastify-cookie';
import fastifyHelmet from 'fastify-helmet';
import fastifyMultipart from 'fastify-multipart';
import fastifyRateLimit from 'fastify-rate-limit';
import fastifySensible from 'fastify-sensible';
import fastifyStatic from 'fastify-static';
import fastifyTokenize from 'fastify-tokenize';
import fs from 'fs-extra';
import path from 'path';
import { Sequelize } from 'sequelize-typescript';
import { pipeline } from 'stream';
import { keys } from 'ts-transformer-keys';
import util from 'util';
import { v4 as uuid } from 'uuid';
import models from './models';
import schemas from './schemas';
import {
  Endpoints, EndpointProvider, Query, Response,
} from '../types/Endpoints';
import apiPath from '../util/apiPath';
import errors from '../util/errors';

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
    logger: true,
  });

  /**
   * ORM for interacting with the database
   */
  public database: Sequelize;

  private models = models;

  private token: Tokenize;

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
    app.register(fastifyAuth);
    app.register(fastifyCookie);
    app.register(fastifyHelmet);
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
      throw new Error('Missing auth key!');
    } else {
      this.token = new Tokenize(env.AUTHKEY);
      app.register(fastifyTokenize, {
        fastifyAuth: true,
        fetchAccount: async (id) => this.models.User.findOne({
          where: {
            id,
          },
        }),
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
              properties: {
                data: {
                  type: 'object',
                  properties: schemas[endpoint].response.properties,
                },
              },
              required: ['data'],
            },
          },
        },
        handler: async (request) => {
          let response: Response<typeof endpoint> = {};
          try {
            response = await this[endpoint](request.body);
          } catch (err) {
            response.error = err;
          }
          return response;
        },
      });
    });

    // Uploading media has special instructions & can't be automatically generated
    app.post(apiPath('media'), async (request) => {
      const id = uuid();
      // TODO: multiple MIME types, validation
      await util.promisify(pipeline)(
        (await request.file()).file,
        fs.createWriteStream(path.join(media, `${id}.mp4`)),
      );
      return {
        data: {
          id,
        },
      };
    });

    // Start the server & establish database connection
    try {
      await database.authenticate();
      await database.sync();
      await app.listen(port);
    } catch (err) {
      console.error(err);
      process.exit(1);
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
    const results = await this.models.User.findOne({
      where: {
        username: params.username,
      },
    });
    if (results === null) {
      // TODO: sanitize params, 2 step encryption & https
      const user = await new models.User(params).save();
      return {
        data: {
          id: user.get('id'),
        },
      };
    }
    return {
      error: errors.USER_EXISTS,
    };
  }

  /**
   * Signs the user in
   * @param params Username & password
   */
  public async signIn({ username, password }: Query<'signIn'>): Promise<Response<'signIn'>> {
    // TODO: handle tokens
    const results = await this.models.User.findOne({
      where: {
        username,
        password,
      },
    });
    if (results !== null) {
      const id = results.get('id');
      return {
        data: {
          id,
          token: this.token.generate(id),
        },
      };
    }
    return {
      error: 'Incorrect username or password',
    };
  }
}
