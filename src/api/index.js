import axios from 'axios';
import qs from 'qs';

import user from './user';
import table from './table';

const instance = axios.create({
  baseURL: __TARGET__ === 'dev' ? '__api' : 'https://yourIp.cn/__api',
  timeout: 30000,
  withCredentials: false,
  responseType: '',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});

instance.interceptors.request.use(
  (config) => {
    const { token } = G;
    // eslint-disable-next-line
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  err => Promise.reject(err),
);

instance.interceptors.response.use(
  (resp) => {
    const {
      data: { code, data },
    } = resp;
    if (code === '0' && data) {
      return data;
    }
    if (code && code !== '0') {
      return Promise.reject(data);
    }
    return data;
  },
  (err) => {
    const {
      response: { status },
    } = err;
    if (status === 401) {
      // eslint-disable-next-line
      G.gotoSignIn();
    } else {
      Promise.reject(err);
    }
  },
);

class Service {
  constructor(userInfo) {
    this.userInfo = userInfo;
    if (userInfo && userInfo.clientId) {
      this.userInfo.device_id = userInfo.clientId;
    }
  }

  get(url, config = {}) {
    const params = Object.assign({}, this.userInfo, config.params);
    return instance.get(url, {
      ...config,
      params,
    });
  }

  post(url, data, config = {}) {
    const DATA = Object.assign({}, this.userInfo, data);

    return instance.post(url, DATA, config);
  }

  put(url, data, config = {}) {
    const DATA = Object.assign({}, this.userInfo, data);

    return instance.put(url, qs.stringify(DATA), config);
  }

  delete(url, config = {}) {
    const params = Object.assign({}, this.userInfo, config.params);

    return instance.delete(url, {
      ...config,
      params,
    });
  }

  setUserInfo(userInfo) {
    this.userInfo = userInfo;
  }
}

Object.assign(Service.prototype, user, table);

export default new Service();
