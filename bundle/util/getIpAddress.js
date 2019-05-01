const os = require('os');

function getIpAddress() {
  let host = '127.0.0.1';
  const interfaces = os.networkInterfaces();
  const keys = Object.keys(interfaces);
  for (let i = 0; i < keys.length; i += 1) {
    const ifc = interfaces[keys[i]];
    const item = ifc.find(
      alias => alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal,
    );
    if (item) host = item.address;
  }
  return host;
}

module.exports = getIpAddress;
