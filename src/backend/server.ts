/* eslint-disable class-methods-use-this */
import dotenv from 'dotenv';
import fastify, { FastifySchema, RouteShorthandMethod } from 'fastify';
import { Sequelize } from 'sequelize-typescript';
import { keys } from 'ts-transformer-keys';
import models from './models';
import schemas from './schemas';
import { Endpoints, EndpointProvider } from '../types/Endpoints';

type GET = Endpoints['GET'];
type POST = Endpoints['POST'];

dotenv.config();

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
    const { app } = this;

    // Automatically creates endpoints based on Endpoints.ts
    keys<GET>().forEach((endpoint) => {
      this.createEndpoint('GET', endpoint);
    });
    keys<POST>().forEach((endpoint) => {
      this.createEndpoint('POST', endpoint);
    });

    // Connect to the database
    const { env } = process;
    const database = new Sequelize(
      `postgres://${env.PGUSER}:${env.PGPASSWORD}@${env.PGHOST}:${env.PGPORT}/${env.PGDATABASE}`,
      {
        models: Object.values(models),
      },
    );

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
  ): Promise<POST['createAccount']['response']> {
    await new models.User({
      username: params.username,
    }).save();
    return {
      id: 1234,
    };
  }

  /**
   * Retrieves information about a specific post
   * @param param Contains the requested post ID
   */
  public async getPost(params: GET['getPost']['query']): Promise<GET['getPost']['response']> {
    return {
      id: params.id,
      text: 'ayy lmao',
    };
  }
}
