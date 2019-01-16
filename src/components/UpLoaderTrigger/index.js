import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export default class UpLoaderTrigger extends Component {
  static propTypes = {
    children: PropTypes.element, // trigger 子组件
    onChange: PropTypes.func, // 文件改变回调函数
    mimeType: PropTypes.string, // 接受文件类型，多种类型','号隔开
    multiple: PropTypes.bool, // 是否多文件上传
  };

  static defaultProps = {
    mimeType: 'all',
  };

  constructor(props) {
    super(props);
    this.loaderId = `${Math.random()}`;
  }

  upload = (e) => {
    const { files } = e.target;
    const { onChange } = this.props;
    if (onChange) onChange(files);
  };

  render() {
    const { children, mimeType, multiple } = this.props;
    const style = { display: 'none' };
    return (
      <label className="up-loader-wrapper" htmlFor={this.loaderId}>
        <input
          type="file"
          style={style}
          accept={mimeType}
          id={this.loaderId}
          multiple={multiple}
          onChange={this.upload}
        />
        {children}
      </label>
    );
  }
}
