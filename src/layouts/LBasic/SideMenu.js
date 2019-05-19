import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Menu, Icon } from 'antd';

import SIDE_MENU from '@/settings/sideMenu';

import Logo from './logo.svg';

import './sideMenu.scss';

const { Item, SubMenu } = Menu;

export default class SideMenu extends Component {
  static propTypes = {
    selectedKeys: PropTypes.string,
  };

  constructor(props) {
    super(props);
    const { selectedKeys } = this.props;
    const openKeys = [selectedKeys.split('/')[1]];
    this.state = {
      openKeys,
    };
  }

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

  get menu() {
    const SHOW_SIDE_MENU = {};
    Object.keys(SIDE_MENU).map((key) => {
      const menu = SIDE_MENU[key];
      if (G.checkPermission(menu.PERMISSIONS)) {
        SHOW_SIDE_MENU[key] = menu;
      }
    });
    return SHOW_SIDE_MENU;
  }

  handleOpenChange = (openKeys) => {
    this.setState({
      openKeys,
    });
  };

  render() {
    const { selectedKeys } = this.props;
    const { openKeys } = this.state;
    const menuProps = {
      mode: 'inline',
      theme: 'dark',
      openKeys,
      selectedKeys:
        selectedKeys.indexOf('/detail/baseDetail/') >= 0
          ? [SIDE_MENU.detail.children[0].to]
          : [selectedKeys],
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
          {Object.keys(this.menu).map((key) => {
            const title = (
              <span>
                <Icon type={this.menu[key].iconType} />
                <span>{this.menu[key].text}</span>
              </span>
            );
            if (this.menu[key].children && this.menu[key].children.length <= 0) {
              return (
                <Item key={this.menu[key].to}>
                  <Link to={this.menu[key].to}>
                    <Icon type={this.menu[key].iconType} />
                    {this.menu[key].text}
                  </Link>
                </Item>
              );
            }
            return (
              <SubMenu key={key} title={title}>
                {this.menu[key].children.map((item) => {
                  if (G.checkPermission(item.PERMISSIONS)) {
                    return (
                      <Item key={item.to}>
                        <Link to={item.to}>{item.text}</Link>
                      </Item>
                    );
                  }
                  return null;
                })}
              </SubMenu>
            );
          })}
        </Menu>
      </aside>
    );
  }
}
