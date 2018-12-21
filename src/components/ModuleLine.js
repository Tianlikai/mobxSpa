import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const ModuleLine = (props) => {
  const {
    title, prefix, className, children,
  } = props;

  const classes = classnames(prefix, { [className]: className });
  return (
    <div className={classes}>
      {title}
      {children}
    </div>
  );
};

ModuleLine.defaultProps = {
  prefix: 'contentTitle',
};

ModuleLine.propTypes = {
  title: PropTypes.string,
  prefix: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.element,
};

export default ModuleLine;
