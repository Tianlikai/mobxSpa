import AuthComponent from '../../libs/AuthComponent'
import UpdateForm from './component/UpdateForm'

export default class VideoCreate extends AuthComponent {
    render() {
        const {
            location: { query, state }
        } = this.props
        const isSuperRight = G.attendant()
        return (
            <UpdateForm
                videoSource='metaVideo'
                title='添加视频'
                isSuperRight={isSuperRight}
                query={query}
                state={state}
            />
        )
    }
}
