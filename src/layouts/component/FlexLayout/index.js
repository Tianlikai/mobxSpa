import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './style.scss';

const FlexLayout = (props) => {
  const {
    children, className, prefixCls, style,
  } = props;
  const classes = classnames(className, prefixCls);
  return (
    <section className={classes} style={style}>
      {children && children}
    </section>
  );
};

FlexLayout.defaultProps = {
  prefixCls: 'flexLayout',
};

FlexLayout.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.element.isRequired,
};

export default FlexLayout;
