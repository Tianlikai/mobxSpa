import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';

import { Pagination } from 'antd';

const TableHoc = config => (WrappedComponent) => {
  const { store, className, NoPager } = config || {};

  @inject(store)
  @observer
  class BaseTable extends Component {
    static defaultProps = {
      fixClass: 'baseTable-wrapper',
    };

    static propTypes = {
      fixClass: PropTypes.string,
      className: PropTypes.string,
      match: PropTypes.object,
    };

    componentDidMount() {
      const {
        match: { params: { id } = {} },
      } = this.props;
      /* eslint-disable */
      if (id) {
        // 如果根据路由获取 id 则拿 id 进行调用
        this.props[store].getData({ id });
      } else {
        this.props[store].getData();
      }
    }

    /**
     * 顶部搜索 接口
     * 具体实现在 store 中
     */
    handleSearch = values => {
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
    handlePageChange = page => {
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
    handleSort = data => {
      this.props[store].handleSort(data); // eslint-disable-line
    };

    render() {
      const { fixClass } = this.props;
      const Store = this.props[store]; // eslint-disable-line
      const { tableData: data } = Store;
      const tableData = toJS(data);

      const { loading, count, list, pageNo, pageSize, query } = tableData;

      const classes = classnames(fixClass, { [className]: className });
      return (
        <div className={classes}>
          <WrappedComponent
            query={query}
            loading={loading}
            tableData={list}
            store={Store}
            handleSort={this.handleSort}
            handleSearch={this.handleSearch}
            handleResetSearch={this.handleResetSearch}
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
