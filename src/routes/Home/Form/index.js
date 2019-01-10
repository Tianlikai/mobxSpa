import { createRoute } from 'utils/core'; // eslint-disable-line

import Container from '../../../layouts/Container';
import BaseForm from './BaseForm/index';
import NotFound from '../../ErrorPage/404/index';

const routesConfig = () => ({
  path: '/form',
  component: Container,
  PERMISSIONS: true,
  childRoutes: [BaseForm(), NotFound()],
});

export default () => createRoute(routesConfig);
