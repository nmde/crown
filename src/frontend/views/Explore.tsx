/* eslint-disable class-methods-use-this */
import { VNode } from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import Styled from 'vue-styled-component';
import { GetPostResponse } from '../../types/schemas/getPost/Response';
import Feed from '../classes/Feed';
import ViewComponent from '../classes/ViewComponent';
import FeedComponent from '../components/Feed';
import store from '../store';

const styles = Styled.makeStyles({});

@Component
/**
 * Explore page
 */
export default class Explore extends ViewComponent<typeof styles> {
  private data: {
    feed: Feed;
  } = {
    feed: new Feed(),
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
        this.data.feed.addPosts(feed);
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
    return <FeedComponent feed={this.data.feed} />;
  }
}
