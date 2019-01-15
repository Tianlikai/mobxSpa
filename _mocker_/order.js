const Mock = require('mockjs');

class Order {
  constructor(initialLength) {
    this.initialLength = initialLength || 105;
    const cached = [];
    for (let i = 0; i < this.initialLength; i += 1) {
      const mock = Mock.mock({
        item: {
          'orderId|+1': 1100000 + i,
          createTime: Mock.Random.datetime(),
          payTime: Mock.Random.datetime(),
          orgName: Mock.Random.csentence(),
          mobile: /^1[34578]\d{9}$/,
          'payMoney|1-10000': 100,
          'state|1': [0, 1, 2, 3, 4],
          note: Mock.Random.csentence(),
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
   * 获取列表
   * @param {string: 搜索条件} name
   * @param {number: 页码} pageNo
   * @param {number: 每页长度} itemsPerPage
   * @param {number: 该条记录状态} state
   * @param {string: 开始日期} startTime
   * @param {string: 截止日期} endTime
   */
  getOrderList(name, pageNo, itemsPerPage, state, startTime, endTime) {
    let copyCached = this.cached.slice();
    state = state ? `${state}` : null;
    name = name ? `${name}` : null;
    if (name) {
      copyCached = copyCached.filter(
        element => element.name.indexOf(name) >= 0
          || `${element.id}`.indexOf(name) >= 0
          || `${element.mobile}`.indexOf(name) >= 0,
      );
    }
    if (state) {
      copyCached = copyCached.filter(element => `${element.countState}` === state);
    }
    if (startTime && endTime) {
      copyCached = copyCached.filter((element) => {
        const createdAt = new Date(element.createTime);
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

  /**
   * 更新订单状态
   * @param {number: 订单id} id
   * @param {string: 备注信息} note
   * @param {string: 状态} state
   */
  updateOrderById(id, note, state) {
    const pos = this.cached.findIndex(element => `${element.orderId}` === `${id}`);
    if (pos >= 0) {
      console.log(this.cached[pos]);
      console.log(note);
      this.cached[pos].note = note;
      this.cached[pos].state = state;
      return true;
    }
    return false;
  }
}

const order = new Order();

module.exports = order;
