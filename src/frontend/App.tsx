import { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import IMessage from '../types/Message';
import APIError from './classes/APIError';
import ViewComponent from './classes/ViewComponent';
import NavLink from './components/NavLink';
import store from './store';
import makeStyles from './styles/makeStyles';

const styles = makeStyles({
  messages: {
    bottom: 0,
    display: 'none',
    position: 'fixed',
    right: 0,
  },
});

@Component
/**
 * The app wrapper
 */
export default class App extends ViewComponent<typeof styles> {
  /** the errors */
  private errors: APIError[] = [];

  private showMessages = false;

  private data: {
    messages: IMessage[];
  } = {
    messages: [],
  };

  /**
   * @constructs
   */
  public constructor() {
    super(styles);
    this.$bus.on('error', (err: APIError) => {
      this.errors.push(err);
    });
  }

  /**
   * Created lifecycle hook
   */
  public async created(): Promise<void> {
    await this.getCurrentUser();
    let messages: IMessage[];
    await this.apiCall(
      async () => {
        messages = (await store.messages({})).messages as IMessage[];
      },
      () => {
        this.data.messages = messages;
        console.log(messages);
      },
    );
  }

  /**
   * Renders the component
   *
   * @returns {VNode} the component
   */
  public render(): VNode {
    return (
      <v-app>
        <v-navigation-drawer app permanent expand-on-hover>
          {(() => {
            if (store.token !== undefined) {
              return (
                <v-list>
                  <v-list-item class="px-2" link to={`/@${store.currentUser?.username}`}>
                    <v-list-item-avatar>
                      <v-img src={store.currentUser?.profilePicture} />
                    </v-list-item-avatar>
                  </v-list-item>
                </v-list>
              );
            }
            return <div />;
          })()}
          <v-divider />
          <v-list nav dense>
            <NavLink href="/" icon="home" text={this.messages.headers.HOME} />
            <NavLink href="/explore" icon="explore" text={this.messages.headers.EXPLORE} />
            <NavLink href="/categories" icon="category" text={this.messages.headers.CATEGORIES} />
            <NavLink href="/account" icon="account_circle" text={this.messages.headers.ACCOUNT} />
          </v-list>
        </v-navigation-drawer>
        {(() => {
          if (store.token === undefined) {
            return (
              <v-app-bar app dense hide-on-scroll>
                <v-app-bar-title>{this.messages.msg.SIGNED_OUT}</v-app-bar-title>
                <v-spacer />
                <v-btn text elevation={0} to="/login">
                  {this.messages.btn.SIGNIN}
                </v-btn>
              </v-app-bar>
            );
          }
          return <div />;
        })()}
        <v-main>
          <v-container fluid>
            <router-view />
          </v-container>
        </v-main>
        {(() => this.errors.map((err) => {
          let open = true;
          return (
              <v-dialog max-width={500} vModel={open}>
                <v-card>
                  <v-card-title>{err.title}</v-card-title>
                  <v-card-text>{err.message}</v-card-text>
                  <v-card-actions>
                    <v-btn
                      block
                      onClick={() => {
                        open = false;
                        this.errors.pop();
                      }}
                    >
                      {this.messages.btn.CLOSE}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
          );
        }))()}
        <v-card class={this.className('messages')}>
          <v-toolbar
            color="primary"
            onClick={() => {
              this.showMessages = !this.showMessages;
            }}
          >
            <v-toolbar-title>{this.messages.headers.MESSAGES}</v-toolbar-title>
          </v-toolbar>
          {(() => {
            if (this.showMessages) {
              if (this.data.messages.length === 0) {
                return <v-card-text>{this.messages.text.NO_MESSAGES}</v-card-text>;
              }
            }
            return <div />;
          })()}
        </v-card>
      </v-app>
    );
  }
}
