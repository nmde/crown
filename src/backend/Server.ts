import concat from 'concat-stream';
import { FastifyInstance } from 'fastify';
import MimeMatcher from 'mime-matcher';
import { Sequelize } from 'sequelize-typescript';
import { keys } from 'ts-transformer-keys';
import { Endpoints } from '../types/Endpoints';
import apiPath from '../util/apiPath';
import ApiProvider from './ApiProvider';
import ServerError from './ServerError';
import app from './createApp';
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
    const dbUrl = `postgres://${user}:${password}@${host}:${port}/${databaseName}`;
    this.database = new Sequelize(dbUrl, {
      logging: process.env.NODE_ENV === 'development',
      models: Object.values(models),
      native: true,
      ssl: true,
    });
    try {
      await this.database.authenticate();
      await this.database.sync({
        alter: true,
      });
      return this.database;
    } catch (err) {
      const message = 'Could not establish database connection';
      console.error(err);
      this.app.log.error(message);
      throw new ServerError(message);
    }
  }

  /**
   * Starts the HTTP server
   *
   * @param {string} port The port to run the HTTP server on
   * @returns {FastifyInstance} The Fastify instance
   * @throws {ServerError} If the server failed to start
   */
  public async start(port: string): Promise<FastifyInstance> {
    // Media uploading
    this.app.post(
      `/${apiPath('upload')}`,
      async (request) => new Promise((resolve, reject) => {
        // TODO: convert all images to jpg
        request
          .file()
          .then((file) => {
            let valid = false;
            ['image/*', 'video/*', 'audio/*']
              .map((mime) => new MimeMatcher(mime))
              .forEach((mime) => {
                valid = valid || mime.match(file.mimetype);
              });
            if (valid) {
              file.file.pipe(
                concat(async (buffer) => {
                  const media = await new models.Media({
                    data: buffer.toString('base64'),
                    mimeType: file.mimetype,
                  }).save();
                  resolve({
                    id: media.getDataValue('id'),
                  });
                }),
              );
            } else {
              reject(this.app.httpErrors.forbidden());
            }
            // TODO: validation
          })
          .catch((err) => {
            reject(err);
          });
      }),
    );

    // Automatically create endpoints based on Endpoints.ts
    type QueryKeys = {
      [key in keyof Endpoints]: keyof Endpoints[key]['query'];
    };
    keys<Endpoints>().forEach((endpoint) => {
      this.app.post<{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Body: Record<QueryKeys[typeof endpoint], any>;
      }>(`/${apiPath(endpoint)}`, {
        handler: async (request) => this[endpoint](request.body),
        schema: {
          body: schemas[endpoint].query,
        },
      });
    });

    // HTML landing page
    this.app.get('/', async (_res, reply) => {
      await reply.sendFile('index.html');
    });

    // Debug page
    // TODO: completely remove this in production
    this.app.get('/admin', async () => (await models.User.findAll()).map((user) => user.toJSON()));

    // Start the Fastify server
    try {
      await this.app.listen(port, '0.0.0.0');
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
