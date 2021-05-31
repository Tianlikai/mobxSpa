import { action, observable, flow } from 'mobx';

import TableModel from './modal/TableModel';
import api from '../api';

class Table {
  @observable
  tableData;

  @observable
  imgByte = {};

  @observable
  chooseImgByte = null;

  @observable
  activeId = null;

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
  handleSort(values) {
    const params = Object.assign(values, { pageNo: 1 });
    const data = this.tableModel.getParams(params);
    this.getData(data);
  }

  @action
  handleResetSearch() {
    const params = Object.assign({
      pageNo: 1,
      grade: undefined,
      name: undefined,
      startTime: undefined,
      endTime: undefined,
    }, { pageNo: 1 });
    const data = this.tableModel.getParams(params);
    this.getData(data);
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


  getData = flow(function* getDataAction({
    name = undefined,
    grade = undefined,
    pageNo = 1,
    pageSize = 10,
    startTime = undefined,
    endTime = undefined,
    order = undefined,
  } = {}) {
    this.tableData.loading = true;
    const resp = yield api.initTableData({
      params: {
        name,
        grade,
        pageNo,
        itemsPerPage: pageSize,
        startTime,
        endTime,
        order,
      },
    });
    const { count, items: listItems } = resp;
    const byId = listItems.map(item => item.id);
    const tableData = {
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
        order,
      },
    };
    this.tableModel.tableData = tableData;
    this.tableData = tableData;
  });

  getWeiCode = flow(function* getWeiCodeAction({
    promotionId,
    width = 200,
    autoColor = false,
    isHyaline = false,
  }) {
    if (!this.imgByte[promotionId]) {
      const data = yield api.getQRCode({
        promotionId,
        width,
        autoColor,
        isHyaline,
      });
      this.imgByte[promotionId] = data;
      this.chooseImgByte = data;
      this.activeId = promotionId;
    } else {
      this.chooseImgByte = this.imgByte[promotionId];
      this.activeId = promotionId;
    }
  })

  @action
  delWeiCode() {
    this.activeId = null;
    this.chooseImgByte = null;
  }
}

export default new Table(TableModel);
