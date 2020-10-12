const { merge } = require('webpack-merge');
const common = require('../build/common');

module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-viewport',
    '@storybook/addon-a11y',
    '@storybook/addon-knobs',
  ],
  webpackFinal: async config => merge(config, common),
};
