import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Form, Button, Input } from 'antd';

import FormHoc from '../../hoc/FormHoc';

import './SignInForm.scss';

const FormItem = Form.Item;

@FormHoc
class SignInForm extends Component {
  static propTypes = {
    prefix: PropTypes.string,
    className: PropTypes.string,
    form: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    prefix: 'j_signForm',
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { handleSubmit } = this.props;
    handleSubmit();
  };

  render() {
    const {
      prefix,
      className,
      form: { getFieldDecorator },
    } = this.props;
    const classes = classnames(prefix, { [className]: className });
    return (
      <Form className={classes} onSubmit={this.onSubmit}>
        <FormItem className="ipt_username">
          {getFieldDecorator('username', {
            rules: [
              {
                required: true,
                message: '请输入用户名',
              },
            ],
          })(<Input type="text" placeholder="请输入用户名: admin" />)}
        </FormItem>

        <FormItem className="ipt_password">
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入密码',
              },
            ],
          })(<Input type="password" placeholder="请输入密码: admin" />)}
        </FormItem>
        <FormItem className="btnGroup">
          <Button className="searchBtn" htmlType="submit">
            登陆
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default SignInForm;
