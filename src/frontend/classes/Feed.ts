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
     * @constructs
     * @param initialPosts Initial posts, if any
     */
    constructor(initialPosts: IPost[] = []) {
        this.posts = initialPosts;
    }
}
