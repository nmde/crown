/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { default: keysTransformer } = require('ts-transformer-keys/transformer');

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '..', 'dist'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              getCustomTransformers: (program) => ({
                before: [keysTransformer(program)],
              }),
            },
          },
        ],
      },
    ],
  },
};
