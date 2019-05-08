import { createRoute } from '@/utils/core';

import HomeLayout from '@/layouts/LHome/index';
import BaseDetail from './PBaseDetail/route';
import NotFound from '../../RErrorPage/P404/route';

const routesConfig = () => ({
  path: '/detail',
  component: HomeLayout,
  PERMISSIONS: true,
  childRoutes: [BaseDetail(), NotFound()],
});

export default () => createRoute(routesConfig);
