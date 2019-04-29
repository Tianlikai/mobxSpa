const path = require('path');
const webpack = require('webpack');
const webpackApiMocker = require('webpack-api-mocker');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          'sass-loader',
          'postcss-loader',
        ],
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    open: true,
    hot: true,
    stats: true,
    https: true,
    overlay: true,
    compress: true,
    historyApiFallback: true,
    before(app) {
      webpackApiMocker(app, path.resolve(__dirname, '../_mocker_', 'index.js'));
    },
    proxy: {
      '/react/api': 'http://www.dell-lee.com',
    },
  },
};
