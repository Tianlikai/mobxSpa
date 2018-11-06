import Component from 'components/Component'
import Breadcrumb from './Breadcrumb'

export default class WithBreadcrumb extends Component {
    render() {
        const { children, config } = this.props
        return (
            <div>
                <Breadcrumb config={config} />
                {children && children}
            </div>
        )
    }
}
