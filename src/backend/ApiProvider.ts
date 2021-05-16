import Tokenize from '@cyyynthia/tokenize';
import { FastifyInstance } from 'fastify';
import { HttpError } from 'fastify-sensible/lib/httpError';
import { WhereOptions } from 'sequelize/types';
import { EndpointProvider, Query, Response } from '../types/Endpoints';
import IUser from '../types/User';
import { CreateAccountQuery } from '../types/schemas/createAccount/Query';
import { CreateAccountResponse } from '../types/schemas/createAccount/Response';
import { CreatePostQuery } from '../types/schemas/createPost/Query';
import { CreatePostResponse } from '../types/schemas/createPost/Response';
import { GetFeedQuery } from '../types/schemas/getFeed/Query';
import { GetPostQuery } from '../types/schemas/getPost/Query';
import { GetPostResponse } from '../types/schemas/getPost/Response';
import { GetUserQuery } from '../types/schemas/getUser/Query';
import { GetUserResponse } from '../types/schemas/getUser/Response';
import { SignInQuery } from '../types/schemas/signIn/Query';
import { SignInResponse } from '../types/schemas/signIn/Response';
import currentTokenTime from '../util/currentTokenTime';
import media from '../util/media';
import models from './models';

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
   * @param {string} token the auth token
   * @returns {IUser} the user associated with the token
   * @throws {HttpError} if the token is invalid
   */
  private async authenticate(token: string): Promise<IUser> {
    const user = await this.token.validate(token, async (id) => {
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
        id: '',
        lastTokenReset: currentTokenTime(),
        password: query.password,
        profileBackground: media.BACKGROUND,
        profilePicture: media.PROFILE,
        username: query.username,
      }).save();
      return {
        id: user.get('id'),
      };
    }
    // Username is taken
    throw this.app.httpErrors.conflict();
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
    const user = await this.authenticate(query.token);
    const post = await new models.Post({
      author: user.id,
      created: new Date().toISOString(),
      description: query.description,
      expires: query.expires,
      media: query.media,
    }).save();
    return {
      id: post.get('id'),
    };
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
    const where: WhereOptions = {};
    if (query.author !== undefined) {
      where.author = query.author;
    } else {
      // No valid search parameters supplied
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
      },
    });
    if (results !== null) {
      return results.toJSON();
    }
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
        id: query.id,
      },
    });
    if (results != null) {
      return results.toJSON();
    }
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
        password: query.password,
        username: query.username,
      },
    });
    if (results !== null) {
      const id = results.get('id');
      // Update lastTokenReset to the current time
      results.set('lastTokenReset', currentTokenTime());
      await results.save();
      return {
        id,
        token: this.token.generate(id),
      };
    }
    // No matching username/password
    throw this.app.httpErrors.badRequest();
  }
}
