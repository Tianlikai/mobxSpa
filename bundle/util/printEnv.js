function printEnv(conf) {
  const KEYS = Object.keys(conf);
  const MAX_LENGTH = Math.max(...KEYS.map(k => k.length)) + 2;

  console.log('\r\n\x1b[36m==================== 环境变量 ======================\x1b[0m');
  Object.keys(conf).forEach((k) => {
    const color = conf[k] === true ? '\x1b[35m' : '';
    const len = k.length;
    const prefix = len < MAX_LENGTH ? ' '.repeat(MAX_LENGTH - k.length) : '';
    console.log('%s%s: %j\x1b[0m', color, prefix + k, conf[k]);
  });
  console.log('\x1b[36m===================================================\x1b[0m\r\n');
}

module.exports = printEnv;
