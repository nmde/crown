/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const sass = require('sass');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { merge } = require('webpack-merge');
const common = require('./common.config');

module.exports = merge(common, {
  entry: {
    frontend: path.resolve(__dirname, '..', 'src', 'frontend', 'index.ts'),
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './src/frontend/index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s(c|a)ss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: sass,
              sassOptions: {
                indentedSyntax: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'file-loader',
        options: {
          name: 'assets/[name].[ext]',
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
    ],
  },
});
