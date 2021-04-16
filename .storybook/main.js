const main = require('nmde-common/config/storybook-main');
const path = require('path');

module.exports = main(path.resolve(__dirname, '..', 'src', 'frontend', 'bootstrap.ts'));
