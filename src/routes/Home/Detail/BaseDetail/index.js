import Loadable from 'react-loadable';

import { createRoute } from 'utils/core'; // eslint-disable-line

const Spinner = () => null;
const routesConfig = () => ({
  path: '/detail/baseDetail/:id',
  PERMISSIONS: true,
  config: ['Admin', '详情页', '基础详情页'],
  component: Loadable({
    loader: () => import('./component/index'),
    loading: Spinner,
  }),
});

export default () => createRoute(routesConfig);
