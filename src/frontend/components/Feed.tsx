import { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import IPost from '../../types/Post';
import Feed from '../classes/Feed';
import Styled from '../classes/Styled';
import makeStyles from '../styles/makeStyles';
import Post from './Post';

const styles = makeStyles({});

export type Props = {
  feed: Feed;
};

@Component
/**
 * Displays a feed of posts
 */
export default class FeedComponent extends Styled<typeof styles> implements Props {
  @Prop()
  public feed!: Feed;

  public _tsx!: tsx.DeclareProps<Props>;

  /**
   * @constructs
   */
  public constructor() {
    super(styles);
  }

  /**
   * The posts to display
   *
   * @returns {IPost[]} the posts in the feed
   */
  private get posts(): IPost[] {
    return this.feed.getFeed();
  }

  /**
   * Renders the component
   *
   * @returns {VNode} the component
   */
  public render(): VNode {
    // TODO: sorting
    return (
      <v-container>
        <v-row justify="center">
          {(() => this.posts.map((post) => (
              <v-col sm={4} cols={12}>
                <Post post={post} />
              </v-col>
          )))()}
        </v-row>
      </v-container>
    );
  }
}
