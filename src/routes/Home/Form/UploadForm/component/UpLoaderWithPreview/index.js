import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'antd';

import UpLoaderTrigger from 'components/UpLoaderTrigger/index'; // eslint-disable-line
import UpLoaderHoc from '../../../../../../hoc/UpLoaderHoc';

import './style.scss';

@UpLoaderHoc
export default class FormUpLoader extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
  };

  next = (info) => {
    console.log(info);
  };

  uploadComplete = () => {};

  uploadError = () => {};

  handleFileChange = (file) => {
    const { onChange } = this.props;
    onChange(file[0]);
  };

  render() {
    return (
      <div className="upLoader_with_preview">
        <UpLoaderTrigger className="loader_trigger" onChange={this.handleFileChange}>
          <Icon type="download" />
          上传文件
        </UpLoaderTrigger>
      </div>
    );
  }
}
