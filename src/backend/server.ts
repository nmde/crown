import bodyParser from 'body-parser';
import express from 'express';
import http from 'http';
import path from 'path';
import { Sequelize } from 'sequelize-typescript';
import { keys } from 'ts-transformer-keys';
import UserData from '../types/UserData';
import { Endpoints, EndpointProvider, GenericResponse } from '../types/Endpoints';
import PostData from '../types/PostData';
import Post from './models/Post';
import User from './models/User';
import LoginData from '../types/LoginData';

export default class Server implements EndpointProvider {
  private app = express();

  private database: Sequelize;

  private models = { Post, User };

  private port: number;

  public httpServer?: http.Server;

  public constructor(dbPath: string, port = 3000) {
    this.database = new Sequelize({
      dialect: 'sqlite',
      storage: dbPath,
      logging: false,
    });
    this.port = port;
  }

  private connectToDatabase(): Promise<Sequelize> {
    return new Promise((resolve, reject) => {
      this.database.addModels(Object.values(this.models));
      this.database.sync();
      this.database
        .authenticate()
        .then(() => {
          resolve(this.database);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public async createPost(data: PostData): Promise<GenericResponse<Post>> {
    try {
      return {
        success: true,
        data: await (new this.models.Post(data)).save(),
      };
    } catch (err) {
      return {
        success: false,
        error: err,
      };
    }
  }

  public async createUser(data: UserData): Promise<GenericResponse<UserData>> {
    try {
      return {
        success: true,
        data: await (new this.models.User(data)).save(),
      };
    } catch (err) {
      return {
        success: false,
        error: err,
      };
    }
  }

  public async getPost({ id }: { id: string }): Promise<GenericResponse<PostData>> {
    try {
      const result = await this.models.Post.findOne({
        where: {
          id,
        },
      });
      if (result === null) {
        return {
          success: false,
          error: `No post found with ID ${id}`,
        };
      }
      return {
        success: true,
        data: result,
      };
    } catch (err) {
      return {
        success: false,
        error: err,
      };
    }
  }

  public async login(data: LoginData): Promise<GenericResponse<UserData>> {
    try {
      const match = await this.models.User.findOne({
        where: {
          ...data,
        },
      });
      if (match === null) {
        return {
          success: false,
          error: 'Incorrect username or password',
        };
      }
      return {
        success: true,
        data: match,
      };
    } catch (err) {
      return {
        success: false,
        error: err,
      };
    }
  }

  public start(): Promise<number> {
    return new Promise((resolve, reject) => {
      const { app } = this;
      app.use(bodyParser.json());
      app.use(express.static(path.resolve(__dirname, '..', 'dist')));

      // Sets up the API endpoints
      keys<Endpoints['post']>().forEach((key) => {
        console.log(`/api/${key}`);
        app.post(`/api/${key}`, async (req, res) => {
          res.send(await this[key](req.body));
        });
      });
      keys<Endpoints['get']>().forEach((key) => {
        app.get(`/api/${key}`, async (req, res) => {
          res.send(await this[key](req.query as Endpoints['get'][typeof key]['data']));
        });
      });

      this.connectToDatabase()
        .then(() => {
          this.httpServer = app.listen(this.port, () => {
            resolve(this.port);
          });
        })
        .catch((err) => {
          reject(new Error(`Could not establish database connection: ${err}`));
        });
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.httpServer !== undefined) {
        this.httpServer.close(() => {
          delete this.httpServer;
          resolve();
        });
      }
    });
  }
}
