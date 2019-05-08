import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import { Button, Table } from 'antd';

import ModuleLine from '@/components/ModuleLine';
import { WithBreadcrumb } from '@/components/Breadcrumb/index';

import TableHoc from '../../../../hoc/TableHoc';

import SearchForm from './SearchForm';
import ShareModal from './ShareModal';
import dealFormatData from './util';

import './style.scss';

// 可以使用缓存数据的返回页面
const noNeedReloadPathname = ['/form/baseForm', '/detail/baseDetail/'];

@TableHoc({ store: 'TableStore', dealFormatData, noNeedReloadPathname })
class SearchTable extends Component {
  static defaultProps = {
    titleValue: ['本次推广专属小程序二维码', '本次推广专属小程序链接'],
  };

  static propTypes = {
    loading: PropTypes.bool,
    tableData: PropTypes.array, // 表格数据
    query: PropTypes.object, // 表单查询信息
    titleValue: PropTypes.array, // 弹窗提示
    store: PropTypes.object, // @TableHoc 高阶组件中绑定的 mobx store 对象
    routerData: PropTypes.object.isRequired, // 路由数据
    history: PropTypes.object.isRequired, // router history
    handleSearch: PropTypes.func.isRequired, // @TableHoc 表单搜索接口
    handleResetSearch: PropTypes.func.isRequired, // @TableHoc 表单重置接口
  };

  constructor(props) {
    super(props);
    this.state = {
      visibleModal: false,
      record: {},
    };
  }

  get columns() {
    return [
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
      },
      {
        title: '地区',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '学校',
        dataIndex: 'school',
        key: 'school',
      },
      {
        title: '年级',
        dataIndex: 'grade',
        key: 'grade',
      },
      {
        title: '班级',
        dataIndex: 'className',
        key: 'className',
      },
      {
        title: '用户数',
        dataIndex: 'registerNumber',
        key: 'registerNumber',
      },
      {
        title: '订单金额',
        dataIndex: 'totalPayMoney',
        key: 'totalPayMoney',
      },
      {
        title: '我的收益',
        dataIndex: 'totalShare',
        key: 'totalShare',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 155,
        render: (text, record) => {
          const shareStyle = {
            width: 70,
            color: '#1574D4',
            marginRight: 5,
            cursor: 'pointer',
          };
          const detailStyle = {
            width: 70,
            color: '#1574D4',
            marginLeft: 5,
            cursor: 'pointer',
          };
          return (
            <div className="operations-orgGo">
              <span style={shareStyle} onClick={() => this.handleOpenShareModal(record)}>
                立即分享
              </span>
              <span style={detailStyle} onClick={() => this.redirectToDetail(record)}>
                查看详情
              </span>
            </div>
          );
        },
      },
    ];
  }

  redirectToCreatePromotion = () => {
    const {
      history: { push },
    } = this.props;
    push({ pathname: '/form/baseForm' });
  };

  redirectToDetail = (record) => {
    const {
      history: { push },
    } = this.props;
    push({ pathname: `/detail/baseDetail/${record.id}` });
  };

  handleOpenShareModal = (record) => {
    this.setState({
      visibleModal: true,
      record,
    });
    const { store } = this.props;
    store.getWeiCode({ promotionId: record.id, record });
  };

  handleCloseShareModal = () => {
    const { store } = this.props;
    this.setState(
      {
        visibleModal: false,
        record: {},
      },
      () => store.delWeiCode(),
    );
  };

  handleReset = () => {
    const { handleResetSearch } = this.props;
    handleResetSearch();
  };

  handleSearch = (value) => {
    const { timeLimit = [undefined, undefined], grade } = value;
    let { queryCond: name } = value;
    const startTime = timeLimit[0] && timeLimit[0].format('YYYY-MM-DD HH:mm:ss');
    const endTime = timeLimit[1] && timeLimit[1].format('YYYY-MM-DD HH:mm:ss');
    name = name ? name.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '') : undefined;

    const { handleSearch } = this.props;
    handleSearch({
      startTime,
      endTime,
      name,
      grade: grade || undefined,
    });
  };

  render() {
    const { visibleModal, record } = this.state;

    const {
      routerData: { config },
      titleValue,
      loading,
      tableData,
      query,
    } = this.props;

    return (
      <WithBreadcrumb config={config}>
        <Helmet>
          <title>查询表格 - SPA</title>
          <meta name="description" content="SPA" />
        </Helmet>
        <div className="table-search-wrapper">
          <ModuleLine title="查询表格">
            <Button
              size="middle"
              type="primary"
              className="promotionBtn"
              onClick={this.redirectToCreatePromotion}
            >
              新增
            </Button>
          </ModuleLine>

          <SearchForm
            handleReset={this.handleReset}
            onSubmit={this.handleSearch}
            initialValue={query}
          />
        </div>

        <Table
          bordered
          className="self-table-wrapper"
          loading={loading}
          dataSource={tableData}
          pagination={false}
          columns={this.columns}
        />
        <ShareModal
          key="base-table-modal"
          width={600}
          record={record}
          showTitle={false}
          titleDownImg="保存"
          recordType="string"
          visible={visibleModal}
          titleValue={titleValue}
          handleClose={this.handleCloseShareModal}
        />
      </WithBreadcrumb>
    );
  }
}

export default SearchTable;
