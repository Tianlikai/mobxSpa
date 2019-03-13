# mobx_antd_react

中后台 SPA 完整项目脚手架。

![](./print.png)

## 写在前面

这是一个不断迭代，与时俱进的中后台项目。

如果对你的项目搭建有帮助的话，随手给个星，感谢。

## 特点

- webpack 一个适用于真实项目开发配置
- Router 做了基本权限处理，跳转，以及一个更好的组织项目模块的路由配置函数
- mobx 处理数据流，简单易用
- axios 基于模块组织 api 接口
- 基于 antd 提供了表单，表格，上传的高阶组件。统一了以上场景的公共业务
- 基于路由和组件的按需加载模块
- style 和 js 使用 lint限制, git hooks 强制统一资源代码风格
- 业务场景模块抽离

## 规范列表

- [eslint](https://www.npmjs.com/package/eslint) 继承 [airbnb](https://www.npmjs.com/package/eslint-config-airbnb)，自定义部分 rules
- [stylelint](https://www.npmjs.com/package/stylelint) 限制样式文件，对 .js 文件中样式使用 rules 进行忽略
- 文件引用顺序，1 公共库 2 公共业务（util函数，通用组件，hoc）3 业务组件 4 配置文件 5 样式 6 const 结构

## 文件目录

```
├── node_modules:                   模块文件夹
|   └── ...
├── _mocker_:                       mock接口数据
├── build:                          webpack配置文件
|   ├── env:                        环境变量配置
|   ├── index:                      调用webpack入口文件
|   ├── webpack.base.config:        webpack通用配置
|   ├── webpack.dev.config:         webpack开发配置
|   ├── webpack.dll.config:         webpack公共依赖库打包
|   └── webpack.prod.config:        webpack生产配置
├── dist:                           打包生成目录
├── src:                            开发目录
|   ├── api:                        API配置，axios封装
|   ├── components:                 公共组件
|   ├── hoc:                        公共业务
|   ├── layouts:                    布局组件
|   ├── routes:                     项目路由
|   |   ├── ErrorPage:              错误导航页面
|   |   ├── Home:                   主路由模块
|   |   ├── Login:                  登录页面
|   |   └── index.js:               路由配置文件
|   ├── settings:                   配置文件
|   |   ├── const.js:               常量文件
|   |   ├── headConfig.js:          顶部模块配置
|   |   ├── permissions.js:         权限配置
|   |   └── sideMenu.js:            目录
|   ├── static:                     静态文件
|   ├── store:                      mobx store文件
|   ├── utils:                      工具函数
|   ├── index.ejs:                  模版文件
|   ├── index.js:                   入口文件
|   └── style.scss:                 公共样式
├── .babelrc                        babel配置文件
├── .editorconfig                   不通操作系统编码格式统一
├── .eslintignore                   eslint忽略
├── .eslintrc.json                  eslint
├── .gitignore                      git忽略文件
├── .prettierignore                 格式化代码忽略文件
├── .prettierrc                     格式化自定义配置文件
├── .stylelintrc.json               style lint 配置文件
├── .gitignore                      git忽略文件
├── jsconfig.json                   代码兼容装饰器写法
├── package.json                    项目依赖 npm
├── postcss.config.js               postcss 插件配置
└── README.MD                       项目信息
```

## 技术栈

- react 16.3xx
- react-dom
- react-router 4.xx
- react-loadable
- mobx 数据流
- webpack 4.xx
- ESLint styleLint lint-staged pre-commit 代码规范
- axios 异步请求
- antd ui
- mock 模拟接口数据
- echarts

## 开发环境

- git clone https://github.com/Tianlikai/mobxSpa.git
- npm i
- npm run build:dll
- npm run dev

## 生产环境

- npm run build

## TODO

- loading 改为体验更好的占位符
- React 生命周期替换，以及新的 API 的使用，React 从 16.3 起到 17 将逐渐废除[componentWillReceiveProps]()，[componentWillMount]()，[componentWillUpdate]()
- 当项目体积变大，是否针对暂存区进行lint检查
- 引入 git 提交格式规范
- React ref/context/lazy/suspense/error api 使用

## 未来展望

- 异步渲染