import React from 'react'

import Select from './component/Select'
import NavTabs from './component/Tabs'
import ListCard from './component/ListCard'
import IconCircle from './component/IconCircle'
// import factoryOfVideo from './factory/VideoCommonFactory'
import videoHoc from './hoc/videoHoc'

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
        render: text => (
          <div title={text}>
            {text.length > 10 ? text.substring(0, 10) + '...' : text}
          </div>
        )
      },
      {
        title: '知识点关联',
        dataIndex: 'kpoint',
        key: 'kpoint',
        render: (text, record) => {
          let value = text[0] ? text[0].name : '未关联'
          return (
            <div title={value}>
              {value.length > 10 ? value.substring(0, 10) + '...' : value}
            </div>
          )
        }
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
        title: '反馈',
        dataIndex: 'reason',
        key: 'reason',
        render: text => (
          <div title={text}>
            {text.length > 10 ? text.substring(0, 10) + '...' : text}
          </div>
        )
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
              <span onClick={this.handleModifyVideo.bind(this, record)}>
                修改
              </span>
              <span onClick={this.handleDelete.bind(this, record)}>删除</span>
            </div>
          )
        }
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

// const VideoPendingModify = factoryOfVideo({
//   title: '待修改视频',
//   currentKey: null,
//   NavTabs: null,
//   Select: Select(FILTER_VIDEO),
//   SearchGroup,
//   TableWithHeader,
//   fetchVideoList: 'getPendingVideoList',
//   route: 'VIDEO_PENDING_MODIFY'
// })

export default VideoPendingModify
