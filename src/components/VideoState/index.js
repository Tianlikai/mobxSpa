import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Tooltip } from 'antd';

import IconCircle from '../IconCircle/index';
import { STATUS_VIDEO } from '@/settings/const';

const VideoState = (props) => {
  const {
    text, size, record, fixClass, className,
  } = props;

  let stateText;
  if (text || text === 0) {
    stateText = STATUS_VIDEO[text + 1].text;
  }

  let bcg = '';
  switch (text) {
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

  let title = '';
  if (record && record.reason) {
    title = record.reason;
  }

  return (
    <div className={classnames(fixClass, { [className]: className })}>
      <Tooltip title={title}>
        <IconCircle size={size} bcg={bcg} />
        <span>{stateText}</span>
      </Tooltip>
    </div>
  );
};

VideoState.defaultProps = {
  size: 10,
  fixClass: 'withToolTip',
};

VideoState.propTypes = {
  text: PropTypes.string,
  size: PropTypes.number,
  record: PropTypes.object,
  fixClass: PropTypes.string,
  className: PropTypes.string,
};

export default VideoState;
