import { createRoute } from 'utils/core'; // eslint-disable-line

import Container from '../../../layouts/Container';
import SearchTable from './SearchTable/index';
import NotFound from '../../ErrorPage/404/index';

const routesConfig = () => ({
  path: '/table',
  component: Container,
  PERMISSIONS: true,
  childRoutes: [SearchTable(), NotFound()],
});

export default () => createRoute(routesConfig);
