import AuthComponent from 'libs/AuthComponent'

import videoFormHoc from '../../hoc/videoFormHoc'
import PromptReason from '../PromptReason'

import { Modal, Button, Icon, message } from 'antd'

import FrameBox from 'widgets/FrameBox'

const BoxHeader = FrameBox.BoxHeader

import './style.scss'

class TopMethod extends AuthComponent {
    confirmPublish = () => {
        Modal.confirm({
            className: 'adminConfirm',
            title: '确认操作',
            content: '即将直接发布视频至学校库？',
            okText: '确认',
            cancelText: '取消',
            iconType: 'exclamation-circle',
            onOk: this.handlePublish
        })
    }

    handlePublish = () => {
        const { getData, handleHistoryBack } = this.props
        const params = getData()
        if (!params) return null
        api.videoPush(params)
            .then(resp => {
                handleHistoryBack()
                message.success('视频发布成功')
            })
            .catch(() => {
                message.error('视频发布失败')
            })
    }

    handleReview = () => {
        const { videoSource, getData, handleHistoryBack } = this.props
        const params = getData()
        if (!params) return null
        const data = { state: 1, videoSource, ...params }
        api.videoSaveQuestion(data)
            .then(resp => {
                handleHistoryBack()
                message.success('提交审核成功')
            })
            .catch(() => {
                message.error('提交审核失败')
            })
    }

    render() {
        const { title, isSuperRight, handleHistoryBack } = this.props
        return (
            <BoxHeader>
                <Button
                    className='self-left-back'
                    size='large'
                    type='default'
                    onClick={handleHistoryBack}
                >
                    <Icon type='left' />
                    返回
                </Button>

                <h4 className='storeHead'>{title}</h4>

                {isSuperRight ? (
                    <Button
                        className='self-right-submit'
                        size='large'
                        type='primary'
                        onClick={this.confirmPublish}
                    >
                        发布
                    </Button>
                ) : (
                    <Button
                        className='self-right-submit'
                        size='large'
                        type='primary'
                        onClick={this.handleReview}
                    >
                        提交审核
                    </Button>
                )}
            </BoxHeader>
        )
    }
}

class FixedFooter extends AuthComponent {
    handleSave = () => {
        const { getData, videoSource, handleHistoryBack } = this.props
        const params = getData()
        if (!params) return null
        const data = { state: 0, videoSource, ...params }
        api.videoSaveQuestion(data)
            .then(resp => {
                handleHistoryBack()
                message.success('保存成功')
            })
            .catch(() => {
                message.error('保存失败')
            })
    }

    render() {
        const { handleHistoryBack } = this.props
        const marginLeft = { marginLeft: 10 }
        return (
            <div className='fixFooter'>
                <div className='addBtn'>
                    <Button style={marginLeft} onClick={handleHistoryBack}>
                        取消
                    </Button>
                    <Button type='primary' onClick={this.handleSave}>
                        保存并退出
                    </Button>
                </div>
            </div>
        )
    }
}

const ModifyForm = videoFormHoc({
    TopMethod,
    PromptReason,
    FixedFooter
})

export default ModifyForm
