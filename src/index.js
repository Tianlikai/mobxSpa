import React from 'react';
import dayJs from 'dayjs';
import 'dayjs/locale/zh-cn';

/**
 * 全局函数
 */
import '@/utils/G';

/**
 * mobx store
 */
import stores from './stores/index';

/**
 * 路由
 */
import createRoutes from './routes/index';

/**
 * 公共样式
 */
import './styles.scss';

dayJs.locale('zh-cn');

const { Provider } = MobxReact;
const { BrowserRouter: Router } = ReactRouterDOM;

const Entry = () => (
  <Provider {...stores}>
    <Router basename={__BASENAME__}>{createRoutes()}</Router>
  </Provider>
);

ReactDOM.render(<Entry />, document.querySelector('#root'));
