import { Observer } from 'mobx-vue';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import Store from '../store';

@Observer
@Component
export default class Home extends Vue {
  private store = new Store();

  public render(): VNode {
    return (
      <div>
        {this.store.user !== null ? (
          <div>{JSON.stringify(this.store.user)}</div>
        ) : (
          <div>User is not signed in</div>
        )}
      </div>
    );
  }
}
