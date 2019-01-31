/* eslint-disable */

const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const WebpackMd5Hash = require('webpack-md5-hash');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const happyThreadPool = HappyPack.ThreadPool({ size: 5 });
const manifest = require('../src/static/manifest.dll.json');
require('babel-polyfill');

const env = require('./env.js');

const cdnUrl = ''; // 静态资源上传地址
const rootDir = path.resolve(__dirname);
const srcDir = path.join(rootDir, '../src');
const distDir = path.join(rootDir, '../dist');

function getDllName() {
  const { name } = manifest;
  return name.replace(/_/g, '.');
}

module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    filename: env.DEV ? '[name].js' : '[name]-[chunkhash:8].js',
    publicPath: env.DEV ? env.CLIENT : `${cdnUrl}/`,
    path: distDir,
    chunkFilename: '[name].[chunkhash:8].js',
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      components: path.join(srcDir, 'components'),
      layouts: path.join(srcDir, 'layouts'),
      utils: path.join(srcDir, 'utils'),
      settings: path.join(srcDir, 'settings'),
      redactor: path.join(srcDir, 'static/redactor'),
    },
  },
  externals: {
    React: 'react',
    ReactDOM: 'react-dom',
    PropTypes: 'prop-types',
    ReactRouterDOM: 'react-router-dom',
    Mobx: 'mobx',
    Antd: 'antd',
    Jquery: 'jquery',
    MobxReact: 'mobx-react',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          minChunks: 1,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 100,
        },
        common: {
          chunks: 'all',
          test: /[\\/]src[\\/]/,
          name: 'common',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 1,
        },
      },
    },
    runtimeChunk: {
      name: 'manifest',
    },
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
        test: /\.js$/,
        loader: 'source-map-loader',
        enforce: 'pre',
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: ['happypack/loader?id=js'],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          { loader: env.DEV ? 'style-loader' : MiniCssExtractPlugin.loader },
          { loader: 'happypack/loader?id=css' },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 1024,
          publicPath: env.DEV ? env.CLIENT : `${cdnUrl}/`,
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|mp4)$/,
        loader: 'file-loader',
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
            cacheDirectory: env.DEV,
          },
        },
      ],
      threadPool: happyThreadPool,
    }),
    new HappyPack({
      id: 'css',
      loaders: [{ loader: 'css-loader' }, { loader: 'postcss-loader' }, { loader: 'sass-loader' }],
      threadPool: happyThreadPool,
    }),
    new MiniCssExtractPlugin({
      filename: env.DEV ? '[name].css' : '[name].[hash].css',
      chunkFilename: env.DEV ? '[id].css' : '[id].[hash].css',
    }),
    new HtmlWebpackPlugin({
      title: 'my structure',
      template: path.resolve(srcDir, 'index.ejs'),
      inject: false,
      hash: true,
      dllJS: env.DEV ? `/static/${getDllName()}.js` : `${cdnUrl}/${getDllName()}.js`,
      dllCSS: env.DEV ? `/static/${getDllName()}.css` : `${cdnUrl}/${getDllName()}.css`,
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Mobx: 'mobx',
      ReactDOM: 'react-dom',
      PropTypes: 'prop-types',
      Immutable: 'immutable',
      MobxReact: 'mobx-react',
      ReactRouterDOM: 'react-router-dom',
    }),
    new webpack.DefinePlugin(
      Object.keys(env).reduce((res, k) => {
        res[`__${k}__`] = JSON.stringify(env[k]);
        return res;
      }, {}),
    ),
    new webpack.DllReferencePlugin({
      context: rootDir,
      manifest: require('../src/static/manifest.dll.json'),
    }),
    new WebpackMd5Hash(),
    new ManifestPlugin(),
    new CopyWebpackPlugin([
      {
        from: '../src/static/dll.vendor.*',
        to: '',
        flatten: true,
      },
    ]),
  ],
};
