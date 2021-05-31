import React, { Component } from 'react';
import qs from 'qs';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { observer, inject } from 'mobx-react';

import BasicFooter from '@/layouts/LBasic/Footer';
import SignInForm from './SignInForm';

import './style.scss';

const PREFIX = `${__PROJECT__}PSignIn`;

@inject('User')
@observer
class SignIn extends Component {
  static propTypes = {
    User: PropTypes.object,
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
      const { from = 'home' } = qs.parse(search.substr(1));
      replace(`${from}`);
    });
  };

  render() {
    return (
      <div className={PREFIX}>
        <Helmet>
          <title>登录 - SPA</title>
          <meta name="description" content="SPA" />
        </Helmet>
        <header className={`${PREFIX}-header`} />
        <main className={`${PREFIX}-content`}>
          <div className={`${PREFIX}-content-logo`}>
            <div className={`${PREFIX}-content-title`}>Backstage management</div>
          </div>
          <SignInForm onFinish={this.onSubmit} />
        </main>
        <BasicFooter className={`${PREFIX}-footer`} />
      </div>
    );
  }
}

export default SignIn;
