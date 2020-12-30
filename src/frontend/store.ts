/* eslint-disable class-methods-use-this */
import axios from 'axios';
import { action } from 'mobx';
import { POST } from '../types/Endpoints';
import apiPath from '../util/apiPath';

/**
 * The "store", which manages data shared across all pages
 */
class Store {
  @action
  public async createAccount(
    params: POST['createAccount']['query'],
  ): POST['createAccount']['response'] {
    return axios.post(apiPath('createAccount'), params);
  }

  @action
  public async signIn(params: POST['signIn']['query']): POST['signIn']['response'] {
    return axios.post(apiPath('signIn'), params);
  }
}

export default new Store();
