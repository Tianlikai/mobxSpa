import { createRoute } from 'utils/core'

import NotFound from './component'

const routesConfig = () => ({
    component: NotFound,
    PERMISSIONS: true
})

export default () => createRoute(routesConfig)
