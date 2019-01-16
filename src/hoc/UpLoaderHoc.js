import React from 'react';
import * as Q from 'qiniu-js';

import { message } from 'antd';

import UpLoaderTrigger from 'components/UpLoaderTrigger/index'; // eslint-disable-line
import { ApiOnline as api } from '../api/index';

const UpLoaderHoc = Component => class extends Component {
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

    next = (value) => {
      console.info(value);
    };

    error = (error) => {
      if (super.uploadError) return super.uploadError(error);
      return message.error('上传失败');
    };

    complete = (data) => {
      if (super.uploadComplete) return super.uploadComplete(data);
      return message.success('上传成功');
    };

    onChange = (files) => {
      api.getUploadToken({ bucket: this.bucket || 'learnta-pics' }).then((data) => {
        this.uploadByQ(data.uptoken, files);
      });
    };

    render() {
      return <UpLoaderTrigger onChange={this.onChange}>{super.render()}</UpLoaderTrigger>;
    }
};

export default UpLoaderHoc;
