import React from 'react'

import Select from './component/Select'
import NavTabs from './component/Tabs'
import ListCard from './component/ListCard'
import IconCircle from './component/IconCircle'
import TextWithIntercept from './component/TextWithIntercept'
import ActionSet from './component/ActionSet'

import videoHoc from './hoc/videoHoc'
import searchGroupHoc from './hoc/searchGroupHoc'

import GearBox from 'widgets/QuestionCard/GearBox'
import SelectGroup from 'widgets/Layout/SelectGroup'

import { Table } from 'antd'

import Storage from '../../helpers/Storage'
import { FILTER_VIDEO, STATUS_VIDEO } from '../../config'

import './style.scss'

@searchGroupHoc({ source: 0, createBy: true })
class SearchGroup extends React.Component {
  get searchMessage() {
    const { value, tagList, createList } = this.props

    const {
      id,
      isRelaKPoint,
      kpointKeyName,
      state,
      userDefinedTag,
      videoKeyName,
      createdBy
    } = value || {}

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
    inputList = item.concat(selectList).concat(inputList)
    return inputList
  }

  render() {
    const { searchFn, resetForm } = this.props
    return (
      <div className='pSelect'>
        <SelectGroup
          searchMessage={this.searchMessage}
          resetForm={this.resetForm}
          searchFn={this.searchFn}
        />
      </div>
    )
  }
}

const GearBoxWithCallBack = props => (
  <GearBox content='审核视频' handleClick={props.historyToPreview} />
)

@videoHoc({
  key: 2,
  title: '待审核视频',
  GearBox: GearBoxWithCallBack,
  currentKey: null,
  NavTabs: null,
  Select: Select(FILTER_VIDEO),
  SearchGroup,
  fetchVideoList: 'getPendingVideoList',
  route: 'VIDEO_PENDING_REVIEW'
})
class VideoPersonal extends React.Component {
  get columns() {
    return [
      {
        title: '视频ID',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: '提审时间',
        dataIndex: 'examineTime',
        key: 'examineTime'
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
        title: '创建人',
        dataIndex: 'creatorName',
        key: 'creatorName'
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        className: 'td-action',
        render: (text, record) => (
          <ActionSet
            page='review'
            record={record}
            handleOpenPreview={this.handleOpenPreview.bind(this, record)}
            handleReview={this.handleReview.bind(this, record)}
          />
        )
      }
    ]
  }
  handleReview(record) {
    const { handleReview } = this.props
    if (handleReview) handleReview(record)
  }
  handleOpenPreview(record) {
    const { handleOpenPreview } = this.props
    if (handleOpenPreview) handleOpenPreview(record)
  }
  handleSelectChange = selectedRowKeys => {
    const { handleSelectChange } = this.props
    if (handleSelectChange) handleSelectChange(selectedRowKeys)
  }
  render() {
    const {
      videos,
      loading,
      clsTable,
      listDisplay,
      selectedVideos
    } = this.props

    const rowSelection = {
      selectedRowKeys: selectedVideos,
      onChange: this.handleSelectChange
    }

    return (
      <div>
        <ListCard
          key='listCard'
          page='review'
          data={videos}
          loading={loading}
          display={listDisplay}
          selectedRowKeys={selectedVideos}
          handleChange={this.handleSelectChange}
          handleReview={this.handleReview.bind(this)}
          handleOpenPreview={this.handleOpenPreview.bind(this)}
        />
        <Table
          bordered
          type='checkbox'
          className={clsTable}
          dataSource={videos}
          pagination={false}
          loading={loading}
          columns={this.columns}
          rowSelection={rowSelection}
        />
      </div>
    )
  }
}

export default VideoPersonal
