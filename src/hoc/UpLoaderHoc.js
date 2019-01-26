import React from 'react';
import * as Q from 'qiniu-js';

import { message } from 'antd';

// import { ApiOnline as api } from '../api/index';
import api from '../api/index';

const UpLoaderHoc = (WrapperComponent) => {
  class Loader extends React.Component {
    cancel = () => {};

    next = (info) => {
      if (this.loader.next) {
        this.loader.next(info);
      }
    };

    error = (error) => {
      if (this.loader.uploadError) {
        return this.loader.uploadError(error);
      }
      return message.error('上传失败');
    };

    complete = (data) => {
      const {
        lastModified, lastModifiedDate, name, size, type, webkitRelativePath,
      } = this.file;
      if (this.loader.uploadComplete) {
        this.loader.uploadComplete({
          lastModified,
          lastModifiedDate,
          name,
          size,
          type,
          webkitRelativePath,
          ...data,
        });
      } else {
        message.success('上传成功');
      }
    };

    upload = (file) => {
      this.file = file;
      api.getUploadToken({ bucket: this.bucket || 'learnta-pics' }).then((data) => {
        const key = undefined;
        const token = data.uptoken;
        const putExtra = {
          fname: '',
          params: {},
        };
        const config = {
          useCdnDomain: true,
        };
        const observable = Q.upload(file, key, token, putExtra, config);
        this.subscription = observable.subscribe(this.next, this.error, this.complete);
      });
    };

    render() {
      // const { loading, progress } = this.state;

      // <Modal
      //   title="正在上传"
      //   visible={loading}
      //   onCancel={this.cancel}
      //   footer={<Button onClick={this.cancel}>取消上传</Button>}
      // >
      //   <Progress percent={progress} status="active" />
      // </Modal>,
      return (
        <WrapperComponent
          ref={loader => (this.loader = loader)}
          upload={this.upload}
          {...this.props}
        />
      );
    }
  }
  return Loader;
};

export default UpLoaderHoc;
