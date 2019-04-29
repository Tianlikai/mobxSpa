const merge = require('webpack-merge');

const comConfig = require('./webpack.com.config');
const devConfig = require('./webpack.dev.config');
const prodConfig = require('./webpack.prod.config');

module.exports = (env) => {
  if (env && env.production) {
    return merge(comConfig, prodConfig);
  }
  return merge(comConfig, devConfig);
};
