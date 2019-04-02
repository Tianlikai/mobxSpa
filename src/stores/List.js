import { action, observable } from 'mobx';

import TableModel from './modal/TableModel';
// import { ApiOnline as api } from '../api/index';
import api from '../api/index';

class List {
  @observable
  tableData;

  constructor(Model) {
    this.tableModel = new Model();
    this.tableData = this.tableModel.tableData;
  }

  @action
  handleSearch(values) {
    const params = Object.assign(values, { pageNo: 1 });
    const data = this.tableModel.getParams(params);
    this.getData(data);
  }

  @action
  handleResetSearch() {
    this.getData({
      pageNo: 1,
      grade: undefined,
      name: undefined,
      startTime: undefined,
      endTime: undefined,
    });
  }

  @action
  handlePageChange(pageNo) {
    const data = this.tableModel.getParams({ pageNo });
    this.getData(data);
  }

  @action
  handlePageSizeChange(pageNo, pageSize) {
    const data = this.tableModel.getParams({ pageNo, pageSize });
    this.getData(data);
  }

  @action
  getData({
    name = undefined,
    grade = undefined,
    pageNo = 1,
    pageSize = 10,
    startTime = undefined,
    endTime = undefined,
    isOwn = 0,
  } = {}) {
    this.tableData.loading = true;
    api
      .fetchList({
        params: {
          isOwn,
          name,
          grade,
          pageNo,
          pageSize,
          startTime,
          endTime,
        },
      })
      .then((resp) => {
        const { count, items: listItems } = resp;
        const byId = listItems.map(item => item.id);

        this.tableData = {
          loading: false,
          pageNo: pageNo || this.tableData.pageNo,
          pageSize: pageSize || this.tableData.pageSize,
          count,
          listItems,
          byId,
          errorMessage: undefined,
          needReload: false,
          query: {
            grade,
            name,
            startTime,
            endTime,
          },
        };
      });
  }
}

export default new List(TableModel);
