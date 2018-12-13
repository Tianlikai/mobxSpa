import AuthComponent from '../../libs/AuthComponent'
import ModifyForm from './component/ModifyForm'

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
          console.err(err)
        })
    } else {
      console.err('参数错误')
    }
  }

  render() {
    const { initValue } = this.state
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
        isSuperRight={isSuperRight}
      />
    )
  }
}
