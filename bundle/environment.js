const getEnv = require('./util/getEnv');
const getIpAddress = require('./util/getIpAddress');

/**
 * 定义环境变量
 */
const env = {
  PROTOCOL: 'https',
  HOST: getIpAddress(),
  PORT: 9000,
  BASENAME: '',
  SERVICE_IP: '', // 服务端ip
  ROUTER: 'BrowserRouter',
  TARGET: getEnv('NODE_ENV'),
};

module.exports = env;
