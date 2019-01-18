import React from 'react';
import PropTypes from 'prop-types';
import CloneDeep from 'lodash/cloneDeep';

import { Icon } from 'antd';

import UpLoaderTrigger from 'components/UpLoaderTrigger/index'; // eslint-disable-line
import UpLoadWithProgress from 'components/UpLoadWithProgress/index'; // eslint-disable-line
import UpLoaderHoc from '../../../../../../hoc/UpLoaderHoc';

import './style.scss';

@UpLoaderHoc
export default class FormUpLoader extends React.Component {
  static propTypes = {
    upload: PropTypes.func,
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      files: [],
    };
  }

  next = (info) => {
    console.log(info);
  };

  uploadComplete = (data) => {
    const { onChange } = this.props;
    onChange(data);
  };

  uploadError = () => {};

  handleFileChange = (Files) => {
    // const { upload } = this.props;
    // upload(file[0]);
    const { files } = this.state;
    const copyFiles = CloneDeep(files);
    for (let i = 0; i < Files.length; i += 1) {
      const file = Files[i];
      const pos = copyFiles.findIndex(f => f.name !== file.name);
      if (pos < 0) copyFiles.push(file);
    }
    this.setState({
      files: copyFiles,
    });
  };

  render() {
    const { files } = this.state;
    return (
      <div className="upLoader_with_preview">
        <UpLoaderTrigger className="loader_trigger" multiple onChange={this.handleFileChange}>
          <Icon type="download" />
          上传文件
        </UpLoaderTrigger>
        {files.map(file => (
          <UpLoadWithProgress file={file} />
        ))}
      </div>
    );
  }
}
