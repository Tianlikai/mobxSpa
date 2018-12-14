import React from 'react'

import { Button } from 'antd'

import Card from '../../ListCard/Card'
import { Title } from '../../ListCard/Card'

import Preview from 'widgets/Preview/Preview'
import Uploader from 'widgets/Upload/Uploader'

import './style.scss'

export default class FormUpLoader extends React.Component {
  state = {
    preview: false
  }

  handleClosePreview = () => {
    this.setState({
      preview: false
    })
  }

  handleOpenPreview = () => {
    this.setState({
      preview: true
    })
  }

  handleChangeFileName = data => {
    const { value, onChange } = this.props
    const video = {
      name: data,
      medias: value && value.medias ? value.medias : ''
    }
    if (onChange) {
      onChange(video)
    }
  }

  handleComplete = data => {
    const { value, onChange } = this.props
    const video = {
      name: value && value.name ? value.name : '',
      medias: data
    }
    if (onChange) {
      onChange(video)
    }
  }

  render() {
    const { preview } = this.state
    const { value, mimeType } = this.props
    const { medias, name } = value || {}

    const marginTop = { marginTop: 4 }

    const PreviewTitle = (
      <Title
        name={name && name.length > 60 ? name.substring(0, 60) + '...' : name}
        classes='previewTitle'
      />
    )

    return (
      <div>
        <Uploader
          value={name}
          mimeType={mimeType}
          type='formUploadItem'
          bucket='learnta-video-public'
          text={medias ? '重新上传' : '点击上传'}
          onComplete={this.handleComplete}
          changeFileName={this.handleChangeFileName}
        />

        {medias && name ? (
          <Card
            className='self-card'
            cover={`https://lcdns-vv.learnta.com/res/${medias}?vframe/jpg/offset/2`}
            fileName={name}
          />
        ) : null}

        <Button
          disabled={!medias || !name}
          style={marginTop}
          onClick={this.handleOpenPreview}
        >
          预览
        </Button>

        {preview && medias && (
          <Preview
            type='video'
            data={medias}
            title={PreviewTitle}
            className='videoPreviewModal'
            onCancel={this.handleClosePreview}
          />
        )}
      </div>
    )
  }
}
