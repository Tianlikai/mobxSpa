import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './style.scss';

const { Switch } = ReactRouterDOM;

const HomeLayout = (props) => {
  const {
    routerData: { childRoutes },
    prefix,
    className,
  } = props;
  const classes = classnames(prefix, { [className]: className });
  return (
    <main className={classes}>
      <Switch>{childRoutes}</Switch>
    </main>
  );
};

HomeLayout.defaultProps = {
  prefix: 'LHome',
};

HomeLayout.propTypes = {
  prefix: PropTypes.string,
  className: PropTypes.string,
  routerData: PropTypes.object,
};

export default HomeLayout;
