import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import Storage from '@/utils/storage';

import FlexLayout from '../component/FlexLayout/index';
import Header from './Header';
import SideMenu from './SideMenu';
import Footer from './Footer';

import './index.scss';

const { Switch } = ReactRouterDOM;

@inject('User')
@observer
class BasicLayout extends Component {
  static propTypes = {
    User: PropTypes.object.isRequired,
    routerData: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object,
  };

  componentDidMount() {
    const token = Storage.get('token');
    const username = Storage.get('username');
    if (!token) {
      const {
        history: { replace },
      } = this.props;
      replace('/signIn');
    } else {
      G.setUpUser({ token });
      const { User } = this.props;
      User.setUserInfo({ name: username });
      User.getArea();
    }
  }

  logOut = () => {
    const {
      User,
      history: { replace },
      location: { pathname },
    } = this.props;
    User.logOut();
    replace({
      pathname: '/signIn',
      search: `?from=${pathname}`,
    });
  };

  render() {
    const {
      routerData,
      location: { pathname },
    } = this.props;
    const { childRoutes } = routerData;

    return (
      <FlexLayout className="LBasic">
        <SideMenu selectedKeys={pathname} />
        <FlexLayout>
          <Header
            logOut={this.logOut}
            currentAddress={pathname}
            username={Storage.get('username')}
          />
          <Switch>{childRoutes}</Switch>
          <Footer />
        </FlexLayout>
      </FlexLayout>
    );
  }
}

export default BasicLayout;
