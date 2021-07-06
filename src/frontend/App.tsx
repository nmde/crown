import { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import ViewComponent from './classes/ViewComponent';
import CreatePostDialog from './components/CreatePostDialog';
import ErrorDialog from './components/ErrorDialog';
import store from './store';
import fab from './styles/fab';
import makeStyles from './styles/makeStyles';
import t from './translations/en-US.json';

const styles = makeStyles(fab);

@Component
/**
 *
 */
export default class App extends ViewComponent<typeof styles> {
  /**
   * The view currently displayed to the user
   */
  private nav = this.$route.path.substring(1);

  /**
   * Controls visibility of the create post dialog
   */
  private uploadDialog = false;

  /**
   * Defines custom component styles
   *
   * @constructs
   */
  public constructor() {
    super(styles);
    this.$bus.on('deletePost', async (id: string) => {
      await this.apiCall(
        async () => {
          await store.deletePost({
            id,
            token: store.token as string,
          });
        },
        () => {},
        {
          400: this.messages.errors.DELETE,
        },
      );
    });
  }

  /**
   * Renders the component
   *
   * @returns {VNode} the component
   */
  public render(): VNode {
    return (
      <v-app>
        {(() => {
          if (store.token === undefined) {
            return (
              <v-app-bar app color="primary" dense>
                <v-app-bar-title>{t.msg.SIGNED_OUT}</v-app-bar-title>
                <v-spacer />
                <v-btn to="/login">{t.btn.SIGNIN}</v-btn>
              </v-app-bar>
            );
          }
          return null;
        })()}
        <v-main>
          {(() => {
            if (store.token !== undefined && this.nav === 'home') {
              return (
                <v-btn
                  fab
                  color="primary"
                  class={this.className('fab')}
                  onClick={() => {
                    this.uploadDialog = true;
                  }}
                >
                  <v-icon>add</v-icon>
                </v-btn>
              );
            }
            return null;
          })()}
          <router-view />
        </v-main>
        <v-bottom-navigation app color="primary" grow shift vModel={this.nav}>
          <v-btn to="/" value="home">
            <span>{t.headers.HOME}</span>
            <v-icon>home</v-icon>
          </v-btn>
          <v-btn to="/categories" value="categories">
            <span>{t.headers.CATEGORIES}</span>
            <v-icon>category</v-icon>
          </v-btn>
          <v-btn to="/explore" value="explore">
            <span>{t.headers.EXPLORE}</span>
            <v-icon>explore</v-icon>
          </v-btn>
          <v-btn to="/account" value="account">
            <span>{t.headers.ACCOUNT}</span>
            <v-icon>account_circle</v-icon>
          </v-btn>
        </v-bottom-navigation>
        <v-dialog vModel={this.uploadDialog}>
          <CreatePostDialog
            onFinished={() => {
              this.uploadDialog = false;
            }}
          />
        </v-dialog>
        <ErrorDialog header={this.messages.headers.HOME_ERROR} message={this.error} />
      </v-app>
    );
  }
}
