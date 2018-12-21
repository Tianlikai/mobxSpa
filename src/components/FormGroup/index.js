import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import {
  Form, Select, Button, Input, DatePicker, AutoComplete,
} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

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
    // const formItemLayout = {
    //   labelCol: {
    //     xs: { span: 24 },
    //     sm: { span: 8 }
    //   },
    //   wrapperCol: {
    //     xs: { span: 18 },
    //     sm: { span: 20 }
    //   }
    // }
    // const tailFormItemLayout = {
    //   wrapperCol: {
    //     xs: {
    //       span: 24,
    //       offset: 0
    //     },
    //     sm: {
    //       span: 14,
    //       offset: 6
    //     }
    //   }
    // }
    const classes = classnames(prefix, { [className]: className });
    return (
      <div className={classes}>
        <Form onSubmit={this.handleSubmit}>
          {searchMessage.map((item) => {
            if (item.type === 'select') {
              return (
                <FormItem
                  // hasFeedback
                  key={item.key}
                  label={item.label ? <span>{item.label}</span> : null}
                  className={item.className ? item.className : null}
                  onChange={this.handleSearch}
                >
                  {getFieldDecorator(item.key, {
                    rules: [
                      {
                        required: false,
                        message: item.message,
                      },
                    ],
                    initialValue: item.defaultValue,
                  })(
                    // option展开的时候，鼠标滚动，下拉会脱离源
                    <Select
                      showSearch
                      notFoundContent=""
                      optionFilterProp="children"
                      placeholder={item.placeholder}
                      key={item.key}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      {item.params
                        && item.params.map(opt => (
                          <Option value={opt.value} key={opt.key}>
                            {item.text}
                          </Option>
                        ))}
                    </Select>,
                  )}
                  <br />
                </FormItem>
              );
            }
            if (item.type === 'date') {
              return (
                <FormItem
                  // hasFeedback
                  key={item.key}
                  label={item.label ? <span>{item.label}</span> : null}
                  className={item.className || ''}
                  onChange={this.handleSearch}
                >
                  {getFieldDecorator(item.key, {
                    rules: [
                      {
                        type: 'object',
                        required: false,
                        message: '请输入计划日期',
                      },
                    ],
                  })(
                    <DatePicker
                      onChange={item.onChange && item.onChange.bind(this)}
                      format={item.format || null}
                      placeholder={item.placeholder}
                      disabledTime={item.disabledTime || null}
                      disabledDate={item.disabledDate || null}
                      showTime={item.showTime || null}
                    />,
                  )}
                </FormItem>
              );
            }
            if (item.type === 'rangePicker') {
              return (
                <FormItem
                  // hasFeedback
                  key={item.key}
                  label={item.label ? <span>{item.label}</span> : null}
                  className={item.className || ''}
                  onChange={this.handleSearch}
                >
                  {getFieldDecorator(item.key)(
                    <RangePicker
                      format={item.format || null}
                      disabledDate={item.disabledDate || null}
                      showTime={item.showTime || null}
                      disabledTime={item.disabledTime || null}
                    />,
                  )}
                </FormItem>
              );
            }
            return (
              <FormItem
                // hasFeedback
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
                })(<Input type={item.iptType || 'text'} placeholder={item.placeholder} />)}
              </FormItem>
            );
          })}
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
