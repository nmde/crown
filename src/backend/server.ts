/* eslint-disable class-methods-use-this */
import dotenv from 'dotenv';
import fastify, { FastifySchema, RouteShorthandMethod } from 'fastify';
import fastifyMultipart from 'fastify-multipart';
import fastifyStatic from 'fastify-static';
import fs from 'fs-extra';
import path from 'path';
import { Sequelize } from 'sequelize-typescript';
import { pipeline } from 'stream';
import { keys } from 'ts-transformer-keys';
import util from 'util';
import { v4 as uuid } from 'uuid';
import models from './models';
import schemas from './schemas';
import { Endpoints, EndpointProvider } from '../types/Endpoints';

type GET = Endpoints['GET'];
type POST = Endpoints['POST'];

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
  public database = new Sequelize(
    `postgres://${env.PGUSER}:${env.PGPASSWORD}@${env.PGHOST}:${env.PGPORT}/${env.PGDATABASE}`,
    {
      models: Object.values(models),
    },
  );

  public constructor() {
    const { app } = this;
    // TODO: set upload size limits
    app.register(fastifyMultipart);
    app.register(fastifyStatic, {
      root: __dirname,
    });
  }

  /**
   * Generic API endpoint handler
   * @param type The request type this endpoint expects (GET or POST)
   * @param endpoint The name of the endpoint
   */
  private async createEndpoint(type: 'GET' | 'POST', endpoint: keyof GET | keyof POST) {
    const schema: FastifySchema = {
      response: {
        '2xx': schemas[endpoint].response,
      },
    };
    let method: RouteShorthandMethod;
    let dataKey: 'query' | 'body';

    // Endpoints are created slightly differently depending on if they're GET or POST
    if (type === 'GET') {
      schema.querystring = schemas[endpoint].query;
      method = this.app.get;
      dataKey = 'query';
    } else {
      schema.body = schemas[endpoint].query;
      method = this.app.post;
      dataKey = 'body';
    }
    method.call(this.app, `/api/${endpoint}`, {
      schema,
      handler: async (request) => {
        let message = 'OK';
        let error;
        let statusCode;
        try {
          statusCode = 200;
        } catch (err) {
          message = err.message;
          error = 'API error';
          statusCode = 500;
        }
        const response = {
          message,
          error,
          statusCode,
          data: request[dataKey],
        };
        return response;
      },
    });
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
    keys<GET>().forEach((endpoint) => {
      this.createEndpoint('GET', endpoint);
    });
    keys<POST>().forEach((endpoint) => {
      this.createEndpoint('POST', endpoint);
    });

    // Uploading media has special instructions & can't be automatically generated
    app.post('/api/media', async (request) => {
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
      app.log.error(err);
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
  public async createAccount(
    params: POST['createAccount']['query'],
  ): POST['createAccount']['response'] {
    // Check that username isn't already in use
    const results = await models.User.findOne({
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
      data: {
        id: '',
      },
      error: 'Username exists',
    };
  }

  /**
   * Creates a post
   * @param params Post metadata
   */
  public async createPost(
    params: POST['createPost']['query'],
  ): POST['createPost']['response'] {
    // TODO: auth with tokens
  }

  /**
   * Retrieves information about a specific post
   * @param params Contains the requested post ID
   */
  public async getPost(params: GET['getPost']['query']): GET['getPost']['response'] {
    return {
      data: {
        id: params.id,
        text: 'ayy lmao',
      },
    };
  }

  /**
   * Signs the user in
   * @param params Username & password
   */
  public async signIn(params: POST['signIn']['query']): POST['signIn']['response'] {
    // TODO: handle tokens
    const results = await models.User.findOne({
      where: {
        username: params.username,
        password: params.password,
      },
    });
    if (results !== null) {
      return {
        data: {
          id: results.get('id'),
        },
      };
    }
    return {
      data: {
        id: '',
      },
      error: 'Incorrect username or password',
    };
  }
}
