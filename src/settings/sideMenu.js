/**
 * 左侧菜单 需要展示的路由
 * @param {iconType} antd内置图标
 * @param {text} label展示
 * @param {PERMISSIONS} 包含的所有权限 有一个就需要展示
 * @param {children} 子菜单
 * @param {to} 跳转地址
 */
export default {
    home: {
        iconType: 'dashboard',
        text: 'Dashboard',
        PERMISSIONS: true,
        children: [],
        to: '/home'
    },
    table: {
        iconType: 'desktop',
        text: '表格页',
        PERMISSIONS: true,
        children: [
            {
                to: '/table/searchTable',
                text: '查询表格',
                PERMISSIONS: true
            }
        ]
    }
}
