import { VNode } from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import categoryKey from '../../util/categoryKey';
import Feed from '../classes/Feed';
import ViewComponent from '../classes/ViewComponent';
import FeedComponent from '../components/Feed';
import store from '../store';
import makeStyles from '../styles/makeStyles';

const styles = makeStyles({
  jumbotron: {
    textAlign: 'center',
  },
});

@Component
/**
 * Individual category view
 */
export default class Category extends ViewComponent<typeof styles> {
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
   * Collects data necessary for displaying the page
   */
  @Watch('$route', {
    deep: true,
    immediate: true,
  })
  public async setup(): Promise<void> {
    await this.apiCall(
      async () => {
        const feed = await store.getFeed({
          category: this.$route.params.category,
        });
        this.data.feed.addPosts(feed);
      },
      () => {},
      {},
    );
  }

  /**
   * Renders the component
   *
   * @returns {VNode} the component
   */
  public render(): VNode {
    return (
      <div>
        <div class={this.className('jumbotron')}>
          <h1 class="text--h1">
            {this.messages.categories[categoryKey(this.$route.params.category)]}
          </h1>
        </div>
        <FeedComponent feed={this.data.feed} />
      </div>
    );
  }
}
