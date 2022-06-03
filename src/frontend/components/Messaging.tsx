/**
 * @file Messaging component.
 */
import { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { IMessage, IUser } from '../../types';
import { GetMessageResponse } from '../../types/schemas/getMessage/Response';
import formatDate from '../../util/formatDate';
import ViewComponent from '../classes/ViewComponent';
import store from '../store';
import makeStyles from '../styles/makeStyles';

const styles = makeStyles({
  incoming: {
    textAlign: 'right',
  },
  messaging: {
    margin: '8px',
  },
  outgoing: {},
});

@Component
/**
 * @class Messaging
 * @classdesc Instant messaging pop up box.
 */
export default class Messaging extends ViewComponent<typeof styles> {
  private focusedChat: string | null = null;

  private data: {
    messages: Record<string, IMessage[]>;
    users: Record<string, IUser>;
  } = {
    messages: {},
    users: {},
  };

  private newMessage = '';

  private sending = false;

  /**
   * Constructs Messaging.
   *
   * @constructs
   */
  public constructor() {
    super(styles);
    // Handles incoming messages
    this.$bus.on('message', async (message) => {
      let m: IMessage;
      await this.apiCall(
        async () => {
          m = await store.getMessage({
            id: message.id,
          });
        },
        async () => {
          await this.ensureUser(m.sender);
          this.data.messages[m.sender].push(m);
          this.$forceUpdate();
        },
      );
    });
  }

  /**
   * Created lifecycle hook.
   */
  public async created(): Promise<void> {
    await this.fetchMessages();
    const { focus } = this.$route.query;
    if (typeof focus === 'string') {
      this.focusedChat = focus;
      await this.ensureUser(focus);
    }
  }

  /**
   * Ensures that a user exists in the component data structure.
   *
   * @param {string} id The ID of the user to verify.
   */
  private async ensureUser(id: string) {
    if (!this.data.users[id]) {
      let userData: IUser;
      await this.apiCall(
        async () => {
          userData = await store.getUserById({
            id,
          });
        },
        () => {
          if (!this.data.messages[id]) {
            this.data.messages[id] = [];
          }
          this.$set(this.data.users, id, userData);
        },
        {},
      );
    }
  }

  /**
   * Fetches the user's messages from the backend.
   */
  private async fetchMessages(): Promise<void> {
    let messages: GetMessageResponse[] = [];
    await this.apiCall(
      async () => {
        messages = await store.messages({});
      },
      async () => {
        this.data.messages = {};
        messages.forEach(async (message) => {
          let id = message.recipient;
          if (id === store.currentUser?.id) {
            id = message.sender;
          }
          await this.ensureUser(id);
          this.data.messages[id].push(message);
        });
      },
      {},
    );
  }

  /**
   * Renders the component.
   *
   * @returns {VNode} The component.
   */
  public render(): VNode {
    return (
      <v-card class={this.className('messaging')}>
        <v-toolbar color="primary">
          <v-toolbar-title>
            {(() => {
              if (typeof this.focusedChat === 'string') {
                return `${this.messages.headers.MESSAGES_WITH} ${
                  this.data.users[this.focusedChat].displayName
                }`;
              }
              return this.messages.headers.MESSAGES;
            })()}
          </v-toolbar-title>
        </v-toolbar>
        {(() => {
          if (typeof this.focusedChat === 'string') {
            return (
              <div>
                <v-list>
                  {(() => this.data.messages[this.focusedChat].map((message) => {
                    let className: 'incoming' | 'outgoing' = 'incoming';
                    if (message.sender === store.currentUser?.id) {
                      className = 'outgoing';
                    }
                    return (
                        <v-list-item two-line class={this.className(className)}>
                          <v-list-item-content>
                            <v-list-item-title>{message.content}</v-list-item-title>
                            <v-list-item-subtitle class="text-subtitle-1">
                              {formatDate(message.time)}
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                    );
                  }))()}
                </v-list>
                <v-text-field
                  label={this.messages.labels.SEND_MESSAGE}
                  vModel={this.newMessage}
                ></v-text-field>
                <v-btn
                  loading={this.sending}
                  icon
                  onClick={async () => {
                    this.sending = true;
                    let created: IMessage;
                    await this.apiCall(
                      async () => {
                        created = await store.createMessage({
                          content: this.newMessage,
                          recipient: this.focusedChat as string,
                        });
                      },
                      () => {
                        this.newMessage = '';
                        this.sending = false;
                        this.data.messages[this.focusedChat as string].push(created);
                      },
                    );
                  }}
                >
                  <v-icon>send</v-icon>
                </v-btn>
              </div>
            );
          }
          return (
            <v-list>
              {(() => Object.values(this.data.users).map((user) => (
                  <v-list-item
                    onClick={() => {
                      this.focusedChat = user.id as string;
                    }}
                  >
                    <v-list-item-title>{user.displayName}</v-list-item-title>
                  </v-list-item>
              )))()}
            </v-list>
          );
        })()}
      </v-card>
    );
  }
}
