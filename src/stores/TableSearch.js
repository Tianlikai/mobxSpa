import { action, observable } from 'mobx';
import moment from 'moment';

import { GRADE } from '../settings/const';
import api from '../api';

class TableSearch {
  @observable
  data = {
    loading: false,
    count: 0,
    pageNo: 1,
    pageSize: 10,
    list: [],
  };

  @observable
  imgByte = {};

  @observable
  chooseImgByte = null;

  @observable
  activeId = null;

  getParams(data) {
    return {
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize,
      ...data,
    };
  }

  @action
  handleSearch(values) {
    debugger;
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
  } = {}) {
    this.data.loading = true;
    api
      .initTableData({
        params: {
          name,
          grade,
          pageNo,
          itemsPerPage: pageSize,
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

        this.data = {
          loading: false,
          pageNo: pageNo || this.data.pageNo,
          pageSize: pageSize || this.data.pageSize,
          count,
          list,
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

export default new TableSearch();
