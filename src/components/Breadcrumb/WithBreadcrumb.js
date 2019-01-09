import React from 'react';
import PropTypes from 'prop-types';

import Breadcrumb from './Breadcrumb';

const WithBreadcrumb = (props) => {
  const { children, config } = props;
  return [<Breadcrumb config={config} />, children];
};

WithBreadcrumb.propTypes = {
  config: PropTypes.array,
  children: PropTypes.element.isRequired,
};

export default WithBreadcrumb;
