/**
 * @file Messaging component.
 */
import { VNode } from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import IMessage from '../../types/Message';
import IUser from '../../types/User';
import { GetMessageResponse } from '../../types/schemas/getMessage/Response';
import formatDate from '../../util/formatDate';
import ViewComponent from '../classes/ViewComponent';
import store from '../store';
import makeStyles from '../styles/makeStyles';

const styles = makeStyles({
  chatWindow: {},
  isSender: {},
  message: {},
  messaging: {
    margin: '8px',
  },
});

@Component
/**
 * @class Messaging
 * @classdesc Instant messaging pop up box.
 */
export default class Messaging extends ViewComponent<typeof styles> {
  private focusedChat: string | null = null;

  private data: {
    messages: Record<string, IMessage[]>,
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
  }

  /**
   * Created lifecycle hook.
   */
  public async created(): Promise<void> {
    await this.fetchMessages();
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
          if (!this.data.users[message.recipient]) {
            let userData: IUser;
            await this.apiCall(
              async () => {
                userData = await store.getUserById({
                  id: message.recipient,
                });
              },
              () => {
                if (!this.data.messages[message.recipient]) {
                  this.data.messages[message.recipient] = [];
                }
                this.$set(this.data.users, message.recipient, {
                  ...userData,
                });
              },
              {},
            );
          }
          this.data.messages[message.recipient].push(message);
        });
      },
      {},
    );

    // Handles incoming messages
    this.$bus.on('message', async (message) => {
      let m: IMessage;
      await this.apiCall(
        async () => {
          m = await store.getMessage({
            id: message.id,
          });
        },
        () => {
          console.log(m);
          this.data.messages[m.sender].push(m);
        },
      );
    });
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
                return `${this.messages.headers.MESSAGES_WITH} ${this.data.users[this.focusedChat].displayName}`;
              }
              return this.messages.headers.MESSAGES;
            })()}
          </v-toolbar-title>
        </v-toolbar>
        {(() => {
          if (typeof this.focusedChat === 'string') {
            return (
              <div>
                <div class={this.className('chatWindow')}>
                  {(() => this.data.messages[this.focusedChat].map((message) => (
                      <v-card>
                        <v-card-text>
                          <p>{message.content}</p>
                          <p class="text-subtitle-1">{formatDate(message.time)}</p>
                        </v-card-text>
                      </v-card>
                  )))()}
                </div>
                <v-text-field
                  label={this.messages.labels.SEND_MESSAGE}
                  vModel={this.newMessage}
                ></v-text-field>
                <v-btn
                  loading={this.sending}
                  icon
                  onClick={async () => {
                    this.sending = true;
                    await this.apiCall(
                      async () => {
                        await store.createMessage({
                          content: this.newMessage,
                          recipient: this.focusedChat as string,
                        });
                      },
                      () => {
                        this.newMessage = '';
                        this.sending = false;
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
                  <v-list-item onClick={() => {
                    this.focusedChat = user.id as string;
                  }}>
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
