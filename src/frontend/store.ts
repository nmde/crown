/* eslint-disable class-methods-use-this */
import axios from 'axios';
import JSCookie from 'js-cookie';
import { action, makeObservable, observable } from 'mobx';
import { CreateAccountQuery } from 'types/schemas/createAccount/Query';
import { CreateAccountResponse } from 'types/schemas/createAccount/Response';
import { CreatePostQuery } from 'types/schemas/createPost/Query';
import { CreatePostResponse } from 'types/schemas/createPost/Response';
import { GetFeedQuery } from 'types/schemas/getFeed/Query';
import { GetPostQuery } from 'types/schemas/getPost/Query';
import { GetPostResponse } from 'types/schemas/getPost/Response';
import { GetUserQuery } from 'types/schemas/getUser/Query';
import { GetUserResponse } from 'types/schemas/getUser/Response';
import { SignInQuery } from 'types/schemas/signIn/Query';
import { SignInResponse } from 'types/schemas/signIn/Response';
import { EndpointProvider, Query, Response } from '../types/Endpoints';
import IPost from '../types/Post';
import IUser from '../types/User';
import apiPath from '../util/apiPath';

/**
 * The "store", which manages data shared across all pages
 */
class Store implements EndpointProvider {
  @observable
  public posts: Record<string, IPost> = {};

  /**
   * Information about users, accessible by the user's uuid
   */
  @observable
  public users: Record<string, IUser> = {};

  @observable
  public token = JSCookie.get('token');

  /**
   * @constructs
   */
  public constructor() {
    makeObservable(this);
  }

  /**
   * Creates an account
   *
   * @param {CreateAccountQuery} params the query parameters
   * @returns {CreateAccountResponse} the API response
   */
  @action public async createAccount(params: Query<'createAccount'>): Promise<Response<'createAccount'>> {
    const res = (await axios.post<Response<'createAccount'>>(apiPath('createAccount'), params))
      .data;
    await this.signIn({
      password: params.password,
      username: params.username,
    });
    return res;
  }

  /**
   * Creates a post
   *
   * @param {CreatePostQuery} params the request parameters
   * @returns {CreatePostResponse} the API response
   */
  @action public async createPost(params: Query<'createPost'>): Promise<Response<'createPost'>> {
    return (await axios.post<Response<'createPost'>>(apiPath('createPost'), params)).data;
  }

  /**
   * Retrieves a feed of posts matching the specified search parameter
   *
   * @param {GetFeedQuery} params getFeed query parameters
   * @returns {GetPostResponse[]} the list of posts
   */
  @action public async getFeed(params: Query<'getFeed'>): Promise<Response<'getFeed'>> {
    const posts = (await axios.post<Response<'getFeed'>>(apiPath('getFeed'), params)).data;
    posts.forEach((post) => {
      if (this.posts[post.id as string]) {
        this.posts[post.id as string] = post;
      }
    });
    return posts;
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
    const post = (await axios.post<Response<'getPost'>>(apiPath('getPost'), params)).data;
    this.posts[post.id as string] = post;
    return post;
  }

  /**
   * Retrieves information about a user from the backend & stores it in memory
   *
   * @param {GetUserQuery} params getUser query parameters
   * @returns {GetUserResponse} information about the requested user
   */
  @action
  public async getUser(params: Query<'getUser'>): Promise<Response<'getUser'>> {
    if (this.users[params.id]) {
      return this.users[params.id];
    }
    return (await axios.post<Response<'getUser'>>(apiPath('getUser'), params)).data;
  }

  /**
   * Attempts to authenticate the user with the backend
   *
   * @param {SignInQuery} params the query parameters
   * @returns {SignInResponse} the API response
   */
  @action public async signIn(params: Query<'signIn'>): Promise<Response<'signIn'>> {
    const res = (await axios.post<Response<'signIn'>>(apiPath('signIn'), params)).data;
    JSCookie.set('token', res.token);
    this.token = res.token;
    return res;
  }

  /**
   * Signs the user out
   */
  @action public async signOut() {
    JSCookie.remove('token');
    this.token = undefined;
  }
}

export default new Store();
