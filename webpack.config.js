const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const WebpackMd5Hash = require('webpack-md5-hash')
const apiMocker = require('webpack-api-mocker')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HappyPack = require('happypack')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const happyThreadPool = HappyPack.ThreadPool({ size: 5 })
const manifest = require('./src/static/manifest.dll.json')
require('babel-polyfill')

const env = require('./env.js')
const mocker = path.resolve('./src/mocker/index.js')

const cdnUrl = 'CDN-URL' // 静态资源上传地址
const rootDir = path.resolve(__dirname)
const srcDir = path.join(rootDir, 'src')
const distDir = path.join(rootDir, 'dist')

const FRONT_PORT = 8080
const ADMIN_PORT = 9090
const TASK_PORT_V3 = 8091
const TARZAN_PORT = 8090
const BUSINESS_ADMIN_PORT = 8890
const TASK_TWO_PORT = 8088
const PRIVILEGE_PORT = 9091
const LUNDAFUDAO_PORT = 80
const WECHAT_PORT = 8094
const BD_PORT = 8097
const LT_ADMIN = 8291
const ORG_ADMIN = 8241
const LIB_PORT = 8231
const OPERATION_ADMIN = 8311
const ACTIVITY_PORT = 8331

let wp = {
    mode: env.DEV ? 'development' : 'production',
    entry: env.DEV ? [
        'webpack-dev-server/client' + '?' + env.FRONTEND, // 资源服务器地址
        'webpack/hot/only-dev-server',
        path.join(srcDir, 'index.js')
    ] : ['babel-polyfill', path.join(srcDir, 'index.js')],
    output: {
        filename: env.DEV ? '[name].js' : '[name]-[chunkhash:8].js',
        publicPath: env.DEV ? env.FRONTEND : `${cdnUrl}/${env.PRODUCT}/${env.TARGET}/`,
        path: distDir,
        chunkFilename: '[name].[chunkhash:8].js'
    },
    devtool: env.DEV && 'source-map',
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            components: path.join(srcDir, 'components'),
            libs: path.join(srcDir, 'libs'),
            settings: path.join(srcDir, 'settings'),
            redactor: path.join(srcDir, 'static/redactor')
        }
    },
    cache: env.DEV,
    // 不打包以下库，通过dll处理
    // key是全局变量名，value是引用的库名
    externals: {
        'React': 'react',
        'ReactDOM': 'react-dom',
        'PropTypes': 'prop-types',
        'ReactRouterDOM': 'react-router-dom',
        'Mobx': 'mobx',
        'Antd': 'antd',
        'Jquery': 'jquery',
        'MobxReact': 'mobx-react'
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: { // node_modules内的依赖库
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    minChunks: 1, // 被不同entry引用次数(import),1次的话没必要提取
                    maxInitialRequests: 5,
                    minSize: 0,
                    priority: 100
                },
                common: { // ‘src/js’ 下的js文件
                    chunks: 'all',
                    test: /[\\/]src[\\/]/, // 也可以值文件/[\\/]src[\\/]js[\\/].*\.js/,
                    name: 'common', // 生成文件名，依据output规则
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0,
                    priority: 1
                }
            }
        },
        runtimeChunk: {
            name: 'manifest'
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'source-map-loader',
                enforce: 'pre'
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: ['happypack/loader?id=js']
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['happypack/loader?id=css']
                })
            },
            {
                test: /\.s(a|c)ss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'sass-loader',
                            options: { importLoaders: 1 }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                                ident: 'postcss',
                                parser: 'postcss-scss',
                                plugins: () => [
                                    require('autoprefixer')(
                                        {browsers: ['last 10 version', 'ie >= 10']}
                                    )
                                ]
                            }
                        }
                    ]
                })
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    publicPath: env.DEV ? env.FRONTEND : `${cdnUrl}/${env.PRODUCT}/${env.TARGET}/`
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|mp4)$/,
                loader: 'file-loader'
            }
        ]
    },
    plugins: [
        new HappyPack({
            // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
            id: 'js',
            // 如何处理 .js 文件，用法和 Loader 配置中一样
            loaders: [{
                loader: 'babel-loader',
                options: {
                    cacheDirectory: env.DEV
                }
            }],
            // 使用共享进程池中的子进程去处理任务
            threadPool: happyThreadPool
            // ... 其它配置项
        }),
        new HappyPack({
            id: 'css',
            // 如何处理 .css 文件，用法和 Loader 配置中一样
            loaders: ['css-loader'],
            // 使用共享进程池中的子进程去处理任务
            threadPool: happyThreadPool
        }),
        // 用ExtractTextPlugin之后hot无效，所以开发模式下禁用
        new ExtractTextPlugin({
            filename: env.DEV ? 'style.css' : 'style-[md5:contenthash:hex:20].css',
            disable: env.DEV,
            allChunks: true
        }),
        new HtmlWebpackPlugin({
            title: 'my structure',
            template: path.resolve(srcDir, 'index.ejs'),
            inject: false,
            hash: true,
            dllJS: env.DEV ? `/static/${getDllName()}.js` : `${cdnUrl}/${process.env.PRODUCT}/${env.TARGET}/${getDllName()}.js`,
            dllCSS: env.DEV ? `/static/${getDllName()}.css` : `${cdnUrl}/${process.env.PRODUCT}/${env.TARGET}/${getDllName()}.css`
        }),
        // 定义全局变量React指向react库就不用每次import react
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            React: 'react',
            ReactDOM: 'react-dom',
            PropTypes: 'prop-types',
            Immutable: 'immutable',
            ReactRouterDOM: 'react-router-dom'
        }),
        new webpack.DefinePlugin(Object.keys(env).reduce((res, k) => {
            res['__' + k + '__'] = JSON.stringify(env[k])
            return res
        }, {})),
        new webpack.DllReferencePlugin({
            context: rootDir,
            manifest: require('./src/static/manifest.dll.json')
        }),
        // css变化时不会影响js的hash，参看hash,chunkhash,contenthash的区别
        new WebpackMd5Hash(),
        new ManifestPlugin(),
        new CopyWebpackPlugin([{
            from: 'src/static/dll.vendor.*',
            to: '',
            flatten: true
        }])
    ],
    devServer: {
        // publicPath: 'http://127.0.0.1:8000/', // bundle.js来源
        contentBase: srcDir, // 静态文件来源
        compress: true,
        historyApiFallback: true,
        host: env.HOST,
        port: env.PORT, // 不要用8080，被webStorm占用
        hot: env.HOT, // hot module replacement 代码变化时只改变变动的部分
        inline: env.INLINE,
        https: true,
        clientLogLevel: 'none',
        open: true,
        stats: {color: true},
        overlay: true, // 报错时会在浏览器全屏弹出
        before(app) {
            apiMocker(app, mocker)
        },
        proxy: {
            '/__api/*': {
                changeOrigin: true,
                secure: false,
                target: 'https://demo.yourIP.cn', // 随便写，但必须有
                router: function(req) {
                    let path = req.originalUrl
                    let rePrefix = /^\/__api\/(\d+)?/
                    let port, base, target
                    if (rePrefix.test(path)) {
                        let flag = RegExp.$1
                        switch (flag) {
                            case '0': port = ''; base = ''; target = 'https://demo.yourIP.cn'; break
                            case '1': port = FRONT_PORT; base = '/fo/rest'; break // 做题端
                            case '2': port = ADMIN_PORT; base = '/admin_service'; break // 后台
                            // case '3': port = TASK_PORT; base = '/beat'; break // 任务卡
                            case '4': port = TARZAN_PORT; base = '/tarzan'; break // 论答课堂
                            case '5': port = BUSINESS_ADMIN_PORT; base = '/busi_admin'; break // 销课后台
                            case '6': port = TASK_TWO_PORT; base = '/beatV2'; break // 任务卡2.0
                            case '7': port = TASK_PORT_V3; base = '/beatV3'; break // 任务卡2.0
                            case '8': port = PRIVILEGE_PORT; base = '/auth'; break // 权限系统
                            case '9': port = LUNDAFUDAO_PORT; base = '/fudao'; break // 论答辅导
                            case '10': port = WECHAT_PORT; base = '/wechat'; break // 微信相关接口
                            case '11': port = BD_PORT; base = '/bd'; break // 2B相关接口
                            case '12': port = LT_ADMIN; base = '/officialsite'; break // 论答管网
                            case '13': port = ORG_ADMIN; base = '/manage'; break // 测试本地接口
                            case '14': port = LIB_PORT; base = '/library'; break // 课程审核
                            case '15': port = OPERATION_ADMIN; base = '/operation'; break // operationAdmin
                            case '16': port = ACTIVITY_PORT; base = '/activity'; break
                            default: base = ''; port = '5000'
                        }
                    }
                    path = base + path.replace(rePrefix, '')
                    target = `http://${env.BACKEND_IP}:${port}`
                    console.log('request: ' + target + path)
                    return target + path
                },
                pathRewrite: function() {
                    return ''
                }
            }
        }
    }
}

if (!env.DEV) {
    wp.plugins.push(
        new BundleAnalyzerPlugin({
            analyzerMode: 'static'
        })
    )
} else if (env.DEV && env.HOT) {
    wp.plugins.push(
        new webpack.HotModuleReplacementPlugin() // 启用 HMR
    )
}

module.exports = wp

function getDllName() {
    const name = manifest.name

    return name.replace(/_/g, '.')
}
