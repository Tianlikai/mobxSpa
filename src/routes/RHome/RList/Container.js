import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Tabs } from 'antd';

const { TabPane } = Tabs;

const { Switch } = ReactRouterDOM;

export default class Container extends React.Component {
  static defaultProps = {
    prefix: 'container',
  };

  static propTypes = {
    prefix: PropTypes.string,
    className: PropTypes.string,
    routerData: PropTypes.object,
  };

  handleTabChange = () => {};

  render() {
    const {
      routerData: { childRoutes },
      prefix,
      className,
    } = this.props;
    const classes = classnames(prefix, { [className]: className });
    return (
      <div className={classes}>
        <Tabs defaultActiveKey="1" onChange={this.handleTabChange}>
          <TabPane tab="我的视频" key="1" />
          <TabPane tab="学校视频" key="2" />
        </Tabs>
        <Switch>{childRoutes}</Switch>
      </div>
    );
  }
}
