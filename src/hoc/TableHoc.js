import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';

import { Pagination } from 'antd';

const TableHoc = config => (WrappedComponent) => {
  const {
    store, // 绑定 store
    className,
    NoPager, // 是否需要外置翻页器
    noNeedReloadPathname = [], // 不需要重新加载数据的返回页面
    dealFormatData = data => data, // 清理列表数据方法
  } = config || {};

  @inject(store)
  @observer
  class BaseTable extends Component {
    static defaultProps = {
      fixClass: 'baseTable-wrapper',
    };

    static propTypes = {
      fixClass: PropTypes.string,
      className: PropTypes.string,
      location: PropTypes.object.isRequired,
      match: PropTypes.object.isRequired,
    };

    componentDidMount() {
      const {
        match: { params: { id } = {} },
        location: { pathname },
      } = this.props;
      /* eslint-disable */
      const {
        tableData: { count, needReload },
      } = this.props[store];

      const preLocation = window.RouterPathname.find((item) => item !== pathname); // [preLocation, curLocation]

      const noNeedReloadTag = !preLocation
        ? false
        : noNeedReloadPathname.some((item) => {
            return preLocation.startsWith(item);
          });

      // 数据没有更新使用缓存数据
      if (count !== 0 && !needReload && noNeedReloadTag) {
        return null;
      }

      if (id) {
        // 如果根据路由获取 id 则拿 id 进行调用
        this.props[store].getData({ id });
      } else {
        this.props[store].getData();
      }
      return null;
    }

    /**
     * 顶部搜索 接口
     * 具体实现在 store 中
     */
    handleSearch = (values) => {
      this.props[store].handleSearch(values); // eslint-disable-line
    };

    /**
     * 重置搜索 接口
     * 具体实现在 store 中
     */
    handleResetSearch = () => {
      this.props[store].handleResetSearch(); // eslint-disable-line
    };

    /**
     * 翻页 接口
     * 具体实现在 store 中
     */
    handlePageChange = (page) => {
      this.props[store].handlePageChange(page); // eslint-disable-line
    };

    /**
     * 改变pageSize 接口
     * 具体实现在 store 中
     */
    handlePageSizeChange = (page, pageSize) => {
      this.props[store].handlePageSizeChange(page, pageSize); // eslint-disable-line
    };

    /**
     * 排序 接口
     * 具体实现在 store 中
     */
    handleSort = (data) => {
      this.props[store].handleSort(data); // eslint-disable-line
    };

    render() {
      const { fixClass } = this.props;
      const Store = this.props[store]; // eslint-disable-line
      const { tableData: data } = Store;
      const tableData = toJS(data);
      const classes = classnames(fixClass, { [className]: className });

      const { loading, count, listItems, pageNo, pageSize, query } = tableData;

      const formatData = dealFormatData(listItems);

      return (
        <div className={classes}>
          <WrappedComponent
            loading={loading}
            query={query}
            tableData={formatData}
            handleSort={this.handleSort}
            handleSearch={this.handleSearch}
            handleResetSearch={this.handleResetSearch}
            store={Store}
            {...this.props}
          />

          {NoPager ? null : (
            <div className="pagWrapper">
              <Pagination
                showQuickJumper
                showSizeChanger
                showTotal={() => `共 ${count} 条`}
                onChange={this.handlePageChange}
                onShowSizeChange={this.handlePageSizeChange}
                current={pageNo}
                total={count}
                pageSize={pageSize}
              />
            </div>
          )}
        </div>
      );
    }
  }

  return BaseTable;
};

export default TableHoc;
