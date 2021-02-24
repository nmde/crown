const Vuetify = require('vuetify');
const { VApp } = require('vuetify/lib');

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

export const decorators = [
  (story) => ({
    vuetify: new Vuetify({
      theme: {
        themes: {
          light: {
            primary: '#ff9800',
          },
        },
      },
    }),
    components: { VApp, story },
    template: '<v-app><story /></v-app>',
  }),
];
