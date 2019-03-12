/* eslint-disable */

const path = require('path');

const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const rootDir = path.resolve(__dirname);
const staticDir = path.resolve(rootDir, '../src/static');

module.exports = {
  mode: 'production',
  entry: {
    vendor: [
      'antd',
      'antd/dist/antd.min.css',
      'echarts',
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
    path: path.resolve(staticDir, 'dll'),
    filename: 'dll.[name].[chunkhash].js',
    library: 'dll_[name]_[chunkhash]',
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' },
        ],
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
      path: path.resolve(staticDir, 'dll', 'manifest.dll.json'),
      name: 'dll_[name]_[chunkhash]',
      context: rootDir,
    }),
    new MiniCssExtractPlugin({
      filename: 'dll.[name].[chunkhash].css',
      allChunks: true,
    }),
  ],
};
