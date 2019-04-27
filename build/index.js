const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
const devConfig = require('./webpack.dev.config');
const prodConfig = require('./webpack.prod.config');

module.exports = () => {
  if (process.env.NODE_ENV === 'prod') {
    return merge(baseConfig, prodConfig);
  }
  return merge(baseConfig, devConfig);
};
