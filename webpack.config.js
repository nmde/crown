const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpackNodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development',
  entry: {
    backend: path.join(__dirname, 'src', 'backend', 'index.ts'),
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
    ],
  },
  externals: [webpackNodeExternals()],
  plugins: [new HtmlWebpackPlugin()],
};
