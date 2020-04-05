const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const getDllPlugins = require('./getDllPlugins');
const env = require('./environment');

module.exports = {
  entry: {
    main: path.resolve(__dirname, '../src', 'index'),
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
  },
  performance: {
    hints: false,
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@/components': path.resolve(__dirname, '../src', 'components'),
      '@/layouts': path.resolve(__dirname, '../src', 'layouts'),
      '@/utils': path.resolve(__dirname, '../src', 'utils'),
      '@/settings': path.resolve(__dirname, '../src', 'settings'),
    },
  },
  externals: {
    React: 'react',
    ReactDOM: 'react-dom',
    PropTypes: 'prop-types',
    ReactRouterDOM: 'react-router-dom',
    MobxReact: 'mobx-react',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          { loader: 'thread-loader' },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name]_[hash].[ext]',
            outputPath: 'images',
            limit: '1024',
          },
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|mp4)$/,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src', 'index.html'),
      inject: true,
      favicon: path.resolve(__dirname, '../static', 'rl.ico'),
    }),
    new webpack.ProvidePlugin({
      React: 'react',
      ReactDOM: 'react-dom',
      MobxReact: 'mobx-react',
      ReactRouterDOM: 'react-router-dom',
    }),
    new webpack.DefinePlugin(
      Object.keys(env).reduce((result, key) => {
        result[`__${key}__`] = JSON.stringify(env[key]);
        return result;
      }, {}),
    ),
    ...getDllPlugins(),
  ],
};
