import { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import profileBackground from '../assets/profile-background.jpg';
import samplePost1 from '../assets/sample-post-1.jpg';
import samplePost2 from '../assets/sample-post-2.jpg';
import samplePost3 from '../assets/sample-post-3.jpg';
import samplePost4 from '../assets/sample-post-4.jpg';
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
import Styled from '../Styled';

// CSS classes
type Classes = 'Fill' | 'AvatarContainer' | 'Icon' | 'Main' | 'DisplayName' | 'Center' | 'GalleryImage';

const avatarSize = 100;

/**
 * User profile page view
 */
@Component
export default class Profile extends Styled<Classes> {
  /**
   * Explicitly defines TSX prop types
   */
  _tsx!: tsx.DeclareProps<tsx.AutoProps<Profile>>;

  public foo!: string;

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
      <VParallax class={this.className('Fill')} src={profileBackground}>
        <VContainer class={this.className('Fill')} fluid>
          <VRow noGutters>
            <VCol class={this.className('AvatarContainer')}>
              <VAvatar color="primary" rounded size={avatarSize}>
                <VIcon class={this.className('Icon')}>account_circle</VIcon>
              </VAvatar>
            </VCol>
          </VRow>
          <VRow class={this.className('Main')} noGutters>
            <VCol>
              <VCard class={this.className('Center')}>
                <VCardTitle class={this.className('DisplayName')}>Display Name</VCardTitle>
                <VCardSubtitle>username</VCardSubtitle>
                <VCardText>
                  <VContainer>
                    <VRow>
                      <VCol cols={6}>
                        <div class="text-h5">100</div>
                        followers
                      </VCol>
                      <VCol cols={6}>
                        <div class="text-h5">1500</div>
                        following
                      </VCol>
                    </VRow>
                    <VRow>
                      <VCol cols={4} class={this.className('GalleryImage')}>
                        {/* TODO: add lazy-src to all images */}
                        <VImg aspectRatio={1} src={samplePost1} />
                      </VCol>
                      <VCol cols={4} class={this.className('GalleryImage')}>
                        <VImg aspectRatio={1} src={samplePost2} />
                      </VCol>
                      <VCol cols={4} class={this.className('GalleryImage')}>
                        <VImg aspectRatio={1} src={samplePost3} />
                      </VCol>
                      <VCol cols={4} class={this.className('GalleryImage')}>
                        <VImg aspectRatio={1} src={samplePost4} />
                      </VCol>
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
