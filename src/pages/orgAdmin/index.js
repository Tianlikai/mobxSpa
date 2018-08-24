import Component from 'components/Component'
import { ROUTE_ORGADMIN } from '../../settings/routeAndPermissions'

const { Route, Switch } = ReactRouterDOM

export default class OrgAdmin extends Component {
    render() {
        return (
            <Switch>
                {ROUTE_ORGADMIN.map(route => {
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
