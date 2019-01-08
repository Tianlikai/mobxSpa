/* eslint-disable */

const path = require('path');

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const rootDir = path.resolve(__dirname);
const staticDir = path.resolve(rootDir, 'src', 'static');

module.exports = {
  mode: 'production',
  entry: {
    vendor: [
      'antd',
      'antd/dist/antd.min.css',
      'react',
      'react-dom',
      'react-helmet',
      'react-router-dom',
      'react-loadable',
      'babel-polyfill',
      'prop-types',
      'mobx',
      'mobx-react',
    ],
  },
  output: {
    path: staticDir,
    filename: 'dll.[name].[chunkhash].js',
    library: 'dll_[name]_[chunkhash]',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        enforce: 'pre',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: false,
        },
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },
      {
        test: /\.s(a|c)ss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: false,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: false,
              },
            },
          ],
        }),
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(staticDir, 'manifest.dll.json'),
      name: 'dll_[name]_[chunkhash]',
      context: rootDir,
    }),
    new ExtractTextPlugin({
      filename: 'dll.[name].[chunkhash].css',
      allChunks: true,
    }),
  ],
};
