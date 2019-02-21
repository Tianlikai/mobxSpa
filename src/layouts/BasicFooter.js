import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './styles/BasicFooter.scss';

const BasicFooter = (props) => {
  const { fixClass, className } = props;

  return (
    <div className={classnames(fixClass, { [className]: className })}>
      Project maintenance
      <br />
      by jason
    </div>
  );
};
BasicFooter.defaultProps = {
  fixClass: 'lBasicFooter',
};

BasicFooter.propTypes = {
  fixClass: PropTypes.string,
  className: PropTypes.string,
};

export default BasicFooter;
