import { createRoute } from 'utils/core'; // eslint-disable-line

import Container from '../../../layouts/Container';
import BaseDetail from './BaseDetail';
import NotFound from '../../ErrorPage/404';

const routesConfig = () => ({
  path: '/detail',
  component: Container,
  PERMISSIONS: true,
  childRoutes: [BaseDetail(), NotFound()],
});

export default () => createRoute(routesConfig);
