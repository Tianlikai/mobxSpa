import React from 'react';
import { Form } from 'antd';

import PropTypes from 'prop-types';

const FormHoc = (WrapperComponent) => {
  class CommonForm extends React.Component {
    static propTypes = {
      onSubmit: PropTypes.func,
    };

    handleSubmit = () => {
      const { form } = this.props;
      form.validateFieldsAndScroll((errors, params) => {
        if (errors) return null;
        const { onSubmit } = this.props;
        return onSubmit(params);
      });
    };

    render() {
      const { form, ...rest } = this.props;
      return <WrapperComponent handleSubmit={this.handleSubmit} form={form} {...rest} />;
    }
  }
  return Form.create()(CommonForm);
};

export default FormHoc;
