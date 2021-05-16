import * as tsx from 'vue-tsx-support';
import { VNode } from 'vue/types/umd';
import store from '../store';
import t from '../translations/en-US.json';

export default tsx.component({
  /**
   * Renders the component
   *
   * @returns {VNode} the component
   */
  render() {
    return (
      <v-container>
        <v-btn
          block
          onClick={async () => {
            await store.signOut();
          }}
        >
          {t.btn.SIGNOUT}
        </v-btn>
      </v-container>
    );
  },
});
