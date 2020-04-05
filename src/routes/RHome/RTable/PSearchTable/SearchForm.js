import React from 'react';

import dayJs from 'dayjs';
import PropTypes from 'prop-types';

import { Form, Input, Button, DatePicker, Select } from 'antd';

import { GRADE } from '@/settings/const';

const FORMAT = 'YYYY-MM-DD HH:MM:SS';
const FormItem = Form.Item;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const SearchForm = ({ initialValue, onFinish }) => {
  const handleFinish = (values) => {
    onFinish(values);
  };

  const searchStyle = { width: 220 };

  const { name = undefined, grade = '' } = initialValue;
  let { startTime, endTime } = initialValue || {
    startTime: undefined,
    endTime: undefined,
  };

  startTime = startTime ? dayJs(startTime).format('YYYY-MM-DD HH:MM:SS') : undefined;

  endTime = endTime ? dayJs(endTime).format('YYYY-MM-DD HH:MM:SS') : undefined;

  const initialValues = {
    grade,
    name,
    timeLimit: [startTime, endTime],
  };

  return (
    <div className="search">
      <Form layout="inline" onFinish={handleFinish} initialValues={initialValues}>
        <FormItem label="年级" name="grade">
          <Select>
            {GRADE.map((item) => (
              <Option key={item.key} value={item.value}>
                {item.text}
              </Option>
            ))}
          </Select>
        </FormItem>
        <FormItem label="时间范围" name="timeLimit">
          <RangePicker format={FORMAT} placeholder={['开始时间', '结束时间']} />
        </FormItem>

        <FormItem name="name">
          <Search style={searchStyle} placeholder="请输入学校，班级" />
        </FormItem>

        <FormItem>
          <Button htmlType="submit" type="primary">
            搜索
          </Button>
        </FormItem>

        <FormItem>
          <Button type="primary" htmlType="reset">
            重置
          </Button>
        </FormItem>
      </Form>
    </div>
  );
};

SearchForm.propTypes = {
  initialValue: PropTypes.object,
  onFinish: PropTypes.func,
};

export default React.memo(SearchForm);
