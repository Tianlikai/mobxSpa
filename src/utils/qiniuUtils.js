import React from 'react';
import PropTypes from 'prop-types';

import * as Q from 'qiniu-js';
import {
  Modal, Progress, Button, Row, Col, Input, message,
} from 'antd';

import { ApiOnline as api } from '../api/index';

function QUpload(options) {
  return Component => class extends Component {
      static propTypes = {
        desc: PropTypes.string,
        type: PropTypes.string,
        value: PropTypes.string,
        disableInput: PropTypes.bool,
        sizeLimit: PropTypes.number,
        sizeErrMessage: PropTypes.string,
        typeErrMessage: PropTypes.string,
        mimeType: PropTypes.array,
        loaderId: PropTypes.number,
        onChange: PropTypes.func,
        changeFileName: PropTypes.func,
      };

      componentWillMount() {
        const { loaderId } = this.props;
        if (super.componentWillMount) super.componentWillMount();
        this.loaderId = loaderId || `${Math.random()}`;
      }

      cancelUpload = () => {
        if (this.subscription) this.subscription.unsubscribe();
        this.subscription = null;
        this.file = null;
        this.setState({ loading: false });
        message.error('上传取消');
        this.clearInputFile();
      };

      error = (err) => {
        message.error('上传失败');
        if (super.error) super.error(err);
        this.clearInputFile();
      };

      next = (info) => {
        if (super.next) super.next(info);
      };

      complete = (res) => {
        if (res.hash) {
          const { changeFileName } = this.props;
          const { type, name } = this.file;
          this.triggerChange(res.hash);
          if (super.complete) super.complete(res, type, name);
          if (changeFileName) changeFileName(name);
          message.success('上传成功');
          this.clearInputFile();
        }
      };

      upload = (_file) => {
        const {
          sizeLimit, sizeErrMessage, typeErrMessage, mimeType,
        } = this.props;

        if (_file || (this.picker && this.picker.files && this.picker.files.length > 0)) {
          const file = this.picker && this.picker.files[0];
          this.file = file;

          if (file.size > sizeLimit) {
            Modal.error({ title: sizeErrMessage });
            return;
          }

          if (!this.typeCheck(mimeType, file.type)) {
            Modal.error({ title: typeErrMessage });
            return;
          }

          api.getUploadToken({ bucket: this.bucket || 'learnta-pics' }).then((data) => {
            this.uploadByQiniu(data.uptoken, file);
          });
          if (super.upload) super.upload();
        }
      };

      triggerChange(value) {
        const { onChange } = this.props;
        if (onChange) onChange(value);
      }

      clearInputFile() {
        if (this.picker) {
          this.picker.value = '';
        }
      }

      typeCheck(mimeType, fileType) {
        if (!mimeType || mimeType.indexOf(fileType) !== -1) {
          return true;
        }
        return false;
      }

      uploadByQiniu(token, file) {
        const key = undefined;
        const putExtra = {
          fname: '',
          params: {},
        };
        const config = {
          useCdnDomain: true,
        };
        const observable = Q.upload(file, key, token, putExtra, config);

        this.subscription = observable.subscribe(this.next, this.error, this.complete);
      }

      changeFileName(e) {
        if (!e) return;
        const name = e.target && e.target.value;
        const { changeFileName } = this.props;
        if (changeFileName) changeFileName(name);
      }

      render() {
        if (options && options.type === 'CKEditor') return super.render();

        const { loading, progress } = this.state;

        const {
          desc, type, mimeType, value, disableInput,
        } = this.props;

        if (type === 'formUploadItem') {
          return (
            <Row>
              <Col span={18}>
                <Input
                  value={value}
                  disabled={disableInput}
                  onChange={this.changeFileName}
                  className="input"
                  placeholder="请点击上传按钮进行上传"
                />
              </Col>
              <Col span={5} style={{ marginLeft: 5 }}>
                <input
                  type="file"
                  style={{ display: 'none' }}
                  accept={mimeType ? mimeType.join(',') : 'all'}
                  id={this.loaderId}
                  ref={(picker) => {
                    this.picker = picker;
                  }}
                  onChange={this.upload}
                />
                <label htmlFor={this.loaderId}>
                  <div>{super.render()}</div>
                </label>
                <Modal
                  onCancel={this.cancelUpload}
                  visible={loading}
                  title="正在上传"
                  footer={<Button onClick={this.cancelUpload}>取消上传</Button>}
                >
                  <Progress percent={+progress} status="active" />
                </Modal>
              </Col>
            </Row>
          );
        }
        return (
          <div className="uploader_container">
            <input
              type="file"
              style={{ display: 'none' }}
              accept={mimeType ? mimeType.join(',') : 'all'}
              id={this.loaderId}
              ref={(picker) => {
                this.picker = picker;
              }}
              onChange={this.upload}
            />
            <label htmlFor={this.loaderId}>
              <div>{super.render()}</div>
            </label>
            <Modal
              onCancel={this.cancelUpload}
              visible={loading}
              title="正在上传"
              footer={<Button onClick={this.cancelUpload}>取消上传</Button>}
            >
              <Progress percent={+progress} status="active" />
            </Modal>
            {desc ? (
              <div className="clearfix" style={{ fontSize: 14, lineHeight: 1.5 }}>
                {desc}
              </div>
            ) : null}
          </div>
        );
      }
  };
}

export default QUpload;
