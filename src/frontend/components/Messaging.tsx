/**
 * @file Messaging component.
 */
import { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import IMessage from '../../types/Message';
import IUser from '../../types/User';
import formatDate from '../../util/formatDate';
import ViewComponent from '../classes/ViewComponent';
import store from '../store';
import makeStyles from '../styles/makeStyles';

const styles = makeStyles({
  chatWindow: {},
  isSender: {},
  message: {},
  messaging: {
    marginRight: '8px',
    width: '50%',
  },
});

@Component
/**
 * @class Messaging
 * @classdesc Instant messaging pop up box.
 */
export default class Messaging extends ViewComponent<typeof styles> {
  private showMessages = false;

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
  }

  /**
   * Created lifecycle hook.
   */
  public async created(): Promise<void> {
    // Opens the chat window to a specific user
    this.$bus.on('focusChat', async (target: string) => {
      this.showMessages = true;
      let messages: IMessage[] = [];
      let user: IUser;
      await this.apiCall(
        async () => {
          user = await store.getUserById({
            id: target,
          });
        },
        async () => {
          this.data.users[target] = user;
          await this.apiCall(
            async () => {
              messages = (
                await store.messages({
                  to: target,
                })
              ) as IMessage[];
            },
            () => {
              this.data.messages[target] = messages;
              this.focusedChat = target;
            },
          );
        },
      );
    });

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
        <v-toolbar
          color="primary"
          onClick={() => {
            this.showMessages = !this.showMessages;
          }}
        >
          <v-toolbar-title>
            {(() => {
              if (typeof this.focusedChat === 'string') {
                return this.data.users[this.focusedChat].displayName;
              }
              return this.messages.headers.MESSAGES;
            })()}
          </v-toolbar-title>
        </v-toolbar>
        {(() => {
          if (this.showMessages) {
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
                  <v-btn loading={this.sending} icon onClick={async () => {
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
                  }}>
                    <v-icon>send</v-icon>
                  </v-btn>
                </div>
              );
            }
            return <div />;
          }
          return <div />;
        })()}
      </v-card>
    );
  }
}
