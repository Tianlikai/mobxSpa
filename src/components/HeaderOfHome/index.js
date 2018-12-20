import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Dropdown, Menu, Button } from 'antd';
import Storage from 'utils/storage'; // eslint-disable-line

import auth from '../../settings/headerConfig';
import './style.scss';

const MenuItem = Menu.Item;

export default class Header extends Component {
  static defaultProps = {
    AUTHORITY: auth,
    username: '匿名用户',
  };

  static propTypes = {
    username: PropTypes.string,
    currentAddress: PropTypes.string,
    AUTHORITY: PropTypes.object,
    logOut: PropTypes.func,
  };

  goToTargetPage = (target) => {
    if (target) {
      let { state } = G.history.location || {};
      if (state) {
        state = { isBack: true, ...state };
      }
      G.history.push({
        pathname: target,
        state,
      });
    } else {
      G.history.goBack();
    }
  };

  handleAuthority = () => {
    const permissionList = Storage.get('permissionList') || [];
    return permissionList.indexOf(60003) >= 0 || false;
  };

  render() {
    const {
      logOut, currentAddress, AUTHORITY, username,
    } = this.props;
    const key = currentAddress.split('/')[2];
    const { pageTitle, btnText, target } = AUTHORITY[key] || {};
    const hadCreatePermission = this.handleAuthority(); // 是否有创建权限
    const menu = (
      <Menu onClick={logOut}>
        <MenuItem key="0">退出</MenuItem>
      </Menu>
    );
    return (
      <div className="header">
        {btnText && hadCreatePermission && (
          <Button
            className={key ? `${'create-order-'}${key}` : 'create-order'}
            onClick={this.goToTargetPage.bind(null, target)}
          >
            {btnText}
          </Button>
        )}
        {pageTitle && <div className="create-order-title">{pageTitle}</div>}
        <Dropdown overlay={menu}>
          <a>{username}</a>
        </Dropdown>
      </div>
    );
  }
}
