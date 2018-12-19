import React from 'react'

import Select from './component/Select'
import NavTabs from './component/Tabs'
import ListCard from './component/ListCard'
import IconCircle from './component/IconCircle'
import TextWithIntercept from './component/TextWithIntercept'
import ActionSet from './component/ActionSet'
import GroupConnect from './component/SearchGroup/GroupConnect'

import videoHoc from './hoc/videoHoc'
import hocPreviewModal from './hoc/hocPreviewModal'
import hocConnectModal from './hoc/hocConnectModal'

import GearBox from 'widgets/QuestionCard/GearBox'

import { Table } from 'antd'

import { FILTER_VIDEO } from '../../config'

import './style.scss'

@hocPreviewModal
@hocConnectModal
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
            handleOpenConnect={this.handleOpenConnect.bind(this, record)}
          />
        )
      }
    ]
  }
  handleOpenPreview(record) {
    const { handleOpenPreview } = this.props
    if (handleOpenPreview) handleOpenPreview(record)
  }
  handleOpenConnect(record) {
    const { handleOpenConnect } = this.props
    if (handleOpenConnect) handleOpenConnect(record)
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
      selectedVideos,
      handleOpenConnect
    } = this.props

    const rowSelection = {
      selectedRowKeys: selectedVideos,
      onChange: this.handleSelectChange
    }

    return (
      <div>
        <GearBox content='关联知识点' handleClick={handleOpenConnect} />
        <ListCard
          key='listCard'
          page='connect'
          data={videos}
          loading={loading}
          display={listDisplay}
          selectedRowKeys={selectedVideos}
          handleChange={this.handleSelectChange}
          handleOpenPreview={this.handleOpenPreview.bind(this)}
          handleOpenConnect={this.handleOpenConnect.bind(this)}
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

export default videoHoc({
  key: 3,
  title: '待关联视频',
  currentKey: null,
  NavTabs: null,
  Select: Select(FILTER_VIDEO),
  SearchGroup: GroupConnect,
  fetchVideoList: 'getNoConnectList',
  route: 'VIDEO_CONNECT'
})(VideoConnect)
