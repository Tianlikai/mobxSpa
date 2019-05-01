function getEnv(key, defaultValue) {
  return process.env[key.toUpperCase()] || process.env[key.toLowerCase()] || defaultValue;
}

module.exports = getEnv;
