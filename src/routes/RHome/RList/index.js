import { createRoute } from '@/utils/core';

import HomeLayout from '@/layouts/LHome/index';
import ListWithSwitch from './PListWithSwitch/route';
import NotFound from '../../RErrorPage/P404/route';

const routesConfig = () => ({
  path: '/list',
  component: HomeLayout,
  PERMISSIONS: true,
  childRoutes: [ListWithSwitch(), NotFound()],
});

export default () => createRoute(routesConfig);
