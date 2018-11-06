import Component from 'components/Component'
import PropTypes from 'prop-types'
import BreadcrumbItem from './BreadcrumbItem'
import classNames from 'classnames'

import './style.scss'

class Breadcrumb extends Component {
    static defaultProps = {
        prefixCls: 'breadcrumb'
    }
    static propTypes = {
        prefixCls: PropTypes.string,
        className: PropTypes.string,
        config: PropTypes.array
    }
    render() {
        let crumbs
        const { config, prefixCls, className, children } = this.props
        const cn = classNames(className, prefixCls)
        if (config && config.length > 0) {
            crumbs = config.map(label => {
                return <BreadcrumbItem label={label} />
            })
        } else if (children) {
            // 这个地方等待处理
            // 满足多种组件定义需求
        }
        return <div className={cn}>{crumbs}</div>
    }
}

export default Breadcrumb
