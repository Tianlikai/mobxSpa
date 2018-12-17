import React from 'react'

import Card from './Card'

import { Menu, Spin, Checkbox } from 'antd'

import styles from './style.scss'

export default class ListCard extends React.Component {
  state = {
    selectedRowKeys: new Set([]), // 总数
    indeterminate: false,
    checkAll: false
  }

  commonUtil(data) {
    const pageIds = data.map(item => item.id)
    const currentPage = new Set([...pageIds])
    const currentSize = currentPage.size // now 总数

    return { currentPage, currentSize }
  }

  componentWillReceiveProps(nextProps) {
    const { data, selectedRowKeys: selectedVideos } = nextProps
    if (selectedVideos) {
      const { currentPage, currentSize } = this.commonUtil(data)

      const oldPage = new Set([...selectedVideos])

      const { selectedRowKeys } = this.state
      const ids = new Set([...selectedRowKeys])

      const intersect = new Set([...currentPage].filter(x => ids.has(x)))

      this.setState({
        selectedRowKeys: oldPage,
        indeterminate: intersect.size && intersect.size < currentSize,
        checkAll: intersect.size !== 0 && intersect.size === currentSize
      })
    }
  }

  handleChange = id => {
    const { data } = this.props

    const { currentPage, currentSize } = this.commonUtil(data)

    const { selectedRowKeys } = this.state
    const ids = new Set([...selectedRowKeys])

    if (ids.has(id)) {
      ids.delete(id)
    } else {
      ids.add(id)
    }

    const intersect = new Set([...currentPage].filter(x => ids.has(x)))

    this.setState(
      {
        selectedRowKeys: ids,
        indeterminate: intersect.size && intersect.size < currentSize,
        checkAll: intersect.size !== 0 && intersect.size === currentSize
      },
      () => {
        const { handleChange } = this.props
        const array = Array.from(ids)
        handleChange(array)
      }
    )
  }

  handleCheckAll = e => {
    const { data } = this.props
    const { currentPage } = this.commonUtil(data)

    const { selectedRowKeys } = this.state
    const ids = new Set([...selectedRowKeys])

    const { checked } = e.target

    const set = checked
      ? new Set([...ids, ...currentPage])
      : new Set([...ids].filter(x => !currentPage.has(x)))

    this.setState(
      {
        selectedRowKeys: set,
        indeterminate: false,
        checkAll: checked
      },
      () => {
        const { handleChange } = this.props
        const array = Array.from(set)
        handleChange(array)
      }
    )
  }

  render() {
    const { indeterminate, checkAll, selectedRowKeys } = this.state

    const {
      display,
      data,
      loading,
      selectedRowKeys: selectedVideos,
      className: cn,
      ...props
    } = this.props

    let classes = display ? `${styles.root} ${cn}` : styles.displayNone

    classes = loading ? `${classes} ${styles.loading}` : classes

    return (
      <div className={classes}>
        {selectedVideos && data && data.length > 0 ? (
          <Checkbox
            className={styles.check}
            indeterminate={indeterminate}
            checked={checkAll}
            onChange={this.handleCheckAll}
          >
            全选
          </Checkbox>
        ) : null}

        <div className={styles.listRoot}>
          {data &&
            data.map(card => (
              <Card
                key={card.id}
                {...card}
                {...props}
                selectedVideos={selectedVideos}
                selectedRowKeys={selectedRowKeys}
                onChange={this.handleChange}
              />
            ))}
          {loading ? (
            <div className={styles.spinLoading}>
              <Spin />
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}
