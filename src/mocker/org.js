const Mock = require('mockjs')

class Org {
    constructor(initialLength) {
        this.initialLength = initialLength || 105
        let cached = []
        for (let i = 0; i < this.initialLength; ++i) {
            let mock = Mock.mock({
                'item': {
                    'id|+1': 1000000 + i,
                    'state|1': [0, 1],
                    'name': Mock.Random.cname(),
                    'mobile': /^1[34578]\d{9}$/,
                    'createdBy': Mock.Random.cname(),
                    'teacherNum|1-100': 100,
                    'studentNum|1-100': 100,
                    'countState|1': [0, 1, 2, 3, 4],
                    'createdAtFormat': Mock.Random.datetime()
                }
            })
            cached.push(mock.item)
        }
        this.cached = cached
    }

    /**
     * @param {num: 页} p
     * @param {num: 行数} i
     * @param {num: 总数} max
     */
    getStartAndStop(p, i, max) {
        let start = (p - 1) * 10
        let end = start + 10
        if (end > max) end = max
        return {start, end}
    }

    /**
     * 获取列表
     * @param {string: 搜索条件} name
     * @param {number: 页码} pageNo
     * @param {number: 每页长度} itemsPerPage
     * @param {number: 该条记录状态} state
     */
    getOrgList(name, pageNo, itemsPerPage, state) {
        let copyCached = this.cached.slice()
        state = state ? state + '' : null
        name = name ? name + '' : null
        if (name) {
            copyCached = copyCached.filter(element => {
                return element.name.indexOf(name) >= 0 || (element.id + '').indexOf(name) >= 0 || (element.mobile + '').indexOf(name) >= 0
            })
        }
        if (state) {
            copyCached = copyCached.filter(element => {
                return element.countState + '' === state
            })
        }
        let len = copyCached.length
        let items = []
        let {start, end} = this.getStartAndStop(pageNo, itemsPerPage, len)
        while (start < end) {
            items.push(copyCached[start])
            ++start
        }
        return {items, count: len}
    }
}

const org = new Org()

module.exports = org
