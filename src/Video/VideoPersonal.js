import AuthComponent from 'libs/AuthComponent'

import Select from './component/Select'
import NavTabs from './component/Tabs'
import ListCard from './component/ListCard'
import VideoState from './component/VideoState'
import TextWithIntercept from './component/TextWithIntercept'
import ActionSet from './component/ActionSet'
import GroupPersonal from './component/SearchGroup/GroupPersonal'

import videoHoc from './hoc/videoHoc'
import hocPreviewModal from './hoc/hocPreviewModal'

import GearBox from 'widgets/QuestionCard/GearBox'

import { Table } from 'antd'

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
                    if (text && text.length > 0) { str = text.reduce((l, r) => (l += r + ','), '') }
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
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                className: 'td-action',
                render: (text, record) => (
                    <ActionSet
                        page='personal'
                        record={record}
                        handleOpenPreview={this.handleOpenPreview.bind(
                            this,
                            record
                        )}
                        handleEditVideo={this.handleEditVideo.bind(
                            this,
                            record
                        )}
                        handleModifyVideo={this.handleModifyVideo.bind(
                            this,
                            record
                        )}
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

    handleEditVideo(record) {
        const { handleEditVideo } = this.props
        if (handleEditVideo) handleEditVideo(record)
    }

    handleModifyVideo(record) {
        const { handleModifyVideo } = this.props
        if (handleModifyVideo) handleModifyVideo(record)
    }

    handleDelete(record) {
        const { handleDelete } = this.props
        if (handleDelete) handleDelete(record)
    }

    historyToCreate = () => {
        const { showType } = this.props
        const query = {
            from: 'VIDEO_PERSONAL'
        }
        const state = {
            showType
        }
        this.gotoPage(routePath.VIDEO_CREATE, {}, query, state)
    }

    render() {
        const { videos, loading, clsTable, listDisplay } = this.props
        return (
            <div>
                <GearBox
                    addIcon
                    content='添加视频'
                    handleClick={this.historyToCreate}
                />
                <ListCard
                    key='listCard'
                    page='personal'
                    data={videos}
                    loading={loading}
                    display={listDisplay}
                    handleDelete={this.handleDelete.bind(this)}
                    handleEditVideo={this.handleEditVideo.bind(this)}
                    handleModifyVideo={this.handleModifyVideo.bind(this)}
                    handleOpenPreview={this.handleOpenPreview.bind(this)}
                />
                <Table
                    key='table'
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

const cur = routePath.VIDEO_PERSONAL
const curArray = [routePath.VIDEO_PERSONAL, routePath.VIDEO_SCHOOL]

export default videoHoc({
    key: 1,
    title: '全部视频',
    currentKey: 'mine',
    NavTabs: NavTabs({ currentKey: cur, routePath: curArray }),
    Select: Select(FILTER_VIDEO),
    SearchGroup: GroupPersonal,
    fetchVideoList: 'getVideoList',
    route: 'VIDEO_PERSONAL'
})(VideoPersonal)
