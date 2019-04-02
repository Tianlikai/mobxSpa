import { ColorArray } from './EChartType';

function foreachDataSetBackgroundColors(data, i, type) {
  const result = [];
  /* eslint-disable */
  data.forEach(item => {
    const list = {};
    list.value = item === -1 ? '-' : item;
    list.itemStyle = {
      normal: {
        color: ColorArray[i],
      },
    };
    if (item === 0 && type !== 3) {
      list.itemStyle = {
        normal: {
          opacity: 0,
        },
      };
    }
    result.push(list);
  });
  return result;
}

function getDataZoomEnd(len) {
  let end = 100;
  if (len <= 15) {
    end = 100;
  } else if (len <= 40) {
    end = 50;
  } else if (len <= 100) {
    end = 20;
  } else if (len <= 200) {
    end = 10;
  } else if (len <= 400) {
    end = 5;
  } else if (len <= 1000) {
    end = 2;
  } else {
    end = 1;
  }
  return end;
}

// 提示可单击、和双击
function formatterHintWithClick(params) {
  const div = formatterTooltip(params, '单击可下钻. 双击可查看项目详情');
  return div;
}

// 提示可双击
function formatterHintWithDbClick(params) {
  const div = formatterTooltip(params, '双击可查看项目详情');
  return div;
}

// Echarts tooltip的formatter函数
// type 为下载还是dashboard显示 false为下载 true为dashboard
function formatterTooltip(params, hint) {
  if (Object.prototype.toString.call(params) == '[object Object]') {
    const value = params.value === '-' ? '-' : params.value;
    let div = `<div style='padding:6px 10px 10px;'>${params.name}<br />`;
    div += `${params.seriesName}：${value}<br />`;
    div += '</div>';
    div += `<div style='font-size:10px;padding:3px 10px 0;text-align:center;border-top:1px solid #9E9E9E;'>${hint}</div>`;
    return div;
  }
  if (Object.prototype.toString.call(params) == '[object Array]') {
    let div = `<div style='padding:6px 10px 10px;'>${params[0].name}<br />`;
    for (let i = 0, j = params.length; i < j; i++) {
      const value = params[i].value === '-' ? '-' : params[i].value;
      div += `${params[i].seriesName}：${value}<br />`;
    }
    div += '</div>';
    div += `<div style='font-size:10px;padding:3px 10px 0;text-align:center;border-top:1px solid #9E9E9E;'>${hint}</div>`;
    return div;
  }
}

// 图表上面显示的数值要经过转换
function convertChartNumber(params) {
  let newValue = params.value;
  if (newValue && newValue === '-') return '-';
  // 如果value存在
  if (newValue) {
    newValue = Number.parseFloat(newValue);
    // >=1万
    if (newValue >= 10000) {
      newValue = Number.parseInt(newValue, 10);
      // >=1亿
      if (newValue >= 100000000) {
        newValue = `${(newValue / 100000000).toFixed(2)}亿`;
      } else {
        newValue = `${(newValue / 10000).toFixed(2)}万`;
      }
    } else {
      // 不是整数
      if (newValue % 1 !== 0) {
        newValue = newValue.toFixed(2);
      }
    }
  }
  return newValue;
}
/**
 * 依据图表分组分组数目判断 是否需要调整坐标轴
 * @param {num} groupCount
 * @return {bool/num}
 */
function adjustGrid(groupCount) {
  if (groupCount > 15) {
    return 120;
  }
  if (groupCount > 10) {
    return 100;
  }
  if (groupCount > 5) {
    return 80;
  }
  return false;
}
/**
 * 返回条形图SeriesItem
 * @param {str} name 坐标轴刻度名
 * @param {str} type
 * @param {num} barMaxWidth 最大宽度
 * @param {num} barMinHeight 最小高度
 * @param {num} colorIndex 颜色下标
 * @param {bool} show 是的显示label数据
 * @param {str} position label显示的位置
 * @param {str} color 颜色
 * @param {number} data 数值
 * @return {返回单个item配置对象}
 */
function getSeriesItem({
  name,
  type,
  barMaxWidth,
  barMinHeight,
  colorIndex,
  show,
  position,
  color,
  data,
}) {
  return {
    name,
    type,
    barMaxWidth,
    barMinHeight,
    itemStyle: {
      normal: {
        color: ColorArray[colorIndex],
      },
    },
    label: {
      normal: {
        show,
        position,
        formatter: convertChartNumber, // 当前环境函数
        textStyle: {
          color,
        },
      },
    },
    data,
  };
}
export {
  foreachDataSetBackgroundColors,
  getDataZoomEnd,
  formatterHintWithClick,
  formatterHintWithDbClick,
  formatterTooltip,
  convertChartNumber,
  adjustGrid,
  getSeriesItem,
};
