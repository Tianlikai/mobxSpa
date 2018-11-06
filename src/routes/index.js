import SignIn from './Login'

import Dashboard from './Home/Dashboard'
import Table from './Home/Table'
import NotFound from './ErrorPage/404'

import BasicLayout from '../layouts/BasicLayout'
import { createRoutes } from './../libs/core'

const routesConfig = () => [
    {
        path: '/signin',
        exact: true,
        PERMISSIONS: true,
        component: SignIn
    },
    {
        path: '/',
        exact: false,
        PERMISSIONS: true,
        component: BasicLayout,
        indexRoute: '/home',
        childRoutes: [Dashboard(), Table(), NotFound()]
    }
]

export default () => {
    return createRoutes(routesConfig)
}
