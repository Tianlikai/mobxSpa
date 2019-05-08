import { createRoute } from '@/utils/core';

import HomeLayout from '@/layouts/LHome/index';
import SearchTable from './PSearchTable/route';
import NotFound from '../../RErrorPage/P404/route';

const routesConfig = () => ({
  path: '/table',
  component: HomeLayout,
  PERMISSIONS: true,
  childRoutes: [SearchTable(), NotFound()],
});

export default () => createRoute(routesConfig);
