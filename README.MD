# mobx_antd_react 

中后台spa完整项目脚手架。

![](./print.png)

## 写在前面
使用webpack4.xx，区分开发环境和生产环境，开发环境打包编译超快，生产环境的优化基本都有。
mobx做状态管理，灵活方便
antd做ui易于维护
axios请求api
mock数据前端独立开发

## 文件目录
```
├── node_modules:                   模块文件夹
|   └── ...
├── dist:                           打包生成目录
├── src:                            开发目录
|   ├── components:                 公共组件
|   ├── layouts:                    布局组件
|   ├── libs:                       全局工具函数
|   ├── mocker:                     模拟接口
|   ├── pages:                      项目view
|   ├── static:                     静态文件
|   ├── store:                      mobx store文件
|   ├── setting:                    配置文件
|   |   ├── api:                    API配置文件
|   |   └── consts:                 常量文件
|   ├── index.ejs:                  模版文件
|   └── index.js:                   入口文件
├── .babelrc                        babel配置文件 
├── .eslintignore                   eslint忽略
├── .eslintrc.json                  eslint
├── .gitignore                      git忽略文件
├── env.js                          开发变量配置
├── jsconfig.json                   代码兼容装饰器写法
├── package.json                    项目依赖 npm
├── README.MD                       项目信息
├── webpack.config.js               webpack配置文件
└── webpack.dll.config.js           dll分离公共库
```
## 技术栈
* react 16.3xx
* react-dom 
* react-router 4.xx
* mobx 数据流
* webpack 4.xx
* ESLint 代码规范 
* axios 异步请求
* antd ui
* mock 模拟接口数据

## 开发环境
* git clone https://github.com/Tianlikai/mobxSpa.git
* npm i 
* npm run dev

## 生产环境
* npm run build

## 注意
* windows 平台下“git clone”项目可能会出现丢失src目录下部分代码
* windows 平台下可以通过 Download Zip 形式下载
* 解压后部分“import”文件名或出错，通过“npm i” -> "npm run dev“ 会抛出所有错误文件目录定位
* 找到修改为正确的文件目录即可