import IPost from '../../types/Post';

/**
 * Represents a stream of posts
 */
export default class Feed {
  /**
   * The posts in the feed
   */
  public posts: IPost[];

  /**
   * Creates the feed, with optional initial postss
   *
   * @constructs
   * @param {IPost[]} initialPosts Initial posts, if any
   */
  public constructor(initialPosts: IPost[] = []) {
    this.posts = initialPosts;
  }
}
