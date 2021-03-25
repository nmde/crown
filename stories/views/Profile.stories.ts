import Vue from 'vue';
import bind from '../bind';
import ProfileTSX, { Props } from '../../src/frontend/views/Profile';
import { Feeds, Users, Media } from '../../tests/sample-data';

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

// Displaying a fake user
export const WithUser = bind<Props>(Template);
WithUser.args = {
  tDisableBackend: true,
  user: Users[0],
  media: Media[0],
  feed: Feeds[0],
};


// Loading
export const Loading = bind<Props>(Template);
Loading.args = {
  tDisableBackend: true,
  tForceLoading: true,
  user: Users[0],
  media: {},
  feed: {
    posts: [],
  },
};
