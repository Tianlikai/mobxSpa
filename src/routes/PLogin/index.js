import React, { Component } from 'react';
import qs from 'qs';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { observer, inject } from 'mobx-react';

import SignInForm from './SignInForm';
import BasicFooter from '../../layouts/LBasic/Footer';

import './style.scss';

@inject('User')
@observer
export default class SignIn extends Component {
  static propTypes = {
    User: PropTypes.string,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  onSubmit = (values) => {
    const { username, password } = values;
    const { User } = this.props;
    User.signIn({ username, password }, () => {
      const {
        history: { replace },
        location: { search },
      } = this.props;
      const { from } = qs.parse(search.substr(1));
      replace(`${from}`);
    });
  };

  render() {
    return (
      <div className="PSignIn">
        <Helmet>
          <title>登录 - SPA</title>
          <meta name="description" content="SPA" />
        </Helmet>
        <div className="header" />
        <div className="content">
          <div className="logo">
            <div className="title">Backstage management</div>
          </div>
          <SignInForm onSubmit={this.onSubmit} />
        </div>
        <BasicFooter className="footer" />
      </div>
    );
  }
}
