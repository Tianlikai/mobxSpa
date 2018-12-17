import React from 'react'

import Select from './component/Select'
import NavTabs from './component/Tabs'
import ListCard from './component/ListCard'
import VideoState from './component/VideoState'
import TextWithIntercept from './component/TextWithIntercept'
import ActionSet from './component/ActionSet'

import videoHoc from './hoc/videoHoc'
import searchGroupHoc from './hoc/searchGroupHoc'

import GearBox from 'widgets/QuestionCard/GearBox'
import SelectGroup from 'widgets/Layout/SelectGroup'

import { Table } from 'antd'

import Storage from '../../helpers/Storage'
import { FILTER_VIDEO, STATUS_VIDEO, routePath } from '../../config'

@searchGroupHoc({ source: 1, createBy: true })
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
        // {
        //   value: '2',
        //   text: '需修改'
        // },
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
        defaultValue: createdBy || ''
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
        defaultValue: state || ''
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
    inputList = selectList.concat(item).concat(inputList)
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

const cur = routePath.VIDEO_SCHOOL
const curArray = [routePath.VIDEO_PERSONAL, routePath.VIDEO_SCHOOL]
const GearBoxWithCallBack = props => (
  <GearBox addIcon content='添加视频' handleClick={props.historyToCreate} />
)

@videoHoc({
  key: 1,
  title: '全部视频',
  currentKey: 'school',
  GearBox: GearBoxWithCallBack,
  NavTabs: NavTabs({ currentKey: cur, routePath: curArray }),
  Select: Select(FILTER_VIDEO),
  SearchGroup,
  fetchVideoList: 'getVideoList',
  route: 'VIDEO_SCHOOL'
})
class VideoSchool extends React.Component {
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
        title: '视频状态',
        dataIndex: 'state',
        key: 'state',
        render: (text, record) => (
          <VideoState size={10} record={record} text={text} />
        )
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
          return (
            <ActionSet
              page='school'
              record={record}
              isSuperRight={isSuperRight}
              handleOpenPreview={this.handleOpenPreview.bind(this, record)}
              handleReview={this.handleReview.bind(this, record)}
              handleModifyVideo={this.handleModifyVideo.bind(this, record)}
              handleEditVideo={this.handleEditVideo.bind(this, record)}
              handleDelete={this.handleDelete.bind(this, record)}
            />
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

export default VideoSchool
