import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Tooltip } from 'antd';

import './style.scss';

/**
 * 显示固定长度字符串
 * hover 显示全文
 * @param {*} props
 */
const TextWithIntercept = (props) => {
  const {
    text, len, fixClass, className,
  } = props;

  return (
    <div className={classnames(fixClass, { [className]: className })}>
      <Tooltip title={text}>
        {text && text.length > len ? `${text.substring(0, len)}...` : text}
      </Tooltip>
    </div>
  );
};
TextWithIntercept.defaultProps = {
  fixClass: 'withToolTip',
};

TextWithIntercept.propTypes = {
  len: PropTypes.number, // 显示字符串的最大长度
  text: PropTypes.string,
  fixClass: PropTypes.string,
  className: PropTypes.string,
};

export default TextWithIntercept;
