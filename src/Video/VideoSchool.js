import React from 'react'

import Select from './component/Select'
import NavTabs from './component/Tabs'
import ListCard from './component/ListCard'
import VideoState from './component/VideoState'
import TextWithIntercept from './component/TextWithIntercept'
import ActionSet from './component/ActionSet'
import GroupSchool from './component/SearchGroup/GroupSchool'

import videoHoc from './hoc/videoHoc'
import hocPreviewModal from './hoc/hocPreviewModal'

import GearBox from 'widgets/QuestionCard/GearBox'
import SelectGroup from 'widgets/Layout/SelectGroup'

import { Table } from 'antd'

import { FILTER_VIDEO, routePath } from '../../config'

const cur = routePath.VIDEO_SCHOOL
const curArray = [routePath.VIDEO_PERSONAL, routePath.VIDEO_SCHOOL]
const GearBoxWithCallBack = props => (
  <GearBox addIcon content='添加视频' handleClick={props.historyToCreate} />
)

@hocPreviewModal
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

export default videoHoc({
  key: 1,
  title: '全部视频',
  currentKey: 'school',
  GearBox: GearBoxWithCallBack,
  NavTabs: NavTabs({ currentKey: cur, routePath: curArray }),
  Select: Select(FILTER_VIDEO),
  SearchGroup: GroupSchool,
  fetchVideoList: 'getVideoList',
  route: 'VIDEO_SCHOOL'
})(VideoSchool)
