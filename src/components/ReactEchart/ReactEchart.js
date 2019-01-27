import React, { Component } from 'react';
import Echarts from 'echarts';
import PropTypes from 'prop-types';

import './style.scss';

export default class ReactEchart extends Component {
  static propTypes = {
    style: PropTypes.object,
    config: PropTypes.object,
    option: PropTypes.object,
    notMerge: PropTypes.bool,
    notRefreshImmediately: PropTypes.bool,
    handleClick: PropTypes.func,
    handleDblClick: PropTypes.func,
  };

  state = {
    needInit: false,
  };

  componentDidMount() {
    this.renderChart();
  }

  renderChart = () => {
    const {
      config,
      handleClick,
      handleDblClick,
      option,
      notMerge,
      notRefreshImmediately,
    } = this.props;

    const { needInit } = this.state;

    const chartDom = this.dom;
    const theme = (config && config.theme) || 'default';
    let chart = Echarts.getInstanceByDom(chartDom);
    if (!chart || needInit) {
      chart = Echarts.init(chartDom, theme);
      /* eslint-disable */
      if (config && config.hasOwnProperty('event')) {
        config.event.forEach(item => {
          chart.on(item.type, item.handler);
        });
      }
      let timer = null;
      // 单击
      chart.on('click', params => {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          if (handleClick) {
            handleClick(params);
          }
        }, 250);
      });
      // 双击
      chart.on('dblclick', params => {
        clearTimeout(timer);
        if (handleDblClick) {
          handleDblClick(params);
        }
      });
    }

    if (config && config.showLoading) {
      chart.showLoading(
        'default',
        (config && config.loadingOption) || {
          text: '加载中...',
          color: '#c23531',
          textColor: '#000',
          maskColor: 'rgba(255, 255, 255, 0.8)',
          zlevel: 0,
        },
      );
    } else {
      chart.hideLoading();
      chart.setOption(option, notMerge, notRefreshImmediately);
    }
  };

  render() {
    const { style } = this.props;
    return <div className="chart-wrapper" style={style} ref={dom => (this.dom = dom)} />;
  }
}
