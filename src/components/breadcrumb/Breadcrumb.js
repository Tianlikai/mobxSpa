import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import BreadcrumbItem from './BreadcrumbItem';

import './style.scss';

const Breadcrumb = (props) => {
  let crumbs;
  const {
    config, prefixCls, className, children,
  } = props;
  const cn = classNames(className, prefixCls);
  if (config && config.length > 0) {
    crumbs = config.map(label => <BreadcrumbItem label={label} />);
  } else if (children) {
    // 这个地方等待处理
    // 满足多种组件定义需求
  }
  return <div className={cn}>{crumbs}</div>;
};

Breadcrumb.defaultProps = {
  prefixCls: 'breadcrumb',
};

Breadcrumb.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  config: PropTypes.array,
  children: PropTypes.element,
};

export default Breadcrumb;
