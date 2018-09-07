import Component from 'components/Component'
import { ROUTE_MYAGENT } from '../../settings/routeAndPermissions'

const { Route, Switch } = ReactRouterDOM

export default class OrgAdmin extends Component {
    render() {
        return (
            <Switch>
                {ROUTE_MYAGENT.map(route => {
                    // 同Home.js
                    // 由于react-router4 所有的路由即组件
                    // 新建子模块时若要结合权限处理
                    // 需要进行写像这样的遍历函数

                    // 如果你有很好的方法希望能分享给我

                    if (G.checkPermission(route.PERMISSIONS)) {
                        return (
                            <Route
                                exact={route.exact}
                                path={`${this.props.match.url}${route.path}`}
                                component={route.component}
                            />
                        )
                    }
                })}
            </Switch>
        )
    }
}
