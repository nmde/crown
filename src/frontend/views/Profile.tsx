import { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import IUser from '../../types/User';
import VAvatar from '../components/vuetify-tsx/VAvatar';
import VCard from '../components/vuetify-tsx/VCard';
import VCardText from '../components/vuetify-tsx/VCardText';
import VCardTitle from '../components/vuetify-tsx/VCardTitle';
import VCardSubtitle from '../components/vuetify-tsx/VCardSubtitle';
import VCol from '../components/vuetify-tsx/VCol';
import VContainer from '../components/vuetify-tsx/VContainer';
import VIcon from '../components/vuetify-tsx/VIcon';
import VImg from '../components/vuetify-tsx/VImg';
import VParallax from '../components/vuetify-tsx/VParallax';
import VRow from '../components/vuetify-tsx/VRow';
import t from '../translations/en-US.json';
import Styled from '../Styled';
import MediaRecord from 'types/MediaRecord';
import Feed from '../classes/Feed';

// CSS classes
type Classes =
  | 'Fill'
  | 'AvatarContainer'
  | 'Icon'
  | 'Main'
  | 'DisplayName'
  | 'Center'
  | 'GalleryImage';

const avatarSize = 100;

// Prop types
export type Props = {
  user: Required<IUser>;
  media: MediaRecord;
  feed: Feed;
};

/**
 * User profile page view
 */
@Component
export default class Profile extends Styled<Classes> implements Props {
  /**
   * Pass prop type information to TSX
   */
  _tsx!: tsx.DeclareProps<Props>;

  /**
   * The user data, if supplied via props
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
   * Defines custom styles for the Profile view
   * @constructs
   */
  public constructor() {
    super({
      Fill: {
        height: '100%',
        width: '100%',
      },
      AvatarContainer: {
        textAlign: 'center',
        zIndex: 100,
      },
      Icon: {
        color: 'white',
        fontSize: `${avatarSize}px`,
      },
      Main: {
        marginTop: '-15px',
      },
      DisplayName: {
        justifyContent: 'center',
      },
      Center: {
        textAlign: 'center',
      },
      GalleryImage: {
        padding: 0,
      },
    });
  }

  /**
   * Renders the component
   * @returns the component
   */
  public render(): VNode {
    // TODO: allow users to customize their background
    return (
      <VParallax class={this.className('Fill')} src={this.media[this.user.profileBackground]}>
        <VContainer class={this.className('Fill')} fluid>
          <VRow noGutters>
            <VCol class={this.className('AvatarContainer')}>
              <VAvatar color="primary" rounded size={avatarSize}>
                <VImg src={this.media[this.user.profilePicture]} />
                {/* TODO: display icon as a placeholder, then load user's profile picture */}
                {/* <VIcon class={this.className('Icon')}>account_circle</VIcon> */}
              </VAvatar>
            </VCol>
          </VRow>
          <VRow class={this.className('Main')} noGutters>
            <VCol>
              <VCard class={this.className('Center')}>
                <VCardTitle class={this.className('DisplayName')}>
                  {this.user.displayName}
                </VCardTitle>
                <VCardSubtitle>{this.user.username}</VCardSubtitle>
                <VCardText>
                  <VContainer>
                    <VRow>
                      <VCol cols={6}>
                        <div class="text-h5">{this.user.followerCount}</div>
                        {t.labels.FOLLOWERS}
                      </VCol>
                      <VCol cols={6}>
                        <div class="text-h5">{this.user.followingCount}</div>
                        {t.labels.FOLLOWING}
                      </VCol>
                    </VRow>
                    <VRow>
                      {
                        (() => {
                          return this.feed.posts.map((post) => {
                            return <VCol cols={6} sm={4} class={this.className('GalleryImage')}>
                              {/* TODO: add lazy-src to all images */}
                              <VImg aspectRatio={1} src={this.media[post.media]} />
                            </VCol>
                          });
                        })()
                      }
                    </VRow>
                  </VContainer>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VContainer>
      </VParallax>
    );
  }
}
