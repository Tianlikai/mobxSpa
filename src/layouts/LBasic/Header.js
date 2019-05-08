import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Dropdown, Menu, Button } from 'antd';

import Storage from '@/utils/storage';

import auth from '@/settings/headerConfig';
import './header.scss';

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
    // history: PropTypes.object,
  };

  // goToTargetPage = () => {
  //   const { currentAddress, AUTHORITY } = this.props;
  //   const key = currentAddress.split('/')[2];
  //   const { target } = AUTHORITY[key] || {};

  //   if (target) {
  //     let { state } = G.history.location || {};
  //     if (state) {
  //       state = { isBack: true, ...state };
  //     }
  //     const {
  //       history: { push },
  //     } = this.props;
  //     push({
  //       pathname: target,
  //       state,
  //     });
  //   } else {
  //     G.history.goBack();
  //   }
  // };

  handleAuthority = () => {
    const permissionList = Storage.get('permissionList') || [];
    return permissionList.indexOf(60003) >= 0 || false;
  };

  render() {
    const {
      logOut, currentAddress, AUTHORITY, username,
    } = this.props;
    const key = currentAddress.split('/')[2];
    const { pageTitle, btnText } = AUTHORITY[key] || {};
    const hadCreatePermission = this.handleAuthority(); // 是否有创建权限
    const menu = (
      <Menu onClick={logOut}>
        <MenuItem key="0">退出</MenuItem>
      </Menu>
    );
    return (
      <header className="LBasicHeader">
        {btnText && hadCreatePermission && (
          <Button
            className={key ? `${'create-order-'}${key}` : 'create-order'}
            onClick={this.goToTargetPage}
          >
            {btnText}
          </Button>
        )}
        {pageTitle && <div className="create-order-title">{pageTitle}</div>}
        <Dropdown overlay={menu}>
          <Button>{username}</Button>
        </Dropdown>
      </header>
    );
  }
}
