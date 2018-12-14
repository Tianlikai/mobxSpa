import React from 'react'
import { Icon, Radio } from 'antd'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const Select = listData => {
  class BaseSelect extends React.Component {
    state = {
      value1: 'Apple',
      value2: 'Apple',
      value3: 'Apple',
      list: {}
    }

    radioHandle(dataKey, e) {
      let { list } = this.state
      let params = list
      params[dataKey] = e.target.value
      this.setState({ list: { ...params } })
      this.props.handleSelect(params)
    }

    render() {
      const { value } = this.props
      const { category } = value || {}
      return (
        <div className='radio-group'>
          {listData.map((option, i) => {
            return (
              <div key={i} className='radio-item'>
                <label htmlFor={option.label}>{option.label}:</label>
                <RadioGroup
                  value={category || ''}
                  onChange={this.radioHandle.bind(this, option.dataKey)}
                >
                  {option.children.map((item, index) => {
                    return (
                      <RadioButton key={String(i) + index} value={item.key}>
                        {item.value}
                      </RadioButton>
                    )
                  })}
                </RadioGroup>
              </div>
            )
          })}
        </div>
      )
    }
  }
  return BaseSelect
}

export default Select
