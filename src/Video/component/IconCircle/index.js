import './style.scss'

const IconCircle = props => {
  const { size, className, bcg } = props
  const style = {
    height: size,
    width: size,
    backgroundColor: bcg || '#2c5b8f'
  }
  const classesIcon = className ? `iconCircle ${className}` : 'iconCircle'
  return <span style={style} className={classesIcon} />
}

export default IconCircle
