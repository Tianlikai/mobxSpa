import { createRoute } from 'utils/core'

import Container from '../../../layouts/Container'
import BaseDetail from './BaseDetail'
import NotFound from '../../ErrorPage/404'

const routesConfig = () => ({
    path: '/detail',
    component: Container,
    PERMISSIONS: true,
    childRoutes: [BaseDetail(), NotFound()]
})

export default () => createRoute(routesConfig)
