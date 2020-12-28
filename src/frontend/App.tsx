import { VNode } from 'vue';
import { component } from 'vue-tsx-support';

/**
 * The main app component - Contains all global logic & UI
 */
export default component({
  render(): VNode {
    return (
      <v-app>
        <router-view />
      </v-app>
    );
  },
});
