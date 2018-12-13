import React from 'react'

import { Modal, Button, Icon } from 'antd'

import SelectPoints from 'widgets/QuestionCard/SelectPoints'

import './style.scss'

export default class ConnectPoint extends React.Component {
  state = {
    isTree: false
  }

  handleHideTree = () => this.setState({ isTree: false })
  handleOpenTree = () => this.setState({ isTree: true })

  handleClearPoint = () => {
    const { onChange } = this.props
    if (onChange) {
      onChange()
    }
  }

  selectPoint = point => {
    const { onChange } = this.props
    if (onChange) {
      onChange(point)
    }
    this.setState({ isTree: false })
  }

  render() {
    const { value, category } = this.props
    const { isTree } = this.state
    return (
      <div>
        {value && (
          <div className='pointList'>
            {value.name} &nbsp;
            <Icon type='close' onClick={this.handleClearPoint} />
          </div>
        )}

        <Button className='connectBtn' onClick={this.handleOpenTree}>
          {value ? <Icon type='edit' /> : <Icon type='plus' />}
          {value ? '修改知识点' : '关联知识点'}
        </Button>

        <Modal
          className='treeModal'
          title='关联知识点'
          visible={isTree}
          footer={null}
          width={768}
          onCancel={this.handleHideTree}
        >
          <SelectPoints selectPoint={this.selectPoint} subjectType={category} />
        </Modal>
      </div>
    )
  }
}
