import React from 'react'

import Select from './component/Select'
import NavTabs from './component/Tabs'
import ListCard from './component/ListCard'
import IconCircle from './component/IconCircle'
import TextWithIntercept from './component/TextWithIntercept'
import ActionSet from './component/ActionSet'

import videoHoc from './hoc/videoHoc'
import searchGroupHoc from './hoc/searchGroupHoc'

import SelectGroup from 'widgets/Layout/SelectGroup'

import { Table } from 'antd'

import Storage from '../../helpers/Storage'
import { FILTER_VIDEO, STATUS_VIDEO } from '../../config'

import './style.scss'

@searchGroupHoc({ source: 0, createBy: true })
class SearchGroup extends React.Component {
  get searchMessage() {
    const { value, tagList, createList } = this.props

    const { id, isRelaKPoint, kpointKeyName, userDefinedTag, videoKeyName } =
      value || {}

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

@videoHoc({
  title: '待修改视频',
  currentKey: null,
  NavTabs: null,
  Select: Select(FILTER_VIDEO),
  SearchGroup,
  fetchVideoList: 'getPendingVideoList',
  route: 'VIDEO_PENDING_MODIFY'
})
class VideoPendingModify extends React.Component {
  get columns() {
    return [
      {
        title: '视频ID',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: '审核时间',
        dataIndex: 'reviewTime',
        key: 'reviewTime'
      },
      {
        title: '视频名称',
        dataIndex: 'fileName',
        key: 'fileName',
        render: text => <TextWithIntercept text={text} len={10} />
      },
      {
        title: '知识点关联',
        dataIndex: 'kpoint',
        key: 'kpoint',
        render: (text, record) => {
          let value = text[0] ? text[0].name : '未关联'
          return <TextWithIntercept text={value} len={10} />
        }
      },
      {
        title: '自定义标签',
        dataIndex: 'userDefinedTags',
        key: 'userDefinedTags',
        render: (text, record) => {
          let str = '未定义'
          if (text && text.length > 0) {
            str = text.reduce((l, r) => (l += r + ','), '')
          }
          str = str.substring(0, str.length - 1)
          return <TextWithIntercept text={str} len={10} />
        }
      },
      {
        title: '反馈',
        dataIndex: 'reason',
        key: 'reason',
        render: text => <TextWithIntercept text={text} len={10} />
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        className: 'td-action',
        render: (text, record) => (
          <ActionSet
            page='modify'
            record={record}
            handleOpenPreview={this.handleOpenPreview.bind(this, record)}
            handleModifyVideo={this.handleModifyVideo.bind(this, record)}
            handleDelete={this.handleDelete.bind(this, record)}
          />
        )
      }
    ]
  }
  handleOpenPreview(record) {
    const { handleOpenPreview } = this.props
    if (handleOpenPreview) handleOpenPreview(record)
  }
  handleModifyVideo(record) {
    const { handleModifyVideo } = this.props
    if (handleModifyVideo) handleModifyVideo(record)
  }
  handleDelete(record) {
    const { handleDelete } = this.props
    if (handleDelete) handleDelete(record)
  }
  render() {
    const { videos, loading, clsTable, listDisplay } = this.props
    return (
      <div>
        <ListCard
          key='listCard'
          page='modify'
          data={videos}
          loading={loading}
          display={listDisplay}
          handleDelete={this.handleDelete.bind(this)}
          handleModifyVideo={this.handleModifyVideo.bind(this)}
          handleOpenPreview={this.handleOpenPreview.bind(this)}
        />
        <Table
          bordered
          className={clsTable}
          dataSource={videos}
          pagination={false}
          loading={loading}
          columns={this.columns}
        />
      </div>
    )
  }
}

export default VideoPendingModify
