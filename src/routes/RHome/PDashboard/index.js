import React from 'react';
import { Helmet } from 'react-helmet';

import { Icon, Tooltip } from 'antd';

import getChartOpt from '@/utils/echarts/index';
import MomentNow from '@/components/MomentNow/index';
import ReChart from '@/components/ReactEchart/ReactEchart';

import './style.scss';

const canvasData = {
  errcode: 0,
  status: 0,
  result: {
    id: 1,
    app_id: 0,
    name: '柱状堆积图',
    plot_type: 6,
    sum: 51,
    condition: [
      {
        col_desc: '职位',
        col_name: 'job',
        col_type: 'text',
        cond: 'equal',
        value: [
          '产品营销工程师',
          '系统维护工程师',
          '售前主管',
          '技术经理',
          '区域产品经理',
          '行业销售',
          '销售助理',
        ],
      },
    ],
    dimension: {
      measure: {
        col_desc: '总数',
        col_name: 'fx_total',
        col_type: 'int',
        method: 1,
      },
      newGroup: [
        {
          col_desc: '职位',
          col_name: 'job',
          col_type: 'text',
          cond_second: '',
        },
        {
          col_desc: '文章标题',
          col_name: 'title',
          col_type: 'text',
          cond_second: '',
        },
      ],
    },
    drill: {
      drill_condition: [
        {
          col_desc: 'partner_desc',
          col_name: 'partner_desc',
          col_type: 'varchar',
          format: '',
          plot_type: 2,
        },
        {
          charttype: '条形图',
          col_desc: 'action',
          col_name: 'action',
          col_type: 'varchar',
          format: '',
          plot_type: 1,
        },
      ],
    },
    drill_values: [],
    ds_id: 15,
    filter_key: 'job,title',
    groupNum: 2,
    group_type: ['text', 'text'],
    hasData: 0,
    legend: [
      '2017新品解读视频——AnyBackup 6.0 夯实高端数据保护技术',
      '2017新品解读视频——AnyRobot 2.0开启 IT 运营的日志云',
      '2017新品解读视频——AnyShare Family 6.0统一的文档云',
      '2017新品解读视频——AnyShare 运营服务 助力文档管理',
      '2017新品解读视频——AnyVM 5.0 高性能的超融合存储',
      'ASC新版本：多人在线编辑和强大插件功能',
      'b2b2c',
      'Proverb',
      '【人物专栏——武灵芝】安全新台阶，AnyShare新增安全应用场景介绍',
      '【医疗行业】数据中心升级整体解决方案销售指南 ? 深度解读',
      '【深度干货】AnyRobot 与监控产品的竞争差异',
      '【深度干货】企业行业——智能制造两化融合趋势下销售线索（一）',
      '【深度干货】企业行业——智能制造两化融合趋势下销售线索（二）',
      '【爱数主播】保护智慧城市政务数据，这个方案亮点足',
      '【讲师专栏 周杰】XX竞品分析及竞争策略',
      '一个10万用户规模的PB级教育云盘案例',
      '内容家2.2.6版本新功能介绍',
      '尊尚Z3第二版全新上市',
      '爱数云服务商合作伙伴认证通知',
      '蓝光归档，数据保护与归档的完美结合',
    ],
    slicer: {
      data: [
        {
          col_desc: '公司名称',
          col_name: 'company_name',
          col_type: 'text',
          format: '',
        },
        {
          col_desc: '职位',
          col_name: 'job',
          col_type: 'text',
          format: '',
        },
      ],
    },
    x: [
      [1, 1, 1, 1, 0, 0, 1],
      [1, 0, 0, 3, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 1],
      [1, 2, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 1],
      [0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 1, 0],
      [0, 1, 0, 2, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 1],
      [0, 2, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1],
      [0, 0, 1, 5, 1, 2, 1],
      [0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [1, 1, 2, 1, 1, 0, 0],
      [0, 1, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 1],
    ],
    x_name: '总数',
    y: [
      '产品营销工程师',
      '区域产品经理',
      '售前主管',
      '技术经理',
      '系统维护工程师',
      '行业销售',
      '销售助理',
    ],
    y_name: '职位,文章标题',
  },
};

/**
 * 该页面只是一个静态页面，没有加业务，之后添加
 */

export default class Dashboard extends React.Component {
  todo = () => {};

  render() {
    const style = { height: 500, width: '100%' };
    const option = getChartOpt({
      type: 1,
      options: {
        type: 1,
        chartData: canvasData.result,
        from: 'hasDetail',
        isShow: true,
        WhetherTheTrip: true,
      },
    });
    return (
      <React.Fragment>
        <Helmet>
          <title>仪表盘 - SPA</title>
          <meta name="description" content="SPA" />
        </Helmet>
        <main className="PDashboard">
          <div className="dashboard-header">
            <span className="dashboard-icon">
              <Icon type="dashboard" />
              仪表盘
            </span>
          </div>
          <div className="dashboard-wrap">
            <div className="dashboard-sideMenu">
              <div className="dashboard-side-title">仪表盘列表</div>
              <div className="dashboard-list">
                <div className="dashboard-list-item">
                  <span className="d-l-item-sort active">1</span>
                  <span className="d-l-item-name">个人看板</span>
                  <Tooltip title="删除">
                    <Icon className="d-l-item-del" type="close" />
                  </Tooltip>
                </div>
                <div className="dashboard-list-item">
                  <span className="d-l-item-sort">2</span>
                  <span className="d-l-item-name">个人看板</span>
                  <Tooltip title="删除">
                    <Icon className="d-l-item-del" type="close" />
                  </Tooltip>
                </div>
                <div className="dashboard-list-item">
                  <span className="d-l-item-sort">3</span>
                  <span className="d-l-item-name">个人看板</span>
                  <Tooltip title="删除">
                    <Icon className="d-l-item-del" type="close" />
                  </Tooltip>
                </div>
                <div className="dashboard-list-item">
                  <span className="d-l-item-sort">5</span>
                  <span className="d-l-item-name">个人看板</span>
                  <Tooltip title="删除">
                    <Icon className="d-l-item-del" type="close" />
                  </Tooltip>
                </div>
                <div className="dashboard-list-item">
                  <span className="d-l-item-sort">6</span>
                  <span className="d-l-item-name">个人看板</span>
                  <Tooltip title="删除">
                    <Icon className="d-l-item-del" type="close" />
                  </Tooltip>
                </div>
              </div>
              <div className="dashboard-side-title">自定义</div>
              <div className="dashboard-list">
                <div className="dashboard-list-item self dashed">
                  <Icon className="d-l-item-add" type="plus" />
                  <span className="d-l-item-name">新建仪表盘</span>
                </div>
              </div>
            </div>
            <div className="dashboard-content">
              <MomentNow className="dashboard-time" />
              <div className="chart-list">
                <ReChart style={style} option={option} notMerge />
                <ReChart style={style} option={option} notMerge />
                <ReChart style={style} option={option} notMerge />
              </div>
            </div>
          </div>
        </main>
      </React.Fragment>
    );
  }
}
