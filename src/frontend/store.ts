import { observable } from 'mobx';
import Client from './client';

export default class Store {
  @observable
  // TODO fix url
  public client = new Client('http://localhost:3000');
}
