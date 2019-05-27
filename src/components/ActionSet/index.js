import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const ActionSet = (props) => {
  const {
    page,
    record: { state }, // state 视频状态
    isSuperRight,
    fixClass,
    className,
    handleOpenPreview,
    handleEditVideo,
    handleModifyVideo,
    handleReview,
    handleOpenConnect,
    handleDelete,
    handleReBack,
  } = props;

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
    default:
      break;
  }

  return (
    <div className={classnames(fixClass, { [className]: className })}>
      {hasPreview ? <span onClick={handleOpenPreview}>预览</span> : null}
      {hasEdit ? <span onClick={handleEditVideo}>编辑</span> : null}
      {hasLook ? <span onClick={handleEditVideo}>查看</span> : null}
      {hasModify ? <span onClick={handleModifyVideo}>编辑</span> : null}
      {hasReview ? <span onClick={handleReview}>审核</span> : null}
      {hasConnect ? <span onClick={handleOpenConnect}>关联知识点</span> : null}
      {hasDel ? <span onClick={handleDelete}>删除</span> : null}
      {hasReBack ? <span onClick={handleReBack}>恢复</span> : null}
    </div>
  );
};

ActionSet.defaultProps = {
  fixClass: 'table-method',
};

ActionSet.propTypes = {
  fixClass: PropTypes.string,
  className: PropTypes.string,
  page: PropTypes.string,
  record: PropTypes.object,
  isSuperRight: PropTypes.bool,
  handleOpenPreview: PropTypes.func,
  handleEditVideo: PropTypes.func,
  handleModifyVideo: PropTypes.func,
  handleReview: PropTypes.func,
  handleOpenConnect: PropTypes.func,
  handleDelete: PropTypes.func,
  handleReBack: PropTypes.func,
};

export default ActionSet;
