import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Menu } from 'antd';

import SIDE_MENU from '@/settings/sideMenu';

import Logo from './logo.svg';

import './sideMenu.scss';

const { Item, SubMenu } = Menu;

export default class SideMenu extends Component {
  static propTypes = {
    selectedKeys: PropTypes.string,
  };

  state = {
    openKeys: [],
  };
  // constructor(props) {
  //   super(props);
  //   const { selectedKeys } = this.props;
  //   const openKeys = [selectedKeys.split('/')[1]];
  //   this.state = {
  //     openKeys,
  //   };
  // }

  static getDerivedStateFromProps(props, state) {
    const { selectedKeys } = props;
    const openKey = selectedKeys.split('/')[1];
    if (state.openKeys.indexOf(openKey) < 0) {
      return {
        openKeys: state.openKeys.concat(openKey),
      };
    }
    return null;
  }

  // 对menu配置做一个权限的校验
  // 这里有个问题，只过滤了第一层级的权限
  // 更深层级的放在了render函数里面进行过滤
  // 目前是优化后的函数
  get menu() {
    const filterPermission = configList => configList.reduce((state, payload) => {
      if (payload.PERMISSIONS) {
        state.push({
          ...payload,
          children: payload.children !== undefined
            ? filterPermission(payload.children)
            : [],
        });
      }
      return state;
    }, []);
    return filterPermission(SIDE_MENU);
  }

  get selectedKeys() {
    const { selectedKeys } = this.props;
    const detailRoute = SIDE_MENU.find(item => item.key === 'detail');
    return selectedKeys.indexOf('/detail/baseDetail/') >= 0
      ? [detailRoute.children[0].to]
      : [selectedKeys];
  }

  handleOpenChange = (openKeys) => {
    this.setState({
      openKeys,
    });
  };

  render() {
    const { openKeys } = this.state;

    const menuProps = {
      mode: 'inline',
      theme: 'dark',
      openKeys,
      selectedKeys: this.selectedKeys,
      onClick: this.handleClick,
      onOpenChange: this.handleOpenChange,
    };
    return (
      <aside className="LBasicSideMenu">
        <div className="logo">
          <img src={Logo} alt="logo" />
          <span> ~~~~</span>
        </div>
        <Menu {...menuProps}>
          {this.menu.map(route => {
            const title = (
              <span>
                {route.iconType}
                <span>{route.text}</span>
              </span>
            );
            if (route.children && route.children.length <= 0) {
              return (
                <Item key={route.to}>
                  <Link to={route.to}>
                    {route.iconType}
                    {route.text}
                  </Link>
                </Item>
              );
            }
            return (
              <SubMenu key={route.key} title={title}>
                {route.children.map((item) => (
                  <Item key={item.to}>
                    <Link to={item.to}>{item.text}</Link>
                  </Item>
                ))}
              </SubMenu>
            );
          })}
        </Menu>
      </aside>
    );
  }
}
