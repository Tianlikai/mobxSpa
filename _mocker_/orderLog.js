const Mock = require('mockjs');

class OrderLog {
  constructor(initialLength) {
    this.initialLength = initialLength || 105;
    const cached = [];
    for (let i = 0; i < this.initialLength; i += 1) {
      const mock = Mock.mock({
        item: {
          'orderId|+1': 1400000 + i,
          'operationType|1': [1, 2, 3],
          orgName: Mock.Random.cword(4),
          operationDescription: Mock.Random.csentence(),
          userName: Mock.Random.cname(),
          operateDate: Mock.Random.datetime(),
        },
      });
      cached.push(mock.item);
    }
    this.cached = cached;
  }

  /**
   * @param {num: 页} p
   * @param {num: 行数} i
   * @param {num: 总数} max
   */
  getStartAndStop(p, i, max) {
    const start = (p - 1) * 10;
    let end = start + 10;
    if (end > max) end = max;
    return { start, end };
  }

  /**
   * 获取订单日志列表
   * @param {string: 搜索条件} name
   * @param {number: 页码} pageNo
   * @param {number: 每页长度} itemsPerPage
   * @param {number: 操作状态} state
   * @param {string: 开始日期} startTime
   * @param {string: 截止日期} endTime
   */
  getLog(name, pageNo, itemsPerPage, state, startTime, endTime) {
    let copyCached = this.cached.slice();
    const copyState = state ? `${state}` : null;
    const copyName = name ? `${name}` : null;
    if (copyName) {
      copyCached = copyCached.filter(
        element =>
          element.orgName.indexOf(copyName) >= 0 || element.userName.indexOf(copyName) >= 0, // eslint-disable-line
      );
    }
    if (copyState) {
      copyCached = copyCached.filter(element => `${element.operationType}` === copyState);
    }
    if (startTime && endTime) {
      copyCached = copyCached.filter((element) => {
        const createdAt = new Date(element.operateDate);
        const start = new Date(startTime);
        const end = new Date(endTime);
        return createdAt >= start && createdAt <= end;
      });
    }
    const len = copyCached.length;
    const items = [];
    let { start, end } = this.getStartAndStop(pageNo, itemsPerPage, len); // eslint-disable-line
    while (start < end) {
      items.push(copyCached[start]);
      start += 1;
    }
    return { items, count: len };
  }
}

const orderLog = new OrderLog();

module.exports = orderLog;
