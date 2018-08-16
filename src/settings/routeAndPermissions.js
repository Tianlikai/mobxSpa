import OrgAdmin from '../pages/orgAdmin'
import MyAgent from '../pages/myAgent'
import Logs from '../pages/operationLog'

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
 * 左侧菜单列表
 */
const SIDE_MENU = {
    orgAdmin: {
        iconType: 'desktop',
        text: '机构管理',
        PERMISSIONS: [PERMISSIONS.createOrg, PERMISSIONS.orgList, PERMISSIONS.orderList],
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
        PERMISSIONS: [PERMISSIONS.myIncome, PERMISSIONS.myPromotion, PERMISSIONS.myInformation],
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

// 导航路径
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
 * 顶级路由
 */
const ROUTE_HOME = [
    {
        path: 'orgAdmin',
        component: OrgAdmin,
        exact: false,
        PERMISSIONS: [PERMISSIONS.createOrg, PERMISSIONS.orgList, PERMISSIONS.orderList]
    },
    {
        path: 'myAgent',
        component: MyAgent,
        exact: false,
        PERMISSIONS: [PERMISSIONS.myIncome, PERMISSIONS.myPromotion, PERMISSIONS.myInformation]
    },
    {
        path: 'logs',
        component: Logs,
        exact: false,
        PERMISSIONS: [PERMISSIONS.orgLogs, PERMISSIONS.orderLogs]
    }
]

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

export {
    ROUTE_HOME,
    ROUTE_ORGADMIN,
    ROUTE_MYAGENT,
    ROUTE_OPERATIONLOG,
    PERMISSIONS,
    SIDE_MENU
}
