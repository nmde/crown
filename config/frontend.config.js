/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const frontend = require('nmde-common/config/frontend');
const path = require('path');

module.exports = frontend(
  path.resolve(__dirname, '..', 'src', 'frontend', 'index.ts'),
  path.resolve(__dirname, '..', 'dist'),
);
