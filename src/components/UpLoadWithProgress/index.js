import React from 'react';
import PropTypes from 'prop-types';

import { Progress, Tooltip } from 'antd';
import {
  CloseCircleOutlined,
  DeleteOutlined,
  PauseCircleOutlined,
  PaperClipOutlined,
} from '@ant-design/icons';

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
              <PauseCircleOutlined />
            </Tooltip>
          ) : null}

          {progress < 100 ? null : (
            <Tooltip title="复制链接">
              <PaperClipOutlined />
            </Tooltip>
          )}

          {progress < 100 ? (
            <Tooltip title="取消">
              <CloseCircleOutlined />
            </Tooltip>
          ) : (
            <Tooltip title="删除">
              <DeleteOutlined />
            </Tooltip>
          )}
        </div>
      </div>
    );
  }
}
