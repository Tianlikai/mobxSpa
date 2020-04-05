import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { Form, Button } from 'antd';

import MulSelect from '@/components/MulSelect/index';
import UpLoaderWithPreview from '@/components/UpLoaderWithPreview/index';

const FormItem = Form.Item;

class MyForm extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired, // antd 表单对象
    formItemLayout: PropTypes.object,
    tailFormItemLayout: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired, // FormHoc 公用方法，该方法调用会默认触发尾部onSubmit回调
  };

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
    const { formItemLayout, tailFormItemLayout } = this.props;

    const mimeType = ['video/mp4', 'video/quicktime'];
    const initialValues = { video: { files: [], finish: [] } };
    return (
      <div className="orderForm-container">
        <Form onSubmit={this.onSubmit} initialValues={initialValues}>
          <FormItem className="orderForm-item" name="video" {...formItemLayout} label="视频名称">
            <UpLoaderWithPreview mimeType={mimeType} />
            {/* {getFieldDecorator('video', {
              initialValue: {
                files: [],
                finish: [],
              },
              rules: [
                { required: true, message: '请上传视频' },
                // { validator: this.validatorVideo },
              ],
            })()} */}
          </FormItem>

          <FormItem
            className="defaultFormItem"
            name="userDefinedTags"
            {...formItemLayout}
            label="自定义标签"
          >
            <MulSelect warningInfo={false} />
            {/* {getFieldDecorator('userDefinedTags', {
              initialValue: [],
              rules: [{ required: true, message: '请填写自定义标签' }],
            })(<MulSelect warningInfo={false} />)} */}
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
