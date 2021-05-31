import { action, observable, flow } from 'mobx';
import Storage from '@/utils/storage';
import { Modal } from 'antd';

import api from '../api/index';


class User {
  @observable
  username = null;

  @observable
  count = 0;

  @observable
  sid = null;

  @observable
  area = null;

  @action
  signIn = flow(function* singInAction(data, callback) {
    try {
      const resp = yield api.signIn(data);
      this.setUserInfo(resp);
      const permissionList = this.saveUserInfo(resp);
      callback(permissionList);
    } catch (error) {
      Modal.error({
        title: error.message,
      });
    }
  })

  @action
  setUserInfo(data) {
    this.username = data.name;
  }

  @action
  saveUserInfo(data) {
    const {
      user: { roleOperations },
    } = data;
    const permissionList = []; // 目前对读写权限做处理
    if (roleOperations) {
      roleOperations.forEach((element) => {
        if (element.state === 2) {
          permissionList.push(element.operationId);
        }
      });
    }
    G.setUpUser({ token: data.access_token });
    Storage.set('token', data.access_token);
    Storage.set('expires_date', data.expires_in + Date.now());
    Storage.set('username', data.user.name);
    Storage.set('permissionList', permissionList);
    return permissionList;
  }

  @action
  logOut() {
    this.username = null;
    Storage.del('token');
    Storage.del('expires_date');
    Storage.del('username');
    Storage.del('permissionList');
  }

  @action
  setIntervalSMS() {
    this.count = 60;
    this.sid = setInterval(() => {
      this.count -= 1;
      if (this.count === 0) clearInterval(this.sid);
    }, 1000);
  }

  @action
  clearIntervalSMS() {
    this.count = 0;
    clearInterval(this.sid);
  }

  @action
  getArea() {
    const area = Storage.get('area') || null;
    if (!area) {
      api.getArea().then((data) => {
        Storage.set('area', data);
        this.area = data;
      });
    } else {
      this.area = area;
    }
  }
}

export default new User();
