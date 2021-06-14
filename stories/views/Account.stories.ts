import Vue from 'vue';
import { ComponentOptions } from 'vue/types/umd';
import AccountTSX, { Props } from '../../src/frontend/views/Account';
import bind from '../bind';

// Convert TSX to actual Vue component
const Account = Vue.component('Account', AccountTSX);

export default {
  component: Account,
  title: 'Views/Account',
};

/**
 * Default story template
 *
 * @param {Props} _args component props
 * @param {any} param1 arg types
 * @returns {ComponentOptions} the bound template
 */
const Template = (_args: Props, { argTypes }: { argTypes: string }) => ({
  components: { Account },
  props: Object.keys(argTypes),
  template: '<v-app><Account v-bind="$props" v-on="$props" /></v-app>',
});

// Default view
export const Primary = bind<Props>(Template);
Primary.args = {};
