import Vue from 'vue';
import { ComponentOptions } from 'vue/types/umd';
import ProfileTSX, { Props } from '../../src/frontend/views/Profile';
import { Feeds, Users, Media } from '../../tests/sample-data';
import bind from '../bind';

// Convert TSX to actual Vue component
const Profile = Vue.component('Profile', ProfileTSX);

export default {
  component: Profile,
  title: 'Views/Profile',
};

/**
 * Default story template
 *
 * @param {Props} _args component props
 * @param {any} param1 arg types
 * @returns {ComponentOptions} the bound template
 */
const Template = (_args: Props, { argTypes }: { argTypes: string }) => ({
  components: { Profile },
  props: Object.keys(argTypes),
  template: '<Profile v-bind="$props" v-on="$props" />',
});

// Displaying a fake user
export const WithUser = bind<Props>(Template);
WithUser.args = {
  feed: Feeds[0],
  media: Media[0],
  tDisableBackend: true,
  user: Users[0],
};

// Loading
export const Loading = bind<Props>(Template);
Loading.args = {
  feed: {
    posts: [],
  },
  media: {},
  tDisableBackend: true,
  tForceLoading: true,
  user: Users[0],
};
