import PostData from '../../types/PostData';
import StoryComponent from '../../types/StoryComponent';
import Post from './Post';

export default {
  title: 'Post',
};

const emptyPost: PostData = {
  author: 0,
  media: '',
  text: 'Post contents',
  expires: new Date().toISOString(),
};

export const normal = (): StoryComponent => ({
  render() {
    return <Post post={emptyPost} />;
  },
});
