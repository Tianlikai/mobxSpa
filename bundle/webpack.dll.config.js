const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  performance: {
    hints: false,
  },
  entry: {
    vendors: [
      'axios',
      'classnames',
      'lodash',
      'mobx',
      'mobx-react',
      'moment',
      'object-assign',
      'prop-types',
      'react-content-loader',
      'react-helmet',
      'react-loadable',
    ],
    ui: ['antd', 'echarts'],
    react: ['react', 'react-dom', 'react-router', 'react-router-dom'],
  },
  output: {
    path: path.resolve(__dirname, '../dll'),
    filename: '[name].[chunkhash].dll.js',
    library: '[name]_[chunkhash]_dll',
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_[chunkhash]_dll',
      path: path.resolve(__dirname, '../dll', '[name].manifest.json'),
    }),
  ],
};
