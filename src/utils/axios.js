import axios from 'axios';
import { message } from 'antd';
import api from '../settings/api';

/* eslint-disable */
for (const key in api) {
  api[key] = fetch.bind(null, api[key]);
}

console.log('__TARGET__', __TARGET__);

const Axios = axios.create({
  baseURL: __TARGET__ === 'dev' ? '__api' : 'https://yourIp.cn' + '/__api',
  timeout: 30000,
  withCredentials: false,
  responseType: '',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});

Axios.interceptors.request.use(
  config => {
    const token = G.token;

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  error => {
    message.error(
      `【Axios.interceptors.request】error.data.error.message:${error.data.error.message}`,
      3,
    );
  },
);

function fetch(options, urlOptions) {
  options = Object.assign({}, options, urlOptions);
  if (options.urlParams) {
    options.url = replaceParams(options.url, options.urlParams);
  }
  return new Promise((resolve, reject) => {
    Axios(options)
      .then(response => {
        const { code, data } = response.data;

        if (code === '0' && data) {
          resolve(data);
        } else if (code && code !== '0') {
          reject(response.data);
        } else {
          resolve(response.data);
        }
        // console.log('axios data', data)
      })
      .catch(e => {
        console.error('error', e);
        if (e.response.status === 401) {
          // Storage.del('token')
          G.gotoSignIn();
        }
        reject(e.response.data);
      });
  });
}

function replaceParams(url, urlParams) {
  const urlReplaceKeys = getMathKeys(url, []);

  for (let i = 0; i < urlReplaceKeys.length; i++) {
    const key = urlReplaceKeys[i];

    url = url.replace(`{${key}}`, urlParams[key]);
  }

  return url;
}

function getMathKeys(url, matchKeys) {
  const reg = /\{(\w+)\}/g;
  let urlReplaceKeys = reg.exec(url);
  while (urlReplaceKeys) {
    matchKeys.push(urlReplaceKeys[1]);
    urlReplaceKeys = reg.exec(url);
  }

  return matchKeys;
}

export default api;
