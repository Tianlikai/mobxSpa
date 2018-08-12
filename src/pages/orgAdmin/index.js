import Component from '../../components/Component'
import ProductInfo from './ProductInfo'
import PartnerList from './PartnerList'
import OrderList from './OrderList'
import CreateOrder from './CreateOrder'
import OrderDetail from './OrderDetail'
import Container from '../../layouts/Container'
import {PERMISSIONS} from '../../settings/consts'

const {Route, Switch} = ReactRouterDOM

const NAV = {
    createOrg: ['机构管理', '创建机构'],
    orgList: ['机构管理', '机构列表'],
    orderList: ['机构管理', '订单列表']
}

const PartnerListWrapper = Container(NAV.orgList)(PartnerList)
const OrderListWrapper = Container(NAV.orderList)(OrderList)

const ROUTE = [
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

export default class OrgAdmin extends Component {
    render() {
        return (
            <Switch>
                {ROUTE.map(route => {
                    if (G.checkPermission(route.PERMISSIONS)) return <Route exact={route.exact} path={`${this.props.match.url}${route.path}`} component={route.component} />
                })}
            </Switch>
        )
    }
}
