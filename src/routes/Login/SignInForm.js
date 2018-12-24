import React, { Component } from 'react';

import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Form, Button, Input } from 'antd';
import LoginForm from '../../components/FormGroup';
import './SignInForm.scss';

const FormItem = Form.Item;

const UserFormItem = () => (
  <FormItem className="btnGroup">
    <Button className="searchBtn" htmlType="submit">
      登陆
    </Button>
  </FormItem>
);

class SignInForm extends Component {
  static propTypes = {
    prefix: PropTypes.string,
    className: PropTypes.string,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    prefix: 'j_signForm',
  };

  onSubmit = (values) => {
    const { onSubmit } = this.props;
    if (onSubmit) onSubmit(values);
  };

  get formItems() {
    return [
      {
        type: 'input',
        label: '',
        key: 'username',
        className: 'ipt_username',
        placeholder: '请输入账号',
        size: 'large',
        required: true,
        message: '请填写帐号',
        iptType: 'text',
        Component: props => <Input type="text" {...props} />,
      },
      {
        type: 'input',
        label: '',
        key: 'password',
        className: 'ipt_password',
        placeholder: '请输入密码',
        size: 'large',
        required: true,
        message: '请填写密码',
        iptType: 'password',
        Component: props => <Input type="password" {...props} />,
      },
    ];
  }

  render() {
    const { prefix, className } = this.props;
    const classes = classnames(prefix, { [className]: className });
    return (
      <div className={classes}>
        <LoginForm
          searchMessage={this.formItems}
          searchFn={this.onSubmit}
          UserFormItem={UserFormItem}
        />
      </div>
    );
  }
}

export default SignInForm;
