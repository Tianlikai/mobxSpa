import { createRoute } from '@/utils/core';

import HomeLayout from '@/layouts/LHome/index';
import BaseForm from './PBaseForm/route';
import UploadForm from './PUploadForm/route';
import NotFound from '../../RErrorPage/P404/route';

const routesConfig = () => ({
  path: '/form',
  component: HomeLayout,
  PERMISSIONS: true,
  childRoutes: [BaseForm(), UploadForm(), NotFound()],
});

export default () => createRoute(routesConfig);
