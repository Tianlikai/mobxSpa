import { createRoutes } from 'utils/core'; // eslint-disable-line

import SignIn from './Login';

import Dashboard from './Home/Dashboard';
import Detail from './Home/Detail';
import Form from './Home/Form';
import Table from './Home/Table';
import NotFound from './ErrorPage/404';

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
    childRoutes: [Dashboard(), Detail(), Form(), Table(), NotFound()],
  },
];

export default () => createRoutes(routesConfig);
