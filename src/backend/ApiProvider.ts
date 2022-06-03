/**
 * @file API endpoints.
 */
import Tokenize from '@cyyynthia/tokenize';
import { HttpError } from '@fastify/sensible/lib/httpError';
import bcrypt from 'bcrypt';
import { FastifyInstance } from 'fastify';
import { Op, WhereOptions } from 'sequelize';
import { IAchievement, IComment, IEdge, IMedia, IMessage, IUser } from '../types';
import {
  Endpoint, EndpointProvider, Endpoints, Response,
} from '../types/Endpoints';
import { AuthenticateQuery } from '../types/schemas/authenticate/Query';
import { BoostQuery } from '../types/schemas/boost/Query';
import { CreateAccountQuery } from '../types/schemas/createAccount/Query';
import { CreateAccountResponse } from '../types/schemas/createAccount/Response';
import { CreateCommentQuery } from '../types/schemas/createComment/Query';
import { CreateCommentResponse } from '../types/schemas/createComment/Response';
import { CreateEdgeQuery } from '../types/schemas/createEdge/Query';
import { CreateEdgeResponse } from '../types/schemas/createEdge/Response';
import { CreateMessageQuery } from '../types/schemas/createMessage/Query';
import { CreateMessageResponse } from '../types/schemas/createMessage/Response';
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
import { GetMessageQuery } from '../types/schemas/getMessage/Query';
import { GetMessageResponse } from '../types/schemas/getMessage/Response';
import { GetPostQuery } from '../types/schemas/getPost/Query';
import { GetPostResponse } from '../types/schemas/getPost/Response';
import { GetUserQuery } from '../types/schemas/getUser/Query';
import { GetUserResponse } from '../types/schemas/getUser/Response';
import { GetUserByIdQuery } from '../types/schemas/getUserById/Query';
import { MessagesQuery } from '../types/schemas/messages/Query';
import { SignInQuery } from '../types/schemas/signIn/Query';
import { SignInResponse } from '../types/schemas/signIn/Response';
import { UpdateUserQuery } from '../types/schemas/updateUser/Query';
import currentTokenTime from '../util/currentTokenTime';
import media from '../util/media';
import Achievement from './models/Achievement';
import Comment from './models/Comment';
import Edge from './models/Edge';
import Media from './models/Media';
import Message from './models/Message';
import Post from './models/Post';
import User from './models/User';

type Query<E extends Endpoint> = Endpoints[E]['query'];

/**
 * @class ApiProvider
 * @classdesc Provides API endpoints to the Server class.
 */
export default class ApiProvider implements EndpointProvider {
  /**
   * The Fastify instance.
   */
  protected app!: FastifyInstance;

  /**
   * Tokenize token generator.
   */
  private token!: Tokenize<IUser>;

  /**
   * Constructs ApiProvider.
   *
   * @param {string} authKey Key for generating tokens.
   */
  public constructor(authKey: string) {
    this.token = new Tokenize<IUser>(authKey);
  }

  /**
   * Helper for automatically getting only visible posts.
   *
   * @param {WhereOptions} where Query.
   * @returns {Post[]} Results.
   * @throws {HttpError} 400 if no posts matching the query were found.
   */
  private async getPosts(where: WhereOptions): Promise<Post[]> {
    try {
      return await Post.findAll({
        where: {
          ...where,
          visible: true,
        },
      });
    } catch (err) {
      this.app.log.error((err as Error).message);
      throw this.app.httpErrors.notFound();
    }
  }

  /**
   * Authenticates the user based on the provided auth token.
   *
   * @param {AuthenticateQuery} query The auth token.
   * @returns {IUser} The user associated with the token.
   * @throws {HttpError} 401 if the token is invalid.
   */
  public async authenticate(query: Query<'authenticate'>): Promise<Response<'authenticate'>> {
    const user = await this.token.validate(query.token, async (id) => {
      const results = await User.findOne({
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
   * Boosts a post.
   *
   * @param {BoostQuery} query The post to boost.
   * @returns {any} If the post was boosted.
   * @throws {HttpError} 403 if the user is unable to boost the post.
   */
  public async boost(query: Query<'boost'>): Promise<Response<'boost'>> {
    const user = await this.authenticate({
      token: query.token,
    });
    if (user && user.boostBalance && user.boostBalance > 0) {
      await User.update(
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
   * API endpoint for creating an account.
   *
   * @param {CreateAccountQuery} query Account creation query.
   * @returns {CreateAccountResponse} The new account information.
   * @throws {HttpError} 409 if the supplied username is already in use.
   */
  public async createAccount(query: Query<'createAccount'>): Promise<Response<'createAccount'>> {
    // Check if username is already in use
    const results = await User.findOne({
      where: {
        username: query.username,
      },
    });
    if (results == null) {
      const user = await User.create({
        boostBalance: 1,
        displayName: query.displayName,
        email: query.email,
        lastTokenReset: currentTokenTime(),
        password: await bcrypt.hash(query.password, 10),
        profileBackground: media.BACKGROUND,
        profilePicture: media.PROFILE,
        username: query.username,
      });
      console.log(user);
      this.app.log.info(`Created account with ID ${user.get('id')}`);
      return {
        id: user.get('id') as string,
      };
    }
    this.app.log.error(`Username ${query.username} is taken`);
    throw this.app.httpErrors.conflict();
  }

  /**
   * Creates a comment.
   *
   * @param {CreateCommentQuery} query The comment query.
   * @returns {CreateCommentResponse} The created comment ID.
   */
  public async createComment(query: Query<'createComment'>): Promise<Response<'createComment'>> {
    const author = await this.authenticate({ token: query.token });
    const comment = await new Comment({
      author: author.id as string,
      parent: query.parent,
      text: query.text,
    }).save();
    return {
      id: comment.getDataValue('id') as string,
    };
  }

  /**
   * Creates an edge.
   *
   * @param {CreateEdgeQuery} query The edge information.
   * @returns {CreateEdgeResponse} The created edge ID.
   * @throws {HttpError} 400 if the edge could not be created.
   */
  public async createEdge(query: Query<'createEdge'>): Promise<Response<'createEdge'>> {
    const user = await this.authenticate({ token: query.token });
    if (query.type === 'follow' || query.type === 'like' || query.type === 'boost') {
      const edge: IEdge = {
        source: user.id as string,
        target: query.target,
        type: query.type,
      };
      const exists = await Edge.findOne({
        where: {
          ...edge,
        },
      });
      if (exists === null) {
        const created = await new Edge({
          ...edge,
        }).save();
        this.app.log.info(`Created edge with ID ${created.get('id')}`);
        return created.toJSON() as Required<IEdge>;
      }
      throw this.app.httpErrors.badRequest();
    }
    this.app.log.error(`Invalid edge type: ${query.type}`);
    throw this.app.httpErrors.badRequest();
  }

  /**
   * Creates a message.
   *
   * @param {CreateMessageQuery} query The message information.
   * @returns {CreateMessageResponse} The created message.
   */
  public async createMessage(query: Query<'createMessage'>): Promise<Response<'createMessage'>> {
    const user = await this.authenticate({ token: query.token });
    const message = await new Message({
      content: query.content,
      recipient: query.recipient,
      sender: user.id as string,
      time: new Date().toISOString(),
    }).save();
    this.app.log.info(`Created message with ID ${message.get('id')}`);
    return message.toJSON();
  }

  /**
   * Creates a post.
   *
   * @param {CreatePostQuery} query The post information.
   * @returns {CreatePostResponse} The created post ID.
   */
  public async createPost(query: Query<'createPost'>): Promise<Response<'createPost'>> {
    // Confirm the auth token is valid
    const user = await this.authenticate({ token: query.token });
    const post = await new Post({
      author: user.id,
      category: query.category,
      created: new Date().toISOString(),
      description: query.description,
      expires: query.expires,
      media: query.media,
      tags: query.description
        .match(/#[a-zA-Z]+/g)
        ?.map((tag) => tag.substring(1))
        .join(','),
      visible: true,
    }).save();
    this.app.log.info(`Created post with ID ${post.get('id')}`);
    return {
      id: post.get('id') as string,
    };
  }

  /**
   * Deletes an edge.
   *
   * @param {DeleteEdgeQuery} query The edge to delete.
   * @returns {DeleteEdgeResponse} The response.
   * @throws {HttpError} 401 if the edge could not be deleted.
   */
  public async deleteEdge(query: Query<'deleteEdge'>): Promise<Response<'deleteEdge'>> {
    const user = await this.authenticate({ token: query.token });
    const target = await Edge.findOne({
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
   * Deletes a post.
   *
   * @param {DeletePostQuery} query The post to delete.
   * @returns {DeletePostResponse} The deleted post ID.
   * @throws {HttpError} 401 if the post could not be deleted.
   */
  public async deletePost(query: Query<'deletePost'>): Promise<Response<'deletePost'>> {
    const user = await this.authenticate({ token: query.token });
    const target = await this.getPosts({
      author: user.id,
      id: query.id,
    });
    if (target !== null) {
      const updated = await Post.update(
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
        id: updated[1][0].get('id') as string,
      };
    }
    this.app.log.error(`User ${user.id} failed to delete post ${query.id}`);
    throw this.app.httpErrors.unauthorized();
  }

  /**
   * Gets a list of a user's achievements.
   * 
   * @param query The query.
   * @returns The user's achievements.
   */
  public async getAchievements(query: Query<'getAchievements'>): Promise<Response<'getAchievements'>> {
    const user = await this.authenticate({ token: query.token });
    const results = await Achievement.findAll({
      where: {
        user: user.id,
      },
    });
    return {
      achievements: results.map((result) => result.toJSON() as IAchievement),
    };
  }

  /**
   * Gets a post's comments.
   *
   * @param {GetCommentsQuery} query The post to get comments for.
   * @returns {GetCommentsResponse} A list of comments on the post.
   */
  public async getComments(query: Query<'getComments'>): Promise<Response<'getComments'>> {
    const results = await Comment.findAll({
      where: {
        parent: query.parent,
      },
    });
    return {
      comments: results.map((result) => result.toJSON() as IComment),
    };
  }

  /**
   * Searches for edges.
   *
   * @param {GetEdgesQuery} query The search parameters.
   * @returns {CreateEdgeResponse[]} The list of edges.
   * @throws {HttpError} 400 if the search parameters are invalid.
   */
  public async getEdges(query: Query<'getEdges'>): Promise<Response<'getEdges'>> {
    const source = await this.authenticate({ token: query.token });
    let results;
    switch (query.type) {
      case 'follow':
        results = await Edge.findAll({
          where: {
            source: source.id as string,
            type: 'follow',
          },
        });
        return results.map((result) => result.toJSON() as Required<IEdge>);
      case 'like':
      case 'boost':
        if (query.target) {
          results = await Edge.findAll({
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
   * Gets a feed of posts matching the supplied parameters.
   *
   * @param {GetFeedQuery} query Post search parameters.
   * @returns {GetPostResponse[]} The list of posts.
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
   * Gets post media.
   *
   * @param {GetMediaQuery} query The media ID.
   * @returns {string} The media data.
   * @throws {HttpError} 404 if the request media was not found.
   */
  public async getMedia(query: Query<'getMedia'>): Promise<Response<'getMedia'>> {
    // @TODO: check visibility permissions?
    const result = await Media.findOne({
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
   * Gets a message.
   *
   * @param {GetMessageQuery} query The message to get.
   * @returns {GetMessageResponse} The message.
   * @throws {HttpError} 404 if the message could not be found.
   */
  public async getMessage(query: Query<'getMessage'>): Promise<Response<'getMessage'>> {
    // TODO: check if the user should be able to see this message
    // const user = await this.authenticate({ token: query.token });
    const result = await Message.findOne({
      where: {
        id: query.id,
      },
    });
    if (result !== null) {
      return result.toJSON();
    }
    throw this.app.httpErrors.notFound();
  }

  /**
   * Gets detailed information about an individual post.
   *
   * @param {GetPostQuery} query The post ID.
   * @returns {GetPostResponse} The post information.
   * @throws {HttpError} 404 if the post could not be found.
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
   * Gets all the required information about the specified user.
   *
   * @param {GetUserQuery} query The user to retrieve.
   * @returns {GetUserResponse} The user information.
   * @throws {HttpError} 404 if the user could not be found.
   */
  public async getUser(query: Query<'getUser'>): Promise<Response<'getUser'>> {
    const results = await User.findOne({
      where: {
        username: query.username,
      },
    });
    if (results != null) {
      return results.toJSON();
    }
    this.app.log.error(`No user found with username ${query.username}`);
    throw this.app.httpErrors.notFound();
  }

  /**
   * Gets user information by user ID.
   *
   * @param {GetUserByIdQuery} query The query parameters.
   * @returns {GetUserResponse} The user information.
   * @throws {HttpError} 404 if the user could not be found.
   */
  public async getUserById(query: Query<'getUserById'>): Promise<Response<'getUserById'>> {
    const results = await User.findOne({
      where: {
        id: query.id,
      },
    });
    if (results !== null) {
      return results.toJSON();
    }
    this.app.log.error(`No user found with ID ${query.id}`);
    throw this.app.httpErrors.notFound();
  }

  /**
   * Gets a user's messages.
   *
   * @param {MessagesQuery} query The messages to find.
   * @returns {IMessage} The messages.
   */
  public async messages(query: Query<'messages'>): Promise<Response<'messages'>> {
    const user = await this.authenticate({
      token: query.token,
    });
    const messages = await Message.findAll({
      where: {
        [Op.or]: {
          recipient: user.id,
          sender: user.id,
        },
      },
    });
    return messages.map((message) => message.toJSON() as IMessage);
  }

  /**
   * Generates an auth token for the given username and password.
   *
   * @param {SignInQuery} query Sign In query.
   * @returns {SignInResponse} The auth token.
   * @throws {HttpError} 400 if the username + password does not match a user.
   */
  public async signIn(query: Query<'signIn'>): Promise<Response<'signIn'>> {
    const results = await User.findOne({
      where: {
        username: query.username,
      },
    });
    if (results !== null && (await bcrypt.compare(query.password, results.get('password') as string))) {
      const id = results.get('id') as string;
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
   * Updates existing user information.
   *
   * @param {UpdateUserQuery} query The new information.
   * @returns {GetUserResponse} The updated user.
   */
  public async updateUser(query: Query<'updateUser'>): Promise<Response<'updateUser'>> {
    const user = await this.authenticate({ token: query.token });
    const updated = await User.update(
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
