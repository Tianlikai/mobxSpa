import React from 'react';
import PropTypes from 'prop-types';

import { Progress, Icon, Tooltip } from 'antd';

import './style.scss';

export default class UpLoadWithProgress extends React.Component {
  static propTypes = {
    file: PropTypes.object,
    upload: PropTypes.func,
    onCancel: PropTypes.func,
    onDelete: PropTypes.func,
    onUploadSuccess: PropTypes.func,
  };

  state = {
    progress: 0,
  };

  componentDidMount() {
    const { file, upload } = this.props;
    if (upload) upload(file);
  }

  next = (info) => {
    this.setState({
      progress: info.total.percent.toFixed(0),
    });
  };

  uploadComplete = (file) => {
    const { onUploadSuccess } = this.props;
    if (onUploadSuccess) onUploadSuccess(file);
  };

  onCancel = () => {
    const { onCancel, file } = this.props;
    if (onCancel) onCancel(file);
  };

  onDel = () => {
    const { onDelete, file } = this.props;
    if (onDelete) onDelete(file);
  };

  render() {
    const { file } = this.props;
    const { progress } = this.state;
    const { name } = file;
    return (
      <div className="upload_section">
        <div className="upload_section_top">{name}</div>
        <div className="upload_section_middle">
          <Progress percent={progress} />
        </div>
        <div className="upload_section_bottom">
          {progress < 100 ? (
            <Tooltip title="暂停">
              <Icon type="pause-circle" />
            </Tooltip>
          ) : null}

          {progress < 100 ? null : (
            <Tooltip title="复制链接">
              <Icon type="paper-clip" />
            </Tooltip>
          )}

          {progress < 100 ? (
            <Tooltip title="取消">
              <Icon onClick={this.onCancel} type="close" />
            </Tooltip>
          ) : (
            <Tooltip title="删除">
              <Icon onClick={this.onDel} type="delete" />
            </Tooltip>
          )}
        </div>
      </div>
    );
  }
}
