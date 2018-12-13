import React from 'react'

import Select from './component/Select'
import NavTabs from './component/Tabs'
import ListCard from './component/ListCard'
import IconCircle from './component/IconCircle'
import factoryOfVideo from './factory/VideoCommonFactory'

import SelectGroup from 'widgets/Layout/SelectGroup'

import { Table } from 'antd'

import { FILTER_VIDEO, STATUS_VIDEO, routePath } from '../../config'

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
    api
      .fetchVideoLabelList()
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
    api
      .fetchVideoCreateList()
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

    const isSuperRight = G.attendant()
    let videoState
    if (isSuperRight) {
      videoState = [
        {
          value: '',
          text: '全部'
        },
        {
          value: '1',
          text: '待审核'
        },
        {
          value: '2',
          text: '需修改'
        },
        {
          value: '3',
          text: '审核通过'
        }
      ]
    } else {
      videoState = [
        {
          value: '',
          text: '全部'
        },
        {
          value: '3',
          text: '审核通过'
        }
      ]
    }

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
        defaultValue: ''
      }
    ]
    let selectList = [
      {
        type: 'select',
        label: '视频状态',
        key: 'state',
        placeholder: '请输入视频状态',
        class: 'update-state',
        errorMessage: '',
        params: videoState,
        defaultValue: ''
      },
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
        defaultValue: ''
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
        placeholder: '按视频ID词搜索',
        errorMessage: ''
      },
      {
        type: 'input',
        label: '',
        key: 'kpointKeyName',
        placeholder: '知识点关键词搜索',
        errorMessage: ''
      }
    ]
    inputList = selectList.concat(item).concat(inputList)
    return inputList
  }

  searchFn = values => {
    const { searchFn } = this.props
    if (searchFn) searchFn(values)
  }

  render() {
    return (
      <div className='pSelect'>
        <SelectGroup
          searchMessage={this.searchMessage}
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
            str = text.reduce((l, r) => (l = r + ','), '')
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
        title: '审核状态',
        dataIndex: 'state',
        key: 'state',
        render: (text, record) => {
          let stateText
          if (text || text === 0) {
            stateText = STATUS_VIDEO[text + 1].text
          }
          let bcg = ''
          switch (text) {
            case 0:
              bcg = '#2c5b8f'
              break
            case 1:
              bcg = '#FF9E16'
              break
            case 2:
              bcg = '#FF591A'
              break
            case 3:
              bcg = '#77BC2B'
              break
          }

          return (
            <div>
              <IconCircle size={10} bcg={bcg} />
              <span>{stateText}</span>
            </div>
          )
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
        render: (text, record) => {
          const isSuperRight = G.attendant()
          const { state } = record
          return (
            <div className='table-method'>
              <span onClick={this.handleOpenPreview.bind(this, record)}>
                预览
              </span>
              {state === 1 && isSuperRight ? (
                <span onClick={this.handleReview.bind(this, record)}>审核</span>
              ) : null}
              {state === 2 && isSuperRight ? (
                <span onClick={this.handleModifyVideo.bind(this, record)}>
                  修改
                </span>
              ) : null}
              {state === 3 && isSuperRight ? (
                <span onClick={this.handleEditVideo.bind(this, record)}>
                  查看
                </span>
              ) : null}
              {state !== 1 && isSuperRight ? (
                <span onClick={this.handleDelete.bind(this, record)}>删除</span>
              ) : null}
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
  handleModifyVideo(record) {
    const { handleModifyVideo } = this.props
    if (handleModifyVideo) handleModifyVideo(record)
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
  render() {
    const { videos, loading, clsTable, listDisplay } = this.props
    const isSuperRight = G.attendant()
    return (
      <div>
        <ListCard
          key='listCard'
          page='school'
          data={videos}
          loading={loading}
          display={listDisplay}
          isSuperRight={isSuperRight}
          handleReview={this.handleReview.bind(this)}
          handleDelete={this.handleDelete.bind(this)}
          handleEditVideo={this.handleEditVideo.bind(this)}
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

const cur = routePath.VIDEO_SCHOOL
const curArray = [routePath.VIDEO_PERSONAL, routePath.VIDEO_SCHOOL]

const VideoSchool = factoryOfVideo({
  key: 1,
  title: '全部视频',
  currentKey: 'school',
  NavTabs: NavTabs({ currentKey: cur, routePath: curArray }),
  Select: Select(FILTER_VIDEO),
  SearchGroup,
  TableWithHeader,
  fetchVideoList: 'getVideoList',
  route: 'VIDEO_SCHOOL'
})

export default VideoSchool
