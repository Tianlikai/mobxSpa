import React from 'react';
import dayJs from 'dayjs';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class dayJsNow extends React.Component {
  static propTypes = {
    className: PropTypes.string,
  };

  state = {
    time: dayJs().format('MMMM D YYYY, h:mm:ss A'),
  };

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick = () => {
    this.setState({
      time: dayJs().format('MMMM D YYYY, h:mm:ss A'),
    });
  };

  render() {
    const { time } = this.state;
    const { className } = this.props;
    const classes = classnames({ [className]: className });
    return <div className={classes}>{time}</div>;
  }
}
