import { action, observable } from 'mobx';
import Client from './client';
import UserData from '../types/UserData';

export default class Store {
  @observable
  // TODO verify url
  public client = new Client('http://localhost:3000');

  @observable
  public user: UserData | null = null;

  @action.bound
  public setUser(newUser: UserData): UserData {
    this.user = newUser;
    return newUser;
  }
}
