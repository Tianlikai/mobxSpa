import { createRoutes } from 'utils/core'; // eslint-disable-line

import SignIn from './Login/index';

import Dashboard from './Home/Dashboard/index';
import Form from './Home/Form/index';
import Table from './Home/Table/index';
import List from './Home/List/index';
import Detail from './Home/Detail/index';
import NotFound from './ErrorPage/404/index';

import BasicLayout from '../layouts/BasicLayout';

const routesConfig = () => [
  {
    path: '/signIn',
    exact: true,
    PERMISSIONS: true,
    component: SignIn,
  },
  {
    path: '/',
    exact: false,
    PERMISSIONS: true,
    component: BasicLayout,
    indexRoute: '/home',
    childRoutes: [Dashboard(), Form(), Table(), List(), Detail(), NotFound()],
  },
];

export default () => createRoutes(routesConfig);
