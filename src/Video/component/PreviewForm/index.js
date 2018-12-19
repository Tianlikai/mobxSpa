import AuthComponent from 'libs/AuthComponent'

import videoFormHoc from '../../hoc/videoFormHoc'

import FrameBox from 'widgets/FrameBox'

import TextAreaForm from './TextAreaForm'

import { Button, Icon, Modal, message } from 'antd'

import { routePath } from 'libs/routes'
import './style.scss'

const BoxHeader = FrameBox.BoxHeader

class TopMethod extends AuthComponent {
    render() {
        const { title, handleHistoryBack } = this.props
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
            </BoxHeader>
        )
    }
}

class FixedFooter extends AuthComponent {
    state = {
        visible: false
    }

    handleOpenTextArea = () => {
        this.setState({ visible: true })
    }

    handleCloseTextArea = () => {
        this.setState({ visible: false })
    }

    handleOver = () => {
        const { list, showType, query } = this.props

        if (list.length) {
            const copyList = list.slice()
            const next = copyList.shift()

            const state = {
                list: copyList,
                showType
            }

            const route = routePath.VIDEO_REVIEW.replace(
                ':videoId',
                next.id
            ).replace(':videoSource', next.videoSource)
            this.gotoPage(route, {}, query, state)
        } else {
            this.gotoPage(routePath.VIDEO_PENDING_REVIEW)
        }
    }

    // 不通过
    handleFail = values => {
        const {
            query,
            videoId,
            videoSource,
            list,
            getData,
            handleHistoryBack
        } = this.props
        const params = getData()
        if (!params) return null

        const data = {
            state: 2,
            id: videoId,
            videoSource,
            ...params,
            ...values
        }

        api.reviewVideo(data)
            .then(resp => {
                this.handleCloseTextArea()
                if (list && list.length) {
                    this.handleOver()
                } else {
                    const { from } = query || {}
                    if (from) {
                        handleHistoryBack()
                        this.gotoPage(routePath[from])
                    } else {
                        // 逻辑待定
                        this.gotoPage(routePath.VIDEO_PENDING_REVIEW)
                    }
                }
            })
            .catch(err => message.error('提交失败'))
    }

    handlePassConfirm = () => {
        Modal.confirm({
            title: '操作确认',
            content: '确认审核通过？',
            iconType: 'exclamation-circle',
            cancelText: '取消',
            okText: '确认',
            onOk: this.handlePass.bind(this)
        })
    }

    handlePass = () => {
        const {
            query,
            videoId,
            videoSource,
            list,
            getData,
            handleHistoryBack
        } = this.props
        const params = getData()
        if (!params) return null

        const data = {
            state: 3,
            id: videoId,
            videoSource,
            ...params
        }
        api.reviewVideo(data)
            .then(resp => {
                if (list && list.length) {
                    this.handleOver()
                } else {
                    const { from } = query || {}
                    if (from) {
                        handleHistoryBack()
                    } else {
                        this.gotoPage(routePath.VIDEO_PENDING_REVIEW)
                    }
                }
            })
            .catch(err => message.error('提交失败'))
    }

    render() {
        const { list } = this.props
        const { visible } = this.state

        const marginLeft = { marginLeft: 10 }
        return (
            <div className='fixFooter'>
                <div className='addBtn'>
                    <Button
                        style={marginLeft}
                        onClick={this.handleOpenTextArea}
                    >
                        审核不通过
                    </Button>
                    <Button type='primary' onClick={this.handlePassConfirm}>
                        审核通过
                    </Button>
                    {list ? (
                        <Button style={marginLeft} onClick={this.handleOver}>
                            跳过
                        </Button>
                    ) : null}
                </div>
                {visible ? (
                    <TextAreaForm
                        key='ModalForm'
                        visible={visible}
                        title='不通过理由'
                        onClose={this.handleCloseTextArea}
                        onSubmit={this.handleFail}
                    />
                ) : null}
            </div>
        )
    }
}

const PreviewForm = videoFormHoc({
    TopMethod,
    FixedFooter
})

export default PreviewForm
