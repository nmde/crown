/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./common');

module.exports = merge(common, {
  entry: {
    frontend: path.resolve(__dirname, '..', 'src', 'frontend', 'index.ts'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', 'src', 'frontend', 'index.html'),
    }),
  ],
});
