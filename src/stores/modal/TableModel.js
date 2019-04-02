class TableModel {
  constructor({ pageSize = 10 } = {}) {
    this.tableData = {
      loading: false,
      count: 0,
      pageNo: 1,
      pageSize,
      listItems: [],
      byId: {},
      query: {},
      errorMessage: undefined,
      needReload: false,
    };
  }

  getParams(data) {
    return {
      pageNo: this.pageNo,
      pageSize: this.pageSize,
      ...this.query,
      ...data,
    };
  }
}

export default TableModel;
