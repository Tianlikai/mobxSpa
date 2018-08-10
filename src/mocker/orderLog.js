const Mock = require('mockjs')

class OrderLog {
    constructor(initialLength) {
        this.initialLength = initialLength || 105
        let cached = []
        for (let i = 0; i < this.initialLength; ++i) {
            let mock = Mock.mock({
                'item': {
                    'orderId|+1': 1400000 + i,
                    'operationType|1': [1, 2, 3],
                    'orgName': Mock.Random.cword(4),
                    'operationDescription': Mock.Random.csentence(),
                    'userName': Mock.Random.cname(),
                    'operateDate': Mock.Random.datetime()
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
     * 获取订单日志列表
     * @param {string: 搜索条件} name
     * @param {number: 页码} pageNo
     * @param {number: 每页长度} itemsPerPage
     * @param {number: 操作状态} state
     * @param {string: 开始日期} startTime
     * @param {string: 截止日期} endTime
     */
    getLog(name, pageNo, itemsPerPage, state, startTime, endTime) {
        let copyCached = this.cached.slice()
        state = state ? state + '' : null
        name = name ? name + '' : null
        if (name) {
            copyCached = copyCached.filter(element => {
                return element.orgName.indexOf(name) >= 0 || element.userName.indexOf(name) >= 0
            })
        }
        if (state) {
            copyCached = copyCached.filter(element => {
                return element.operationType + '' === state
            })
        }
        if (startTime && endTime) {
            copyCached = copyCached.filter(element => {
                const createdAt = new Date(element.operateDate)
                const start = new Date(startTime)
                const end = new Date(endTime)
                return createdAt >= start && createdAt <= end
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

const orderLog = new OrderLog()

module.exports = orderLog
