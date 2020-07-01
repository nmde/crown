import bodyParser from 'body-parser';
import express from 'express';
import http from 'http';
import path from 'path';
import { Sequelize } from 'sequelize-typescript';
import Endpoints, {
  EndpointURL,
  CreatePostResponse,
  GetPostResponse,
} from '../types/Endpoints';
import PostData from '../types/PostData';
import Post from './models/Post';

export default class Server implements Endpoints {
  private app = express();

  private database: Sequelize;

  private models = { Post };

  private port: number;

  public httpServer?: http.Server;

  constructor(dbPath: string, port = 3000) {
    console.log(dbPath);
    this.database = new Sequelize({
      dialect: 'sqlite',
      storage: dbPath,
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

  async createPost(data: PostData): Promise<CreatePostResponse> {
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

  async getPost(id: string): Promise<GetPostResponse> {
    try {
      const result = await this.models.Post.findOne({
        where: {
          id,
        },
      });
      if (result === null) {
        return {
          success: false,
          error: new Error(`No post found with ID ${id}`),
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

  start(): Promise<number> {
    return new Promise((resolve, reject) => {
      const { app } = this;
      app.use(bodyParser.json());
      app.use(express.static(path.resolve(__dirname, '..', 'dist')));
      // TODO: Fix the URL mess
      app.post(`/${EndpointURL.createPost}`, async (req, res) => {
        res.send(await this.createPost(req.body));
      });
      app.get(`/${EndpointURL.getPost}`, async (req, res) => {
        res.send(await this.getPost(req.query.id as string));
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

  stop(): Promise<void> {
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
