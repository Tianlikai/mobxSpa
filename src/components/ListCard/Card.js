import React from 'react';

import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Menu, Dropdown as DropDown, Checkbox } from 'antd';

import IconCircle from '../IconCircle/index';

import { STATUS_VIDEO } from '@/settings/const';

import './Card.scss';

export const Title = (props) => {
  const { classes, name } = props;
  return <div className={classes}>{name}</div>;
};

Title.propTypes = {
  classes: PropTypes.string,
  name: PropTypes.string,
};

class Card extends React.Component {
  static defaultProps = {
    fixClass: 'videoItem',
  };

  static propTypes = {
    id: PropTypes.number,
    page: PropTypes.string,
    cover: PropTypes.string,
    fixClass: PropTypes.string,
    className: PropTypes.string,
    isSuperRight: PropTypes.bool,
    fileName: PropTypes.string,
    state: PropTypes.number,
    selectedRowKeys: PropTypes.array,
    selectedVideos: PropTypes.array,
    onChange: PropTypes.func,
    handleDelete: PropTypes.func,
    handleReBack: PropTypes.func,
    handleReview: PropTypes.func,
    handleOpenPreview: PropTypes.func,
    handleEditVideo: PropTypes.func,
    handleModifyVideo: PropTypes.func,
    handleOpenConnect: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleReBack = this.handleReBack.bind(this);
    this.handleReview = this.handleReview.bind(this);
    this.handleEditVideo = this.handleEditVideo.bind(this);
    this.handleModifyVideo = this.handleModifyVideo.bind(this);
    this.handleOpenConnect = this.handleOpenConnect.bind(this);
    this.handleOpenPreview = this.handleOpenPreview.bind(this);
  }

  onChange() {
    const { onChange, id } = this.props;
    if (onChange) onChange(id);
  }

  handleDelete() {
    const { handleDelete, ...rest } = this.props;
    if (handleDelete) {
      handleDelete({ ...rest });
    }
  }

  handleReBack() {
    const { handleReBack, ...rest } = this.props;
    if (handleReBack) {
      handleReBack({ ...rest });
    }
  }

  handleReview() {
    const { handleReview, ...rest } = this.props;
    if (handleReview) {
      handleReview({ ...rest });
    }
  }

  handleOpenPreview() {
    const { handleOpenPreview, ...rest } = this.props;
    if (handleOpenPreview) {
      handleOpenPreview({ ...rest });
    }
  }

  handleEditVideo() {
    const { handleEditVideo, ...rest } = this.props;
    if (handleEditVideo) {
      handleEditVideo({ ...rest });
    }
  }

  handleModifyVideo() {
    const { handleModifyVideo, ...rest } = this.props;
    if (handleModifyVideo) {
      handleModifyVideo({ ...rest });
    }
  }

  handleOpenConnect() {
    const { handleOpenConnect, ...rest } = this.props;
    if (handleOpenConnect) {
      handleOpenConnect({ ...rest });
    }
  }

  render() {
    const {
      id,
      page,
      cover,
      fileName,
      state, // 视频状态
      fixClass,
      className,
      isSuperRight,
      selectedVideos,
      selectedRowKeys,
    } = this.props;

    let stateText;
    if (state || state === 0) {
      stateText = STATUS_VIDEO[state + 1].text;
    }

    let hasPreview; // 预览
    let hasEdit; // 编辑
    let hasLook; // 产看
    let hasModify; // 修改
    let hasReview; // 审核
    let hasConnect; // 关联
    let hasDel; // 删除
    let hasReBack; // 恢复

    switch (page) {
      case 'personal':
        hasPreview = true;
        hasDel = state !== 1 && state !== 2;
        hasEdit = state === 0;
        hasLook = state === 1 || state === 3;
        hasModify = state === 2;
        break;
      case 'school':
        hasPreview = true;
        if (isSuperRight) {
          hasReview = state === 1;
          hasLook = state === 3;
          hasModify = state === 2;
          hasDel = state === 3;
        }
        break;
      case 'modify':
        hasPreview = true;
        hasModify = true;
        break;
      case 'review':
        hasPreview = true;
        hasReview = true;
        break;
      case 'connect':
        hasPreview = true;
        hasConnect = true;
        break;
      case 'recycleBin':
        hasPreview = true;
        hasReBack = true;
        break;
      case 'hasPreview':
        hasPreview = true;
        break;
      default:
        break;
    }
    // 下啦菜单展示
    const hasDrop = hasPreview
      || hasEdit
      || hasLook
      || hasModify
      || hasReview
      || hasConnect
      || hasDel
      || hasReBack;

    const itemMenu = (
      <Menu>
        {hasPreview ? (
          <Menu.Item>
            <span className="videoMethod" onClick={this.handleOpenPreview}>
              预览
            </span>
          </Menu.Item>
        ) : null}

        {hasEdit ? (
          <Menu.Item>
            <span className="videoMethod" onClick={this.handleEditVideo}>
              编辑
            </span>
          </Menu.Item>
        ) : null}

        {hasLook ? (
          <Menu.Item>
            <span className="videoMethod" onClick={this.handleEditVideo}>
              查看
            </span>
          </Menu.Item>
        ) : null}

        {hasModify ? (
          <Menu.Item>
            <span className="videoMethod" onClick={this.handleModifyVideo}>
              编辑
            </span>
          </Menu.Item>
        ) : null}

        {hasReview ? (
          <Menu.Item>
            <span className="videoMethod" onClick={this.handleReview}>
              审核
            </span>
          </Menu.Item>
        ) : null}

        {hasConnect ? (
          <Menu.Item>
            <span className="videoMethod" onClick={this.handleOpenConnect}>
              关联知识点
            </span>
          </Menu.Item>
        ) : null}

        {hasDel ? (
          <Menu.Item>
            <span className="videoMethod" onClick={this.handleDelete}>
              删除
            </span>
          </Menu.Item>
        ) : null}
        {hasReBack ? (
          <Menu.Item>
            <span className="videoMethod" onClick={this.handleReBack}>
              恢复
            </span>
          </Menu.Item>
        ) : null}
      </Menu>
    );

    let bcg = '';
    switch (state) {
      case 0:
        bcg = '#2c5b8f';
        break;
      case 1:
        bcg = '#FF9E16';
        break;
      case 2:
        bcg = '#FF591A';
        break;
      case 3:
        bcg = '#77BC2B';
        break;
      default:
        break;
    }

    const checked = selectedRowKeys ? selectedRowKeys.has(id) : false;

    return (
      <div className={classnames('cardWrapper', `${fixClass}`, { [className]: className })}>
        <div className="imgWrapper">
          <img src={cover} alt="cover" />
        </div>
        <div className="cardTitle">{fileName}</div>

        {stateText && page !== 'recycleBin' ? (
          <div className="statusWrapper">
            <IconCircle size={10} bcg={bcg} />
            <span>{stateText}</span>
          </div>
        ) : null}

        {hasDrop ? (
          <div className="dropDown videoDropDown">
            <DropDown placement="bottomRight" overlay={itemMenu}>
              <span className="pointBC" />
            </DropDown>
          </div>
        ) : null}

        {selectedVideos ? (
          <Checkbox checked={checked} className="checkbox videoCheckbox" onChange={this.onChange} />
        ) : null}
      </div>
    );
  }
}

export default Card;
