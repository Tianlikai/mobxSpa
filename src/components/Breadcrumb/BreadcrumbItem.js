import React from 'react';
import PropTypes from 'prop-types';

const BreadcrumbItem = (props) => {
  const { prefixCls, separator, label } = props;
  return (
    <span>
      <span className={`${prefixCls}-label`}>{label}</span>
      <span className={`${prefixCls}-separator`}>{separator}</span>
    </span>
  );
};

BreadcrumbItem.defaultProps = {
  prefixCls: 'breadItem',
  separator: '/',
  label: 'string',
};

BreadcrumbItem.propTypes = {
  label: PropTypes.string,
  prefixCls: PropTypes.string,
  separator: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

export default BreadcrumbItem;
