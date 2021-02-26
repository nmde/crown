import IPost from '../../types/Post';

/**
 * Represents a stream of posts
 */
export default class Feed {
    /**
     * The posts in the feed
     */
    public posts: Required<IPost>[];

    /**
     * Creates the feed, with optional initial postss
     * @constructs
     * @param initialPosts Initial posts, if any
     */
    constructor(initialPosts: Required<IPost>[] = []) {
        this.posts = initialPosts;
    }
}
