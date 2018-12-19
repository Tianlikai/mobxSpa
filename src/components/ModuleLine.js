import PropTypes from 'prop-types'

const ModuleLine = props => {
    const { title, children } = props
    return (
        <div className='contentTitle'>
            {title}
            {children}
        </div>
    )
}

ModuleLine.propTypes = {
    title: PropTypes.string,
    children: PropTypes.element
}

export default ModuleLine
