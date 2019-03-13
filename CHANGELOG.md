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