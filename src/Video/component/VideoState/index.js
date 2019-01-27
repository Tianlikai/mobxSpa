import IconCircle from '../IconCircle'
import { Tooltip } from 'antd'
import { STATUS_VIDEO } from '../../../../config'

const VideoState = props => {
    const { text, size, record, className } = props

    let stateText
    if (text || text === 0) {
        stateText = STATUS_VIDEO[text + 1].text
    }

    let bcg = ''
    switch (text) {
        case 0:
            bcg = '#2c5b8f'
            break
        case 1:
            bcg = '#FF9E16'
            break
        case 2:
            bcg = '#FF591A'
            break
        case 3:
            bcg = '#77BC2B'
            break
    }

    let title = ''
    if (record && record.reason) {
        title = record.reason
    }

    const classes = className ? `withToolTip ${className}` : 'withToolTip'

    return (
        <div className={classes}>
            <Tooltip title={title}>
                <IconCircle size={size || 10} bcg={bcg} />
                <span>{stateText}</span>
            </Tooltip>
        </div>
    )
}

export default VideoState
