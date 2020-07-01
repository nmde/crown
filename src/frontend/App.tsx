import { component } from 'vue-tsx-support';
import { VNode } from 'vue';

export default component({
  render(): VNode {
    return (
      <div>
        <div id="nav">
          <router-link to="/">Home</router-link>
          <router-link to="/about">About</router-link>
        </div>
        <router-view />
      </div>
    );
  },
});
