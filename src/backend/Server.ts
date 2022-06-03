/**
 * @file Server class.
 */
import concat from 'concat-stream';
import { FastifyInstance } from 'fastify';
import MimeMatcher from 'mime-matcher';
import { Sequelize } from 'sequelize';
import { keys } from 'ts-transformer-keys';
import { Endpoints } from '../types/Endpoints';
import { CreateMessageQuery } from '../types/schemas/createMessage/Query';
import apiPath from '../util/apiPath';
import ApiProvider from './ApiProvider';
import ServerError from './ServerError';
import app from './createApp';
import Achievement, { achievementModel } from './models/Achievement';
import schemas from './schemas';
import User, { userModel } from './models/User';
import Comment, { commentModel } from './models/Comment';
import Edge, { edgeModel } from './models/Edge';
import Media, { mediaModel } from './models/Media';
import Message, { messageModel } from './models/Message';
import Post, { postModel } from './models/Post';

/**
 * @class Server
 * @classdesc The main backend server.
 */
export default class Server extends ApiProvider {
  /**
   * The Sequelize database connection.
   */
  private database!: Sequelize;

  /**
   * If the server is running in development mode.
   */
  public devMode = process.env.NODE_ENV === 'development';

  /**
   * Constructs Server.
   *
   * @param {string} authKey The main encryption key.
   */
  public constructor(authKey: string) {
    super(authKey);
    this.app = app(authKey);
  }

  /**
   * Establishes a connection to the Postgres database.
   *
   * @param {string} user The Postgres user to authenticate as.
   * @param {string} password The Postgres user password.
   * @param {string} host The Postgres server host.
   * @param {string} port The Postgres server port.
   * @param {string} databaseName The name of the database on the specified Postgres server.
   * @returns {Sequelize} The Sequelize database connection.
   * @throws {ServerError} If the database connection could not be established.
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
      logging: false,
      native: true,
      ssl: true,
    });
    try {
      Achievement.init(achievementModel, {
        sequelize: this.database,
      });
      Comment.init(commentModel, {
        sequelize: this.database,
      });
      Edge.init(edgeModel, {
        sequelize: this.database,
      });
      Media.init(mediaModel, {
        sequelize: this.database,
      });
      Message.init(messageModel, {
        sequelize: this.database,
      });
      Post.init(postModel, {
        sequelize: this.database,
      });
      User.init(userModel, {
        sequelize: this.database,
      });
      await this.database.authenticate();
      await this.database.sync({
        alter: true,
      });
      return this.database;
    } catch (err) {
      const message = 'Could not establish database connection';
      this.app.log.error(err);
      throw new ServerError(message);
    }
  }

  /**
   * Starts the HTTP server.
   *
   * @param {string} port The port to run the HTTP server on.
   * @returns {FastifyInstance} The Fastify instance.
   * @throws {ServerError} If the server failed to start.
   */
  public async start(port: string): Promise<FastifyInstance> {
    // Media uploading
    this.app.post(
      `/${apiPath('upload')}`,
      async (request) =>
        new Promise((resolve, reject) => {
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
                    const media = await new Media({
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
    // Endpoints to not automatically handle
    const override = ['createMessage'];
    keys<Endpoints>()
      .filter((endpoint) => override.indexOf(endpoint) < 0)
      .forEach((endpoint) => {
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

    // createMessage
    this.app.post<{
      Body: CreateMessageQuery;
    }>(`/${apiPath('createMessage')}`, {
      handler: async (request) => {
        const message = await this.createMessage(request.body);
        // TODO: use rooms or something
        this.app.io.emit('message', message);
        return message;
      },
      schema: {
        body: schemas.createMessage.query,
      },
    });

    // HTML landing page
    this.app.get('/', async (_res, reply) => {
      await reply.sendFile('index.html');
    });

    // Start the Fastify server
    try {
      await this.app.listen(port, '0.0.0.0');
      this.app.blipp();
      return this.app;
    } catch (err) {
      throw new ServerError((err as Error).message);
    }
  }

  /**
   * Stops the HTTP server.
   *
   * @returns {undefined}
   */
  public async stop(): Promise<undefined> {
    return this.app.close();
  }
}
