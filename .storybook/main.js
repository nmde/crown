const { mergeWithCustomize } = require('webpack-merge');
const frontend = require('../config/frontend.config');

module.exports = {
  stories: ['../stories/**/*.stories.ts'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: async (config) => {
    const frontendConfig = frontend;
    // Prevent the default frontend entry & output from being merged
    delete frontendConfig.entry;
    delete frontendConfig.output;
    const newConfig = mergeWithCustomize({
      customizeArray(a, b, key) {
        if (key === 'plugins') {
          // Remove plugins that appear to break Storybook
          const newPlugins = [];
          [...a, ...b].forEach((plugin) => {
            if (['VueLoaderPlugin'].indexOf(plugin.constructor.name) < 0) {
              newPlugins.push(plugin);
            }
          });
          return newPlugins;
        }
      },
      customizeObject(a, b, key) {
        if (key === 'module') {
          // Force Storybook to use our configuration for .tsx & .css files
          // And remove our rules for images & fonts so that Storybook places them in the correct location
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
            } else if (rule.loader !== 'file-loader') {
              newRules.push(rule);
            }
          });
          return {
            rules: newRules,
          };
        }
      },
    })(config, frontendConfig);
    return newConfig;
  },
};
