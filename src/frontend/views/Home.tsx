import { VNode } from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { CreateEdgeResponse } from '../../types/schemas/createEdge/Response';
import { GetPostResponse } from '../../types/schemas/getPost/Response';
import Feed from '../classes/Feed';
import ViewComponent from '../classes/ViewComponent';
import CreatePostDialog from '../components/CreatePostDialog';
import FeedComponent from '../components/Feed';
import store from '../store';
import fab from '../styles/fab';
import makeStyles from '../styles/makeStyles';

const styles = makeStyles({
  ...fab,
});

@Component
/**
 * The user's home feed
 */
export default class Home extends ViewComponent<typeof styles> {
  private data: {
    feed: Feed;
  } = {
    feed: new Feed(),
  };

  private uploadDialog = false;

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
    if (await this.getCurrentUser()) {
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
                author: following.map((user) => user.target),
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
    } else {
      // TODO: public feed
      console.log('public feed');
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
        {(() => {
          if (this.loading) {
            return <div />;
          }
          // TODO: fix this showing briefly even when the feed is loaded
          if (this.data.feed.length === 0) {
            return (
              <div>
                <h2 class="text--h2">{this.messages.msg.EMPTY_FEED}</h2>
                <div class="text--h3">
                  {`${this.messages.msg.EMPTY_FEED_DETAIL[0]} `}
                  <router-link to="/explore">{this.messages.headers.EXPLORE}</router-link>
                  {` ${this.messages.msg.EMPTY_FEED_DETAIL[1]} `}
                  <router-link to="/categories">{this.messages.headers.CATEGORIES}</router-link>
                  {` ${this.messages.msg.EMPTY_FEED_DETAIL[2]}`}
                </div>
              </div>
            );
          }
          return <FeedComponent feed={this.data.feed} />;
        })()}
        {(() => {
          if (store.token !== undefined) {
            return (
              <v-btn
                fab
                class={this.className('fab')}
                color="primary"
                onClick={() => {
                  this.uploadDialog = true;
                }}
              >
                <v-icon>add</v-icon>
              </v-btn>
            );
          }
          return <div />;
        })()}
        <v-dialog vModel={this.uploadDialog}>
          <CreatePostDialog />
        </v-dialog>
      </div>
    );
  }
}
