import { FastifyInstance } from 'fastify';
import fs from 'fs-extra';
import MimeMatcher from 'mime-matcher';
import path from 'path';
import { Sequelize } from 'sequelize-typescript';
import { pipeline } from 'stream';
import { keys } from 'ts-transformer-keys';
import util from 'util';
import { v4 as uuid } from 'uuid';
import { Endpoints } from '../types/Endpoints';
import apiPath from '../util/apiPath';
import ApiProvider from './ApiProvider';
import app from './createApp';
import ServerError from './errors/ServerError';
import models from './models';
import schemas from './schemas';

/**
 * The main backend server
 */
export default class Server extends ApiProvider {
  /**
   * The Sequelize database connection
   */
  private database!: Sequelize;

  /**
   * If the server is running in development mode
   */
  public devMode = process.env.NODE_ENV === 'development';

  /**
   * The path to the directory where media is stored
   */
  private mediaDir: string;

  /**
   * Constructs Server
   *
   * @param {string} authKey The main encryption key
   * @param {string} mediaDir The path to the directory where media is stored
   */
  public constructor(authKey: string, mediaDir: string) {
    super(authKey);
    this.app = app(authKey);
    this.mediaDir = mediaDir;
  }

  /**
   * Establishes a connection to the Postgres database
   *
   * @param {string} user The Postgres user to authenticate as
   * @param {string} password The Postgres user password
   * @param {string} host The Postgres server host
   * @param {string} port The Postgres server port
   * @param {string} databaseName The name of the database on the specified Postgres server
   * @returns {Sequelize} The Sequelize database connection
   * @throws {ServerError} If the database connection could not be established
   */
  public async connect(
    user: string,
    password: string,
    host: string,
    port: string,
    databaseName: string,
  ): Promise<Sequelize> {
    this.database = new Sequelize(
      `postgres://${user}:${password}@${host}:${port}/${databaseName}`,
      {
        logging: process.env.NODE_ENV === 'development',
        models: Object.values(models),
      },
    );
    try {
      await this.database.authenticate();
      await this.database.sync({
        alter: true,
      });
      return this.database;
    } catch (err) {
      const message = 'Could not establish database connection.';
      this.app.log.error(message);
      throw new ServerError(message);
    }
  }

  /**
   * Starts the HTTP server
   *
   * @param {number} port The port to run the HTTP server on
   * @returns {FastifyInstance} The Fastify instance
   * @throws {ServerError} If the server failed to start
   */
  public async start(port: number): Promise<FastifyInstance> {
    // Ensure the media directory exists
    await fs.ensureDir(this.mediaDir);

    // Media uploading
    this.app.post(`/${apiPath('upload')}`, async (request) => {
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
          fs.createWriteStream(
            path.join(this.mediaDir, file.filename.replace(/.*\.([a-z]+)/, `${id}.$1`)),
          ),
        );
      } else {
        throw this.app.httpErrors.forbidden();
      }
      // TODO: validation
      return {
        id,
      };
    });

    // Media endpoint
    this.app.get<{
      Params: {
        id: string;
      };
    }>(`/${apiPath('media', ':id')}`, async (request) => {
      const media = (await fs.readdir(this.mediaDir)).find(
        (value) => path.parse(value).name === request.params.id,
      );
      if (media !== undefined) {
        return fs.readFile(path.join(this.mediaDir, media));
      }
      // TODO: return default image if media isn't found
      return '';
    });

    // Automatically create endpoints based on Endpoints.ts
    type QueryKeys = {
      [key in keyof Endpoints]: keyof Endpoints[key]['query'];
    };
    keys<Endpoints>().forEach((endpoint) => {
      this.app.post<{
        Body: Record<QueryKeys[typeof endpoint], string>;
      }>(`/${apiPath(endpoint)}`, {
        handler: async (request) => this[endpoint](request.body),
        schema: {
          body: schemas[endpoint].query,
          response: {
            '2xx': {
              properties: schemas[endpoint].response.properties,
              title: endpoint,
            },
          },
        },
      });
    });

    // HTML landing page
    this.app.get('/', async (_res, reply) => {
      await reply.sendFile('index.html');
    });

    // Start the Fastify server
    try {
      await this.app.listen(port);
      this.app.blipp();
      return this.app;
    } catch (err) {
      throw new ServerError(err);
    }
  }

  /**
   * Stops the HTTP server
   *
   * @returns {undefined}
   */
  public async stop(): Promise<undefined> {
    return this.app.close();
  }
}
