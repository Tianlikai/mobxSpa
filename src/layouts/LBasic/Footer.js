import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './footer.scss';

const BasicFooter = (props) => {
  const { fixClass, className } = props;

  return (
    <footer className={classnames(fixClass, { [className]: className })}>
      Project maintenance
      <br />
      by jason
    </footer>
  );
};
BasicFooter.defaultProps = {
  fixClass: 'LBasicFooter',
};

BasicFooter.propTypes = {
  fixClass: PropTypes.string,
  className: PropTypes.string,
};

export default BasicFooter;
