const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const webpackApiMocker = require('webpack-api-mocker');

const happyThreadPool = HappyPack.ThreadPool({ size: 5 });
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
        test: /\.(sa|sc|c)ss$/,
        use: [{ loader: 'style-loader' }, { loader: 'happypack/loader?id=css' }],
      },
    ],
  },
  plugins: [
    new HappyPack({
      id: 'js',
      loaders: [
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      ],
      threadPool: happyThreadPool,
    }),
    new HappyPack({
      id: 'css',
      loaders: [
        { loader: 'css-loader' },
        { loader: 'postcss-loader' },
        { loader: 'sass-loader' },
        {
          loader: 'sass-resources-loader',
          options: {
            resources: path.resolve(__dirname, '../src/variable.scss'),
          },
        }],
      threadPool: happyThreadPool,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
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
