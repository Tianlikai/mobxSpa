import dayJs from 'dayjs';
import CloneDeep from 'lodash/cloneDeep';

import { action, observable } from 'mobx';
import { GRADE } from '@/settings/const';
import api from '../api';

const INFORMATION = {
  createdAt: { label: '开始时间:', value: '-' },
  address: { label: '地区:', value: '-' },
  grade: { label: '年级:', value: '-' },
  mathPressName: { label: '数学版本:', value: '-' },
  mathTeacher: { label: '数学老师:', value: '-' },
  englishPressName: { label: '英语版本:', value: '-' },
  englishTeacher: { label: '英语老师:', value: '-' },
  school: { label: '学校:', value: '-' },
  className: { label: '班级:', value: '-' },
};

const DATA_OVERVIEW = [
  {
    key: 'registerNumber',
    title: '注册用户总数',
    footer: '昨日增长',
    hint: '本推广带来注册用户数',
    total: '-',
    yesterday: '-',
  },
  {
    key: 'payRegisterNumber',
    title: '付费用户总数',
    footer: '昨日增长',
    hint: '本推广带来付费用户数',
    total: '-',
    yesterday: '-',
  },
  {
    key: 'totalShare',
    title: '累计分成',
    footer: '昨日收益',
    hint: '本推广带来累计分成',
    total: '-',
    yesterday: '-',
  },
];

class Detail {
  @observable
  tableData;

  constructor() {
    this.tableData = {
      loading: false,
      count: 0,
      listItems: [],
    };
    this.basicInformation = INFORMATION;
    this.dataOverview = DATA_OVERVIEW;
  }

  @action
  getData({ id, pageNo = 1, pageSize = 10 } = {}) {
    this.tableData.loading = true;
    api
      .getDetailData({
        params: { promotionId: id, pageNo, itemsPerPage: pageSize },
      })
      .then((data) => {
        const basicInformation = CloneDeep(this.basicInformation);
        const keys = Object.keys(basicInformation);
        keys.forEach((key) => {
          if (key === 'createdAt') {
            basicInformation[key].value = data[key]
              ? dayJs(data[key]).format('YYYY-MM-DD HH:mm:ss')
              : '-';
          } else if (key === 'grade') {
            const pos = GRADE.findIndex(grade => grade.value === data[key]);
            basicInformation[key].value = data[key] && pos >= 0 ? GRADE[pos].text : '-';
          } else {
            basicInformation[key].value = data[key] || '-';
          }
        });
        this.basicInformation = basicInformation;

        const dataOverview = this.dataOverview.slice();
        dataOverview.forEach((item, i) => {
          switch (item.key) {
            case 'registerNumber': {
              dataOverview[i].total = data.registerNumber;
              dataOverview[i].yesterday = data.yesterdayRegisterNumber;
              break;
            }
            case 'payRegisterNumber': {
              dataOverview[i].total = data.payRegisterNumber;
              dataOverview[i].yesterday = data.yesterdayPayRegisterNumber;
              break;
            }
            case 'totalShare': {
              dataOverview[i].total = data.totalShare;
              dataOverview[i].yesterday = data.yesterdayShare;
              break;
            }
            default:
              break;
          }
        });
        this.dataOverview = dataOverview;

        const count = data.totalCourseOrderNumber;
        const listItems = data.courseOrderlist.map((item) => {
          const copy = Object.assign({}, item);
          const pos = GRADE.findIndex(grade => grade.value === item.grade);
          copy.payTime = item.payTime ? dayJs(item.payTime).format('YYYY-MM-DD HH:mm:ss') : '-';
          copy.payMoney = item.payMoney ? `¥${item.payMoney}` : '-';
          copy.share = item.share ? `¥${item.share}` : '-';
          if (item.grade && pos >= 0) {
            const i = GRADE.findIndex(grade => grade.value === item.grade);
            copy.grade = pos >= 0 ? GRADE[i].text : '-';
          } else {
            copy.grade = '-';
          }
          copy.key = item.id;
          return item;
        });

        this.tableData = {
          loading: false,
          count,
          listItems,
        };
      });
  }

  @action
  clearPromotionDetail() {
    this.basicInformation = INFORMATION;
    this.dataOverview = DATA_OVERVIEW;
  }
}

export default new Detail();
