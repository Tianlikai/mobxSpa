import AuthComponent from 'libs/AuthComponent'

import Preview from 'widgets/Preview/Preview'

export const Title = props => <div className={props.classes}>{props.name}</div>

const hocPreviewModal = WrapperComponent => {
  return class PreviewModal extends AuthComponent {
    state = {
      preview: false,
      url: '',
      fileName: ''
    }

    handleClosePreview() {
      this.setState({ preview: false })
    }

    handleOpenPreview({ url, fileName } = { url: '', fileName: '' }) {
      this.setState({ preview: true, url, fileName })
    }

    render() {
      const { preview, url, fileName } = this.state
      const PreviewTitle = (
        <Title
          name={
            fileName.length > 50 ? fileName.substring(0, 50) + '...' : fileName
          }
          classes='previewTitle'
        />
      )
      return (
        <div>
          {preview && url && (
            <Preview
              type='video'
              data={url}
              footer={null}
              className='videoPreviewModal'
              title={PreviewTitle}
              onCancel={this.handleClosePreview}
            />
          )}
          <WrapperComponent
            handleOpenPreview={this.handleOpenPreview}
            {...this.props}
          />
        </div>
      )
    }
  }
}

export default hocPreviewModal
