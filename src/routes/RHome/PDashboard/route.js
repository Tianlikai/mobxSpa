import Loadable from 'react-loadable';

import { createRoute } from '@/utils/core';

const Spinner = () => null;

const routesConfig = () => ({
  path: '/home',
  PERMISSIONS: true,
  component: Loadable({
    loader: () => import('./index'),
    loading: Spinner,
  }),
});

export default () => createRoute(routesConfig);
