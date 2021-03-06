import Loadable from 'react-loadable';

import { createRoute } from '@/utils/core';

const Spinner = () => null;
const routesConfig = () => ({
  path: '/table/searchTable',
  PERMISSIONS: true,
  config: ['Admin', '表格页', '查询表格'],
  component: Loadable({
    loader: () => import('./index'),
    loading: Spinner,
  }),
});

export default () => createRoute(routesConfig);
