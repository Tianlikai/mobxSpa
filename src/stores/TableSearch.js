import { action, observable } from 'mobx';
import moment from 'moment';

import { GRADE } from '../settings/const';
import api from '../api';

class TableSearch {
  @observable
  table;

  @observable
  imgByte = {};

  @observable
  chooseImgByte = null;

  @observable
  activeId = null;

  constructor() {
    this.table = {
      loading: false,
      count: 0,
      list: [],
    };
  }

  @action
  getPromotionList({
    name, grade, pageNo = 1, pageSize = 10, startTime, endTime,
  }) {
    this.table.loading = true;
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
      .then((data) => {
        const count = { data };
        const list = data.items.map((item) => {
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
        this.table = {
          loading: false,
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
      G.api
        .getPromotionQrCode({
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
