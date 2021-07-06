import { VNode } from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { CreateEdgeResponse } from '../../types/schemas/createEdge/Response';
import { GetPostResponse } from '../../types/schemas/getPost/Response';
import Feed from '../classes/Feed';
import ViewComponent from '../classes/ViewComponent';
import ErrorDialog from '../components/ErrorDialog';
import Post from '../components/Post';
import store from '../store';
import makeStyles from '../styles/makeStyles';

const styles = makeStyles({});

export type Props = {};

@Component
/**
 * The user's home feed
 */
export default class Home extends ViewComponent<typeof styles> implements Props {
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
   * Checks if the user is signed in when the page is loaded
   */
  @Watch('$route', {
    deep: true,
    immediate: true,
  })
  private async setup() {
    // TODO: public feed
    const { token } = store;
    if (token !== undefined) {
      // Generate the user's post feed
      let following: CreateEdgeResponse[];
      let feed: GetPostResponse[];
      await this.apiCall(
        async () => {
          following = await store.getEdges({
            type: 'follow',
          });
        },
        async () => {
          await this.apiCall(
            async () => {
              feed = await store.getFeed({
                author: following.map((user) => user.id),
              });
            },
            () => {
              this.$set(this.data, 'feed', new Feed(feed));
            },
            {},
          );
        },
        {},
      );
    }
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
        <ErrorDialog header={this.messages.errors.HOME} message={this.error} />
      </div>
    );
  }
}
