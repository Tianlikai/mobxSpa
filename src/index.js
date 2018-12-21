import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

/**
 * 全局函数
 */
import 'utils/G.js'; // eslint-disable-line

/**
 * mobx store
 */
import stores from './stores/index';

/**
 * 路由
 */
import createRoutes from './routes';

/**
 * 公共样式
 */
import './styles.scss';

const { HashRouter: Router } = ReactRouterDOM;

const Entry = () => (
  <Provider {...stores}>
    <Router>{createRoutes()}</Router>
  </Provider>
);

ReactDOM.render(<Entry />, document.querySelector('#root'));
