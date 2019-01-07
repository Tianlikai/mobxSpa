import React from 'react';
import { Form } from 'antd';

const FormHoc = (WrapperComponent) => {
  class CommonForm extends React.Component {
    getData = () => new Promise((resolve, reject) => {
      const { form } = this.props;
      form.validateFieldsAndScroll((errors, params) => {
        if (errors) {
          reject(errors);
          return null;
        }
        resolve(params);
        return true;
      });
    });

    render() {
      const {
        form: { getFieldDecorator, resetFields },
      } = this.props;
      return (
        <WrapperComponent
          getData={this.getData}
          resetFields={resetFields}
          getFieldDecorator={getFieldDecorator}
          {...this.props}
        />
      );
    }
  }
  return Form.create()(CommonForm);
};

export default FormHoc;
