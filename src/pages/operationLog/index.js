import Component from 'components/Component'
import {ROUTE_OPERATIONLOG} from '../../settings/routeAndPermissions'

const {Route, Switch} = ReactRouterDOM

export default class Logs extends Component {
    render() {
        return (
            <Switch>
                {ROUTE_OPERATIONLOG.map(route => {
                    if (G.checkPermission(route.PERMISSIONS)) {
                        return <Route
                            exact={route.exact}
                            path={`${this.props.match.url}${route.path}`}
                            component={route.component} />
                    }
                })}
            </Switch>
        )
    }
}
