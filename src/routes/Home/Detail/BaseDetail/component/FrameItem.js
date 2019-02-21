import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Icon, Tooltip } from 'antd';

const FrameItem = (props) => {
  const {
    showHint, title, titleHint, value, footerTitle, footerValue,
  } = props;

  const classes = classnames({
    'title-icon-right-show': showHint,
    'title-icon-right-none': !showHint,
  });

  return (
    <div className="data-frame-item">
      <div className="item-title">
        {title}
        <Tooltip title={titleHint}>
          <Icon className={classes} type="exclamation-circle-o" />
        </Tooltip>
      </div>
      <div className="item-value">{value}</div>
      <div className="item-bar" />
      <div className="item-footer">
        {footerTitle}
        <span className="item-footer-value">{footerValue}</span>
      </div>
    </div>
  );
};

FrameItem.propTypes = {
  showHint: PropTypes.string,
  title: PropTypes.string,
  titleHint: PropTypes.string,
  value: PropTypes.string.isRequired,
  footerTitle: PropTypes.string,
  footerValue: PropTypes.string.isRequired,
};

export default FrameItem;
