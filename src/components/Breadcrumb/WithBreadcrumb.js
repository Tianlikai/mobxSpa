import React from 'react';
import PropTypes from 'prop-types';

import Breadcrumb from './Breadcrumb';

const WithBreadcrumb = (props) => {
  const { children, config } = props;
  return (
    <div>
      <Breadcrumb config={config} />
      {children && children}
    </div>
  );
};

WithBreadcrumb.propTypes = {
  config: PropTypes.array,
  children: PropTypes.element,
};

export default WithBreadcrumb;
