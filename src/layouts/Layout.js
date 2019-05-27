import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './styles/Layout.scss';

const LayoutSide = (props) => {
  const { children, className } = props;
  return <div className={className}>{children && children}</div>;
};

LayoutSide.propTypes = {
  className: PropTypes.string,
  children: PropTypes.element.isRequired,
};

const Layout = (props) => {
  const {
    children, className, prefixCls, style,
  } = props;
  const classes = classnames(className, prefixCls);
  return (
    <div className={classes} style={style}>
      {children && children}
    </div>
  );
};

Layout.defaultProps = {
  prefixCls: 't-layout',
};

Layout.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.element.isRequired,
};

Layout.LayoutSide = LayoutSide;

export default Layout;
