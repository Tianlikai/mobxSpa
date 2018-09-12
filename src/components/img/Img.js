import Component from '../Component'
import PropTypes from 'prop-types'
import Spinner from '../spiner/Spinner'

import './Img.scss'

export default class Img extends Component {
    static defaultProps = {
        prefixCls: 'pCode',
        prefixUrl: 'data:image/gif;base64,'
    }
    static propTypes = {
        prefixCls: PropTypes.string,
        className: PropTypes.string, // img dataUrl
        imgByte: PropTypes.string,
        loadingStyle: PropTypes.object // 载入图片过程中loading的样式
    }
    render() {
        const {
            imgByte,
            loadingStyle,
            prefixCls,
            prefixUrl,
            className
        } = this.props
        const cName = className ? `${prefixCls} ${className}` : prefixCls
        return (
            <div className={cName}>
                {!imgByte && <Spinner style={loadingStyle} />}
                {imgByte && (
                    <img
                        className={`${prefixCls}-img`}
                        src={`${prefixUrl}${imgByte}`}
                    />
                )}
            </div>
        )
    }
}
