import Storage from './storage';

/* eslint-disable */
/**
 * 设置全局变量G
 */
let history;

if (__ROUTER__ === 'BrowserRouter') {
  const createHistory = require("history").createBrowserHistory;
  history = createHistory({ basename: __BASENAME__ });
} else {
  const createHistory = require("history").createHashHistory;
  history = createHistory();
}

const G = {
  history,
  gotoSignIn,
  setUpUser,
  getQuery,
  encodeQuery,
  checkPermission,
};

function gotoSignIn() {
  const {
    location: { pathname },
  } = window;
  G.history.replace({
    pathname: '/signIn',
    search: `?from=${pathname}`,
  });
  if (__ROUTER__ === 'BrowserRouter') {
    // BrowserRouter 的history没有对外暴露
    // mobx操作了shouldComponentUpdate方法和 react-router 冲突
    // 导致页面不会刷新
    // 在这里强制刷新登录页面
    setTimeout(() => {
      window.location.reload();
    }, 0);
  }
}

function setUpUser(data) {
  const { token } = data;
  G.token = token;
}

function getQuery() {
  const href = window.location.href;
  const result = {};
  const regKey = /(\w+)=/g;
  const regValue = /=((\w|[\u4e00-\u9fa5]|%)+)/g;
  let key = regKey.exec(href);
  while (key) {
    const k = key[1];
    const v = regValue.exec(href);
    result[k] = v[1];
    key = regKey.exec(href);
  }
  return result;
}

function encodeQuery(params) {
  let result = '';
  if (!params) {
    return;
  }
  result = '?';
  Object.keys(params)
    .filter(k => !!params[k])
    .forEach((p, idx) => {
      if (idx !== 0) {
        result += '&';
      }
      result = `${result + p}=${params[p]}`;
    });
  return result;
}

function checkPermission(hadPermissionList) {
  if (
    Object.prototype.toString.call(hadPermissionList) === '[object Boolean]' &&
    hadPermissionList
  ) {
    return true;
  }
  const permissionList = Storage.get('permissionList') || [];
  const permissions = hadPermissionList.findIndex(p => permissionList.indexOf(p) >= 0);
  return permissions >= 0;
}

window.G = G;
