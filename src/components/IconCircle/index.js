import React from 'react';

import PropTypes from 'prop-types';
import classnames from 'classnames';

import './style.scss';

const IconCircle = (props) => {
  const {
    size, fixClass, className, bcg,
  } = props;
  const classes = classnames(fixClass, { [className]: className });
  const style = {
    height: size,
    width: size,
    backgroundColor: bcg || '#2c5b8f',
  };
  return <span style={style} className={classes} />;
};

IconCircle.defaultProps = {
  fixClass: 'iconCircle',
};

IconCircle.propTypes = {
  fixClass: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.number, // icon 大小
  bcg: PropTypes.string, // icon 背景颜色
};

export default IconCircle;
