import React, { Component } from 'react';

import PropTypes from 'prop-types';

import {
  Form, Input, Select, Button, Radio,
} from 'antd';

import UpLoaderWithPreview from './UpLoaderWithPreview/index';

import FormHoc from '../../../../../hoc/FormHoc';
import { GRADE } from 'settings/const'; // eslint-disable-line

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

@FormHoc
class MyForm extends Component {
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

  validatorVideo(rule, value, callback) {
    const len = Object.keys(value).length;
    if (!len) return callback('请上传视频');
    const { name, medias } = value;
    if (!name || !medias) return callback('请上传视频');
    callback();
    return null;
  }

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

    const mimeType = ['video/mp4', 'video/quicktime', 'image/png'];

    return (
      <div className="orderForm-container">
        <Form onSubmit={this.onSubmit}>
          <FormItem className="orderForm-item" {...formItemLayout} label="视频名称">
            {getFieldDecorator('video', {
              initialValue: {},
              rules: [
                { required: true, message: '请上传视频' },
                { validator: this.validatorVideo },
              ],
            })(<UpLoaderWithPreview mimeType={mimeType} />)}
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

export default MyForm;
