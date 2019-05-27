import Loadable from 'react-loadable';

import { createRoute } from 'utils/core'; // eslint-disable-line

const Spinner = () => null;
const routesConfig = () => ({
  path: '/list/tabList',
  PERMISSIONS: true,
  config: ['Admin', '列表页', '卡片表格切换'],
  component: Loadable({
    loader: () => import('./component/index'),
    loading: Spinner,
  }),
});

export default () => createRoute(routesConfig);
