import { createRoute } from '@/utils/core';

import NotFound from './index';

const routesConfig = () => ({
  component: NotFound,
  PERMISSIONS: true,
});

export default () => createRoute(routesConfig);
