import { component } from 'vue-tsx-support';
import { VNode } from 'vue';

export default component({
  render(): VNode {
    return (
      <v-app>
        <div id="nav">
          <router-link to="/">Home</router-link>
          <router-link to="/login">Login</router-link>
        </div>
        <v-main>
          <router-view />
        </v-main>
      </v-app>
    );
  },
});
