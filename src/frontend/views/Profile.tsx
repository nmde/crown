import MediaRecord from 'types/MediaRecord';
import { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import IUser from '../../types/User';
import Styled from '../Styled';
import background from '../assets/background.jpg';
import Feed from '../classes/Feed';
import ErrorDialog from '../components/ErrorDialog';
import VAvatar from '../components/vuetify-tsx/VAvatar';
import VCard from '../components/vuetify-tsx/VCard';
import VCardSubtitle from '../components/vuetify-tsx/VCardSubtitle';
import VCardText from '../components/vuetify-tsx/VCardText';
import VCardTitle from '../components/vuetify-tsx/VCardTitle';
import VCol from '../components/vuetify-tsx/VCol';
import VContainer from '../components/vuetify-tsx/VContainer';
import VImg from '../components/vuetify-tsx/VImg';
import VParallax from '../components/vuetify-tsx/VParallax';
import VProgressCircular from '../components/vuetify-tsx/VProgressCircular';
import VProgressLinear from '../components/vuetify-tsx/VProgressLinear';
import VRow from '../components/vuetify-tsx/VRow';
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
  user: IUser;
  media: MediaRecord;
  feed: Feed;
  tDisableBackend?: boolean;
  tForceLoading?: boolean;
};

@Component
/**
 * User profile page view
 */
export default class Profile extends Styled<Classes> implements Props {
  /**
   * The user data
   */
  @Prop()
  public user!: Required<IUser>;

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
   * Disabled loading data from the backend (for testing)
   */
  @Prop({
    default: false,
  })
  public tDisableBackend!: boolean;

  /**
   * Force the loading state to be a certain value (for testing)
   */
  @Prop({
    default: false,
  })
  public tForceLoading!: boolean;

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
    this.loading = this.tForceLoading;
    if (!this.tDisableBackend) {
      const { id } = this.$route.params;
      if (typeof id === 'string') {
        try {
          this.user = (await store.getUser({
            id,
          })) as IUser;

          // TODO
          this.background = this.media[this.user.profileBackground];

          // Get the user's posts
          try {
            this.feed = new Feed(
              await store.getFeed({
                author: this.user.id,
              }),
            );
          } catch (err) {
            this.loading = false;
          }
        } catch (err) {
          this.loading = false;
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
      } else {
        // Invalid ID was supplied, display an error message
        this.error = t.errors.USER_NOT_FOUND;
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
      <VParallax class={this.className('Fill')} src={this.background}>
        <VContainer class={this.className('Fill')} fluid>
          <VRow noGutters>
            <VCol class={this.className('AvatarContainer')}>
              <VAvatar color="primary" rounded size={avatarSize}>
                {(() => {
                  if (this.loading) {
                    return <VProgressCircular indeterminate />;
                  }
                  return <VImg src={this.media[this.user.profilePicture]} />;
                })()}
              </VAvatar>
            </VCol>
          </VRow>
          <VRow class={this.className('Main')} noGutters>
            <VCol>
              <VCard class={this.className('Center')}>
                {(() => {
                  if (!this.loading) {
                    return (
                      <div>
                        <VCardTitle class={this.className('DisplayName')}>
                          {this.user.displayName}
                        </VCardTitle>
                        <VCardSubtitle>{this.user.username}</VCardSubtitle>
                      </div>
                    );
                  }
                  return <div class={this.className('Spacer')}></div>;
                })()}
                <VCardText>
                  <VContainer>
                    <VRow>
                      <VCol cols={6}>
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
                      </VCol>
                      <VCol cols={6}>
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
                      </VCol>
                    </VRow>
                    <VRow>
                      {(() => {
                        // TODO: limit the number of posts loaded at once & load more when the user scrolls
                        if (this.loading) {
                          return <VProgressLinear indeterminate />;
                        }
                        return this.feed.posts.map((post) => (
                            <VCol cols={6} sm={4} class={this.className('GalleryImage')}>
                              {/* TODO: add lazy-src to all images */}
                              <VImg aspectRatio={1} src={this.media[post.media as string]} />
                            </VCol>
                        ));
                      })()}
                    </VRow>
                  </VContainer>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
          <ErrorDialog header={t.headers.USER_ERROR} message={this.error} />
        </VContainer>
      </VParallax>
    );
  }
}
