/* eslint-disable class-methods-use-this */
/**
 * @file Shared data store.
 */
import axios from 'axios';
import JSCookie from 'js-cookie';
import { action, makeObservable, observable } from 'mobx';
import { BoostQuery } from 'types/schemas/boost/Query';
import { CreateAccountQuery } from 'types/schemas/createAccount/Query';
import { CreateAccountResponse } from 'types/schemas/createAccount/Response';
import { CreateCommentQuery } from 'types/schemas/createComment/Query';
import { CreateCommentResponse } from 'types/schemas/createComment/Response';
import { CreateEdgeQuery } from 'types/schemas/createEdge/Query';
import { CreateEdgeResponse } from 'types/schemas/createEdge/Response';
import { CreateMessageQuery } from 'types/schemas/createMessage/Query';
import { CreateMessageResponse } from 'types/schemas/createMessage/Response';
import { CreatePostQuery } from 'types/schemas/createPost/Query';
import { CreatePostResponse } from 'types/schemas/createPost/Response';
import { DeleteEdgeQuery } from 'types/schemas/deleteEdge/Query';
import { DeleteEdgeResponse } from 'types/schemas/deleteEdge/Response';
import { DeletePostQuery } from 'types/schemas/deletePost/Query';
import { DeletePostResponse } from 'types/schemas/deletePost/Response';
import { GetCommentsQuery } from 'types/schemas/getComments/Query';
import { GetCommentsResponse } from 'types/schemas/getComments/Response';
import { GetEdgesQuery } from 'types/schemas/getEdges/Query';
import { GetFeedQuery } from 'types/schemas/getFeed/Query';
import { GetMediaQuery } from 'types/schemas/getMedia/Query';
import { GetMessageQuery } from 'types/schemas/getMessage/Query';
import { GetMessageResponse } from 'types/schemas/getMessage/Response';
import { GetPostQuery } from 'types/schemas/getPost/Query';
import { GetPostResponse } from 'types/schemas/getPost/Response';
import { GetUserQuery } from 'types/schemas/getUser/Query';
import { GetUserResponse } from 'types/schemas/getUser/Response';
import { GetUserByIdQuery } from 'types/schemas/getUserById/Query';
import { MessagesQuery } from 'types/schemas/messages/Query';
import { MessagesResponse } from 'types/schemas/messages/Response';
import { SignInQuery } from 'types/schemas/signIn/Query';
import { SignInResponse } from 'types/schemas/signIn/Response';
import {
  Endpoint, EndpointProvider, Query, Response,
} from '../types/Endpoints';
import IPost from '../types/Post';
import IUser from '../types/User';
import apiPath from '../util/apiPath';

/**
 * Gets the full path to an API endpoint.
 *
 * @param {string} endpoint The name of the endpoint.
 * @returns {string} The full URL to the endpoint.
 */
function fullPath(endpoint: Endpoint) {
  return `/${apiPath(endpoint)}`;
}

// TODO: improve caching

/**
 * @class Store
 * @classdesc Manages data shared across all pages.
 */
class Store implements EndpointProvider {
  /**
   * The current user.
   */
  @observable public currentUser?: IUser;

  /**
   * Cached posts.
   */
  @observable public posts: Record<string, IPost> = {};

  /**
   * Information about users, accessible by the user's uuid.
   */
  @observable public users: Record<string, IUser> = {};

  /**
   * The user's auth token.
   */
  @observable public token = JSCookie.get('token');

  /**
   * Constructs Store.
   *
   * @constructs
   */
  public constructor() {
    makeObservable(this);
  }

  /**
   * Shortcut for an API call using a token.
   *
   * @param {Endpoint} endpoint The name of the endpoint.
   * @param {Query} query The API query.
   * @returns {Response} The API response.
   */
  private async callWithToken<E extends Endpoint>(
    endpoint: Endpoint,
    query: Query<E>,
  ): Promise<Response<E>> {
    return (
      await axios.post<Response<E>>(fullPath(endpoint), {
        ...query,
        token: this.token,
      })
    ).data;
  }

  /**
   * Authenticates the user token.
   *
   * @returns {GetUserResponse} The user information.
   */
  @action public async authenticate(): Promise<Response<'authenticate'>> {
    const res = await this.callWithToken<'authenticate'>('authenticate', {});
    this.currentUser = res as IUser;
    return res;
  }

  /**
   * Boosts a post.
   *
   * @param {BoostQuery} params The post to boost.
   * @returns {any} The api response.
   */
  @action public async boost(params: Query<'boost'>): Promise<Response<'boost'>> {
    return this.callWithToken<'boost'>('boost', params);
  }

  /**
   * Creates an account.
   *
   * @param {CreateAccountQuery} params The query parameters.
   * @returns {CreateAccountResponse} The API response.
   */
  @action public async createAccount(
    params: Query<'createAccount'>,
  ): Promise<Response<'createAccount'>> {
    const res = (await axios.post<Response<'createAccount'>>(fullPath('createAccount'), params))
      .data;
    await this.signIn({
      password: params.password,
      username: params.username,
    });
    return res;
  }

  /**
   * Creates a comment.
   *
   * @param {CreateCommentQuery} params The comment query.
   * @returns {CreateCommentResponse} The created comment.
   */
  @action public async createComment(params: Query<'createComment'>): Promise<Response<'createComment'>> {
    return this.callWithToken<'createComment'>('createComment', params);
  }

  /**
   * Creates an edge.
   *
   * @param {CreateEdgeQuery} params The request parameters.
   * @returns {CreateEdgeResponse} The API response.
   */
  @action public async createEdge(params: Query<'createEdge'>): Promise<Response<'createEdge'>> {
    return this.callWithToken<'createEdge'>('createEdge', params);
  }

  /**
   * Creates a message.
   * Shouldn't be called directly! Only call through the Socket class.
   *
   * @param {CreateMessageQuery} params The request parameters.
   * @returns {CreateMessageResponse} The API response.
   */
  @action public async createMessage(params: Query<'createMessage'>): Promise<Response<'createMessage'>> {
    return this.callWithToken<'createMessage'>('createMessage', params);
  }

  /**
   * Creates a post.
   *
   * @param {CreatePostQuery} params The request parameters.
   * @returns {CreatePostResponse} The API response.
   */
  @action public async createPost(params: Query<'createPost'>): Promise<Response<'createPost'>> {
    return this.callWithToken<'createPost'>('createPost', params);
  }

  /**
   * Deletes an edge.
   *
   * @param {DeleteEdgeQuery} params The edge to delete.
   * @returns {DeleteEdgeResponse} The API response.
   */
  @action public async deleteEdge(params: Query<'deleteEdge'>): Promise<Response<'deleteEdge'>> {
    return this.callWithToken<'deleteEdge'>('deleteEdge', params);
  }

  /**
   * Deletes a post.
   *
   * @param {DeletePostQuery} params The request parameters.
   * @returns {DeletePostResponse} The API response.
   */
  @action public async deletePost(params: Query<'deletePost'>): Promise<Response<'deletePost'>> {
    return this.callWithToken<'deletePost'>('deletePost', params);
  }

  /**
   * Gets comments on a post.
   *
   * @param {GetCommentsQuery} params Query parameters.
   * @returns {GetCommentsResponse} The comments.
   */
  @action public async getComments(params: Query<'getComments'>): Promise<Response<'getComments'>> {
    return (await axios.post<Response<'getComments'>>(fullPath('getComments'), params)).data;
  }

  /**
   * Searches for edges on the backend.
   *
   * @param {GetEdgesQuery} params Query parameters.
   * @returns {CreateEdgeResponse[]} The list of edges.
   */
  @action public async getEdges(params: Query<'getEdges'>): Promise<Response<'getEdges'>> {
    return this.callWithToken<'getEdges'>('getEdges', params);
  }

  /**
   * Retrieves a feed of posts matching the specified search parameter.
   *
   * @param {GetFeedQuery} params Query parameters.
   * @returns {GetPostResponse[]} The list of posts.
   */
  @action public async getFeed(params: Query<'getFeed'>): Promise<Response<'getFeed'>> {
    const posts = (await axios.post<Response<'getFeed'>>(fullPath('getFeed'), params)).data;
    posts.forEach((post) => {
      if (this.posts[post.id as string]) {
        this.posts[post.id as string] = post;
      }
    });
    return posts;
  }

  /**
   * Gets post media.
   *
   * @param {GetMediaQuery} params The media ID.
   * @returns {string} The media data.
   */
  @action public async getMedia(params: Query<'getMedia'>): Promise<Response<'getMedia'>> {
    return this.callWithToken<'getMedia'>('getMedia', params);
  }

  /**
   * Gets a message.
   *
   * @param {GetMessageQuery} params The message to get.
   * @returns {GetMessageResponse} The message.
   */
  @action public async getMessage(params: Query<'getMessage'>): Promise<Response<'getMessage'>> {
    return this.callWithToken<'getMessage'>('getMessage', params);
  }

  /**
   * Gets the full data about a single post from the database.
   *
   * @param {GetPostQuery} params Query parameters.
   * @returns {GetPostResponse} The post data.
   */
  @action public async getPost(params: Query<'getPost'>): Promise<Response<'getPost'>> {
    if (this.posts[params.id]) {
      return this.posts[params.id];
    }
    const post = (await axios.post<Response<'getPost'>>(fullPath('getPost'), params)).data;
    this.posts[post.id as string] = post;
    return post;
  }

  /**
   * Retrieves information about a user.
   *
   * @param {GetUserQuery} params Query parameters.
   * @returns {GetUserResponse} Information about the requested user.
   */
  @action public async getUser(params: Query<'getUser'>): Promise<Response<'getUser'>> {
    // TODO: why is this returning hashed passwords
    if (this.users[params.username]) {
      return this.users[params.username];
    }
    const response = (await axios.post<Response<'getUser'>>(fullPath('getUser'), params)).data;
    if (!this.users[params.username]) {
      this.users[params.username] = response as IUser;
    }
    return response;
  }

  /**
   * Gets user information by user ID.
   *
   * @param {GetUserByIdQuery} params The query parameters.
   * @returns {GetUserResponse} The API response.
   */
  @action public async getUserById(params: Query<'getUserById'>): Promise<Response<'getUserById'>> {
    const response = (await axios.post<Response<'getUserById'>>(fullPath('getUserById'), params))
      .data as IUser;
    if (!this.users[response.username as string]) {
      this.users[response.username as string] = response;
    }
    return response;
  }

  /**
   * Gets a user's messages.
   *
   * @param {MessagesQuery} params The messages to get.
   * @returns {MessagesResponse} The user's messages.
   */
  @action public async messages(params: Query<'messages'>): Promise<Response<'messages'>> {
    return this.callWithToken<'messages'>('messages', params);
  }

  /**
   * Attempts to authenticate the user with the backend.
   *
   * @param {SignInQuery} params The query parameters.
   * @returns {SignInResponse} The API response.
   */
  @action public async signIn(params: Query<'signIn'>): Promise<Response<'signIn'>> {
    const res = (await axios.post<Response<'signIn'>>(fullPath('signIn'), params)).data;
    JSCookie.set('token', res.token);
    this.token = res.token;
    const user = await this.getUserById({
      id: res.id,
    });
    this.currentUser = user;
    return res;
  }

  /**
   * Signs the user out.
   */
  @action public async signOut() {
    JSCookie.remove('token');
    this.token = undefined;
  }

  /**
   * Updates user information.
   *
   * @param {SignInQuery} params The query parameters.
   * @returns {SignInResponse} The API response.
   */
  @action public async updateUser(params: Query<'updateUser'>): Promise<Response<'updateUser'>> {
    const res = await this.callWithToken<'updateUser'>('updateUser', params);
    this.currentUser = res as IUser;
    return res;
  }
}

export default new Store();
