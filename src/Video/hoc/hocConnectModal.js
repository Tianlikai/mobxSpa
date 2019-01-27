import AuthComponent from 'libs/AuthComponent'

import SelectPoints from 'widgets/QuestionCard/SelectPoints'

import { Modal, message } from 'antd'
import Storage from '../../../helpers/Storage'

const hocPreviewModal = WrapperComponent => {
    return class PreviewModal extends AuthComponent {
        state = {
            id: null,
            isTree: false,
            category: null
        }

        handleHideTree() {
            this.setState({ isTree: false })
        }

        handleOpenConnect = record => {
            const { category: ca, id } = record || {}
            if (ca || ca === 0) {
                this.setState({
                    isTree: true,
                    category: ca,
                    id: id
                })
                return null
            }

            const { selectedVideos, allVideos } = this.props

            if (!selectedVideos.length) {
                return Modal.info({ title: '请选择视频' })
            }

            const list = selectedVideos.map(id => {
                const resp = allVideos.find(item => item.id === id)
                if (resp) return resp.category
            })

            const set = new Set([...list])

            if (set.size > 1) {
                return message.warning('跨学科内容无法关联同一个知识点')
            } else {
                this.setState({
                    isTree: true,
                    category: Array.from(set)[0]
                })
            }
        }

        /**
         * 关联知识点
         * @param {object} point 知识点信息
         */
        handleConnect = point => {
            const { id } = this.state
            const { selectedVideos, handleConnect: Connect } = this.props

            const kpointIds = point ? [point.id || point.treeId] : []
            let data = { kpointIds, orgId: Storage.get('orgId') || 1000050 }

            if (id || id === 0) {
                data.videoId = [id]
            } else {
                data.videoId = selectedVideos
            }

            Connect(data, () =>
                this.setState({
                    id: null,
                    isTree: false,
                    category: null
                })
            )
        }

        render() {
            const { isTree, category } = this.state
            return (
                <div>
                    {isTree ? (
                        <Modal
                            className='treeModal'
                            title='关联知识点'
                            visible={isTree}
                            footer={null}
                            width={768}
                            onCancel={this.handleHideTree}
                        >
                            <SelectPoints
                                selectPoint={this.handleConnect}
                                subjectType={category}
                            />
                        </Modal>
                    ) : null}
                    <WrapperComponent
                        handleOpenConnect={this.handleOpenConnect}
                        {...this.props}
                    />
                </div>
            )
        }
    }
}

export default hocPreviewModal
