import React, { useState, useMemo, useEffect } from 'react';

import dayJs from 'dayjs';
import PropTypes from 'prop-types';

import { Form, Input, Button, DatePicker, Select } from 'antd';

import { GRADE } from '@/settings/const';

const FORMAT = 'YYYY-MM-DD HH:MM:SS';
const FormItem = Form.Item;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

// 从props.initialValue中获取表单initialValues的数据
const getInitialValuesFromProps = initialValue => {
  const { name = undefined, grade = '' } = initialValue;
  let { startTime, endTime } = initialValue || {
    startTime: undefined,
    endTime: undefined,
  };
  startTime = startTime ? dayJs(startTime) : undefined;
  endTime = endTime ? dayJs(endTime) : undefined;
  return {
    grade,
    name,
    timeLimit: [startTime, endTime],
  };
};

const SearchForm = ({ initialValue, onFinish, handleReset }) => {
  const [form] = Form.useForm();
  // 是手动重置的动作
  const [isRest, setIsRest] = useState(false);
  const initialValues = useMemo(
    () => (isRest
      ? {
        grade: '',
        name: undefined,
        timeLimit: [undefined, undefined],
      }
      : getInitialValuesFromProps(initialValue)),
    [initialValue, isRest],
  );


  useEffect(() => {
    if (isRest) {
      form.resetFields(['grade', 'name', 'timeLimit']);
    }
  }, [isRest]);

  const handleFinish = (values) => {
    setIsRest(false);
    onFinish(values);
  };

  const onReset = () => {
    handleReset();
    setIsRest(true);
  };

  const searchStyle = { width: 220 };

  return (
    <div className="search">
      <Form form={form} layout="inline" onFinish={handleFinish} initialValues={initialValues}>
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
          <Button type="primary" onClick={onReset}>
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
  handleReset: PropTypes.func,
};

export default React.memo(SearchForm);
