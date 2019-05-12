import React, { Component } from 'react';

import dayJs from 'dayjs';
import PropTypes from 'prop-types';

import {
  Form, Input, Button, DatePicker, Select,
} from 'antd';

import FormHoc from '../../../../hoc/FormHoc';

import { GRADE } from '@/settings/const';

const FormItem = Form.Item;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

@FormHoc
class SearchForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    initialValue: PropTypes.object,
    handleSubmit: PropTypes.func,
    handleReset: PropTypes.func,
    handleResetFields: PropTypes.func,
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { handleSubmit } = this.props;
    handleSubmit();
  };

  handleReset = (e) => {
    e.preventDefault();
    const { handleReset, handleResetFields } = this.props;
    handleResetFields();
    handleReset();
  };

  render() {
    const { initialValue, form } = this.props;
    const { getFieldDecorator } = form;
    const searchStyle = { width: 220 };

    const { name = undefined, grade = undefined } = initialValue;
    let { startTime, endTime } = initialValue || {
      startTime: undefined,
      endTime: undefined,
    };

    startTime = startTime ? dayJs(startTime).format('YYYY-MM-DD HH:MM:SS') : undefined;

    endTime = endTime ? dayJs(endTime).format('YYYY-MM-DD HH:MM:SS') : undefined;

    return (
      <div className="search">
        <Form layout="inline" onSubmit={this.onSubmit}>
          <FormItem label="年级">
            {getFieldDecorator('grade', {
              initialValue: grade || '',
            })(
              <Select>
                {GRADE.map(item => (
                  <Option key={item.key} value={item.value}>
                    {item.text}
                  </Option>
                ))}
              </Select>,
            )}
          </FormItem>

          <FormItem label="时间范围">
            {getFieldDecorator('timeLimit', {
              initialValue: [startTime, endTime],
            })(<RangePicker format="YYYY-MM-DD HH:MM:SS" placeholder={['开始时间', '结束时间']} />)}
          </FormItem>

          <FormItem>
            {getFieldDecorator('queryCond', {
              initialValue: name,
            })(<Search style={searchStyle} placeholder="请输入学校，班级" />)}
          </FormItem>

          <FormItem>
            <Button htmlType="submit" type="primary">
              搜索
            </Button>
          </FormItem>

          <FormItem>
            <Button type="primary" htmlType="reset" onClick={this.handleReset}>
              重置
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default SearchForm;
