const path = require('path');
const webpack = require('webpack');

const rootDir = path.resolve(__dirname);
const staticDir = path.resolve(rootDir, '../dll');

module.exports = {
  mode: 'production',
  performance: {
    hints: false,
  },
  entry: {
    vendor: [
      'antd',
      'echarts',
      'react-helmet',
      'react-loadable',
    ],
    react: [
      'react',
      'react-dom',
      'react-router-dom',
      'prop-types',
      'mobx',
      'mobx-react',
    ],
  },
  output: {
    path: path.resolve(staticDir),
    filename: 'dll.[name].[chunkhash].js',
    library: 'dll_[name]_[chunkhash]',
  },
  plugins: [
    new webpack.DllPlugin({
      name: 'dll_[name]_[chunkhash]',
      path: path.resolve(staticDir, 'manifest.dll.json'),
    }),
  ],
};
