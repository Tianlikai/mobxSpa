import React from 'react';
import PropTypes from 'prop-types';

import { Radio } from 'antd';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default class BaseSelect extends React.Component {
  static defaultProps = {
    data: [],
  };

  static propTypes = {
    value: PropTypes.string.isRequired,
    data: PropTypes.array,
    filterData: PropTypes.object,
    handleSelect: PropTypes.func,
  };

  radioHandle = (e) => {
    const { filterData, handleSelect } = this.props;
    const params = Object.assign({}, filterData);
    params[e.target.name] = e.target.value;
    handleSelect(params);
  };

  render() {
    const { value = {}, data } = this.props;

    return (
      <div className="radio-group">
        {data.map((option) => {
          const { dataKey: key } = option;
          return (
            <div key={option.dataKey} className="radio-item">
              <label htmlFor={option.label}>{`${option.label}:`}</label>
              <RadioGroup
                name={option.dataKey}
                value={value[key] || ''}
                onChange={this.radioHandle}
              >
                {option.children.map(item => (
                  <RadioButton key={`${option.dataKey}${item.key}`} value={item.key}>
                    {item.value}
                  </RadioButton>
                ))}
              </RadioGroup>
            </div>
          );
        })}
      </div>
    );
  }
}
