/* eslint-disable import/no-extraneous-dependencies */
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import moment from 'moment';
import PostData from '../../types/PostData';
import Post from './Post';
import '../boostrap';

export default {
  title: 'Post',
  decorators: [withA11y, withKnobs],
};

const emptyPost: PostData = {
  author: 0,
  media: 'https://cdn.vuetifyjs.com/images/cards/mountain.jpg',
  text: 'Post contents',
  expires: moment()
    .add(1, 'week')
    .toISOString(),
  date: new Date().toISOString(),
  id: '1234',
};

export const withText = () => ({
  render() {
    return <Post post={emptyPost} />;
  },
});
