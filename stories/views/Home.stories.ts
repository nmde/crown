import Vue from 'vue';
import { ComponentOptions } from 'vue/types/umd';
import HomeTSX from '../../src/frontend/views/Home';
import bind from '../bind';

// Convert TSX to actual Vue component
const Home = Vue.component('Home', HomeTSX);

export default {
  component: Home,
  title: 'Views/Home',
};

/**
 * Default story template
 *
 * @param {Props} _args component props
 * @param {any} param1 arg types
 * @returns {ComponentOptions} the bound template
 */
const Template = (_args: any, { argTypes }: { argTypes: string }) => ({
  components: { Home },
  props: Object.keys(argTypes),
  template: '<v-app><Home v-bind="$props" v-on="$props" /></v-app>',
});

// Default view
export const Primary = bind(Template);
Primary.args = {};
