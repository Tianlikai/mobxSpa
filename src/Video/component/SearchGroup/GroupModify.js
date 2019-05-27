import React from 'react'

import SelectGroup from 'widgets/Layout/SelectGroup'

import searchGroupHoc from '../../hoc/searchGroupHoc'

@searchGroupHoc({ source: 0, createBy: true })
class GroupModify extends React.Component {
    get searchMessage() {
        const { value, tagList } = this.props

        const {
            id,
            isRelaKPoint,
            kpointKeyName,
            userDefinedTag,
            videoKeyName
        } = value || {}

        let selectList = [
            {
                type: 'select',
                label: '知识点关联状态',
                key: 'isRelaKPoint',
                class: 'update-state',
                errorMessage: '',
                params: [
                    {
                        value: '',
                        text: '全部'
                    },
                    {
                        value: '0',
                        text: '尚未关联知识点'
                    },
                    {
                        value: '1',
                        text: '已关联知识点'
                    }
                ],
                defaultValue: isRelaKPoint || ''
            },
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
            },
            {
                type: 'input',
                label: '',
                key: 'kpointKeyName',
                placeholder: '知识点关键词搜索',
                errorMessage: '',
                defaultValue: kpointKeyName || ''
            }
        ]
        inputList = selectList.concat(inputList)
        return inputList
    }

    render() {
        const { searchFn, resetForm } = this.props
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

export default GroupModify
