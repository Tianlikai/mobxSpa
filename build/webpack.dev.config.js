/* eslint-disable */

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackApiMocker = require('webpack-api-mocker');

const baseConfig = require('./webpack.base.config');

const mocker = path.resolve(__dirname, '../_mocker_/index.js');

const env = require('./env');

const FRONT_PORT = 8080;

module.exports = merge(baseConfig, {
  devServer: {
    // publicPath: 'http://127.0.0.1:8000/', // bundle.js
    contentBase: path.join(__dirname, '../src'), // 服务静态资源目录
    compress: true,
    historyApiFallback: true,
    host: env.HOST,
    port: env.PORT,
    hot: env.HOT,
    inline: env.INLINE,
    https: true,
    clientLogLevel: 'none',
    open: true,
    stats: { color: true },
    overlay: true,
    before(app) {
      webpackApiMocker(app, mocker);
    },
    // 接口代理
    proxy: {
      '/__online/*': {
        changeOrigin: true,
        secure: false,
        target: 'https://demo.yourIP.cn',
        router(req) {
          let uPath = req.originalUrl;
          const rePrefix = /^\/__online\/(\d+)?/;
          let port;
          let base;
          let target;
          if (rePrefix.test(uPath)) {
            const flag = RegExp.$1;
            switch (flag) {
              case '0':
                port = '';
                base = '';
                target = 'https://demo.learnta.cn';
                break;
              case '1':
                port = FRONT_PORT;
                base = '/fo/rest';
                break;
              default:
                base = '';
                port = '5000';
            }
          }
          uPath = base + uPath.replace(rePrefix, '');
          target = `http://${env.SERVICE_IP}:${port}`;
          // target = 'https://t2.learnta.cn';
          console.log(`request: ${target}${uPath}`);
          return target + uPath;
        },
        pathRewrite() {
          return '';
        },
      },
    },
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
});
