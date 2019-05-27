import * as EchartType from './EchartType';
import getBarChartOpt from './E_BAR_CHART';
import getColumnChartOpt from './E_COLUMN_CHART';

const getChartOpt = ({ type, options }) => {
  options.type = type;
  switch (type) {
    case EchartType.BAR_CHART: {
      return getBarChartOpt(options);
    }
    case EchartType.BAR_CHART_DOWN: {
      break;
    }
    case EchartType.COLUMN_CHART: {
      return getColumnChartOpt(options);
    }
    case EchartType.COLUMN_CHART_DOWN: {
      break;
    }
    case EchartType.LINE_CHART: {
      break;
    }
    case EchartType.LINE_CHART_DOWN: {
      break;
    }
    case EchartType.RING_DIAGRAM: {
      break;
    }
    case EchartType.RING_DIAGRAM_DOWN: {
      break;
    }
    case EchartType.BAR_STACKED_CHART: {
      break;
    }
    case EchartType.BAR_STACKED_CHART_DOWN: {
      break;
    }
    case EchartType.COLUMN_STACKED_CHART: {
      break;
    }
    case EchartType.COLUMN_STACKED_CHART_DOWN: {
      break;
    }
    default: {
      return null;
    }
  }
  return null;
};

export default getChartOpt;
