import AuthComponent from 'libs/AuthComponent'

import Select from './component/Select'
import ListCard from './component/ListCard'
import TextWithIntercept from './component/TextWithIntercept'
import ActionSet from './component/ActionSet'
import GroupReview from './component/SearchGroup/GroupReview'

import videoHoc from './hoc/videoHoc'
import hocPreviewModal from './hoc/hocPreviewModal'

import GearBox from 'widgets/QuestionCard/GearBox'

import { Table, Modal } from 'antd'

import { FILTER_VIDEO, routePath } from '../../config'

import './style.scss'

@hocPreviewModal
class VideoPersonal extends AuthComponent {
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
                        handleOpenPreview={this.handleOpenPreview.bind(
                            this,
                            record
                        )}
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
    historyToPreview = () => {
        const { showType, selectedVideos, videos } = this.props

        if (!selectedVideos.length) {
            return Modal.info({ title: '请选择视频' })
        }

        const list = selectedVideos.map(id => {
            const resp = videos.find(item => item.id === id)
            if (resp) return resp
        })

        const first = list.shift()

        const query = {
            from: 'VIDEO_PENDING_REVIEW'
        }

        const state = {
            list,
            showType
        }
        const route = routePath.VIDEO_REVIEW.replace(
            ':videoId',
            first.id
        ).replace(':videoSource', first.videoSource)

        this.gotoPage(route, {}, query, state)
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
                <GearBox
                    content='审核视频'
                    handleClick={this.historyToPreview}
                />
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

export default videoHoc({
    key: 2,
    title: '待审核视频',
    Select: Select(FILTER_VIDEO),
    SearchGroup: GroupReview,
    fetchVideoList: 'getPendingVideoList',
    route: 'VIDEO_PENDING_REVIEW'
})(VideoPersonal)
