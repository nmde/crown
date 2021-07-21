/* eslint-disable class-methods-use-this */
import { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import { Users } from '../../../tests/sample-data';
import APIError from '../classes/APIError';
import Feed from '../classes/Feed';
import ViewComponent from '../classes/ViewComponent';
import FeedComponent from '../components/Feed';
import store from '../store';
import makeStyles from '../styles/makeStyles';
import t from '../translations/en-US.json';

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
 * User profile page view
 */
export default class Profile extends ViewComponent<typeof styles> {
  /**
   * If an action is pending
   */
  private awaitingAction = false;

  /**
   * The user's background image
   */
  private background = Users[0].profileBackground;

  /**
   * The user data
   */
  private data: {
    displayName?: string;
    feed: Feed;
    id?: string;
    username?: string;
  } = {
    feed: new Feed(),
  };

  /**
   * The user's profile picture
   */
  private profilePicture = Users[0].profilePicture;

  /**
   * Testing route param overrides
   */
  @Prop()
  public tParams?: Record<string, string>;

  /**
   * Pass prop type information to TSX
   */
  public _tsx!: tsx.DeclareProps<Props>;

  /**
   * @constructs
   */
  public constructor() {
    super(styles);
  }

  /**
   * Fetches the user data from the backend
   */
  @Watch('$route', {
    deep: true,
    immediate: true,
  })
  private async fetchUser() {
    let user;
    try {
      user = await store.getUser({
        username: this.$route.params.username,
      });
      const feed = await store.getFeed({
        author: [user.id as string],
      });
      this.data.displayName = user.displayName;
      this.data.username = user.username;
      this.data.feed = new Feed(feed);
      // Force the UI to re-render
      this.$set(this.data, 'id', user.id);
    } catch (err) {
      switch (err.response.status) {
        case 400:
          // Expected error (the user was not found)
          this.$bus.emit('error', new APIError(t.headers.USER_ERROR, t.errors.USER_NOT_FOUND, 400));
          break;
        default:
          // Unexpected error
          this.$bus.emit(
            'error',
            new APIError(t.headers.USER_ERROR, t.errors.GENERIC, err.response.status),
          );
      }
    }
  }

  /**
   * Created lifecycle hook - ensures data is fetched when the component is rendered
   */
  public async created(): Promise<void> {
    await this.fetchUser();
  }

  /**
   * Renders the component
   *
   * @returns {VNode} the component
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
                        // TODO
                        const isFollowing = false;
                        if (this.data.id === store.currentUser?.id) {
                          return <div class={this.className('Spacer')}></div>;
                        }
                        if (isFollowing) {
                          return <v-btn>{t.btn.UNFOLLOW}</v-btn>;
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
                                try {
                                  await store.createEdge({
                                    target: this.data.id as string,
                                    type: 'follow',
                                  });
                                } catch (err) {
                                  this.$bus.emit(
                                    'error',
                                    new APIError(
                                      t.headers.USER_ERROR,
                                      t.errors.GENERIC,
                                      err.response.status,
                                    ),
                                  );
                                }
                              }
                              this.awaitingAction = false;
                            }}
                          >
                            {t.btn.FOLLOW}
                          </v-btn>
                        );
                      })()}
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
                        {t.labels.FOLLOWERS}
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
                        {t.labels.FOLLOWING}
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
