import { VNode } from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import IPost from '../../types/Post';
import { CreateEdgeResponse } from '../../types/schemas/createEdge/Response';
import { GetPostResponse } from '../../types/schemas/getPost/Response';
import Feed from '../classes/Feed';
import ViewComponent from '../classes/ViewComponent';
import CreatePostDialog from '../components/CreatePostDialog';
import Post from '../components/Post';
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
    posts: IPost[];
  } = {
    feed: new Feed(),
    posts: [],
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
              const posts = new Feed(feed);
              this.data.posts = posts.getFeed();
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
        {(() => this.data.posts.map((post) => <Post post={post} />))()}
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
