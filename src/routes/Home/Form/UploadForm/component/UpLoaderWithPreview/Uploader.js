import React from 'react';
import PropTypes from 'prop-types';

import { Icon, Modal } from 'antd';

import Q from '../../../../../../utils/qiniuUtils';

export const VIDEO_BASE_URL = 'https://lcdns-vv.learnta.com/res/';
export const VIDEO_CUSTOM_URL = 'https://lcdns-pic.learnta.com/'; // 自己上传的视频，tree和自己上传的PDF
export const AUDIO_BASE_URL = 'https://lcdns-audio.learnta.com/';

export const QINIU_BUCKETS = {
  'learnta-picks': VIDEO_CUSTOM_URL,
  'learnta-audio': AUDIO_BASE_URL,
  'learnta-video-public': VIDEO_BASE_URL,
};

class Uploader extends React.Component {
  static defaultProps = {
    mimeType: null,
    typeErrMessage: '上传文件格式不正确',
    sizeLimit: 10000 * 1024 * 1024,
    sizeErrMessage: '仅允许上传5M以内的图片',
    width: 80,
    height: 80,
  };

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    mimeType: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    sizeLimit: PropTypes.number,
    sizeErrMessage: PropTypes.string,
    typeErrMessage: PropTypes.string,
    children: PropTypes.element,
    type: PropTypes.string,
    imageMask: PropTypes.string,
    text: PropTypes.string,
    bucket: PropTypes.string,
    value: PropTypes.string,
    onComplete: PropTypes.func,
    onProgress: PropTypes.func,
    onError: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const { bucket } = this.props;
    let { value = '' } = this.props;

    this.bucket = bucket || 'learnta-video-public';
    this.domain = QINIU_BUCKETS[bucket];

    if (value && value.indexOf('lcdns-pic.learnta.com') === -1) {
      value = this.domain + value;
    }

    this.state = {
      imageUrl: value,
      loading: false,
      progress: 0,
    };
  }

  complete(res, type, name) {
    this.setState({ loading: false, imageUrl: this.bucket + res.hash });
    const { onComplete } = this.props;
    if (onComplete) onComplete(res.hash, type, name);
  }

  next(info) {
    this.setState({ progress: info.total.percent.toFixed(0) });
    const { onProgress } = this.props;
    if (onProgress) onProgress(info);
  }

  error(err) {
    this.setState({ loading: false });
    const { onError, typeErrMessage } = this.props;
    if (onError) onError(err);
    Modal.error({ title: typeErrMessage });
  }

  upload() {
    this.setState({ loading: true });
  }

  render() {
    const {
      loading, imageUrl, progress, value,
    } = this.state;
    const {
      width, height, children, type, imageMask, text,
    } = this.props;
    if (children) {
      return React.cloneElement(children, {
        loading,
        imageUrl: value,
      });
    }
    if (type === 'formUploadItem') {
      return (
        <div className="ant-btn ant-btn-primary" style={{ lineHeight: '28px' }}>
          {text || '上传'}
        </div>
      );
    }
    if (type === 'uploadButton') {
      return (
        <div className="ant-btn ant-btn-primary">
          <Icon type="upload" />
          {text || '上传'}
        </div>
      );
    }
    if (type === 'redactor') {
      return (
        <div
          style={{ height: '100px', lineHeight: '100px', textAlign: 'center' }}
          className="wUploader mode1"
        >
          {!loading && (
            <p id="upload_btn" className="upload_btn">
              请点击上传
            </p>
          )}
          {/* {loading && <Progress percent={progress} status="active" />} */}
        </div>
      );
    }
    return (
      <div className="imageUploader" style={{ width: `${width}px`, height: `${height}px` }}>
        <div className="loadingContainer">
          <Icon type={loading ? 'loading' : 'plus'} style={{ color: '#fff', fontSize: 20 }} />
          <div className="loadingText">{imageUrl ? '重新上传' : '上传'}</div>
        </div>
        {imageUrl && imageMask && <div className="imgMask" />}
        {imageUrl && <img src={imageUrl} alt="logo" className="image" />}
      </div>
    );
  }
}

export default Q()(Uploader);
