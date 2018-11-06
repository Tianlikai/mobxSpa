import Loadable from 'react-loadable'

import { createRoute } from 'utils/core'
const Spinner = () => null

const routesConfig = () => ({
    path: '/home',
    PERMISSIONS: true,
    component: Loadable({
        loader: () => import('./component'),
        loading: Spinner
    })
})

export default () => createRoute(routesConfig)
