import React from 'react'

import { Menu, Dropdown as DropDown, Icon, Checkbox } from 'antd'

import IconCircle from '../IconCircle'

import { STATUS_VIDEO } from '../../../../config'

import POINT from './point@3x.png'
import styles from './Card.scss'

export const Title = props => <div className={props.classes}>{props.name}</div>

class Card extends React.Component {
  constructor(props) {
    super(props)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleReBack = this.handleReBack.bind(this)
    this.handleReview = this.handleReview.bind(this)
    this.handleEditVideo = this.handleEditVideo.bind(this)
    this.handleModifyVideo = this.handleModifyVideo.bind(this)
    this.handleOpenConnect = this.handleOpenConnect.bind(this)
    this.handleOpenPreview = this.handleOpenPreview.bind(this)
  }

  handleDelete() {
    const { id, videoSource, handleDelete } = this.props
    if (handleDelete) {
      handleDelete({ id, videoSource })
    }
  }

  handleReBack() {
    const { id, videoSource, handleReBack } = this.props
    if (handleReBack) {
      handleReBack({ id, videoSource })
    }
  }

  handleReview() {
    const { handleReview, id, videoSource } = this.props
    if (handleReview) {
      handleReview({ id, videoSource })
    }
  }

  handleOpenPreview() {
    const { handleOpenPreview, url, fileName } = this.props
    if (handleOpenPreview) {
      handleOpenPreview({ url, fileName })
    }
  }

  handleEditVideo() {
    const { handleEditVideo, id, videoSource } = this.props
    if (handleEditVideo) {
      handleEditVideo({ id, videoSource })
    }
  }

  handleModifyVideo() {
    const { handleModifyVideo, ...rest } = this.props
    if (handleModifyVideo) {
      handleModifyVideo({ ...rest })
    }
  }

  handleOpenConnect() {
    const { handleOpenConnect, id, category, videoSource } = this.props
    if (handleOpenConnect) {
      handleOpenConnect({ id, videoSource, category })
    }
  }

  onChange = e => {
    const { onChange, id } = this.props
    if (onChange) onChange(id)
  }

  render() {
    const {
      page,
      cover,
      fileName,
      state,
      className,
      selectedRowKeys,
      id,
      isSuperRight,
      selectedVideos
    } = this.props

    let stateText
    if (state || state === 0) {
      stateText = STATUS_VIDEO[state + 1].text
    }

    let hasPreview // 预览
    let hasEdit // 编辑
    let hasLook // 产看
    let hasModify // 修改
    let hasReview // 审核
    let hasConnect // 关联
    let hasDel // 删除
    let hasReBack // 恢复

    switch (page) {
      case 'personal':
        hasPreview = true
        hasDel = true
        hasEdit = state === 0
        hasLook = state === 1 || state === 3
        hasModify = state === 2
        break
      case 'school':
        hasPreview = true
        if (isSuperRight) {
          hasReview = state === 1
          hasLook = state === 3
          hasModify = state === 2
          hasDel = state === 2 || state === 3
        }
        break
      case 'modify':
        hasPreview = true
        hasModify = true
        hasDel = true
        break
      case 'review':
        hasPreview = true
        hasReview = true
        break
      case 'connect':
        hasPreview = true
        hasConnect = true
        break
      case 'recycleBin':
        hasPreview = true
        hasReBack = true
        break
    }

    const hasDrop = // 下啦菜单展示
      hasPreview ||
      hasEdit ||
      hasLook ||
      hasModify ||
      hasReview ||
      hasConnect ||
      hasDel ||
      hasReBack

    const itemMenu = (
      <Menu>
        {hasPreview ? (
          <Menu.Item>
            <span
              className={styles.videoMethod}
              onClick={this.handleOpenPreview}
            >
              预览
            </span>
          </Menu.Item>
        ) : null}

        {hasEdit ? (
          <Menu.Item>
            <span className={styles.videoMethod} onClick={this.handleEditVideo}>
              编辑
            </span>
          </Menu.Item>
        ) : null}

        {hasLook ? (
          <Menu.Item>
            <span className={styles.videoMethod} onClick={this.handleEditVideo}>
              查看
            </span>
          </Menu.Item>
        ) : null}

        {hasModify ? (
          <Menu.Item>
            <span
              className={styles.videoMethod}
              onClick={this.handleModifyVideo}
            >
              修改
            </span>
          </Menu.Item>
        ) : null}

        {hasReview ? (
          <Menu.Item>
            <span className={styles.videoMethod} onClick={this.handleReview}>
              审核
            </span>
          </Menu.Item>
        ) : null}

        {hasConnect ? (
          <Menu.Item>
            <span
              className={styles.videoMethod}
              onClick={this.handleOpenConnect}
            >
              关联知识点
            </span>
          </Menu.Item>
        ) : null}

        {hasDel ? (
          <Menu.Item>
            <span className={styles.videoMethod} onClick={this.handleDelete}>
              删除
            </span>
          </Menu.Item>
        ) : null}
        {hasReBack ? (
          <Menu.Item>
            <span className={styles.videoMethod} onClick={this.handleReBack}>
              恢复
            </span>
          </Menu.Item>
        ) : null}
      </Menu>
    )

    const classes = className
      ? `${styles.cardWrapper} ${className}`
      : styles.cardWrapper

    let bcg = ''
    switch (state) {
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

    const checked = selectedRowKeys ? selectedRowKeys.has(id) : false

    return (
      <div className={classes}>
        <div className={styles.imgWrapper}>
          <img src={cover} alt='cover' />
        </div>
        <div className={styles.cardTitle}>{fileName}</div>

        {stateText && page !== 'recycleBin' ? (
          <div className={styles.statusWrapper}>
            <IconCircle size={10} bcg={bcg} />
            <span>{stateText}</span>
          </div>
        ) : null}

        {hasDrop ? (
          <div className={styles.dropDown}>
            <DropDown placement='bottomRight' overlay={itemMenu}>
              <span className={styles.pointBC} />
            </DropDown>
          </div>
        ) : null}

        {selectedVideos ? (
          <Checkbox
            checked={checked}
            className={styles.checkbox}
            onChange={this.onChange}
          />
        ) : null}
      </div>
    )
  }
}

export default Card
