import React from 'react';
import * as Q from 'qiniu-js';

import { message } from 'antd';

import { ApiOnline as api } from '../api/index';

const UpLoaderHoc = (WrapperComponent) => {
  class Loader extends React.Component {
    uploadByQ = (token, file) => {
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
    };

    cancel = () => {};

    next = (info) => {
      if (this.loader.next) {
        this.loader.next(info);
      }
    };

    error = (error) => {
      if (this.loader.uploadError) return this.loader.uploadError(error);
      return message.error('上传失败');
    };

    complete = (data) => {
      if (this.loader.uploadComplete) return this.loader.uploadComplete(data);
      return message.success('上传成功');
    };

    onChange = (files) => {
      api.getUploadToken({ bucket: this.bucket || 'learnta-pics' }).then((data) => {
        // this.setState({ loading: true });
        this.uploadByQ(data.uptoken, files);
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
      return <WrapperComponent ref={loader => (this.loader = loader)} onChange={this.onChange} />;
    }
  }
  return Loader;
};

export default UpLoaderHoc;
