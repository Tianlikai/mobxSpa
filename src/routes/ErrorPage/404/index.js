import { createRoute } from 'libs/core'

import NotFound from './component'

const routesConfig = () => ({
    component: NotFound,
    PERMISSIONS: true
})

export default () => createRoute(routesConfig)
