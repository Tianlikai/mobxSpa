import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import classnames from 'classnames';

moment.locale('zh-cn');

export default class MomentNow extends React.Component {
  static propTypes = {
    className: PropTypes.string,
  };

  state = {
    time: moment().format('MMMM Do YYYY, h:mm:ss a'),
  };

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick = () => {
    this.setState({
      time: moment().format('MMMM Do YYYY, h:mm:ss a'),
    });
  };

  render() {
    const { time } = this.state;
    const { className } = this.props;
    const classes = classnames({ [className]: className });
    return <div className={classes}>{time}</div>;
  }
}
