/* eslint-disable class-methods-use-this */
import { VNode } from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import IPost from '../../types/Post';
import { GetPostResponse } from '../../types/schemas/getPost/Response';
import Feed from '../classes/Feed';
import ViewComponent from '../classes/ViewComponent';
import Post from '../components/Post';
import store from '../store';
import makeStyles from '../styles/makeStyles';

const styles = makeStyles({});

@Component
/**
 * Explore page
 */
export default class Explore extends ViewComponent<typeof styles> {
  private data: {
    feed: Feed;
    posts: IPost[];
  } = {
    feed: new Feed(),
    posts: [],
  };

  /**
   * @constructs
   */
  public constructor() {
    super(styles);
  }

  /**
   * Fetches data when the page is loaded
   */
  @Watch('$route', {
    deep: true,
    immediate: true,
  })
  private async setup() {
    let feed: GetPostResponse[] = [];
    await this.apiCall(
      async () => {
        feed = await store.getFeed({});
      },
      async () => {
        const f = new Feed(feed);
        this.data.posts = f.getFeed();
        this.$set(this.data, 'feed', f);
      },
      {},
    );
  }

  /**
   * Renders the component
   *
   * @returns {VNode} the component
   */
  public render(): VNode {
    return <div>
      {(() => this.data.posts.map((post) => <Post post={post} />))()}
    </div>;
  }
}
