import Vue from 'vue';
import { ComponentOptions } from 'vue/types/umd';
import ProfileTSX, { Props } from '../../src/frontend/views/Profile';
import { Users } from '../../tests/sample-data';
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
  template: '<v-app><Profile v-bind="$props" v-on="$props" /></v-app>',
});

// Default view
export const Primary = bind<Props>(Template);
Primary.args = {
  tParams: {
    username: Users[0].username,
  },
};

// Loading
export const Loading = bind<Props>(Template);
Loading.args = {
  tParams: {},
};

// Viewing your own profile
export const Self = bind<Props>(Template);
Self.args = {
  tParams: {},
};

// Viewing a profile you're already following
export const Following = bind<Props>(Template);
Self.args = {
  tParams: {},
};
