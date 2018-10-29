const { Switch, Redirect, Route } = ReactRouterDOM

/**
 * 生成一组路由
 * @param {*} routesConfig
 */
export const createRoutes = routesConfig => {
    return (
        <Switch>
            {routesConfig().map(config => {
                return createRoute(() => config)
            })}
        </Switch>
    )
}

/**
 * 生成单个路由
 * @param {*} app
 * @param {*} routesConfig
 */
export const createRoute = (app, routesConfig) => {
    const routesResult = routesConfig(app)
    const {
        component: Comp,
        path,
        indexRoute,
        title,
        ...otherProps
    } = routesResult
    if (path && path !== '/') {
        window.dva_router_pathMap[path] = { path, title, ...otherProps }
    }
    const routeProps = Object.assign(
        {
            key: path,
            render: props => <Comp routerData={otherProps} {...props} />
        },
        path && {
            path: path
        }
    )

    if (indexRoute) {
        return [
            <Redirect
                key={path + '_redirect'}
                exact
                from={path}
                to={indexRoute}
            />,
            <Route {...routeProps} />
        ]
    }
    return <Route {...routeProps} />
}
