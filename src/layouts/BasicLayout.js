import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import Storage from 'utils/storage'; // eslint-disable-line

import Layout from './Layout';
import BasicFooter from './BasicFooter';
import SideMenu from './BasicSideMenu';
import Header from './BasicHeader';

import './styles/BasicLayout.scss';

const { Switch } = ReactRouterDOM;
const { LayoutSide } = Layout;

@inject('User')
@observer
export default class Home extends Component {
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

    const style = { flexDirection: 'row' };
    return (
      <Layout style={style} className="home">
        <LayoutSide className="menu">
          <SideMenu selectedKeys={pathname} />
        </LayoutSide>
        <Layout>
          <Header
            logOut={this.logOut}
            currentAddress={pathname}
            username={Storage.get('username')}
          />
          <Switch>{childRoutes}</Switch>
          <BasicFooter />
        </Layout>
      </Layout>
    );
  }
}
