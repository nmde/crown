/* eslint-disable class-methods-use-this */
import axios from 'axios';
import JSCookie from 'js-cookie';
import { action, makeObservable, observable } from 'mobx';
import { CreateAccountQuery } from 'types/schemas/createAccount/Query';
import { CreateAccountResponse } from 'types/schemas/createAccount/Response';
import { CreateCommentQuery } from 'types/schemas/createComment/Query';
import { CreateCommentResponse } from 'types/schemas/createComment/Response';
import { CreateEdgeQuery } from 'types/schemas/createEdge/Query';
import { CreateEdgeResponse } from 'types/schemas/createEdge/Response';
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
import { GetPostQuery } from 'types/schemas/getPost/Query';
import { GetPostResponse } from 'types/schemas/getPost/Response';
import { GetUserQuery } from 'types/schemas/getUser/Query';
import { GetUserResponse } from 'types/schemas/getUser/Response';
import { GetUserByIdQuery } from 'types/schemas/getUserById/Query';
import { SignInQuery } from 'types/schemas/signIn/Query';
import { SignInResponse } from 'types/schemas/signIn/Response';
import {
  Endpoint, EndpointProvider, Query, Response,
} from '../types/Endpoints';
import IPost from '../types/Post';
import IUser from '../types/User';
import apiPath from '../util/apiPath';

/**
 * Gets the full path to an API endpoint
 *
 * @param {string} endpoint the name of the endpoint
 * @returns {string} the full URL to the endpoint
 */
function fullPath(endpoint: Endpoint) {
  return `/${apiPath(endpoint)}`;
}

// TODO: improve caching

/**
 * The "store", which manages data shared across all pages
 */
class Store implements EndpointProvider {
  /**
   * The current user
   */
  @observable public currentUser?: IUser;

  /**
   * Cached posts
   */
  @observable public posts: Record<string, IPost> = {};

  /**
   * Information about users, accessible by the user's uuid
   */
  @observable public users: Record<string, IUser> = {};

  /**
   * The user's auth token
   */
  @observable public token = JSCookie.get('token');

  /**
   * @constructs
   */
  public constructor() {
    makeObservable(this);
  }

  /**
   * Shortcut for an API call using a token
   *
   * @param {Endpoint} endpoint the name of the endpoint
   * @param {Query} query the API query
   * @returns {Response} the API response
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
   * Authenticates the user token
   *
   * @returns {GetUserResponse} the user information
   */
  @action public async authenticate(): Promise<Response<'authenticate'>> {
    const res = await this.callWithToken<'authenticate'>('authenticate', {});
    this.currentUser = res as IUser;
    return res;
  }

  /**
   * Creates an account
   *
   * @param {CreateAccountQuery} params the query parameters
   * @returns {CreateAccountResponse} the API response
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
   * Creates a comment
   *
   * @param {CreateCommentQuery} params The comment query
   * @returns {CreateCommentResponse} The created comment
   */
  @action public async createComment(params: Query<'createComment'>): Promise<Response<'createComment'>> {
    return this.callWithToken<'createComment'>('createComment', params);
  }

  /**
   * Creates an edge
   *
   * @param {CreateEdgeQuery} params the request parameters
   * @returns {CreateEdgeResponse} the API response
   */
  @action public async createEdge(params: Query<'createEdge'>): Promise<Response<'createEdge'>> {
    return this.callWithToken<'createEdge'>('createEdge', params);
  }

  /**
   * Creates a post
   *
   * @param {CreatePostQuery} params the request parameters
   * @returns {CreatePostResponse} the API response
   */
  @action public async createPost(params: Query<'createPost'>): Promise<Response<'createPost'>> {
    return this.callWithToken<'createPost'>('createPost', params);
  }

  /**
   * Deletes an edge
   *
   * @param {DeleteEdgeQuery} params the edge to delete
   * @returns {DeleteEdgeResponse} the API response
   */
  @action public async deleteEdge(params: Query<'deleteEdge'>): Promise<Response<'deleteEdge'>> {
    return this.callWithToken<'deleteEdge'>('deleteEdge', params);
  }

  /**
   * Deletes a post
   *
   * @param {DeletePostQuery} params the request parameters
   * @returns {DeletePostResponse} the API response
   */
  @action public async deletePost(params: Query<'deletePost'>): Promise<Response<'deletePost'>> {
    return this.callWithToken<'deletePost'>('deletePost', params);
  }

  /**
   * Gets comments on a post
   *
   * @param {GetCommentsQuery} params query parameters
   * @returns {GetCommentsResponse} the comments
   */
  @action public async getComments(params: Query<'getComments'>): Promise<Response<'getComments'>> {
    return (await axios.post<Response<'getComments'>>(fullPath('getComments'), params)).data;
  }

  /**
   * Searches for edges on the backend
   *
   * @param {GetEdgesQuery} params getEdges query parameters
   * @returns {CreateEdgeResponse[]} the list of edges
   */
  @action public async getEdges(params: Query<'getEdges'>): Promise<Response<'getEdges'>> {
    return this.callWithToken<'getEdges'>('getEdges', params);
  }

  /**
   * Retrieves a feed of posts matching the specified search parameter
   *
   * @param {GetFeedQuery} params getFeed query parameters
   * @returns {GetPostResponse[]} the list of posts
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
   * Gets post media
   *
   * @param {GetMediaQuery} params The media ID
   * @returns {string} The media data.
   */
  @action public async getMedia(params: Query<'getMedia'>): Promise<Response<'getMedia'>> {
    return this.callWithToken<'getMedia'>('getMedia', params);
  }

  /**
   * Gets the full data about a single post from the database
   *
   * @param {GetPostQuery} params getPost query parameters
   * @returns {GetPostResponse} the post data
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
   * Retrieves information about a user from the backend & stores it in memory
   *
   * @param {GetUserQuery} params getUser query parameters
   * @returns {GetUserResponse} information about the requested user
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
   * Gets user information by user ID
   *
   * @param {GetUserByIdQuery} params the query parameters
   * @returns {GetUserResponse} the API response
   */
  @action public async getUserById(params: Query<'getUserById'>): Promise<Response<'getUserById'>> {
    const response = (await axios.post<Response<'getUserById'>>(fullPath('getUserById'), params))
      .data as IUser;
    if (!this.users[response.username]) {
      this.users[response.username] = response;
    }
    return response;
  }

  /**
   * Attempts to authenticate the user with the backend
   *
   * @param {SignInQuery} params the query parameters
   * @returns {SignInResponse} the API response
   */
  @action public async signIn(params: Query<'signIn'>): Promise<Response<'signIn'>> {
    const res = (await axios.post<Response<'signIn'>>(fullPath('signIn'), params)).data;
    JSCookie.set('token', res.token);
    this.token = res.token;
    this.currentUser = {
      displayName: res.displayName,
      email: res.email,
      profileBackground: res.profileBackground,
      profilePicture: res.profilePicture,
      username: res.username,
    };
    return res;
  }

  /**
   * Signs the user out
   */
  @action public async signOut() {
    JSCookie.remove('token');
    this.token = undefined;
  }

  /**
   * Updates user information
   *
   * @param {SignInQuery} params the query parameters
   * @returns {SignInResponse} the API response
   */
  @action public async updateUser(params: Query<'updateUser'>): Promise<Response<'updateUser'>> {
    const res = await this.callWithToken<'updateUser'>('updateUser', params);
    this.currentUser = res as IUser;
    return res;
  }
}

export default new Store();
