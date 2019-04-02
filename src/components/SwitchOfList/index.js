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

  static getDerivedStateFromProps(props, state) {
    const { showType: propsType } = props;
    const { showType: stateType } = state;
    if (propsType && propsType !== stateType) {
      return {
        showType: propsType,
      };
    }
    return null;
  }

  handleRedirectToCard = () => {
    const { onChange } = this.props;
    if (onChange) {
      onChange('table');
    } else {
      this.setState({
        showType: 'table',
      });
    }
  };

  handleRedirectToTable = () => {
    const { onChange } = this.props;
    if (onChange) {
      onChange('card');
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
  showType: PropTypes.string,
  onChange: PropTypes.func, // 外部切换tabs
};
