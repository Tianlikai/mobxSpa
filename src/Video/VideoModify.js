import AuthComponent from '../../libs/AuthComponent'
import ModifyForm from './component/ModifyForm'

import { message } from 'antd'

export default class VideoModify extends AuthComponent {
  state = {
    initValue: {}
  }

  componentDidMount() {
    const {
      params: { videoId, videoSource }
    } = this.props
    if ((videoId || videoId === 0) && videoSource) {
      api
        .fetchVideoById({
          videoId,
          videoSource
        })
        .then(resp => {
          this.setState({ initValue: resp })
        })
        .catch(err => {
          message.error('请求出错')
        })
    } else {
      message.error('参数错误')
    }
  }

  render() {
    const { initValue } = this.state
    const { videoSource } = initValue
    let VS = ''
    if (videoSource) {
      VS = videoSource
    }
    const {
      location: { query, state },
      params: { videoId }
    } = this.props
    const isSuperRight = G.attendant()
    return (
      <ModifyForm
        title='编辑视频'
        query={query}
        state={state}
        videoId={videoId}
        initValue={initValue}
        videoSource={VS}
        isSuperRight={isSuperRight}
      />
    )
  }
}
