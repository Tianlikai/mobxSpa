/* eslint-disable */
const env = getEnv('NODE_ENV', 'dev');
let backendIp;
const dev = /dev/i.test(env);
const hot = getEnv('HOT', dev);
const inline = getEnv('INLINE', dev);
const host = process.env.HOST ? getIpAddress() : 'localhost';
const https = getEnv('HTTPS', true);

if (env.toLowerCase().indexOf('dev') > -1) {
  backendIp = 'demo.yourIP.cn';
} else if (env.toLowerCase().indexOf('pro') > -1) {
  backendIp = 'yourIP.cn';
}

let port = parseInt(getEnv('PORT'));

if (!port) {
  port = 8008;
}

const conf = {
  VERSION: require('./package.json').version,
  PROTOCOL: https ? 'https' : 'http',
  HOST: host,
  // HOST: getEnv('HOST', getIpAddress()), // 后端测试时 使用
  PORT: port,
  BACKEND_IP: backendIp,

  ENV: env,
  DEV: dev,
  TARGET: getEnv('TARGET', 'dev'),
  HOT: hot,
  INLINE: inline,
  HTTPS: https,
};

conf.FRONTEND = `${conf.PROTOCOL}://${conf.HOST}:${conf.PORT}/`;

outputConf(conf);

module.exports = conf;

function getEnv(key, defaultValue) {
  return process.env[key.toUpperCase()] || process.env[key.toLowerCase()] || defaultValue;
}

function outputConf(conf) {
  const KEYS = Object.keys(conf);
  const MAX_LENGTH = Math.max(...KEYS.map(k => k.length)) + 2;

  console.log('\r\n\x1b[36m==================== 环境变量 ======================\x1b[0m');
  Object.keys(conf).forEach(k => {
    const color = conf[k] === true ? '\x1b[35m' : '';
    const len = k.length;
    const prefix = len < MAX_LENGTH ? ' '.repeat(MAX_LENGTH - k.length) : '';
    console.log('%s%s: %j\x1b[0m', color, prefix + k, conf[k]);
  });
  console.log('\x1b[36m===================================================\x1b[0m\r\n');
}

function getIpAddress() {
  const interfaces = require('os').networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}
