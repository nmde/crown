/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const backend = require('nmde-common/config/backend');
const path = require('path');

module.exports = backend(
  path.resolve(__dirname, '..', 'src', 'backend', 'index.ts'),
  path.resolve(__dirname, '..', 'dist'),
);
