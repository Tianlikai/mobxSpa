import Component from '../../components/Component'
import OrgLogs from './OrgLogs'
import OrderLogs from './OrderLogs'
import Container from '../../layouts/Container'
import {PERMISSIONS} from '../../config'

const {Route, Switch} = ReactRouterDOM

const NAV = {
    orgLogs: ['操作日志', '机构'],
    orderLogs: ['操作日志', '订单']
}

const OrgLogsWrapper = Container(NAV.orgLogs)(OrgLogs)
const OrderLogsWrapper = Container(NAV.orderLogs)(OrderLogs)

const ROUTE = [
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

export default class Logs extends Component {
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
