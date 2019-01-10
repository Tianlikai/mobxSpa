import React from 'react';
import { Form } from 'antd';

import PropTypes from 'prop-types';

const FormHoc = (WrapperComponent) => {
  class CommonForm extends React.Component {
    static propTypes = {
      onSubmit: PropTypes.func.isRequired, // 提交表单，回调函数，返回表单数据
      form: PropTypes.object.isRequired, // antd 表单
    };

    handleSubmit = () => {
      const { form } = this.props;
      form.validateFieldsAndScroll((errors, params) => {
        if (errors) return null;
        const { onSubmit } = this.props;
        return onSubmit(params);
      });
    };

    handleResetFields = () => {
      const {
        form: { resetFields },
      } = this.props;
      resetFields();
    };

    render() {
      const { form, ...rest } = this.props;
      return (
        <WrapperComponent
          handleResetFields={this.handleResetFields}
          handleSubmit={this.handleSubmit}
          form={form}
          {...rest}
        />
      );
    }
  }
  return Form.create()(CommonForm);
};

export default FormHoc;
