V 2.0.1

- 修改项目文件组织结构
- 修改项目路由配置方式（更好的结合[import]()动态加载，和公共模块拆分）
- 更新 webpack 配置，将开发和生产环境拆分为更小的 webpack 文件，通过[webpack-merge]() 合并
- Api 接口不再统一配置，按照功能模块进行区分
- 添加 [表单]()，[表格]()，[上传]() 高阶组件
- 添加简单的 dashboard 页面

v 2.0.2

- 添加 style-lint 检查 style
- 添加 pre-commit 和 lint-staged，限制代码库代码风格
- 按照 styleLint 和 eslint 配置文件，自动格式化代码，修正代码库代码风格。

v 2.0.3

- fixed 路由权限验证逻辑
- 规范项目文件命名 R-路由文件，P-页面文件/页面样式（防止命名冲突），L-公共布局文件/布局样式
- 项目变更记录，统一添加到 CHANGELOG.md
- fixed package.json script clean 脚本 具体删除文件

v 2.0.4

- React api update componentWillReceiveProps -> getDerivedStateFromProps
- 定义列表 数据模型和公共方
- 生成项目文件之间依赖 svg（使用工具 madge -> https://github.com/pahen/madge）

v update_bundle_config

- 升级项目依赖库
- 升级 webpack 打包配置
- 更新项目各项规范配置文件

v 2.0.5

- 修改项目别名配置
- moment.js 包含很多国际化配置文件导致体积过大，更改为 day.js 替代
- 按需打包 lodash
- 修复 polyfill 重复打包
