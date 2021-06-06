/* eslint-disable class-methods-use-this */
import Vue, { VNode } from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import Feed from '../classes/Feed';
import ErrorDialog from '../components/ErrorDialog';
import Post from '../components/Post';
import store from '../store';
import t from '../translations/en-US.json';

@Component
/**
 * The home page
 */
export default class Home extends Vue {
  /**
   * The error message, if any
   */
  private error = '';

  /**
   * Data retrieved from the backend
   */
  private data: {
    feed: Feed;
    foo: string;
  } = {
    feed: new Feed(),
    foo: '',
  };

  /**
   * Fetches the user data from the backend
   */
  @Watch('$route', {
    deep: true,
    immediate: true,
  })
  private async fetchFeed() {
    try {
      const { token } = store;
      if (token === undefined) {
        // TODO: public feed
        console.log('public feed');
      } else {
        // Get the accounts the current user is following
        const following = await store.getEdges({
          token,
          type: 'follow',
        });
        if (following.length > 0) {
          // Generate a feed from followed accounts
          const feed = await store.getFeed({
            author: following.map((edge) => edge.target as string),
          });
          this.data.feed = new Feed(feed);
          // Trick to get the UI to update (ugh)
          this.$set(this.data, 'foo', 'bar');
        } else {
          console.log('0 following');
        }
      }
    } catch (err) {
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

  /**
   * Created lifecycle hook - ensures data is fetched when the component is rendered
   */
  public async created(): Promise<void> {
    await this.fetchFeed();
  }

  /**
   * Renders the component
   *
   * @returns {VNode} the component
   */
  public render(): VNode {
    return (
      <div>
        {(() => this.data.feed.posts.map((post) => <Post post={post} />))()}
        <ErrorDialog header={t.errors.HOME} message={this.error} />
      </div>
    );
  }
}
