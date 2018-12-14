import React from 'react'

import Select from './component/Select'
import NavTabs from './component/Tabs'
import ListCard from './component/ListCard'
import IconCircle from './component/IconCircle'
import factoryOfVideo from './factory/VideoCommonFactory'

import SelectGroup from 'widgets/Layout/SelectGroup'

import { Table } from 'antd'

import Storage from '../../helpers/Storage'
import { FILTER_VIDEO, STATUS_VIDEO } from '../../config'

import './style.scss'

class SearchGroup extends React.Component {
  state = {
    tagList: [],
    createList: []
  }

  componentDidMount() {
    this.getLabelList()
    this.getCreateList()
  }

  getLabelList = () => {
    const params = {
      orgId: Storage.get('orgId')
    }
    api
      .fetchVideoLabelList({ query: params })
      .then(resp => {
        const res = resp
        const list = []
        res.forEach(r => {
          list.push({
            value: r,
            text: r
          })
        })
        this.setState({ tagList: list })
      })
      .catch(err => console.log(err))
  }

  getCreateList = () => {
    const params = {
      orgId: Storage.get('orgId')
    }
    api
      .fetchVideoCreateList({ query: params })
      .then(resp => {
        const res = resp
        const list = []
        res.forEach(r => {
          list.push({
            value: r.userId,
            text: r.name
          })
        })
        this.setState({ createList: list })
      })
      .catch(err => console.log(err))
  }

  get searchMessage() {
    let { tagList, createList } = this.state

    const { value } = this.props

    const {
      id,
      isRelaKPoint,
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
        errorMessage: '',
        defaultValue: id || ''
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

  searchFn = values => {
    const { searchFn } = this.props
    if (searchFn) searchFn(values)
  }

  resetForm = () => {
    const { searchFn } = this.props
    if (searchFn) searchFn({})
  }
  
  render() {
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

class TableWithHeader extends React.Component {
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
        render: text => (
          <div title={text}>
            {text.length > 10 ? text.substring(0, 10) + '...' : text}
          </div>
        )
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
          if (text.length > 0) {
            str = text.reduce((l, r) => (l += r + ','), '')
          }
          str = str.substring(0, str.length - 1)
          return (
            <div title={str}>
              {str.length > 10 ? str.substring(0, 10) + '...' : str}
            </div>
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        className: 'td-action',
        render: (text, record) => {
          return (
            <div className='table-method'>
              <span onClick={this.handleOpenPreview.bind(this, record)}>
                预览
              </span>
              <span onClick={this.handleItemConnect.bind(this, record)}>
                关联知识点
              </span>
            </div>
          )
        }
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
  handleEditVideo(record) {
    const { handleEditVideo } = this.props
    if (handleEditVideo) handleEditVideo(record)
  }
  handleDelete(record) {
    const { handleDelete } = this.props
    if (handleDelete) handleDelete(record)
  }
  handleSelectChange = selectedRowKeys => {
    const { handleSelectChange } = this.props
    if (handleSelectChange) handleSelectChange(selectedRowKeys)
  }
  handleItemConnect(record) {
    const { handleItemConnect } = this.props
    if (handleItemConnect) handleItemConnect(record)
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
          handleReview={this.handleReview.bind(this)}
          handleDelete={this.handleDelete.bind(this)}
          handleEditVideo={this.handleEditVideo.bind(this)}
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

const VideoConnect = factoryOfVideo({
  key: 3,
  title: '待关联视频',
  currentKey: null,
  NavTabs: null,
  Select: Select(FILTER_VIDEO),
  SearchGroup,
  TableWithHeader,
  fetchVideoList: 'getNoConnectList',
  route: 'VIDEO_CONNECT'
})

export default VideoConnect
