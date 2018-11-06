import Component from 'components/Component'
import classNames from 'classnames'

import './styles/Layout.scss'

class LayoutSide extends Component {
    render() {
        const { children, className } = this.props
        return <div className={className}>{children && children}</div>
    }
}

class Layout extends Component {
    static defaultProps = {
        prefixCls: 't-layout'
    }
    render() {
        const { children, className, prefixCls, style } = this.props
        const cn = classNames(className, prefixCls)
        return (
            <div className={cn} style={style}>
                {children && children}
            </div>
        )
    }
}

Layout.LayoutSide = LayoutSide

export default Layout
