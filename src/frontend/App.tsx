/**
 * @file App component.
 */
import io from 'socket.io-client';
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
    position: 'fixed',
    right: 0,
  },
});

@Component
/**
 * @class App
 * @classdesc The app wrapper.
 */
export default class App extends ViewComponent<typeof styles> {
  private errors: APIError[] = [];

  /**
   * Constructs App.
   *
   * @constructs
   */
  public constructor() {
    super(styles);
    const socket = io();
    socket.on('message', (message: IMessage) => {
      if (message.recipient === store.currentUser?.id) {
        this.$bus.emit('message', message);
      }
    });
    this.$bus.on('error', (err: APIError) => {
      this.errors.push(err);
    });
  }

  /**
   * Created lifecycle hook.
   */
  public async created(): Promise<void> {
    await this.getCurrentUser();
  }

  /**
   * Renders the component.
   *
   * @returns {VNode} The component.
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
            <NavLink href="/messages" icon="forum" text={this.messages.headers.MESSAGES} />
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
      </v-app>
    );
  }
}
