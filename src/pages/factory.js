import Component from 'components/Component'

const { Route, Switch } = ReactRouterDOM

const routeFactory = config => {
    class Template extends Component {
        render() {
            return (
                <Switch>
                    {config.map(route => {
                        if (G.checkPermission(route.PERMISSIONS)) {
                            return (
                                <Route
                                    exact={route.exact}
                                    path={`${this.props.match.url}${
                                        route.path
                                    }`}
                                    component={route.component}
                                />
                            )
                        }
                    })}
                </Switch>
            )
        }
    }
    return Template
}

export default routeFactory
