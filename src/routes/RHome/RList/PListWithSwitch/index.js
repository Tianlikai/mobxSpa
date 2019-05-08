import React, { Component } from 'react';

import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Helmet } from 'react-helmet';

import { Table, Button } from 'antd';

import { WithBreadcrumb } from '@/components/Breadcrumb/index';
import Select from '@/components/Select/index';
import ListCard from '@/components/ListCard/index';
import ActionSet from '@/components/ActionSet/index';
import ModuleLine from '@/components/ModuleLine';
import VideoState from '@/components/VideoState/index';
import SwitchOfList from '@/components/SwitchOfList/index';
import TextWithIntercept from '@/components/TextWithIntercept/index';

import TableHoc from '../../../../hoc/TableHoc';

import './style.scss';

@TableHoc({ store: 'ListStore', className: 'listWrapper' })
class ListWithSwitch extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    tableData: PropTypes.array,
    routerData: PropTypes.object.isRequired, // 路由数据
  };

  state = {
    showType: 'card',
    filterData: {},
  };

  get columns() {
    return [
      {
        title: '视频ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
      },
      {
        title: '视频名称',
        dataIndex: 'fileName',
        key: 'fileName',
        render: text => <TextWithIntercept text={text} len={10} />,
      },
      {
        title: '知识点关联状态',
        dataIndex: 'kpoint',
        key: 'kpoint',
        render: (text) => {
          const value = text[0] ? text[0].name : '尚未关联知识点';
          return <TextWithIntercept text={value} len={10} />;
        },
      },
      {
        title: '自定义标签',
        dataIndex: 'userDefinedTags',
        key: 'userDefinedTags',
        render: (text) => {
          let str = '';
          if (text && text.length > 0) {
            str = text.reduce((l, r) => (l += `${r},`), '');
          } else {
            return '-';
          }
          str = str.substring(0, str.length - 1);
          return <TextWithIntercept text={str} len={10} />;
        },
      },
      {
        title: '视频状态',
        dataIndex: 'state',
        key: 'state',
        render: (text, record) => <VideoState size={10} record={record} text={text} />,
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        className: 'td-action',
        render: (text, record) => (
          <ActionSet
            page="personal"
            record={record}
            // handleOpenPreview={this.handleOpenPreview.bind(this, record)}
            // handleEditVideo={this.handleEditVideo.bind(this, record)}
            // handleModifyVideo={this.handleModifyVideo.bind(this, record)}
            // handleDelete={this.handleDelete.bind(this, record)}
          />
        ),
      },
    ];
  }

  handleSelect = (data) => {
    this.setState({
      filterData: data,
    });
  };

  handleSwitchChange = (showType) => {
    this.setState({ showType });
  };

  render() {
    const { routerData, loading, tableData } = this.props;
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

    const { filterData, showType } = this.state;

    return (
      <WithBreadcrumb config={config}>
        <Helmet>
          <title>卡片表格切换 - SPA</title>
          <meta name="description" content="SPA" />
        </Helmet>
        <div className="table-search-wrapper">
          <ModuleLine title="卡片表格切换">
            <Button
              size="middle"
              type="primary"
              className="create-btn"
              onClick={this.redirectToCreate}
            >
              新增
            </Button>
          </ModuleLine>
          <Select
            data={SelectData}
            value={filterData}
            filterData={filterData}
            handleSelect={this.handleSelect}
          />
        </div>
        <SwitchOfList showType={showType} onChange={this.handleSwitchChange} />
        <ListCard
          key="listCard"
          page="personal"
          data={tableData}
          loading={loading}
          display={showType === 'card'}
          // handleDelete={this.handleDelete.bind(this)}
          // handleEditVideo={this.handleEditVideo.bind(this)}
          // handleModifyVideo={this.handleModifyVideo.bind(this)}
          // handleOpenPreview={this.handleOpenPreview.bind(this)}
        />
        <Table
          key="table"
          bordered
          loading={loading}
          pagination={false}
          columns={this.columns}
          dataSource={tableData}
          className={classnames('self-table-wrapper', { displayNone: showType === 'card' })}
        />
      </WithBreadcrumb>
    );
  }
}

export default ListWithSwitch;
