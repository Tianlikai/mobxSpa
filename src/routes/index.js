import { createRoutes } from '@/utils/core';

import SignIn from './PLogin/index';
import Dashboard from './RHome/PDashboard/route';
import Form from './RHome/RForm/index';
import Table from './RHome/RTable/index';
import List from './RHome/RList/index';
import Detail from './RHome/RDetail/index';
import NotFound from './RErrorPage/P404/route';

import BasicLayout from '@/layouts/LBasic/index';

const routesConfig = () => [
  {
    path: '/signIn',
    exact: true,
    PERMISSIONS: true,
    component: SignIn,
  },
  {
    path: '/',
    exact: true,
    PERMISSIONS: true,
    component: BasicLayout,
    indexRoute: '/home',
    childRoutes: [Dashboard(), Form(), Table(), List(), Detail(), NotFound()],
  },
];

export default () => createRoutes(routesConfig);
