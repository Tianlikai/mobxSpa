import React from 'react'

import SelectGroup from 'widgets/Layout/SelectGroup'

import searchGroupHoc from '../../hoc/searchGroupHoc'

@searchGroupHoc({ source: 0, createBy: true })
class GroupConnect extends React.Component {
  get searchMessage() {
    const { value, tagList, createList } = this.props

    const { id, isRelaKPoint, state, userDefinedTag, videoKeyName, createdBy } =
      value || {}

    let item = [
      {
        type: 'select',
        label: '创建人',
        key: 'createdBy',
        class: 'update-state',
        errorMessage: '',
        params: [
          {
            value: '',
            text: '全部'
          },
          ...createList
        ],
        defaultValue: createdBy || ''
      }
    ]
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
        defaultValue: userDefinedTag || ''
      }
    ]
    let inputList = [
      {
        type: 'input',
        label: '',
        key: 'videoKeyName',
        placeholder: '按视频关键词搜索',
        errorMessage: '',
        defaultValue: videoKeyName || ''
      },
      {
        type: 'input',
        label: '',
        key: 'id',
        placeholder: '按视频ID搜索',
        errorMessage: '只能输入数字',
        defaultValue: id || '',
        pattern: new RegExp(/^[1-9]\d*$/, 'g')
      }
    ]
    const isSuperRight = G.attendant()
    if (isSuperRight) {
      inputList = item.concat(selectList).concat(inputList)
    } else {
      inputList = selectList.concat(inputList)
    }
    return inputList
  }

  render() {
    const { resetForm, searchFn } = this.props
    return (
      <div className='pSelect'>
        <SelectGroup
          searchMessage={this.searchMessage}
          resetForm={resetForm}
          searchFn={searchFn}
        />
      </div>
    )
  }
}

export default GroupConnect
