import AuthComponent from '../../libs/AuthComponent'
import PreviewForm from './component/PreviewForm'

export default class VideoReview extends AuthComponent {
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
          console.log(err)
        })
    } else {
      console.log('参数错误')
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      params: { videoId, videoSource }
    } = nextProps
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
          console.log(err)
        })
    } else {
      console.log('参数错误')
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
      <PreviewForm
        title='审核视频'
        query={query}
        state={state}
        videoId={videoId}
        initValue={initValue}
        isSuperRight={isSuperRight}
      />
    )
  }
}
