import { createRoute } from 'utils/core'; // eslint-disable-line

import Container from '../../../layouts/Container';
import ListWithSwitch from './ListWithSwitch/index';
import NotFound from '../../ErrorPage/404/index';

const routesConfig = () => ({
  path: '/list',
  component: Container,
  PERMISSIONS: true,
  childRoutes: [ListWithSwitch(), NotFound()],
});

export default () => createRoute(routesConfig);
