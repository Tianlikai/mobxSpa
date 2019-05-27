import React from 'react';
import PropTypes from 'prop-types';

import src from './spinner.gif';

const Spinner = (props) => {
  const { style: sty } = props;
  const style = sty || {
    display: 'block',
    width: '40px',
    margin: '50px auto',
  };
  return <img alt="spinner" style={style} src={src} />;
};

Spinner.propTypes = {
  style: PropTypes.object,
};

export default Spinner;
