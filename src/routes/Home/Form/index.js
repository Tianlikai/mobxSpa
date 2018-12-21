import { createRoute } from 'utils/core'; // eslint-disable-line

import Container from '../../../layouts/Container';
import BaseForm from './BaseForm';
import NotFound from '../../ErrorPage/404';

const routesConfig = () => ({
  path: '/form',
  component: Container,
  PERMISSIONS: true,
  childRoutes: [BaseForm(), NotFound()],
});

export default () => createRoute(routesConfig);
