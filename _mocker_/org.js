const Mock = require('mockjs');

class Org {
  constructor(initialLength) {
    this.initialLength = initialLength || 105;
    const cached = [];
    for (let i = 0; i < this.initialLength; i += 1) {
      const mock = Mock.mock({
        item: {
          'id|+1': 1000000 + i,
          'state|1': [0, 1],
          name: Mock.Random.cname(),
          mobile: /^1[34578]\d{9}$/,
          createdBy: Mock.Random.cname(),
          'teacherNum|1-100': 100,
          'studentNum|1-100': 100,
          'countState|1': [0, 1, 2, 3, 4],
          createdAtFormat: Mock.Random.datetime(),
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
   */
  getOrgList(name, pageNo, itemsPerPage, state) {
    let copyCached = this.cached.slice();
    const copyState = state ? `${state}` : null;
    const copyName = name ? `${name}` : null;
    if (copyName) {
      copyCached = copyCached.filter(
        element => element.name.indexOf(copyName) >= 0
          || `${element.id}`.indexOf(copyName) >= 0
          || `${element.mobile}`.indexOf(copyName) >= 0,
      );
    }
    if (copyState) {
      copyCached = copyCached.filter(element => `${element.countState}` === copyState);
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
   * 更新机构状态
   * @param {number: 机构id} id
   * @param {string: 状态} state
   */
  updateOrderById(id, state) {
    const pos = this.cached.findIndex(element => `${element.id}` === `${id}`);
    if (pos >= 0) {
      console.log(this.cached[pos]);
      this.cached[pos].state = state;
      return true;
    }
    console.log(pos);
    console.log(id);
    console.log(state);
    return false;
  }
}

const org = new Org();

module.exports = org;
