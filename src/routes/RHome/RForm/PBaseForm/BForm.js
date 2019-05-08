import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Form, Input, Select, Button, Radio, Cascader,
} from 'antd';

import FormHoc from '../../../../hoc/FormHoc';
import { GRADE } from '@/settings/const';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

@FormHoc
class BForm extends Component {
  static defaultProps = {
    formItemLayout: {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
    },
    tailFormItemLayout: {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 6,
          offset: 6,
        },
      },
    },
    formItemRadioLayout: {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    },
  };

  static propTypes = {
    form: PropTypes.object.isRequired, // antd 表单对象
    regions: PropTypes.array, // 地区
    mathType: PropTypes.string, // 数学类型
    englishType: PropTypes.string, // 英语类型
    formItemLayout: PropTypes.object,
    tailFormItemLayout: PropTypes.object,
    formItemRadioLayout: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired, // FormHoc 公用方法，该方法调用会默认触发尾部onSubmit回调
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { handleSubmit } = this.props;
    handleSubmit();
  };

  render() {
    const {
      regions,
      mathType,
      englishType,
      form: { getFieldDecorator },
      formItemLayout,
      tailFormItemLayout,
      formItemRadioLayout,
    } = this.props;

    return (
      <div className="orderForm-container">
        <Form onSubmit={this.onSubmit}>
          <FormItem className="orderForm-item" label="配置地区" {...formItemLayout}>
            {getFieldDecorator('area', {
              rules: [{ required: true }],
              validateTrigger: 'onChange',
            })(<Cascader options={regions} />)}
          </FormItem>

          <FormItem className="orderForm-item" label="配置学校" {...formItemLayout}>
            {getFieldDecorator('school', {
              rules: [{ required: true }],
              validateTrigger: 'onChange',
            })(<Input maxLength="25" placeholder="输入学校名" />)}
          </FormItem>

          <FormItem className="orderForm-item" label="年级" {...formItemLayout}>
            {getFieldDecorator('grade', {
              validateTrigger: 'onChange',
            })(
              <Select placeholder="选择年级">
                {GRADE.map((grade, i) => {
                  if (i > 0) {
                    return (
                      <Option key={grade.key} value={grade.value}>
                        {grade.text}
                      </Option>
                    );
                  }
                  return null;
                })}
              </Select>,
            )}
          </FormItem>

          <FormItem className="orderForm-item" label="班级" {...formItemLayout}>
            {getFieldDecorator('className', {
              validateTrigger: 'onChange',
            })(<Input maxLength="15" placeholder="输入班级" />)}
          </FormItem>

          <FormItem className="orderForm-item" label="英语老师" {...formItemLayout}>
            {getFieldDecorator('englishTeacher', {
              validateTrigger: 'onChange',
            })(<Input placeholder="输入英语老师" />)}
          </FormItem>

          <FormItem className="orderForm-item" label="数学老师" {...formItemLayout}>
            {getFieldDecorator('mathTeacher', {
              validateTrigger: 'onChange',
            })(<Input placeholder="输入数学老师" />)}
          </FormItem>

          <FormItem className="orderForm-item special" label="教材版本" {...formItemLayout} />
          <FormItem className="orderForm-item specialM" label="数学版本" {...formItemRadioLayout}>
            {getFieldDecorator('mathPress', {
              rules: [{ required: true }],
              validateTrigger: 'onChange',
              initialValue: mathType[0] ? mathType[0].dictvalue : '',
            })(
              <RadioGroup>
                {mathType.map(version => (
                  <Radio key={version.dictvalue} value={version.dictvalue}>
                    {version.dicttext}
                  </Radio>
                ))}
              </RadioGroup>,
            )}
          </FormItem>

          <FormItem className="orderForm-item specialE" label="英语版本" {...formItemRadioLayout}>
            {getFieldDecorator('englishPress', {
              rules: [{ required: true }],
              validateTrigger: 'onChange',
              initialValue: englishType[0] ? englishType[0].dictvalue : '',
            })(
              <RadioGroup>
                {englishType.map(version => (
                  <Radio key={version.dictvalue} value={version.dictvalue}>
                    {version.dicttext}
                  </Radio>
                ))}
              </RadioGroup>,
            )}
          </FormItem>

          <FormItem {...tailFormItemLayout}>
            <Button htmlType="submit" type="primary" size="big">
              立即创建
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default BForm;
