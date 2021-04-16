const preview = require('nmde-common/config/storybook-preview');
const vuetify = require('../src/frontend/vuetify');

const config = preview(vuetify);

export const parameters = config.parameters;
export const decorators = config.decorators;
