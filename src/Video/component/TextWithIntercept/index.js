import { Tooltip } from 'antd'

import './style.scss'

/**
 * 文字截取
 */
const TextWithIntercept = props => {
  const { text, len, className } = props
  const classes = className ? `withToolTip ${className}` : 'withToolTip'
  return (
    <div className={classes}>
      <Tooltip title={text}>
        {text && text.length > len ? text.substring(0, len) + '...' : text}
      </Tooltip>
    </div>
  )
}

export default TextWithIntercept
