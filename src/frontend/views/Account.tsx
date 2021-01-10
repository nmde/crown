import * as tsx from 'vue-tsx-support';
import t from '../translations/en-US.json';
import store from '../store';

export default tsx.component({
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
