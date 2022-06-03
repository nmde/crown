/**
 * @file Account page.
 */
import { VNode } from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import ViewComponent from '../classes/ViewComponent';
import store from '../store';
import fab from '../styles/fab';
import makeStyles from '../styles/makeStyles';

const styles = makeStyles({
  ...fab,
  center: {
    textAlign: 'center',
  },
});

@Component
/**
 * The account settings page.
 */
export default class Account extends ViewComponent<typeof styles> {
  private form: {
    displayName: string;
  } = {
    displayName: '',
  };

  private snackbar = false;

  /**
   * Constructs Account.
   *
   * @constructs
   */
  public constructor() {
    super(styles);
  }

  /**
   * Checks if the user is signed in when the page is loaded.
   */
  @Watch('$route', {
    deep: true,
    immediate: true,
  })
  private async setup() {
    if (store.currentUser === undefined) {
      this.$router.push('/login');
    } else {
      this.form.displayName = store.currentUser.displayName as string;
    }
  }

  /**
   * Renders the component.
   *
   * @returns {VNode} The component.
   */
  public render(): VNode {
    return (
      <v-card>
        <v-card-title>{this.messages.headers.ACCOUNT}</v-card-title>
        <v-card-text>
          <div class={this.className('center')}>
            <router-link to={`/@${store.currentUser?.username}`}>View My Profile</router-link>
          </div>
          <v-btn
            block
            color="primary"
            onClick={async () => {
              await store.signOut();
              this.$router.push('/');
            }}
          >
            {this.messages.btn.SIGNOUT}
          </v-btn>
          <v-divider />
          <v-text-field label={this.messages.labels.DISPLAY_NAME} vModel={this.form.displayName} />
          <v-btn
            fab
            class={this.className('fab')}
            color="primary"
            onClick={async () => {
              await this.apiCall(
                async () => {
                  await store.updateUser({
                    displayName: this.form.displayName,
                  });
                },
                () => {
                  this.snackbar = true;
                },
                {},
              );
            }}
          >
            <v-icon>save</v-icon>
          </v-btn>
        </v-card-text>
        <v-snackbar vModel={this.snackbar}>{this.messages.msg.SAVED}</v-snackbar>
      </v-card>
    );
  }
}
