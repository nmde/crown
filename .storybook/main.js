const { mergeWithCustomize } = require('webpack-merge');
const frontend = require('../config/frontend.config');

module.exports = {
  stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: async (config) => {
    const newConfig = mergeWithCustomize({
      customizeArray(a, b, key) {
        if (key === 'plugins') {
          // Remove plugins that appear to break Storybook
          const newPlugins = [];
          [...a, ...b].forEach((plugin) => {
            if (['VueLoaderPlugin', 'HtmlWebpackPlugin'].indexOf(plugin.constructor.name) < 0) {
              newPlugins.push(plugin);
            }
          });
          return newPlugins;
        }
      },
      customizeObject(a, b, key) {
        if (key === 'module') {
          // Force Storybook to use our configuration for .tsx & .css files
          const newRules = [];
          [...a.rules, ...b.rules].forEach((rule) => {
            if (rule.test.source === '\\.tsx?$') {
              if (rule.use.length >= 2) {
                newRules.push(rule);
              }
            } else if (rule.test.source === '\\.css$') {
              if (rule.sideEffects !== true) {
                newRules.push(rule);
              }
            } else {
              newRules.push(rule);
            }
          });
          return {
            rules: newRules,
          };
        }
      },
    })(config, frontend);
    console.log(newConfig.module.rules);
    return newConfig;
  },
};
