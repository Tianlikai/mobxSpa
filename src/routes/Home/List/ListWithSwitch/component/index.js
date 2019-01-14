import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import ModuleLine from 'components/ModuleLine'; // eslint-disable-line
import { WithBreadcrumb } from 'components/Breadcrumb/index'; // eslint-disable-line

import Select from 'components/Select/index'; // eslint-disable-line
import SwitchOfList from 'components/SwitchOfList/index'; // eslint-disable-line

import TableHoc from '../../../../../hoc/TableHoc';

import './style.scss';

@TableHoc({ store: 'TableStore' })
export default class ListWithSwitch extends Component {
  static propTypes = {
    routerData: PropTypes.object.isRequired, // 路由数据
  };

  state = {
    filterData: {},
  };

  handleSelect = (data) => {
    this.setState({
      filterData: data,
    });
  };

  render() {
    const { routerData } = this.props;
    const { config } = routerData;

    const SelectData = [
      {
        dataKey: 'category',
        label: '学科',
        defaultValue: '',
        children: [
          { key: '', value: '全部' },
          { key: '1', value: '数学' },
          { key: '0', value: '英语' },
        ],
      },
    ];

    const { filterData } = this.state;

    return (
      <WithBreadcrumb config={config}>
        <Helmet>
          <title>卡片表格切换 - SPA</title>
          <meta name="description" content="SPA" />
        </Helmet>
        <div className="table-search-wrapper">
          <ModuleLine title="查询表格" />
          <Select
            data={SelectData}
            value={filterData}
            filterData={filterData}
            handleSelect={this.handleSelect}
          />
        </div>
        <SwitchOfList />
      </WithBreadcrumb>
    );
  }
}
