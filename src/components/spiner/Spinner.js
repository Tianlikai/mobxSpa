import PropTypes from 'prop-types'

import src from './spinner.gif'

const Spinner = props => {
    const { style: sty } = props
    const style = sty || {
        display: 'block',
        width: '40px',
        margin: '50px auto'
    }
    return <img style={style} src={src} />
}

Spinner.propTypes = {
    style: PropTypes.obj
}

export default Spinner
