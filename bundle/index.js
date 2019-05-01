const merge = require('webpack-merge');

const comConfig = require('./webpack.com.config');
const devConfig = require('./webpack.dev.config');
const prodConfig = require('./webpack.prod.config');

const printEnv = require('./util/printEnv');
const environment = require('./environment');

module.exports = () => {
  printEnv(environment);
  if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
    return merge(comConfig, prodConfig);
  }
  return merge(comConfig, devConfig);
};
