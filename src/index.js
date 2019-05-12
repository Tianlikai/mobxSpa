import React from 'react';
import dayJs from 'dayjs';
import weekYear from 'dayjs/plugin/weekYear';
import isMoment from 'dayjs/plugin/isMoment';
import badMutable from 'dayjs/plugin/badMutable';
import localeData from 'dayjs/plugin/localeData';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import customParseFormat from 'dayjs/plugin/customParseFormat';

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

dayJs.extend(weekYear);
dayJs.extend(isMoment);
dayJs.extend(localeData);
dayJs.extend(badMutable);
dayJs.extend(weekOfYear);
dayJs.extend(isSameOrAfter);
dayJs.extend(advancedFormat);
dayJs.extend(isSameOrBefore);
dayJs.extend(customParseFormat);
dayJs.locale('zh-cn');

const { Provider } = MobxReact;
const { BrowserRouter: Router } = ReactRouterDOM;

const Entry = () => (
  <Provider {...stores}>
    <Router basename={__BASENAME__}>{createRoutes()}</Router>
  </Provider>
);

ReactDOM.render(<Entry />, document.querySelector('#root'));
