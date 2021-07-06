import Tokenize from '@cyyynthia/tokenize';
import bcrypt from 'bcrypt';
import { FastifyInstance } from 'fastify';
import { HttpError } from 'fastify-sensible/lib/httpError';
import { WhereOptions } from 'sequelize';
import IEdge from 'types/Edge';
import { AuthenticateQuery } from 'types/schemas/authenticate/Query';
import { CreateEdgeQuery } from 'types/schemas/createEdge/Query';
import { CreateEdgeResponse } from 'types/schemas/createEdge/Response';
import { GetEdgesQuery } from 'types/schemas/getEdges/Query';
import {
  Endpoint, EndpointProvider, Endpoints, Response,
} from '../types/Endpoints';
import IUser from '../types/User';
import { CreateAccountQuery } from '../types/schemas/createAccount/Query';
import { CreateAccountResponse } from '../types/schemas/createAccount/Response';
import { CreatePostQuery } from '../types/schemas/createPost/Query';
import { CreatePostResponse } from '../types/schemas/createPost/Response';
import { DeletePostQuery } from '../types/schemas/deletePost/Query';
import { DeletePostResponse } from '../types/schemas/deletePost/Response';
import { GetFeedQuery } from '../types/schemas/getFeed/Query';
import { GetPostQuery } from '../types/schemas/getPost/Query';
import { GetPostResponse } from '../types/schemas/getPost/Response';
import { GetUserQuery } from '../types/schemas/getUser/Query';
import { GetUserResponse } from '../types/schemas/getUser/Response';
import { GetUserByIdQuery } from '../types/schemas/getUserById/Query';
import { SignInQuery } from '../types/schemas/signIn/Query';
import { SignInResponse } from '../types/schemas/signIn/Response';
import { UpdateUserQuery } from '../types/schemas/updateUser/Query';
import currentTokenTime from '../util/currentTokenTime';
import media from '../util/media';
import models from './models';
import Edge from './models/Edge';
import User from './models/User';

type Query<E extends Endpoint> = Endpoints[E]['query'];

/**
 * Provides API endpoints to the Server class
 */
export default class ApiProvider implements EndpointProvider {
  /**
   * The Fastify instance
   */
  protected app!: FastifyInstance;

  /**
   * Tokenize token generator
   */
  private token!: Tokenize<IUser>;

  /**
   * Constructs ApiProvider
   *
   * @param {string} authKey Key for generating tokens
   */
  public constructor(authKey: string) {
    this.token = new Tokenize<IUser>(authKey);
  }

  /**
   * Authenticates the user based on the provided auth token
   *
   * @param {AuthenticateQuery} query the auth token
   * @returns {IUser} the user associated with the token
   * @throws {HttpError} if the token is invalid
   */
  public async authenticate(query: Query<'authenticate'>): Promise<Response<'authenticate'>> {
    const user = await this.token.validate(query.token, async (id) => {
      const results = await models.User.findOne({
        where: {
          id,
        },
      });
      if (results !== null) {
        return results.toJSON() as IUser;
      }
      return null;
    });
    if (user === false || user === null) {
      // Auth token is invalid
      throw this.app.httpErrors.unauthorized();
    }
    return user;
  }

  /**
   * API endpoint for creating an account
   *
   * @param {CreateAccountQuery} query Account creation query
   * @returns {CreateAccountResponse} The new account information
   * @throws {HttpError} HTTP status 409 if the supplied username is already in use
   */
  public async createAccount(query: Query<'createAccount'>): Promise<Response<'createAccount'>> {
    // Check if username is already in use
    const results = await models.User.findOne({
      where: {
        username: query.username,
      },
    });
    if (results == null) {
      const user = await new models.User({
        displayName: query.displayName,
        email: query.email,
        lastTokenReset: currentTokenTime(),
        password: await bcrypt.hash(query.password, 10),
        profileBackground: media.BACKGROUND,
        profilePicture: media.PROFILE,
        username: query.username,
      }).save();
      this.app.log.info(`Created account with ID ${user.get('id')}`);
      return {
        id: user.get('id'),
      };
    }
    this.app.log.error(`Username ${query.username} is taken`);
    throw this.app.httpErrors.conflict();
  }

  /**
   * Creates an edge
   *
   * @param {CreateEdgeQuery} query the edge information
   * @returns {CreateEdgeResponse} the created edge ID
   * @throws {HttpError} if the query is malformed
   */
  public async createEdge(query: Query<'createEdge'>): Promise<Response<'createEdge'>> {
    const user = await this.authenticate({ token: query.token });
    let edge: Edge;
    // TODO: check for duplicate?
    switch (query.type) {
      case 'follow':
        edge = await new models.Edge({
          source: user.id as string,
          target: query.target,
          type: 'follow',
        }).save();
        this.app.log.info(`Created edge with ID ${edge.get('id')}`);
        return edge.toJSON() as Required<IEdge>;
      default:
        this.app.log.error(`Invalid edge type: ${query.type}`);
        throw this.app.httpErrors.badRequest();
    }
  }

  /**
   * Creates a post
   *
   * @param {CreatePostQuery} query The post information
   * @returns {CreatePostResponse} The created post ID
   * @throws {HttpError} If the post could not be created
   */
  public async createPost(query: Query<'createPost'>): Promise<Response<'createPost'>> {
    // Confirm the auth token is valid
    const user = await this.authenticate({ token: query.token });
    const post = await new models.Post({
      author: user.id,
      created: new Date().toISOString(),
      description: query.description,
      expires: query.expires,
      media: query.media,
      visible: true,
    }).save();
    this.app.log.info(`Created post with ID ${post.get('id')}`);
    return {
      id: post.get('id'),
    };
  }

  /**
   * Deletes a post
   *
   * @param {DeletePostQuery} query the post to delete
   * @returns {DeletePostResponse} the deleted post ID
   * @throws {HttpError} if the post could not be deleted
   */
  public async deletePost(query: Query<'deletePost'>): Promise<Response<'deletePost'>> {
    const user = await this.authenticate({ token: query.token });
    const target = await models.Post.findOne({
      where: {
        author: user.id,
        id: query.id,
      },
    });
    if (target !== null) {
      const updated = await models.Post.update(
        {
          visible: false,
        },
        {
          returning: true,
          where: {
            id: query.id,
          },
        },
      );
      return {
        id: updated[1][0].get('id'),
      };
    }
    this.app.log.error(`User ${user.id} failed to delete post ${query.id}`);
    throw this.app.httpErrors.badRequest();
  }

  /**
   * Searches for edges
   *
   * @param {GetEdgesQuery} query the search parameters
   * @returns {CreateEdgeResponse[]} the list of edges
   * @throws {HttpError} if the search parameters are invalid
   */
  public async getEdges(query: Query<'getEdges'>): Promise<Response<'getEdges'>> {
    const source = await this.authenticate({ token: query.token });
    let results;
    switch (query.type) {
      case 'follow':
        results = await models.Edge.findAll({
          where: {
            source: source.id as string,
            type: 'follow',
          },
        });
        return results.map((result) => result.toJSON() as Required<IEdge>);
      default:
        this.app.log.error(`Invalid edge type: ${query.type}`);
        throw this.app.httpErrors.badRequest();
    }
  }

  /**
   * Gets a feed of posts matching the supplied parameters
   *
   * @param {GetFeedQuery} query Post search parameters
   * @returns {GetPostResponse[]} The list of posts
   * @throws {HttpError} If the search parameters are invalid
   */
  public async getFeed(query: Query<'getFeed'>): Promise<Response<'getFeed'>> {
    // TODO: check post visibility permissions
    // TODO: pagination
    const where: WhereOptions = {
      visible: true,
    };
    if (query.author !== undefined) {
      where.author = query.author;
    } else {
      // No valid search parameters supplied
      this.app.log.error('Invalid feed search parameters');
      throw this.app.httpErrors.badRequest();
    }
    const feed = await models.Post.findAll({
      where,
    });
    return feed.map((model) => model.toJSON());
  }

  /**
   * Gets detailed information about an individual post
   *
   * @param {GetPostQuery} query The post ID
   * @returns {GetPostResponse} The post information
   * @throws {HttpError} If the post could not be found
   */
  public async getPost(query: Query<'getPost'>): Promise<Response<'getPost'>> {
    // TODO: check if current user has permissions to view the post
    const results = await models.Post.findOne({
      where: {
        id: query.id,
        visible: true,
      },
    });
    if (results !== null) {
      return results.toJSON();
    }
    this.app.log.error(`No post found with ID ${query.id}`);
    throw this.app.httpErrors.notFound();
  }

  /**
   * Gets all the required information about the specified user
   *
   * @param {GetUserQuery} query The user to retrieve
   * @returns {GetUserResponse} The user information
   * @throws {HttpError} If the user could not be found
   */
  public async getUser(query: Query<'getUser'>): Promise<Response<'getUser'>> {
    const results = await models.User.findOne({
      where: {
        username: query.username,
      },
    });
    if (results != null) {
      return results.toJSON();
    }
    this.app.log.error(`No user found with username ${query.username}`);
    throw this.app.httpErrors.badRequest();
  }

  /**
   * Gets user information by user ID
   *
   * @param {GetUserByIdQuery} query the query parameters
   * @returns {GetUserResponse} the user information
   */
  public async getUserById(query: Query<'getUserById'>): Promise<Response<'getUserById'>> {
    const results = await models.User.findOne({
      where: {
        id: query.id,
      },
    });
    if (results !== null) {
      return results.toJSON();
    }
    this.app.log.error(`No user found with ID ${query.id}`);
    throw this.app.httpErrors.badRequest();
  }

  /**
   * Generates an auth token for the given username and password
   *
   * @param {SignInQuery} query Sign In query
   * @returns {SignInResponse} The auth token
   * @throws {HttpError} If the username + password does not match a user
   */
  public async signIn(query: Query<'signIn'>): Promise<Response<'signIn'>> {
    const results = await models.User.findOne({
      where: {
        username: query.username,
      },
    });
    if (results !== null && (await bcrypt.compare(query.password, results.get('password')))) {
      const id = results.get('id');
      // Update lastTokenReset to the current time
      results.set('lastTokenReset', currentTokenTime());
      await results.save();
      return {
        displayName: results.get('displayName'),
        email: results.get('email'),
        id,
        profileBackground: results.get('profileBackground'),
        profilePicture: results.get('profilePicture'),
        token: this.token.generate(id),
        username: results.get('username'),
      };
    }
    // No matching username/password
    this.app.log.error(`Invalid login attempt for user ${query.username}`);
    throw this.app.httpErrors.badRequest();
  }

  /**
   * Updates existing user information
   *
   * @param {UpdateUserQuery} query the new information
   * @returns {GetUserResponse} the updated user
   */
  public async updateUser(query: Query<'updateUser'>): Promise<Response<'updateUser'>> {
    const user = await this.authenticate({ token: query.token });
    const updated = await models.User.update(
      {
        displayName: query.displayName,
      },
      {
        returning: true,
        where: {
          id: user.id,
        },
      },
    );
    return (updated.filter((row) => typeof row !== 'number')[0] as User[])[0].toJSON();
  }
}
