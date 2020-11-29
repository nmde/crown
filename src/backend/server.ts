/* eslint-disable class-methods-use-this */
import fastify from 'fastify';
import Querystring from './schemas/getPost/Querystring.json';
import Response from './schemas/getPost/Response.json';
import { Endpoints, EndpointProvider } from '../types/Endpoints';

/**
 * The main server class
 * Contains methods for interacting with the central backend
 */
export default class Server implements EndpointProvider {
  /**
   * The Fastify instance
   * @see https://www.fastify.io/
   */
  public app = fastify({
    logger: true,
  });

  /**
   * Starts the server
   * @param port The port to run the server on (defaults to 3000)
   */
  public async start(port = 3000): Promise<number> {
    const { app } = this;

    app.get<{
      Querystring: Endpoints['getPost']['params'];
    }>(
      '/api/getPost',
      {
        schema: {
          querystring: Querystring,
          response: {
            '2xx': Response,
          },
        },
      },
      async (request) => {
        let message = 'OK';
        let error;
        let statusCode;
        let data;
        try {
          data = await this.getPost(request.query);
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
          data,
        };
        return response;
      },
    );

    // Start the HTTP server
    try {
      await app.listen(port);
      app.log.info(`Server running on port ${(app.server.address() || '').toString()}`);
      return port;
    } catch (err) {
      app.log.error(err);
      process.exit(1);
      return -1;
    }
  }

  /**
   * Stops the HTTP server
   */
  public async stop(): Promise<void> {
    return this.app.close();
  }

  /**
   * Retrieves information about a specific post
   * @param param Contains the requested post ID
   */
  public async getPost(
    params: Endpoints['getPost']['params'],
  ): Promise<Endpoints['getPost']['response']> {
    return {
      id: params.id,
      text: 'ayy lmao',
    };
  }
}
