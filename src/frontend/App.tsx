import { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import ViewComponent from './classes/ViewComponent';
import NavLink from './components/NavLink';
import store from './store';
import makeStyles from './styles/makeStyles';

const styles = makeStyles({});

@Component
/**
 * The app wrapper
 */
export default class App extends ViewComponent<typeof styles> {
  /**
   * @constructs
   */
  public constructor() {
    super(styles);
  }

  /**
   * Created lifecycle hook
   */
  public async created(): Promise<void> {
    await this.getCurrentUser();
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
          if (store.token !== undefined) {
            return (
              <v-navigation-drawer app permanent expand-on-hover>
                <v-list>
                  <v-list-item class="px-2">
                    <v-list-item-avatar>
                      <v-img src={store.currentUser?.profilePicture} />
                    </v-list-item-avatar>
                  </v-list-item>
                  <v-list-item link>
                    <v-list-item-content>
                      <v-list-item-title class="text-h6">{store.currentUser?.displayName}</v-list-item-title>
                      <v-list-item-subtitle>{store.currentUser?.username}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-divider />
                <v-list nav dense>
                  <NavLink href="/" icon="home" text={this.messages.headers.HOME} />
                  <NavLink href="/explore" icon="explore" text={this.messages.headers.EXPLORE} />
                  <NavLink href="/categories" icon="category" text={this.messages.headers.CATEGORIES} />
                  <NavLink href="/account" icon="account_circle" text={this.messages.headers.ACCOUNT} />
                </v-list>
              </v-navigation-drawer>
            );
          }
          return <v-app-bar app dense>
            <v-app-bar-title>{this.messages.msg.SIGNED_OUT}</v-app-bar-title>
            <v-spacer />
            <v-btn text elevation={0} to="/signin">{this.messages.btn.SIGNIN}</v-btn>
          </v-app-bar>;
        })()}
        <v-main>
          <v-container fluid>
            <router-view />
          </v-container>
        </v-main>
      </v-app>
    );
  }
}
