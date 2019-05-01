import axios from 'axios';
import qs from 'qs';

import user from './user';
import table from './table';
import form from './form';
import list from './list';
import detail from './detail';

const instance = axios.create({
  baseURL: __TARGET__ === 'development' ? '__api' : 'https://yourIp.cn/__api',
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
      G.gotoSignIn();
    } else {
      Promise.reject(err);
    }
  },
);

const instanceOnline = axios.create({
  baseURL: __TARGET__ === 'dedevelopmentv' ? '/__online' : 'https://yourIp.cn/__api',
  timeout: 30000,
  withCredentials: false,
  responseType: '',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});

instanceOnline.interceptors.request.use(
  (config) => {
    const { token } = G;
    // eslint-disable-next-line
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    if (token) config.headers.Authorization = 'Bearer d29b50a3-ba28-3485-9049-5a2b04ce2ef3';

    return config;
  },
  err => Promise.reject(err),
);

instanceOnline.interceptors.response.use(
  (resp) => {
    const {
      data: { code, data },
    } = resp;
    if (code === '0' && data) {
      return Promise.resolve(data);
    }
    if (code && code !== '0') {
      return Promise.reject(data);
    }
    return Promise.resolve(resp.data);
  },
  (err) => {
    const {
      response: { status },
    } = err;
    if (status === 401) {
      G.gotoSignIn();
    } else {
      Promise.reject(err);
    }
  },
);

class Service {
  constructor(userInfo, ins) {
    this.userInfo = userInfo;
    this.ins = ins;
    if (userInfo && userInfo.clientId) {
      this.userInfo.device_id = userInfo.clientId;
    }
  }

  get(url, config = {}) {
    const params = Object.assign({}, this.userInfo, config.params);
    return this.ins.get(url, {
      ...config,
      params,
    });
  }

  post(url, data, config = {}) {
    const DATA = Object.assign({}, this.userInfo, data);

    return this.ins.post(url, DATA, config);
  }

  put(url, data, config = {}) {
    const DATA = Object.assign({}, this.userInfo, data);

    return this.ins.put(url, qs.stringify(DATA), config);
  }

  delete(url, config = {}) {
    const params = Object.assign({}, this.userInfo, config.params);

    return this.ins.delete(url, {
      ...config,
      params,
    });
  }

  setUserInfo(userInfo) {
    this.userInfo = userInfo;
  }
}

Object.assign(Service.prototype, user, table, form, list, detail);

export default new Service(null, instance);

const ApiOnline = new Service(null, instanceOnline);
export { ApiOnline };
