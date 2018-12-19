import React from 'react'

import SelectGroup from 'widgets/Layout/SelectGroup'

import searchGroupHoc from '../../hoc/searchGroupHoc'

@searchGroupHoc({ source: 0 })
class GroupRecyclePerson extends React.Component {
  get searchMessage() {
    let { tagList } = this.props

    let selectList = [
      {
        type: 'select',
        label: '自定义标签',
        key: 'userDefinedTag',
        class: 'update-state',
        errorMessage: '',
        params: [
          {
            value: '',
            text: '全部'
          },
          ...tagList
        ],
        defaultValue: ''
      }
    ]

    let inputList = [
      {
        type: 'input',
        label: '',
        key: 'videoKeyName',
        placeholder: '按视频关键词搜索',
        errorMessage: ''
      },
      {
        type: 'input',
        label: '',
        key: 'id',
        placeholder: '按视频ID搜索',
        errorMessage: '只能输入数字',
        defaultValue: '',
        pattern: new RegExp(/^[1-9]\d*$/, 'g')
      }
    ]

    inputList = selectList.concat(inputList)
    return inputList
  }

  render() {
    const { searchFn } = this.props
    return (
      <div className='pSelect'>
        <SelectGroup searchMessage={this.searchMessage} searchFn={searchFn} />
      </div>
    )
  }
}

export default GroupRecyclePerson
