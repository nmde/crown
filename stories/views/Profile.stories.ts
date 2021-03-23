import Vue from 'vue';
import bind from '../bind';
import Feed from '../../src/frontend/classes/Feed';
import ProfileTSX, { Props } from '../../src/frontend/views/Profile';

// Convert TSX to actual Vue component
const Profile = Vue.component('Profile', ProfileTSX);

export default {
  title: 'Views/Profile',
  component: Profile,
};

const Template = (args, { argTypes }) => ({
  components: { Profile },
  props: Object.keys(argTypes),
  template: '<Profile v-bind="$props" v-on="$props" />',
});

// Primary story - No data is loaded
/*
export const Primary = bind<Props>(Template);
Primary.args = {};

// Loading
export const Loading = bind<Props>(Template);
Loading.args = {};
*/

// Displaying a fake user
export const WithUser = bind<Props>(Template);
WithUser.args = {
  user: {
    id: '1',
    displayName: 'Freddie Benson',
    email: 'me@example.com',
    username: 'epicgamer123',
    profileBackground: 'background',
    profilePicture: 'avatar',
    followerCount: 100,
    followingCount: 1500,
  },
  media: {
    background: 'http://via.placeholder.com/900x400/555555',
    avatar: 'http://via.placeholder.com/100',
    post1: 'http://via.placeholder.com/500',
    post2: 'http://via.placeholder.com/500x350',
    post3: 'http://via.placeholder.com/1000',
    post4: 'http://via.placeholder.com/12x140',
  },
  feed: new Feed([
    {
      id: '1',
      media: 'post1',
      author: '1',
      created: new Date(2021, 1, 15, 13, 35).toISOString(),
      expires: '',
      description: 'Sample Post 1',
    },
    {
      id: '2',
      media: 'post2',
      author: '1',
      created: new Date(2021, 1, 15, 14, 0).toISOString(),
      expires: '',
      description: 'Sample Post 2',
    },
    {
      id: '3',
      media: 'post3',
      author: '1',
      created: new Date(2021, 2, 1, 2, 11).toISOString(),
      expires: '',
      description: 'Sample Post 3',
    },
    {
      id: '4',
      media: 'post4',
      author: '1',
      created: new Date().toISOString(),
      expires: '',
      description: 'Sample Post 4',
    },
  ]),
};

// Trying to get a user that doesn't exist
/*
export const MissingUser = bind<Props>(Template);
MissingUser.args = {};
*/
