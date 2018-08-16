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

## 实践
* 降低组件之间的耦合
* html/css/js相互分离 依靠一些特殊的联系通信（如:js 和 css 通过更改 class 来改变 html）
* 避免不必要的全局变量
* 所有依靠网络的数据都要进行数据安全检查（是否为空，检查原始类型查看是否为指定类型）
* 将配置数据从代码中分离出来

## 问题
* build文件后自动上传项目