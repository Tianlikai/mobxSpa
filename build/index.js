/* eslint-disable */
if (process.env.NODE_ENV === 'prod') {
  module.exports = require('./webpack.prod.config');
} else if (process.env.NODE_ENV === 'dev') {
  module.exports = require('./webpack.dev.config');
}
