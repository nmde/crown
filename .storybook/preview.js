const { VApp } = require('vuetify/lib');
const vuetify = require('../src/frontend/vuetify');

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

export const decorators = [
  (story) => ({
    vuetify,
    components: { VApp, story },
    template: '<v-app><v-main><story /></v-main></v-app>',
  }),
];
