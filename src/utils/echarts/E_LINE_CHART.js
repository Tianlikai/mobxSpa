import {
  foreachDataSetBackgroundColors,
  getDataZoomEnd,
  formatterHintWithClick,
  formatterHintWithDbClick,
  adjustGrid,
  getSeriesItem,
} from './EchartUtil';
import {
  LINE_SeriesItemType,
  LINE_LabelPosition,
  LINE_SymbolSize,
  DataZoomWidth,
  ColorArray,
} from './EchartType';

/**
 * 返回折线图配置 option
 * @param {num} type 图表类型
 * @param {obj} chartData 图表数据
 * @param {str} from
 * @param {bool} isShow 是否显示数据
 * @param {bool} WhetherTheTrip 是否有下钻提示
 * @return {obj:option}
 */
function getColumnChartOpt({
  type, chartData, from, isShow, WhetherTheTrip,
}) {
  const {
    legend,
    x_name,
    y_name: seriesName,
    x,
    y: seriesData,
    groupNum,
    group_type = [],
  } = chartData;
  const option = {
    tooltip: {
      trigger: 'axis',
      confine: true,
    },
    legend: {
      type: 'scroll',
      orient: 'horizontal',
      top: 0,
      left: 0,
      itemWidth: 13,
      itemHeight: 13,
      show: false,
      data: legend,
      pageIconSize: [10, 10],
      tooltip: {
        show: true,
        confine: true,
      },
    },
    grid: {
      left: '3%',
      right: '6%',
      bottom: '18%',
      top: 60,
      containLabel: true,
    },
    xAxis: {
      name: x_name,
      nameLocation: 'middle',
      nameGap: 25,
      type: 'category',
      data: x,
    },
    yAxis: {
      name: seriesName,
      type: 'value',
    },
    dataZoom: [
      {
        type: 'slider',
        show: true,
        start: 0,
        end: 100,
        filterMode: 'filter',
        xAxisIndex: 0,
        showDetail: false,
        showDataShadow: false,
        bottom: 20,
        height: DataZoomWidth,
      },
    ],
    series: [],
  };
  const groupCount = seriesData.length; // 多个分组方式时的组数
  for (let i = 0; i < groupCount; i++) {
    const datas = foreachDataSetBackgroundColors(seriesData[i], i, type);
    const itemInfo = {
      name: groupNum === 1 ? seriesName : `${legend[i]}`,
      type: LINE_SeriesItemType,
      symbolSize: LINE_SymbolSize,
      colorIndex: i,
      show: false,
      position: LINE_LabelPosition,
      color: '#4A4A4A',
      data: datas,
    };
    const seriesItem = getSeriesItem(itemInfo);
    option.series.push(seriesItem);
  }

  if (groupNum !== 1) {
    // 是否显示 图例
    option.legend.show = true;
    option.tooltip.trigger = 'axis';
    const adjustgridTop = adjustGrid(groupCount); // 是否需要调整坐标轴 返回为false则不需要 返回数值则调整
    if (adjustgridTop) option.grid.top = adjustgridTop;
  }

  if (isShow) {
    // 是否显示数值
    const mainAxisLen = x.length; // y轴显示的数目
    for (let i = 0, y = option.series.length; i < y; i++) {
      option.series[i].label.normal.show = true;
    }
    // 时间类型的数据 需要设置dataDoom 要显示最新的
    if (group_type && (group_type[0] === 'datetime' || group_type[0] === 'date')) {
      option.dataZoom[0].start = 100 - getDataZoomEnd(mainAxisLen);
    } else {
      option.dataZoom[0].end = getDataZoomEnd(mainAxisLen);
    }
  }

  if (from === 'hasDetail') {
    // 悬浮提示框 自定义
    option.tooltip.formatter = WhetherTheTrip
      ? formatterHintWithClick.bind(this)
      : formatterHintWithDbClick.bind(this);
  }

  return option;
}

export default getColumnChartOpt;
