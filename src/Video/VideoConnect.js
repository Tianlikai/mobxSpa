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

const GearBoxWithCallBack = props => (
  <GearBox content='关联知识点' handleClick={props.handleOpenConnect} />
)

@videoHoc({
  key: 3,
  title: '待关联视频',
  GearBox: GearBoxWithCallBack,
  currentKey: null,
  NavTabs: null,
  Select: Select(FILTER_VIDEO),
  SearchGroup,
  fetchVideoList: 'getNoConnectList',
  route: 'VIDEO_CONNECT'
})
class VideoConnect extends React.Component {
  get columns() {
    return [
      {
        title: '视频ID',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt'
      },
      {
        title: '视频名称',
        dataIndex: 'fileName',
        key: 'fileName',
        render: text => <TextWithIntercept text={text} len={10} />
      },
      {
        title: '创建人',
        dataIndex: 'creatorName',
        key: 'creatorName'
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
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        className: 'td-action',
        render: (text, record) => (
          <ActionSet
            page='connect'
            record={record}
            handleOpenPreview={this.handleOpenPreview.bind(this, record)}
            handleItemConnect={this.handleItemConnect.bind(this, record)}
          />
        )
      }
    ]
  }
  handleOpenPreview(record) {
    const { handleOpenPreview } = this.props
    if (handleOpenPreview) handleOpenPreview(record)
  }
  handleItemConnect(record) {
    const { handleItemConnect } = this.props
    if (handleItemConnect) handleItemConnect(record)
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
          page='connect'
          data={videos}
          loading={loading}
          display={listDisplay}
          selectedRowKeys={selectedVideos}
          handleChange={this.handleSelectChange}
          handleOpenPreview={this.handleOpenPreview.bind(this)}
          handleItemConnect={this.handleItemConnect.bind(this)}
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

export default VideoConnect
