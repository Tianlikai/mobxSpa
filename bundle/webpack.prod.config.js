const path = require('path');
const HappyPack = require('happypack');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const happyThreadPool = HappyPack.ThreadPool({ size: 5 });

module.exports = {
  mode: 'production',
  // devtool: 'cheap-module-source-map',
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  output: {
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].chunk.js',
    publicPath: '',
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [{ loader: MiniCssExtractPlugin.loader }, { loader: 'happypack/loader?id=css' }],
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
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash:8].css',
      chunkFilename: '[id].[chunkhash:8].css',
    }),
  ],
};
