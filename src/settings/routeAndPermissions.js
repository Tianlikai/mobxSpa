import ProductInfo from '../pages/orgAdmin/productInfo'
import PartnerList from '../pages/orgAdmin/PartnerList'
import OrderList from '../pages/orgAdmin/orderList'
import CreateOrder from '../pages/orgAdmin/createOrder'
import OrderDetail from '../pages/orgAdmin/orderDetail'
import Container from '../layouts/Container'

import MyIncome from '../pages/myAgent/myIncome'
import MyPromotion from '../pages/myAgent/myPromotion'
import CreatePromotion from '../pages/myAgent/createPromotion'
import PromotionDetail from '../pages/myAgent/promotionDetail'
import MyInformation from '../pages/myAgent/myInformation'

import OrgLogs from '../pages/operationLog/OrgLogs'
import OrderLogs from '../pages/operationLog/OrderLogs'

import factory from '../pages/factory'

/**
 * 等待优化
 * 所有权限更具路由进行配置
 * 所有路径/权限/路由相互映射 自动配置
 */

/**
 * 项目配置说明
 * 1 引入要展示的页面
 * 2 在 PERMISSIONS 中写入该页面的权限 （权限由后端返回，在用户登陆时获取
 * 3 在 SIDE_MENU 配置左侧菜单
 * 4 在 AUTHORITY 配置 Header 权限
 * 5 是否为新模块页面，是则需要陪新的 ROUTE 然后 export
 */

/**
 * 权限列表
 */
const PERMISSIONS = {
    createOrg: 130001, // 创建机构
    orgList: 130002, // 机构列表
    orderList: 130003, // 订单列表
    myIncome: 120001, // 我的分成
    myPromotion: 120002, // 我的推广
    myInformation: 120003, // 我的信息
    orgLogs: 110001, // 操作日志 机构
    orderLogs: 110002 // 操作日志 订单
}

/**
 * 左侧菜单 需要展示的路由
 * @param {iconType} antd内置图标
 * @param {text} label展示
 * @param {PERMISSIONS} 包含的所有权限 有一个就需要展示
 * @param {children} 子菜单
 * @param {to} 跳转地址
 */
const SIDE_MENU = {
    orgAdmin: {
        iconType: 'desktop',
        text: '机构管理',
        PERMISSIONS: [
            PERMISSIONS.createOrg,
            PERMISSIONS.orgList,
            PERMISSIONS.orderList
        ],
        children: [
            {
                to: '/orgAdmin/orgList',
                text: '机构列表',
                PERMISSIONS: [PERMISSIONS.orgList]
            },
            {
                to: '/orgAdmin/orderList',
                text: '订单列表',
                PERMISSIONS: [PERMISSIONS.orderList]
            }
        ]
    },
    myAgent: {
        iconType: 'idcard',
        text: '我的代理',
        PERMISSIONS: [
            PERMISSIONS.myIncome,
            PERMISSIONS.myPromotion,
            PERMISSIONS.myInformation
        ],
        children: [
            {
                to: '/myAgent/myIncome',
                text: '我的分成',
                PERMISSIONS: [PERMISSIONS.myIncome]
            },
            {
                to: '/myAgent/myPromotion',
                text: '我的推广',
                PERMISSIONS: [PERMISSIONS.myPromotion]
            },
            {
                to: '/myAgent/myInformation',
                text: '我的信息',
                PERMISSIONS: [PERMISSIONS.myInformation]
            }
        ]
    },
    logs: {
        iconType: 'book',
        text: '操作日志',
        PERMISSIONS: [PERMISSIONS.orgLogs, PERMISSIONS.orderLogs],
        children: [
            {
                to: '/logs/orgLogs',
                text: '机构',
                PERMISSIONS: [PERMISSIONS.orgLogs]
            },
            {
                to: '/logs/orderLogs',
                text: '订单',
                PERMISSIONS: [PERMISSIONS.orderLogs]
            }
        ]
    }
}

/**
 * 头部配置
 * 不同页面的Header组件可能有不同功能
 * @param {pageTitle} 页面标题
 * @param {btnText} 左侧跳转按钮文字
 * @param {target} 跳转地址
 */
const AUTHORITY = {
    createOrder: {
        pageTitle: '创建订单',
        btnText: '< 返回',
        target: '/orgAdmin/orderList'
    },
    orderDetail: {
        pageTitle: '订单详情',
        btnText: '< 返回',
        target: '/orgAdmin/orderList'
    },
    orderList: {
        pageTitle: '',
        btnText: '创建订单',
        target: '/orgAdmin/createOrder'
    },
    myIncome: {
        pageTitle: '我的分成',
        btnText: '',
        target: ''
    },
    myPromotion: {
        pageTitle: '我的推广',
        btnText: '',
        target: ''
    },
    createPromotion: {
        pageTitle: '新增推广',
        btnText: '< 返回',
        target: '/myAgent/myPromotion'
    },
    promotionDetail: {
        pageTitle: '推广详情',
        btnText: '< 返回',
        target: '/myAgent/myPromotion'
    },
    applicationSettlement: {
        pageTitle: '申请结算',
        btnText: '',
        target: ''
    },
    settlementHistory: {
        pageTitle: '结算历史',
        btnText: '',
        target: ''
    },
    myInformation: {
        pageTitle: '我的信息',
        btnText: '',
        target: ''
    }
}

/**
 * 导航路径
 * 例子：机构管理 / 创建机构
 */
const NAV = {
    createOrg: ['机构管理', '创建机构'],
    orgList: ['机构管理', '机构列表'],
    orderList: ['机构管理', '订单列表'],
    settlementDetail: ['结算管理', '结算详情'],
    myIncome: ['我的代理', '我的分成'],
    myPromotion: ['我的代理', '我的推广'],
    myInformation: ['我的代理', '我的信息'],
    createPromotion: ['我的代理', '新增推广'],
    promotionDetail: ['我的代理', '推广详情'],
    orgLogs: ['操作日志', '机构'],
    orderLogs: ['操作日志', '订单']
}

/**
 * 以下组件都需要 Container 组件进行增强
 * Container为以下组件提供公共组件部分
 * @param {nav} 路径展示配置
 * @param {component} 需要增强的组件
 */
const PartnerListWrapper = Container(NAV.orgList)(PartnerList)
const OrderListWrapper = Container(NAV.orderList)(OrderList)

const MyIncomeWrapper = Container(NAV.myIncome)(MyIncome)
const MyPromotionWrapper = Container(NAV.myPromotion)(MyPromotion)
const CreatePromotionWrapper = Container(NAV.createPromotion)(CreatePromotion)
const PromotionDetailWrapper = Container(NAV.promotionDetail)(PromotionDetail)
const MyInformationWrapper = Container(NAV.myInformation)(MyInformation)

const OrgLogsWrapper = Container(NAV.orgLogs)(OrgLogs)
const OrderLogsWrapper = Container(NAV.orderLogs)(OrderLogs)

/**
 * 机构管理路由
 */
const ROUTE_ORGADMIN = [
    {
        path: '/orgList',
        component: PartnerListWrapper,
        exact: true,
        PERMISSIONS: [PERMISSIONS.orgList]
    },
    {
        path: '/product/:id',
        component: ProductInfo,
        exact: true,
        PERMISSIONS: true
    },
    {
        path: '/orderList',
        component: OrderListWrapper,
        exact: true,
        PERMISSIONS: [PERMISSIONS.orderList]
    },
    {
        path: '/orderDetail/:id',
        component: OrderDetail,
        exact: false,
        PERMISSIONS: true
    },
    {
        path: '/createOrder',
        component: CreateOrder,
        exact: false,
        PERMISSIONS: true
    }
]

/**
 * 我的代理路由
 */
const ROUTE_MYAGENT = [
    {
        path: '/myIncome',
        component: MyIncomeWrapper,
        exact: false,
        PERMISSIONS: [PERMISSIONS.myIncome]
    },
    {
        path: '/myPromotion',
        component: MyPromotionWrapper,
        exact: false,
        PERMISSIONS: [PERMISSIONS.myPromotion]
    },
    {
        path: '/createPromotion',
        component: CreatePromotionWrapper,
        exact: false,
        PERMISSIONS: true
    },
    {
        path: '/promotionDetail/:id',
        component: PromotionDetailWrapper,
        exact: false,
        PERMISSIONS: true
    },
    {
        path: '/myInformation',
        component: MyInformationWrapper,
        exact: false,
        PERMISSIONS: [PERMISSIONS.myInformation]
    }
]

/**
 * 操作日志路由
 */
const ROUTE_OPERATIONLOG = [
    {
        path: '/orgLogs',
        component: OrgLogsWrapper,
        exact: false,
        PERMISSIONS: [PERMISSIONS.orgLogs]
    },
    {
        path: '/orderLogs',
        component: OrderLogsWrapper,
        exact: false,
        PERMISSIONS: [PERMISSIONS.orderLogs]
    }
]

const OrgAdmin = factory(ROUTE_ORGADMIN)
const MyAgent = factory(ROUTE_MYAGENT)
const Logs = factory(ROUTE_OPERATIONLOG)

/**
 * 顶级路由
 */
const ROUTE_HOME = [
    {
        path: 'orgAdmin',
        component: OrgAdmin,
        exact: false,
        PERMISSIONS: [
            PERMISSIONS.createOrg,
            PERMISSIONS.orgList,
            PERMISSIONS.orderList
        ]
    },
    {
        path: 'myAgent',
        component: MyAgent,
        exact: false,
        PERMISSIONS: [
            PERMISSIONS.myIncome,
            PERMISSIONS.myPromotion,
            PERMISSIONS.myInformation
        ]
    },
    {
        path: 'logs',
        component: Logs,
        exact: false,
        PERMISSIONS: [PERMISSIONS.orgLogs, PERMISSIONS.orderLogs]
    }
]

export { ROUTE_HOME, SIDE_MENU, AUTHORITY }
