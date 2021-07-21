import IPost from '../../types/Post';

/**
 * Represents a stream of posts
 */
export default class Feed {
  /**
   * The posts in the feed
   */
  private posts: Required<IPost>[];

  /**
   * Creates the feed, with optional initial postss
   *
   * @constructs
   * @param {IPost[]} initialPosts Initial posts, if any
   */
  public constructor(initialPosts: IPost[] = []) {
    this.posts = initialPosts as Required<IPost>[];
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
