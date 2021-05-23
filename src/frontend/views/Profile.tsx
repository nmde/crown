import { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import MediaRecord from '../../types/MediaRecord';
import IUser from '../../types/User';
import Styled from '../Styled';
import background from '../assets/background.jpg';
import Feed from '../classes/Feed';
import ErrorDialog from '../components/ErrorDialog';
import store from '../store';
import t from '../translations/en-US.json';

// CSS classes
type Classes =
  | 'Fill'
  | 'AvatarContainer'
  | 'Icon'
  | 'Main'
  | 'DisplayName'
  | 'Center'
  | 'GalleryImage'
  | 'Spacer'
  | 'TextSpacer';

const avatarSize = 100;

// Prop types
export type Props = {
  media: MediaRecord;
  feed: Feed;
  tParams?: Record<string, string>;
};

@Component
/**
 * User profile page view
 */
export default class Profile extends Styled<Classes> implements Props {
  /**
   * The user data
   */
  public user!: IUser;

  /**
   * Required media
   */
  @Prop()
  public media!: MediaRecord;

  /**
   * A feed of posts
   */
  @Prop()
  public feed!: Feed;

  /**
   * Testing route param overrides
   */
  @Prop()
  public tParams?: Record<string, string>;

  /**
   * If an action is pending
   */
  private awaitingAction = false;

  /**
   * The image to display as the background
   */
  private background = background;

  /**
   * The error message, if any
   */
  private error = '';

  /**
   * If the page is awaiting user data from the backend
   */
  private loading = false;

  /**
   * Pass prop type information to TSX
   */
  public _tsx!: tsx.DeclareProps<Props>;

  /**
   * Defines custom styles for the Profile view
   *
   * @constructs
   */
  public constructor() {
    super({
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
        fontSize: `${avatarSize}px`,
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
  }

  /**
   * Fetches the user data from the backend
   */
  @Watch('$route', {
    deep: true,
    immediate: true,
  })
  private async fetchUser() {
    this.loading = true;
    let params: Record<string, string>;
    if (this.$route === undefined && this.tParams !== undefined) {
      params = this.tParams;
    } else {
      params = this.$route.params;
    }
    const { username } = params;
    if (typeof username === 'string') {
      try {
        this.user = (await store.getUser({
          username,
        })) as IUser;

        if (this.user !== undefined) {
          // TODO
          this.background = this.media[this.user.profileBackground];

          // Get the user's posts
          try {
            this.feed = new Feed(
              await store.getFeed({
                username: this.user.username,
              }),
            );
          } catch (err) {
            // TODO
            this.loading = false;
          }
        }
      } catch (err) {
        if (err.response === undefined) {
          this.error = t.errors.GENERIC;
        } else {
          switch (err.response.status) {
            case 400:
              // Expected error (the user was not found)
              this.error = t.errors.USER_NOT_FOUND;
              break;
            default:
              // Unexpected error
              this.error = t.errors.GENERIC;
          }
        }
      }
    } else {
      // Invalid ID was supplied, display an error message
      this.error = t.errors.USER_NOT_FOUND;
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
              <v-avatar color="primary" rounded size={avatarSize}>
                {(() => {
                  if (this.loading) {
                    return <v-progress-circular indeterminate />;
                  }
                  return <v-img src={this.media[this.user.profilePicture]} />;
                })()}
              </v-avatar>
            </v-col>
          </v-row>
          <v-row class={this.className('Main')} noGutters>
            <v-col>
              <v-card class={this.className('Center')}>
                {(() => {
                  if (!this.loading) {
                    return (
                      <div>
                        <v-card-title class={this.className('DisplayName')}>
                          {this.user.displayName}
                        </v-card-title>
                        <v-card-subtitle>{this.user.username}</v-card-subtitle>
                        {(() => {
                          // TODO
                          const isFollowing = false;
                          if (this.user.id === store.currentUser?.id) {
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
                                  await store.createEdge({
                                    source: currentUser.id as string,
                                    target: this.user.id as string,
                                    token,
                                    type: 'follow',
                                  });
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
                  }
                  return <div class={this.className('Spacer')}></div>;
                })()}
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols={6}>
                        <div class="text-h5">
                          {(() => {
                            if (this.loading) {
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
                            if (this.loading) {
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
                      {(() => {
                        // TODO: limit the number of posts loaded at once & load more
                        // when the user scrolls
                        if (this.loading) {
                          return <v-progress-linear indeterminate />;
                        }
                        return this.feed.posts.map((post) => (
                          <v-col cols={6} sm={4} class={this.className('GalleryImage')}>
                            {/* TODO: add lazy-src to all images */}
                            <v-img aspectRatio={1} src={this.media[post.media as string]} />
                          </v-col>
                        ));
                      })()}
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <ErrorDialog header={t.headers.USER_ERROR} message={this.error} />
        </v-container>
      </v-parallax>
    );
  }
}
