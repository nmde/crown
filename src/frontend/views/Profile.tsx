/**
 * @file Profile view.
 */
import { GetPostResponse } from 'types/schemas/getPost/Response';
import { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import { Users } from '../../../tests/sample-data';
import IUser from '../../types/User';
import Feed from '../classes/Feed';
import ViewComponent from '../classes/ViewComponent';
import FeedComponent from '../components/Feed';
import store from '../store';
import makeStyles from '../styles/makeStyles';

// Prop types
export type Props = {
  tParams: Record<string, string>;
};

const styles = makeStyles({
  AvatarContainer: {
    textAlign: 'center',
    zIndex: 100,
  },
  Center: {
    textAlign: 'center',
  },
  DisplayName: {
    justifyContent: 'center',
  },
  Fill: {
    height: '100%',
    width: '100%',
  },
  GalleryImage: {
    padding: 0,
  },
  Icon: {
    color: 'white',
    fontSize: '100px',
  },
  Main: {
    marginTop: '-15px',
  },
  Spacer: {
    height: '86.5px',
  },
  TextSpacer: {
    height: '32px',
  },
});

@Component
/**
 * @class Profile
 * @classdesc User profile page view.
 */
export default class Profile extends ViewComponent<typeof styles> {
  /**
   * If an action is pending.
   */
  private awaitingAction = false;

  /**
   * The user's background image.
   */
  private background = Users[0].profileBackground;

  /**
   * The user data.
   */
  private data: {
    displayName?: string;
    feed: Feed;
    id?: string;
    isFollowing?: boolean;
    followId?: string;
    username?: string;
  } = {
    feed: new Feed(),
  };

  /**
   * The user's profile picture.
   */
  private profilePicture = Users[0].profilePicture;

  /**
   * Testing route param overrides.
   */
  @Prop()
  public tParams?: Record<string, string>;

  /**
   * Pass prop type information to TSX.
   */
  public _tsx!: tsx.DeclareProps<Props>;

  /**
   * Constructs Profile.
   *
   * @constructs
   */
  public constructor() {
    super(styles);
  }

  /**
   * Fetches the user data from the backend.
   */
  @Watch('$route', {
    deep: true,
    immediate: true,
  })
  private async fetchUser() {
    let user: IUser;
    await this.apiCall(
      async () => {
        user = (await store.getUser({
          username: this.$route.params.username,
        })) as IUser;
      },
      async () => {
        if (user.id !== store.currentUser?.id) {
          try {
            const edges = await store.getEdges({
              type: 'follow',
            });
            const followEdge = edges.find((edge) => edge.target === user.id);
            this.data.isFollowing = followEdge !== null;
            if (this.data.isFollowing) {
              this.data.followId = followEdge?.id;
            }
          } catch (err) {
            // just ignore it
            // console.error(err);
          }
        }
        let feed: GetPostResponse[];
        await this.apiCall(
          async () => {
            feed = await store.getFeed({
              author: [user.id as string],
            });
          },
          () => {
            this.data.displayName = user.displayName;
            this.data.username = user.username;
            this.data.feed.addPosts(feed);
            // Force the UI to re-render
            this.$set(this.data, 'id', user.id);
          },
          {},
        );
      },
      {
        400: this.messages.errors.USER_NOT_FOUND,
      },
    );
  }

  /**
   * Created lifecycle hook - ensures data is fetched when the component is rendered.
   */
  public async created(): Promise<void> {
    await this.fetchUser();
  }

  /**
   * Renders the component.
   *
   * @returns {VNode} The component.
   */
  public render(): VNode {
    // TODO: allow users to customize their background
    return (
      <v-parallax class={this.className('Fill')} src={this.background}>
        <v-container class={this.className('Fill')} fluid>
          <v-row noGutters>
            <v-col class={this.className('AvatarContainer')}>
              <v-avatar color="primary" rounded size={100}>
                {(() => {
                  if (this.profilePicture === undefined) {
                    return <v-progress-circular indeterminate />;
                  }
                  return <v-img src={this.profilePicture} />;
                })()}
              </v-avatar>
            </v-col>
          </v-row>
          <v-row class={this.className('Main')} noGutters>
            <v-col>
              <v-card class={this.className('Center')}>
                {(() => {
                  if (this.data.id === undefined) {
                    return <div class={this.className('Spacer')}></div>;
                  }
                  return (
                    <div>
                      <v-card-title class={this.className('DisplayName')}>
                        {this.data.displayName}
                      </v-card-title>
                      <v-card-subtitle>{this.data.username}</v-card-subtitle>
                      {(() => {
                        if (this.data.id === store.currentUser?.id) {
                          return <div class={this.className('Spacer')}></div>;
                        }
                        if (this.data.isFollowing && this.data.followId !== undefined) {
                          return (
                            <v-btn
                              loading={this.awaitingAction}
                              onClick={async () => {
                                this.awaitingAction = true;
                                await this.apiCall(
                                  async () => {
                                    await store.deleteEdge({
                                      id: this.data.followId as string,
                                    });
                                  },
                                  () => {
                                    this.data.isFollowing = false;
                                  },
                                  {},
                                );
                                this.awaitingAction = false;
                              }}
                            >
                              {this.messages.btn.UNFOLLOW}
                            </v-btn>
                          );
                        }
                        return (
                          <v-btn
                            color="primary"
                            loading={this.awaitingAction}
                            onClick={async () => {
                              this.awaitingAction = true;
                              const { currentUser, token } = store;
                              if (token === undefined || currentUser === undefined) {
                                // If the user is not signed in, take them to the sign in page
                                this.$router.push('/login');
                              } else {
                                await this.apiCall(
                                  async () => {
                                    this.data.followId = (
                                      await store.createEdge({
                                        target: this.data.id as string,
                                        type: 'follow',
                                      })
                                    ).id;
                                  },
                                  () => {
                                    this.data.isFollowing = true;
                                  },
                                  {
                                    409: this.messages.errors.FOLLOW_CONFLICT,
                                  },
                                );
                                this.awaitingAction = false;
                              }
                            }}
                          >
                            {this.messages.btn.FOLLOW}
                          </v-btn>
                        );
                      })()}
                      <v-btn
                        icon
                        onClick={() => {
                          this.$router.push({
                            path: 'messages',
                            query: {
                              focus: this.data.id,
                            },
                          });
                        }}
                      >
                        <v-icon>chat</v-icon>
                      </v-btn>
                    </div>
                  );
                })()}
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols={6}>
                        <div class="text-h5">
                          {(() => {
                            if (this.data.id === undefined) {
                              return <div class={this.className('TextSpacer')} />;
                            }
                            // return this.user.followerCount;
                            return 0;
                          })()}
                        </div>
                        {this.messages.labels.FOLLOWERS}
                      </v-col>
                      <v-col cols={6}>
                        <div class="text-h5">
                          {(() => {
                            if (this.data.id === undefined) {
                              return <div class={this.className('TextSpacer')} />;
                            }
                            // return this.user.followingCount;
                            return 0;
                          })()}
                        </div>
                        {this.messages.labels.FOLLOWING}
                      </v-col>
                    </v-row>
                    <v-row>
                      <FeedComponent feed={this.data.feed} />
                      {/* TODO: limit the number of posts loaded at once */}
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-parallax>
    );
  }
}
