import { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import { IPost } from '../../types';
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

  private data: {
    posts: IPost[];
  } = { posts: [] };

  public _tsx!: tsx.DeclareProps<Props>;

  /**
   * @constructs
   */
  public constructor() {
    super(styles);
  }

  /**
   * Created lifecycle hook
   */
  public created(): void {
    this.feed.on('change', () => {
      this.$set(this.data, 'posts', this.feed.getFeed());
    });
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
          {(() => this.data.posts.map((post) => (
              <v-col sm={4} cols={12}>
                <router-link to={`/post/${post.id}`}>
                  <Post
                    post={post}
                    onDelete={(id) => {
                      this.feed.delete(id);
                    }}
                  />
                </router-link>
              </v-col>
          )))()}
        </v-row>
      </v-container>
    );
  }
}
