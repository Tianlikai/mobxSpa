import Component from 'components/Component'
import PropTypes from 'prop-types'

class BreadcrumbItem extends Component {
    static defaultProps = {
        prefixCls: 'breadItem',
        separator: '/',
        label: 'string'
    }
    static propTypes = {
        prefixCls: PropTypes.string,
        separator: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    }
    render() {
        const { prefixCls, separator, label } = this.props
        return (
            <span>
                <span className={`${prefixCls}-label`}>{label}</span>
                <span className={`${prefixCls}-separator`}>{separator}</span>
            </span>
        )
    }
}
export default BreadcrumbItem
