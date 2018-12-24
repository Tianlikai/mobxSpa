import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Form } from 'antd';

const FormItem = Form.Item;

class CommonGroup extends Component {
  static propTypes = {
    prefix: PropTypes.string,
    className: PropTypes.string,
    form: PropTypes.object,
    searchValue: PropTypes.string,
    searchMessage: PropTypes.array,
    UserFormItem: PropTypes.element,
    searchFn: PropTypes.func,
    resetForm: PropTypes.func,
  };

  static defaultProps = {
    prefix: 'pSelectGroup',
  };

  state = {
    confirmDirty: false,
    isFirst: true,
  };

  componentWillReceiveProps(nextProps) {
    const { searchValue } = nextProps;
    const { isFirst } = this.state;
    if (searchValue && isFirst) {
      this.setFormValue(searchValue);
    }
  }

  setFormValue = (values) => {
    const keys = Object.keys(values);
    keys.forEach((key) => {
      const val = values[key];
      if (!val && val !== '0') {
        delete values[key]; // eslint-disable-line
      }
    });
    const { form } = this.props;
    form.setFieldsValue(values);
    this.setState({
      isFirst: false,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.handleSearch();
  };

  handleSearch = () => {
    const { form, searchFn } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const keys = Object.keys(values);
        keys.forEach((key) => {
          const val = values[key];
          if (!val) {
            values[key] = ''; // eslint-disable-line
          }
        });
        searchFn(values);
      }
    });
  };

  handleConfirmBlur = (e) => {
    const {
      target: { value },
    } = e;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  handleReset = () => {
    const { resetForm, form } = this.props;
    form.resetFields();
    if (resetForm) return resetForm();
    return this.handleSearch();
  };

  render() {
    const {
      form: { getFieldDecorator },
      searchMessage,
      className,
      prefix,
      UserFormItem,
    } = this.props;
    const classes = classnames(prefix, { [className]: className });
    return (
      <div className={classes}>
        <Form onSubmit={this.handleSubmit}>
          {searchMessage.map(item => (
            <FormItem
              key={item.key}
              label={item.label ? <span>{item.label}</span> : null}
              className={item.className || ''}
              onChange={this.handleSearch}
            >
              {getFieldDecorator(item.key, {
                rules: [
                  {
                    required: item.required || false,
                    message: item.message,
                  },
                  {
                    pattern: item.pattern,
                    message: item.errorMessage,
                  },
                ],
                initialValue: item.defaultValue,
              })(<item.Component placeholder={item.placeholder} />)}
            </FormItem>
          ))}
          {UserFormItem ? (
            <UserFormItem className="btnGroup" handleReset={this.handleReset} />
          ) : null}
        </Form>
      </div>
    );
  }
}

const FormGroup = Form.create()(CommonGroup);

export default FormGroup;
