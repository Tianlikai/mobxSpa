import { createRoute } from 'utils/core'; // eslint-disable-line

import NotFound from './component';

const routesConfig = () => ({
  component: NotFound,
  PERMISSIONS: true,
});

export default () => createRoute(routesConfig);
