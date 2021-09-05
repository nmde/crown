import Tokenize from '@cyyynthia/tokenize';
import bcrypt from 'bcrypt';
import { FastifyInstance } from 'fastify';
import { HttpError } from 'fastify-sensible/lib/httpError';
import { WhereOptions } from 'sequelize';
import IEdge from 'types/Edge';
import {
  Endpoint, EndpointProvider, Endpoints, Response,
} from '../types/Endpoints';
import IMedia from '../types/Media';
import IUser from '../types/User';
import { AuthenticateQuery } from '../types/schemas/authenticate/Query';
import { BoostQuery } from '../types/schemas/boost/Query';
import { CreateAccountQuery } from '../types/schemas/createAccount/Query';
import { CreateAccountResponse } from '../types/schemas/createAccount/Response';
import { CreateCommentQuery } from '../types/schemas/createComment/Query';
import { CreateCommentResponse } from '../types/schemas/createComment/Response';
import { CreateEdgeQuery } from '../types/schemas/createEdge/Query';
import { CreateEdgeResponse } from '../types/schemas/createEdge/Response';
import { CreatePostQuery } from '../types/schemas/createPost/Query';
import { CreatePostResponse } from '../types/schemas/createPost/Response';
import { DeleteEdgeQuery } from '../types/schemas/deleteEdge/Query';
import { DeleteEdgeResponse } from '../types/schemas/deleteEdge/Response';
import { DeletePostQuery } from '../types/schemas/deletePost/Query';
import { DeletePostResponse } from '../types/schemas/deletePost/Response';
import { GetCommentsQuery } from '../types/schemas/getComments/Query';
import { GetCommentsResponse } from '../types/schemas/getComments/Response';
import { GetEdgesQuery } from '../types/schemas/getEdges/Query';
import { GetFeedQuery } from '../types/schemas/getFeed/Query';
import { GetMediaQuery } from '../types/schemas/getMedia/Query';
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
import Post from './models/Post';
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
   * Helper for automatically getting only visible posts
   *
   * @param {WhereOptions} where where query
   * @returns {Post[]} the results
   */
  private async getPosts(where: WhereOptions): Promise<Post[]> {
    try {
      return await models.Post.findAll({
        where: {
          ...where,
          visible: true,
        },
      });
    } catch (err) {
      this.app.log.error(err.message);
      throw this.app.httpErrors.notFound();
    }
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
   * Boosts a post
   *
   * @param {BoostQuery} query the post to boost
   * @returns {any} if the post was boosted
   */
  public async boost(query: Query<'boost'>): Promise<Response<'boost'>> {
    const user = await this.authenticate({
      token: query.token,
    });
    if (user && user.boostBalance && user.boostBalance > 0) {
      await models.User.update(
        {
          boostBalance: user.boostBalance - 1,
        },
        {
          where: {
            id: user.id,
          },
        },
      );
      return this.createEdge({
        target: query.target,
        token: query.token,
        type: 'boost',
      });
    }
    throw this.app.httpErrors.forbidden();
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
        boostBalance: 1,
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
   * Creates a comment
   *
   * @param {CreateCommentQuery} query The comment query
   * @returns {CreateCommentResponse} The created comment ID
   */
  public async createComment(query: Query<'createComment'>): Promise<Response<'createComment'>> {
    const author = await this.authenticate({ token: query.token });
    const comment = await new models.Comment({
      author: author.id as string,
      parent: query.parent,
      text: query.text,
    }).save();
    return {
      id: comment.getDataValue('id') as string,
    };
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
    if (query.type === 'follow' || query.type === 'like' || query.type === 'boost') {
      const edge: IEdge = {
        source: user.id as string,
        target: query.target,
        type: query.type,
      };
      const exists = await models.Edge.findOne({
        where: edge,
      });
      if (exists === null) {
        const created = await new models.Edge(edge).save();
        this.app.log.info(`Created edge with ID ${created.get('id')}`);
        return created.toJSON() as Required<IEdge>;
      }
      throw this.app.httpErrors.conflict();
    }
    this.app.log.error(`Invalid edge type: ${query.type}`);
    throw this.app.httpErrors.badRequest();
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
      category: query.category,
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
   * Deletes an edge
   *
   * @param {DeleteEdgeQuery} query the edge to delete
   * @returns {DeleteEdgeResponse} the response
   * @throws {HttpError} if the edge could not be deleted
   */
  public async deleteEdge(query: Query<'deleteEdge'>): Promise<Response<'deleteEdge'>> {
    const user = await this.authenticate({ token: query.token });
    const target = await models.Edge.findOne({
      where: {
        id: query.id,
        source: user.id,
      },
    });
    if (target !== null) {
      await target.destroy();
      return {
        id: query.id,
      };
    }
    throw this.app.httpErrors.unauthorized();
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
    const target = await this.getPosts({
      author: user.id,
      id: query.id,
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
   * Gets a post's comments
   *
   * @param {GetCommentsQuery} query The post to get comments for
   * @returns {GetCommentsResponse} A list of comments on the post
   */
  public async getComments(query: Query<'getComments'>): Promise<Response<'getComments'>> {
    const results = await models.Comment.findAll({
      where: {
        parent: query.parent,
      },
    });
    return {
      comments: results.map((result) => result.toJSON() as any),
    };
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
      case 'like':
      case 'boost':
        if (query.target) {
          results = await models.Edge.findAll({
            where: {
              source: source.id as string,
              target: query.target,
              type: query.type,
            },
          });
          return results.map((result) => result.toJSON() as Required<IEdge>);
        }
        this.app.log.error('Missing target for edge type like');
        throw this.app.httpErrors.badRequest();
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
    // TODO: pagination
    const where: WhereOptions = {
      visible: true,
    };
    if (query.author !== undefined) {
      where.author = query.author;
    }
    if (query.category !== undefined) {
      where.category = query.category;
    }
    return (await this.getPosts(where)).map((model) => model.toJSON());
  }

  /**
   * Gets post media
   *
   * @param {GetMediaQuery} query The media ID.
   * @returns {string} The media data.
   */
  public async getMedia(query: Query<'getMedia'>): Promise<Response<'getMedia'>> {
    // @TODO: check visibility permissions?
    const result = await models.Media.findOne({
      where: {
        id: query.id,
      },
    });
    if (result !== null) {
      const i = result.toJSON() as IMedia;
      return `data:${i.mimeType};base64,${i.data}`;
    }
    this.app.log.error(`Media not found: ${query.id}`);
    throw this.app.httpErrors.notFound();
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
    const results = await this.getPosts({
      id: query.id,
      visible: true,
    });
    if (results[0] !== undefined) {
      return results[0].toJSON();
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
        id,
        token: this.token.generate(id),
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
