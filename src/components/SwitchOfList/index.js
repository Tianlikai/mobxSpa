import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Icon } from 'antd';
import './style.scss';

export default class SwitchOfList extends React.Component {
  constructor(props) {
    super(props);
    const { showType } = props;
    this.state = {
      showType,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { showType } = nextProps;
    this.setState({
      showType,
    });
  }

  handleRedirectToCard = () => {
    const { handleRedirectToCard } = this.props;
    if (handleRedirectToCard) {
      handleRedirectToCard('table');
    } else {
      this.setState({
        showType: 'table',
      });
    }
  };

  handleRedirectToTable = () => {
    const { handleRedirectToTable } = this.props;
    if (handleRedirectToTable) {
      handleRedirectToTable('card');
    } else {
      this.setState({
        showType: 'card',
      });
    }
  };

  render() {
    const { fixClass, className } = this.props;
    const { showType } = this.state;

    const classes = classnames(fixClass, { [className]: className });
    const classesBars = classnames('table', { active: showType === 'table' });
    const classesCard = classnames('card', { active: showType === 'card' });
    return (
      <div className={classes}>
        <span className={classesBars} onClick={this.handleRedirectToCard}>
          <Icon type="bars" />
        </span>
        <span className={classesCard} onClick={this.handleRedirectToTable}>
          <Icon type="appstore-o" />
        </span>
      </div>
    );
  }
}

SwitchOfList.defaultProps = {
  fixClass: 'root-switch',
  showType: 'card',
};

SwitchOfList.propTypes = {
  fixClass: PropTypes.string, // 固定root名
  className: PropTypes.string, // 接受 className 和root 合并
  showType: PropTypes.string, // 展示 table 还是 listCard
  handleRedirectToTable: PropTypes.func, // 外部切换tabs 到 table
  handleRedirectToCard: PropTypes.func, // 外部切换tabs 到 card
};
