import api from './axios';
import Storage from './storage';

/* eslint-disable */
/**
 * 设置全局变量G
 */
// const createHistory = require('history/createHashHistory').default;
const createHistory = require('history/createBrowserHistory').default;

// const history = createHistory();
const history = createHistory({ basename: '' });
const location = history.location;

const G = {
  api,
  history,
  location,
  gotoSignIn,
  setUpUser,
  getQuery,
  encodeQuery,
  setReturnParams,
  getReturnParams,
  updateReturnParams,
  delReturnParams,
  checkPermission,
};

function gotoSignIn() {
  G.history.push('/signIn');
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

function setReturnParams(key, params) {
  if (params) Storage.set(key, params);
}

function getReturnParams(key) {
  const returnParams = Storage.get(key) || null;
  return returnParams;
}

function updateReturnParams(key) {
  const returnParams = Storage.get(key) || null;
  if (returnParams) {
    returnParams.effective = true;
    Storage.set(key, returnParams);
  }
}

function delReturnParams(key) {
  Storage.del(key);
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
