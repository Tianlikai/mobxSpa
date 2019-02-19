import * as EChartType from './EChartType';
import getBarChartOpt from './E_BAR_CHART';
import getColumnChartOpt from './E_COLUMN_CHART';

const getChartOpt = ({ type, options }) => {
  options.type = type;
  switch (type) {
    case EChartType.BAR_CHART: {
      return getBarChartOpt(options);
    }
    case EChartType.BAR_CHART_DOWN: {
      break;
    }
    case EChartType.COLUMN_CHART: {
      return getColumnChartOpt(options);
    }
    case EChartType.COLUMN_CHART_DOWN: {
      break;
    }
    case EChartType.LINE_CHART: {
      break;
    }
    case EChartType.LINE_CHART_DOWN: {
      break;
    }
    case EChartType.RING_DIAGRAM: {
      break;
    }
    case EChartType.RING_DIAGRAM_DOWN: {
      break;
    }
    case EChartType.BAR_STACKED_CHART: {
      break;
    }
    case EChartType.BAR_STACKED_CHART_DOWN: {
      break;
    }
    case EChartType.COLUMN_STACKED_CHART: {
      break;
    }
    case EChartType.COLUMN_STACKED_CHART_DOWN: {
      break;
    }
    default: {
      return null;
    }
  }
  return null;
};

export default getChartOpt;
