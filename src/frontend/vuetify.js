/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Vuetify plugin confirguation, used in both the frontend and in Storybook preview.js
 * Ensures consistency between the frontend and stories
 */
const Vuetify = require('vuetify/dist/vuetify');

module.exports = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#ff9800',
      },
    },
  },
});
