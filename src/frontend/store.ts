import axios from 'axios';
import JSCookie from 'js-cookie';
import { action, makeObservable, observable } from 'mobx';
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

  public constructor() {
    makeObservable(this);
  }

  @action
  public async createAccount(params: Query<'createAccount'>): Promise<Response<'createAccount'>> {
    const res = (await axios.post<Response<'createAccount'>>(apiPath('createAccount'), params))
      .data;
    await this.signIn({
      username: params.username,
      password: params.password,
    });
    return res;
  }

  @action
  public async createPost(params: Query<'createPost'>): Promise<Response<'createPost'>> {
    return (await axios.post<Response<'createPost'>>(apiPath('createPost'), params)).data;
  }

  /**
   * Retrieves a feed of posts matching the specified search parameter
   * @param params getFeed query parameters
   * @returns the list of posts
   */
  @action
  public async getFeed(params: Query<'getFeed'>): Promise<Response<'getFeed'>> {
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
   * @param params getPost query parameters
   * @returns the post data
   */
  @action
  public async getPost(params: Query<'getPost'>): Promise<Response<'getPost'>> {
    if (this.posts[params.id]) {
      return this.posts[params.id];
    }
    const post = (await axios.post<Response<'getPost'>>(apiPath('getPost'), params)).data;
    this.posts[post.id as string] = post;
    return post;
  }

  /**
   * Retrieves information about a user from the backend & stores it in memory
   * @param params getUser query parameters
   * @returns information about the requested user
   */
  @action
  public async getUser(params: Query<'getUser'>): Promise<Response<'getUser'>> {
    if (this.users[params.id]) {
      return this.users[params.id];
    }
    return (await axios.post<Response<'getUser'>>(apiPath('getUser'), params)).data;
  }

  @action
  public async signIn(params: Query<'signIn'>): Promise<Response<'signIn'>> {
    const res = (await axios.post<Response<'signIn'>>(apiPath('signIn'), params)).data;
    JSCookie.set('token', res.token);
    this.token = res.token;
    return res;
  }

  @action
  public async signOut() {
    JSCookie.remove('token');
    this.token = undefined;
  }
}

export default new Store();
