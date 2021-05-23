/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Vuetify plugin confirguation, used in both the frontend and in Storybook preview.js
 * Ensures consistency between the frontend and stories
 */
const Vuetify = require('vuetify/dist/vuetify');
const { default: colors } = require('vuetify/es5/util/colors');

module.exports = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.orange.base,
        secondary: colors.lightBlue.base,
      },
    },
  },
});
