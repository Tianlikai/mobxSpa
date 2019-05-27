import React from 'react';
import PropTypes from 'prop-types';

const BasicFooter = (props) => {
  const styDiv = {
    textAlign: 'center',
    height: 100,
    marginTop: 20,
  };
  const { className } = props;
  return (
    <div className={className} style={styDiv}>
      Project maintenance
      {' '}
      <br />
      by jason
    </div>
  );
};

BasicFooter.propTypes = {
  className: PropTypes.string,
};

export default BasicFooter;
