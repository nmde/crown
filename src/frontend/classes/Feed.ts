import { EventEmitter } from 'ee-ts';
import IPost from '../../types/Post';

/**
 * Represents a stream of posts
 */
export default class Feed extends EventEmitter<{
  change(posts: IPost[]): void;
}> {
  /**
   * The posts in the feed
   */
  private posts: Required<IPost>[] = [];

  /**
   * Creates the feed, with optional initial postss
   *
   * @constructs
   */
  public constructor() {
    super();
  }

  /**
   * Adds posts to the feed.
   *
   * @param {Required<IPost>[]} posts The posts to add.
   * @returns {Feed} This.
   */
  public addPosts(posts: IPost[]): Feed {
    this.posts = posts as Required<IPost>[];
    this.emit('change', this.posts);
    return this;
  }

  /**
   * Deletes a post from the feed.
   *
   * @param {string} id The post to delete.
   */
  public delete(id: string): void {
    for (let i = 0; i < this.posts.length; i += 1) {
      if (this.posts[i].id === id) {
        this.posts.splice(i, 1);
        break;
      }
    }
    this.emit('change', this.posts);
  }

  /**
   * Gets a post from the feed
   *
   * @param {number} index the index of the post to get
   * @returns {IPost} the post
   */
  public getPost(index: number): Required<IPost> {
    return this.posts[index] as Required<IPost>;
  }

  /**
   * Gets the feed of posts, sorted by date
   *
   * @returns {IPost[]} the feed
   */
  public getFeed(): IPost[] {
    return this.posts.sort((a, b) => {
      if (new Date(a.created) < new Date(b.created)) {
        return 1;
      }
      if (new Date(a.created) > new Date(b.created)) {
        return -1;
      }
      return 0;
    });
  }

  /**
   * Gets the length of the feed
   *
   * @returns {number} the length of the feed
   */
  public get length(): number {
    return this.posts.length;
  }
}
