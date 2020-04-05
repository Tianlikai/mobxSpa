const path = require('path');
const webpack = require('webpack');
const webpackApiMocker = require('webpack-api-mocker');

const environment = require('./environment');

const publicPath = `${environment.PROTOCOL}://${environment.HOST}:${environment.PORT}/`;

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  cache: true,
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        exclude: path.join(__dirname, '../src'),
        use: ['thread-loader', 'style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'thread-loader',
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: path.resolve(__dirname, '../src/variable.scss'),
            },
          },
        ],
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    contentBase: path.resolve(__dirname, '../src'),
    host: environment.HOST,
    port: environment.PORT,
    open: true,
    hot: true,
    https: environment.PROTOCOL === 'https',
    overlay: true,
    compress: true,
    stats: { color: true },
    historyApiFallback: true,
    before(app) {
      webpackApiMocker(app, path.resolve(__dirname, '../_mocker_', 'index.js'));
    },
    proxy: {
      '/react/api': 'http://www.dell-lee.com',
    },
  },
};
