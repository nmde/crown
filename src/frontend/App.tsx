import { VNode } from 'vue';
import { component } from 'vue-tsx-support';

/**
 * The main app component - Contains all global logic & UI
 */
export default component({
  render(): VNode {
    return (
      <v-app>
        <v-main>
          <router-view />
        </v-main>
      </v-app>
    );
  },
});
