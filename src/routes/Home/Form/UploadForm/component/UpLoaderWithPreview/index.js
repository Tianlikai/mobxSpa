import React from 'react';
import PropTypes from 'prop-types';
import CloneDeep from 'lodash/cloneDeep';

import { Icon } from 'antd';

import UpLoaderTrigger from 'components/UpLoaderTrigger/index'; // eslint-disable-line
import FileProgress from 'components/UpLoadWithProgress/index'; // eslint-disable-line
import UpLoaderHoc from '../../../../../../hoc/UpLoaderHoc';

import './style.scss';

const UpLoadWithProgress = UpLoaderHoc(FileProgress);

export default class FormUpLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      finish: [],
    };
  }

  handleCancelFile = (cancelFile) => {
    const { files } = this.state;
    const F = files.slice();
    const pos = F.findIndex(file => file.name === cancelFile.name);
    if (pos >= 0) F.splice(pos, 1);
    this.setState({
      files: F,
    });
  };

  handleDeleteFile = (deleteFile) => {
    const { files, finish } = this.state;
    const F = files.slice();
    const uploaded = finish.slice();

    const pos1 = F.findIndex(file => file.name === deleteFile.name);
    const pos2 = uploaded.findIndex(file => file.name === deleteFile.name);

    if (pos1 >= 0) F.splice(pos1, 1);
    if (pos2 >= 0) uploaded.splice(pos2, 1);

    this.setState({
      files: F,
      finish: uploaded,
    });
  };

  handleUploadSuccess = (newFile) => {
    const { finish } = this.state;
    const uploaded = finish.slice();
    const tag = uploaded.findIndex(file => file.hash === newFile.hash);
    if (tag < 0) {
      uploaded.push(newFile);
      this.setState({
        finish: uploaded,
      });
    }
  };

  handleFileChange = (Files) => {
    const { files } = this.state;
    const copyFiles = CloneDeep(files);
    for (let i = 0; i < Files.length; i += 1) {
      const file = Files[i];
      const pos = copyFiles.findIndex(f => f.name === file.name);
      if (pos < 0) copyFiles.push(file);
    }
    this.setState({
      files: copyFiles,
    });
  };

  render() {
    const { files, finish } = this.state;
    return (
      <div className="upLoader_with_preview">
        <UpLoaderTrigger className="loader_trigger" multiple onChange={this.handleFileChange}>
          <Icon type="download" />
          上传文件
        </UpLoaderTrigger>
        <div className="upLoader_container">
          {files.map(file => (
            <UpLoadWithProgress
              key={file.name}
              file={file}
              onCancel={this.handleCancelFile}
              onDelete={this.handleDeleteFile}
              onUploadSuccess={this.handleUploadSuccess}
            />
          ))}
        </div>
      </div>
    );
  }
}
