import React from 'react';
import PropTypes from 'prop-types';

import { Select } from 'antd';

const { Option } = Select;

export default class MulSelect extends React.Component {
  static propTypes = {
    value: PropTypes.object,
    warningInfo: PropTypes.string,
    optionChildren: PropTypes.element,
    onChange: PropTypes.func,
  };

  handleSelectChange = (value) => {
    const len = value.length;
    if (len > 5 || (len > 0 && value[len - 1].length > 10)) return;
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  render() {
    const { value, optionChildren, warningInfo } = this.props;

    const selStyle = { width: 250 };
    const selStyleContainer = { width: '100%', height: 'auto' };
    return (
      <div className="tag-modal-content" style={selStyleContainer}>
        <Select
          mode="tags"
          value={value}
          placeholder=" 请输入自定义表签"
          onChange={this.handleSelectChange}
          style={selStyle}
        >
          {optionChildren
            && optionChildren.map(item => (
              <Option value={item.value} key={item.value} title={item.text}>
                {item.text}
              </Option>
            ))}
        </Select>
        <div className="warning-txt" style={{ display: warningInfo ? 'block' : 'none' }}>
          请输入自定义表签
        </div>
      </div>
    );
  }
}
