import { action, observable } from 'mobx';
import moment from 'moment';

import { GRADE } from '../settings/const';
// import { ApiOnline as api } from '../api/index';
import api from '../api/index';

class List {
  @observable
  tableData = {
    loading: false,
    count: 0,
    pageNo: 1,
    pageSize: 10,
    list: [],
    query: {},
  };

  @observable
  imgByte = {};

  @observable
  chooseImgByte = null;

  @observable
  activeId = null;

  getParams(data) {
    return {
      pageNo: this.tableData.pageNo,
      pageSize: this.tableData.pageSize,
      ...this.tableData.query,
      ...data,
    };
  }

  @action
  handleSearch(values) {
    const params = Object.assign(values, { pageNo: 1 });
    const data = this.getParams(params);
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
    const data = this.getParams({ pageNo });
    this.getData(data);
  }

  @action
  handlePageSizeChange(pageNo, pageSize) {
    const data = this.getParams({ pageNo, pageSize });
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
        const { count } = resp;

        const list = resp.items.map((item) => {
          const copyItem = Object.assign({}, item);
          const pos = GRADE.findIndex(grd => grd.value === item.grade);
          copyItem.createdAt = item.createdAt
            ? moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
            : '-';
          copyItem.payTime = item.payTime || '-';
          copyItem.grade = item.grade && pos >= 0 ? GRADE[pos].text : '-';
          copyItem.payMoney = item.payMoney ? `¥${item.payMoney}` : '-';
          copyItem.className = item.className || '-';
          copyItem.key = item.id;
          copyItem.note = item.note || '';
          return copyItem;
        });

        this.tableData = {
          loading: false,
          pageNo: pageNo || this.tableData.pageNo,
          pageSize: pageSize || this.tableData.pageSize,
          count,
          list,
          query: {
            grade,
            name,
            startTime,
            endTime,
          },
        };
      });
  }

  @action
  getWeiCode({
    promotionId, width = 200, autoColor = false, isHyaline = false,
  }) {
    if (!this.imgByte[promotionId]) {
      api
        .getQRCode({
          promotionId,
          width,
          autoColor,
          isHyaline,
        })
        .then((data) => {
          this.imgByte[promotionId] = data;
          this.chooseImgByte = data;
          this.activeId = promotionId;
        });
    } else {
      this.chooseImgByte = this.imgByte[promotionId];
      this.activeId = promotionId;
    }
  }

  @action
  delWeiCode() {
    this.activeId = null;
    this.chooseImgByte = null;
  }
}

export default new List();
