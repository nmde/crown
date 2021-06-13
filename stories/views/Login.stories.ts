import Vue from 'vue';
import { ComponentOptions } from 'vue/types/umd';
import LoginTSX, { Props } from '../../src/frontend/views/Login';
import bind from '../bind';

// Convert TSX to actual Vue component
const Login = Vue.component('Login', LoginTSX);

export default {
  component: Login,
  title: 'Views/Login',
};

/**
 * Default story template
 *
 * @param {Props} _args component props
 * @param {any} param1 arg types
 * @returns {ComponentOptions} the bound template
 */
const Template = (_args: Props, { argTypes }: { argTypes: string }) => ({
  components: { Login },
  props: Object.keys(argTypes),
  template: '<v-app><Login v-bind="$props" v-on="$props" /></v-app>',
});

// Default view
export const Primary = bind<Props>(Template);
Primary.args = {};
