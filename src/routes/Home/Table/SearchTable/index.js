import Loadable from 'react-loadable'

import { createRoute } from 'libs/core'

const Spinner = () => null
const routesConfig = () => ({
    path: '/table/searchTable',
    PERMISSIONS: true,
    config: ['论答CRM', '短信通知', '发送短信'],
    component: Loadable({
        loader: () => import('./component'),
        loading: Spinner
    })
})

export default () => createRoute(routesConfig)
