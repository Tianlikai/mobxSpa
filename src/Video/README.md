# 我的视频模块

## 功能目录

以下部分功能包含权限处理
视频恢复功能在回收站中

- 视频录入
- 视频编辑
- 视频审核
- 关联知识点
- 视频删除
- 视频恢复

## 视频状态

- 未提审
- 待审核
- 需修改
- 审核通过

## 角色

- 教学老师
- 教学管理

## 视频类别

- 个人
- 学校

## 业务模块

- 全部视频/个人
- 全部视频/学校
- 待审核视频
- 待关联视频
- 回收站/个人
- 回收站/学校

## 录入视频 - 页面

### 字段

- .学科、题目类型默认不选择 必填

- .视频录入，同 admin 中逻辑 必填

- .备注，可编辑视频备注，非必填

- .自定义标签，非必填，同 admin 中逻辑 非必填
- .关联知识点 非必填

### 权限

- .教学老师角色，显示“提交审核”，点击弹窗确认，提审后题目进入学校题目，状态为待审核
- .教学管理角色，显示“发布”，点击弹窗确认，发布后直接进入学校题目，状态为审核通过

点击 ‘提交审核’或者‘发布’ 跳转到 个人题目
点击 ‘保存并返回’ 跳转到 学校题目

## 编辑视频 - 页面

逻辑和`录入视频 - 页面`相同
编辑时具有初始化数据

## API

保存/修改/提交审核
http://192.168.20.216:8095/admin/video/orgVideo/save
post 请求
参数：
orgId
category（ 0：英语 1：数学）
cover（封面）
url
fileName（视频名称）
userDefinedTag（自定义标签）
remark（备注）
state（0:保存 1:提交审核）
kPointIds（知识点数组）
id(视频 ID)

发布视频
http://192.168.20.216:8095/admin/video/orgVideo/releaseVideo
post 请求
参数：
orgId
category（ 0：英语 1：数学）
cover（封面）
url
fileName（视频名称）
userDefinedTag（自定义标签）
remark（备注）
kPointIds（知识点数组）
id(视频 ID)

审核视频
http://192.168.20.216:8095/admin/video/orgVideo/examine
post 请求
参数：
reason（失败原因）
state（state 2:待修改 3:审核通过）
id(视频 ID)

创建人列表
http://192.168.20.216:8095/admin/video/orgVideo/createdBy
get 请求
无参数

tag 自定义标签列表
http://192.168.20.216:8095/admin/video/orgVideo/tag
get 请求
无参数

视频列表
http://192.168.20.216:8095/admin/video/orgVideo/list/{listType}
post 请求
参数：
orgId
category（ 0：英语 1：数学）
isRelaKPoint（是否关联知识点 0:未关联 1:已关联）
createdBy（创建人 ID）
videoKeyName（视频关键字）
userDefinedTag（自定义标签）
kPointKeyName（知识点关键字）
state（0：未提审、1：待审核、2：需修改、3：审核通过）
isOwn（所属 0:我的视频 1:学校视频）

?

id(视频 ID)
pageNo（页码）
pageSize
(listType 1:全部列表，2:待审核/待修改)

获取视频详情
http://192.168.20.216:8095/admin/video/getVideoInfo/{videoId}/{videoSource}
get 请求
无参数

待关联知识点视频列表
http://192.168.20.216:8095/admin/video/orgVideo/orgVideo/noKpointList
post 请求
参数：
orgId
category（ 0：英语 1：数学）
createdBy（创建人 ID）
videoKeyName（视频关键字）
userDefinedTag（自定义标签）
kPointKeyName（知识点关键字）
id(视频 ID)
pageNo（页码）
pageSize

关联知识点
http://192.168.20.216:8095/admin/video/orgVideo/orgVideo/bindKpoint
post 请求
参数：orgId
kPointId（知识点 ID 数组）
videoId（视频 ID 数组）

全选业务

简单解
定义全局数组

选中一个选项判断是否存在（是 push，不是 pop）
全选（将该页的所有未 push 进全局数组的选项 push）
全不选 （将该页的所有选项 pop）
判断全选按钮是否选中 （判断该页选项是否都在全局数组中）

抽离公共逻辑

高阶组件抽离数据和公共业务

props 传递公共方法
通过公共方法修改数据

包含业务和 UI 都相同的公共组件
