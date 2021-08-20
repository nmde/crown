import { VNode } from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import IComment from '../../types/Comment';
import IPost from '../../types/Post';
import IUser from '../../types/User';
import ViewComponent from '../classes/ViewComponent';
import Post from '../components/Post';
import store from '../store';
import makeStyles from '../styles/makeStyles';

const styles = makeStyles({});

@Component
/**
 * Displays a single post
 */
export default class SinglePost extends ViewComponent<typeof styles> {
  private data: {
    comments: IComment[];
    post: IPost;
    users: Record<string, IUser>;
  } = {
    comments: [],
    post: {},
    users: {},
  };

  private commentText = '';

  /**
   * @constructs
   */
  public constructor() {
    super(styles);
  }

  /**
   * Reads the URL, then retrieves the appropriate post from the backend
   */
  @Watch('$route')
  private async setup(): Promise<void> {
    let post: IPost;
    await this.apiCall(
      async () => {
        post = await store.getPost({
          id: this.$route.params.id,
        });
      },
      async () => {
        this.$set(this.data, 'post', post);
        let comments: IComment[];
        await this.apiCall(
          async () => {
            comments = (
              await store.getComments({
                parent: post.id as string,
              })
            ).comments as IComment[];
          },
          async () => {
            this.$set(this.data, 'comments', comments);
            comments.forEach(async (comment) => {
              let author: IUser;
              await this.apiCall(
                async () => {
                  author = (await store.getUserById({
                    id: comment.author,
                  })) as IUser;
                },
                () => {
                  this.$set(this.data.users, comment.author, author);
                },
              );
            });
          },
        );
      },
      {
        400: this.messages.errors.POST_NOT_FOUND,
      },
    );
  }

  /**
   * Vue lifecycle hook
   * Ensures that the post is loaded when the page is loaded
   */
  public created(): void {
    this.setup();
  }

  /**
   * Renders the component
   *
   * @returns {VNode} the component
   */
  public render(): VNode {
    return (
      <v-container>
        <v-row justify="center">
          <v-col sm={4} cols={12}>
            <Post post={this.data.post} />
          </v-col>
        </v-row>
        <v-row>
          <h2 class="text--h2">{this.messages.headers.COMMENT}</h2>
        </v-row>
        <v-row>
          <v-text-field vModel={this.commentText} />
          <v-btn
            block
            color="primary"
            onClick={async () => {
              await this.apiCall(
                async () => {
                  await store.createComment({
                    parent: this.data.post.id as string,
                    text: this.commentText,
                  });
                },
                () => {
                  this.data.comments.push({
                    author: store.currentUser?.id as string,
                    parent: this.$route.params.id,
                    text: this.commentText,
                  });
                  this.commentText = '';
                },
              );
            }}
          >
            {this.messages.btn.COMMENT}
          </v-btn>
        </v-row>
        {(() => this.data.comments.map((comment) => (
            <v-row>
              <v-col>
                <v-card>
                  <v-card-title>{comment.text}</v-card-title>
                  <v-card-text>
                    <router-link to={`/@${this.data.users[comment.author].username}`}>
                      <a>@{this.data.users[comment.author].username}</a>
                    </router-link>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
        )))()}
      </v-container>
    );
  }
}
