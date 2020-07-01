const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const common = require('./common');

module.exports = {
  ...common,
  entry: {
    frontend: path.resolve(__dirname, '..', 'src', 'frontend', 'index.ts'),
  },
  plugins: [new HtmlWebpackPlugin()],
};
