import { Icon } from 'antd'

import styles from './style.scss'

const SwitchOfList = props => {
  const classesBars =
    props.showType === 'table' ? `${styles.bars} ${styles.active}` : styles.bars
  const classesCard =
    props.showType === 'card' ? `${styles.card} ${styles.active}` : styles.card
  return (
    <div className={styles.root}>
      <span className={classesBars} onClick={props.handleRedirectToTable}>
        <Icon type='bars' />
      </span>
      <span className={classesCard} onClick={props.handleRedirectToCard}>
        <Icon type='appstore-o' />
      </span>
    </div>
  )
}

export default SwitchOfList
