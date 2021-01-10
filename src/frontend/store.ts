/* eslint-disable class-methods-use-this */
import axios from 'axios';
import JSCookie from 'js-cookie';
import { action, makeObservable, observable } from 'mobx';
import { EndpointProvider, Query, Response } from '../types/Endpoints';
import apiPath from '../util/apiPath';

/**
 * The "store", which manages data shared across all pages
 */
class Store implements EndpointProvider {
  @observable
  public token = JSCookie.get('token');

  public constructor() {
    makeObservable(this);
  }

  @action
  public async createAccount(params: Query<'createAccount'>): Promise<Response<'createAccount'>> {
    return (await axios.post<Response<'createAccount'>>(apiPath('createAccount'), params)).data;
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
