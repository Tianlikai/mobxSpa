import {
  foreachDataSetBackgroundColors,
  getDataZoomEnd,
  formatterHintWithClick,
  formatterHintWithDbClick,
  adjustGrid,
  getSeriesItem,
} from './EchartUtil';
import {
  BAR_SeriesItemType,
  BAR_LabelPosition,
  BAR_MaxWidth,
  BAR_MinHeight,
  DataZoomWidth,
  ColorArray,
} from './EchartType';

/**
 * 返回条形图表配置 option
 * @param {num} type 图表类型
 * @param {obj} chartData 图表数据
 * @param {str} from
 * @param {bool} isShow 是否显示数据
 * @param {bool} WhetherTheTrip 是否有下钻提示
 * @return {obj:option}
 */
function getBarChartOpt({
  type, chartData, from, isShow, WhetherTheTrip,
}) {
  const {
    legend,
    x_name: seriesName,
    y_name,
    x: seriesData,
    y,
    groupNum,
    group_type = [],
  } = chartData;
  const flag = y.every(ele => ele === ''); // 判断是否所有的刻度标签都为空
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
      left: '40px',
      right: '6%',
      bottom: '10%',
      top: 60,
      containLabel: true,
    },
    xAxis: {
      name: seriesName,
      nameLocation: 'middle',
      nameGap: 25,
      type: 'value',
      boundaryGap: [0, 0.01],
    },
    yAxis: {
      name: y_name,
      type: 'category',
      data: y,
    },
    dataZoom: [
      {
        type: 'slider',
        show: true,
        start: 0,
        end: 100,
        yAxisIndex: 0,
        filterMode: 'filter',
        right: 0,
        width: DataZoomWidth,
        showDetail: false,
        showDataShadow: false,
      },
    ],
    series: [],
  };
  if (flag) option.grid.left = '70px'; // 如果坐标轴刻度标签全部为空 则设置该属性 防止坐标轴名称显示不全
  const groupCount = seriesData.length; // 多个分组方式时的组数
  for (let i = 0; i < groupCount; i++) {
    const datas = foreachDataSetBackgroundColors(seriesData[i], i, type);
    const itemInfo = {
      name: groupNum === 1 ? seriesName : `${legend[i]}`,
      type: BAR_SeriesItemType,
      barMaxWidth: BAR_MaxWidth,
      barMinHeight: BAR_MinHeight,
      colorIndex: i,
      show: false,
      position: BAR_LabelPosition,
      color: '#4A4A4A',
      data: datas,
    };
    const seriesItem = getSeriesItem(itemInfo);
    option.series.push(seriesItem);
  }

  if (groupNum !== 1) {
    // 是否显示 图例
    option.legend.show = true;
    option.tooltip.trigger = 'item';
    const adjustgridTop = adjustGrid(groupCount); // 是否需要调整坐标轴 返回为false则不需要 返回数值则调整
    if (adjustgridTop) option.grid.top = adjustgridTop;
  }

  if (isShow) {
    // 是否显示数值
    const mainAxisLen = y.length; // y轴显示的数目
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

export default getBarChartOpt;
