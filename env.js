let env = getEnv('NODE_ENV', 'dev')
let backendIp
let dev = /dev/i.test(env)
let hot = getEnv('HOT', dev)
let inline = getEnv('INLINE', dev)
let host = process.env.HOST ? getIpAddress() : 'localhost'
let https = getEnv('HTTPS', true)

if (env.toLowerCase().indexOf('dev') > -1) {
    backendIp = 'demo.yourIP.cn'
} else if (env.toLowerCase().indexOf('pro') > -1) {
    backendIp = 'yourIP.cn'
}

let port = parseInt(getEnv('PORT'))

if (!port) {
    port = 8008
}

let conf = {
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
    HTTPS: https
}

conf.FRONTEND = conf.PROTOCOL + '://' + conf.HOST + ':' + conf.PORT + '/'

outputConf(conf)

module.exports = conf

function getEnv(key, defaultValue) {
    return (
        process.env[key.toUpperCase()]
        || process.env[key.toLowerCase()]
        || defaultValue
    )
}

function outputConf(conf) {
    let KEYS = Object.keys(conf)
    let MAX_LENGTH = Math.max(...KEYS.map(k => k.length)) + 2

    console.log(
        '\r\n\x1b[36m==================== 环境变量 ======================\x1b[0m'
    )
    Object.keys(conf).forEach(k => {
        let color = conf[k] === true ? '\x1b[35m' : ''
        let len = k.length
        let prefix = len < MAX_LENGTH ? ' '.repeat(MAX_LENGTH - k.length) : ''
        console.log('%s%s: %j\x1b[0m', color, prefix + k, conf[k])
    })
    console.log(
        '\x1b[36m===================================================\x1b[0m\r\n'
    )
}

function getIpAddress() {
    let interfaces = require('os').networkInterfaces()
    for (let devName in interfaces) {
        let iface = interfaces[devName]
        for (let i = 0; i < iface.length; i++) {
            let alias = iface[i]
            if (
                alias.family === 'IPv4'
                && alias.address !== '127.0.0.1'
                && !alias.internal
            ) {
                return alias.address
            }
        }
    }
}
