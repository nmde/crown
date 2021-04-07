import { FastifyInstance } from 'fastify';
import fs from 'fs-extra';
import { Sequelize } from 'sequelize-typescript';
import ApiProvider from './ApiProvider';
import app from './createApp';
import ServerError from './errors/ServerError';
import models from './models';

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

    // Start the Fastify server
    try {
      await this.app.listen(port);
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
