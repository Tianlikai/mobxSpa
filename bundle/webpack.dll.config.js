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
      'mobx',
      'mobx-react',
      'prop-types',
      'react-content-loader',
      'react-helmet',
      'react-loadable',
    ],
    ui: ['echarts'],
    react: ['react', 'react-dom', 'react-router', 'react-router-dom'],
  },
  output: {
    path: path.resolve(__dirname, '../dll'),
    filename: '[name].[chunkhash:8].dll.js',
    library: '[name]_[chunkhash:8]_dll',
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_[chunkhash:8]_dll',
      path: path.resolve(__dirname, '../dll', '[name].manifest.json'),
    }),
  ],
};
