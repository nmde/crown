import Vue, { VNode } from 'vue';
import { Component, Watch } from 'vue-property-decorator';
// import { Response } from '../../types/Endpoints';
import Post from '../components/Post';
import store from '../store';
import t from '../translations/en-US.json';

@Component
/**
 * Displays a single post
 */
export default class SinglePost extends Vue {
  /**
   * Contains the error message, if any
   */
  private error = '';

  private data = {
    post: {},
  };

  /**
   * The post data from the backend
   */
  // private post!: Response<'getPost'>;

  /**
   * Reads the URL, then retrieves the appropriate post from the backend
   */
  @Watch('$route')
  private async getPost(): Promise<void> {
    try {
      this.$set(
        this.data,
        'post',
        await store.getPost({
          id: this.$route.params.id,
        }),
      );
    } catch (err) {
      switch (err.response.status) {
        case 400:
          this.error = t.errors.POST_NOT_FOUND;
          break;
        default:
          this.error = t.errors.GENERIC;
      }
    }
  }

  /**
   * Vue lifecycle hook
   * Ensures that the post is loaded when the page is loaded
   */
  public created(): void {
    this.getPost();
  }

  /**
   * Renders the component
   *
   * @returns {VNode} the component
   */
  public render(): VNode {
    return (
      <div>
        <Post post={this.data.post} />
      </div>
    );
  }
}
