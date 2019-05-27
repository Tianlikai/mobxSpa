import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const { Switch } = ReactRouterDOM;

const Container = (props) => {
  const {
    routerData: { childRoutes },
    prefix,
    className,
  } = props;
  const classes = classnames(prefix, { [className]: className });
  return (
    <div className={classes}>
      <Switch>{childRoutes}</Switch>
    </div>
  );
};

Container.defaultProps = {
  prefix: 'container',
};

Container.propTypes = {
  prefix: PropTypes.string,
  className: PropTypes.string,
  routerData: PropTypes.object,
};

export default Container;
