import Loadable from 'react-loadable';

import { createRoute } from '@/utils/core';

const Spinner = () => null;
const routesConfig = () => ({
  path: '/form/baseForm',
  PERMISSIONS: true,
  config: ['Admin', '表单页', '基础表单'],
  component: Loadable({
    loader: () => import('./index'),
    loading: Spinner,
  }),
});

export default () => createRoute(routesConfig);
