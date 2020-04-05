import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Form, Button, Input } from 'antd';

import './SignInForm.scss';

const PREFIX = 'j_signForm';
const FormItem = Form.Item;

const SignInForm = ({ className, onFinish }) => {
  const handleFinish = (values) => {
    onFinish(values);
  };
  const classes = classnames(PREFIX, { [className]: className });
  return (
    <Form className={classes} onFinish={handleFinish}>
      <FormItem
        className="ipt_username"
        name="username"
        rules={[
          {
            required: true,
            message: '请输入用户名',
          },
        ]}
      >
        <Input type="text" placeholder="请输入用户名: admin" />
      </FormItem>

      <FormItem
        className="ipt_password"
        name="password"
        rules={[
          {
            required: true,
            message: '请输入密码',
          },
        ]}
      >
        <Input type="password" placeholder="请输入密码: admin" />
      </FormItem>
      <FormItem className="btnGroup">
        <Button className="searchBtn" htmlType="submit">
          登陆
        </Button>
      </FormItem>
    </Form>
  );
};

SignInForm.propTypes = {
  className: PropTypes.string,
  onFinish: PropTypes.func.isRequired,
};

export default React.memo(SignInForm);
