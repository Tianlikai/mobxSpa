const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

const env = require('./env.js');

const getCommonPlugins = () => {
  const plugins = [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src', 'index.html'),
    }),
    new webpack.ProvidePlugin({
      React: 'react',
      ReactDOM: 'react-dom',
      PropTypes: 'prop-types',
      MobxReact: 'mobx-react',
      ReactRouterDOM: 'react-router-dom',
    }),
    new webpack.DefinePlugin(
      Object.keys(env).reduce((res, k) => {
        res[`__${k}__`] = JSON.stringify(env[k]);
        return res;
      }, {}),
    ),
  ];

  const files = fs.readdirSync(path.resolve(__dirname, '../dll'));

  files.forEach((filename) => {
    if (/.*\.dll.js/.test(filename)) {
      plugins.push(
        new AddAssetHtmlPlugin({
          filepath: path.resolve(__dirname, '../dll', filename),
        }),
      );
    } else if (/.*\.manifest.json/.test(filename)) {
      plugins.push(
        new webpack.DllReferencePlugin({
          manifest: path.resolve(__dirname, '../dll', filename),
        }),
      );
    }
  });

  return plugins;
};

module.exports = getCommonPlugins;
