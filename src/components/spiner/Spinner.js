import Component from '../Component'
import src from './spinner.gif'

export default class Spinner extends Component {
    render() {
        const style = this.props.style || {
            display: 'block',
            width: '40px',
            margin: '50px auto'
        }
        return <img style={style} src={src} />
    }
}
