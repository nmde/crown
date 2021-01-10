import { FromMobx } from 'movue';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import store from '../store';

@Component
export default class Home extends Vue {
  @FromMobx
  private get isLoggedIn() {
    return this.store.token !== undefined;
  }

  private store = store;

  public render(): VNode {
    return <div>is logged in: {this.isLoggedIn}</div>;
  }
}
