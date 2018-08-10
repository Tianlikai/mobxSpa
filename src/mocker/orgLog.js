const Mock = require('mockjs')

class OrgLog {
    constructor(initialLength) {
        this.initialLength = initialLength || 105
        let cached = []
        for (let i = 0; i < this.initialLength; ++i) {
            let mock = Mock.mock({
                'item': {
                    'id|+1': 1300000 + i,
                    'operationType|1': [0, 1, 2, 3, 4, 5],
                    'orgName': Mock.Random.cword(4),
                    'operationDescription': Mock.Random.csentence(),
                    'username': Mock.Random.cname(),
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
     * 获取机构日志列表
     * @param {string: 搜索条件} name
     * @param {number: 页码} pageNo
     * @param {number: 每页长度} itemsPerPage
     * @param {number: 操作状态} operationType
     * @param {string: 开始日期} startTime
     * @param {string: 截止日期} endTime
     */
    getLog(name, pageNo, itemsPerPage, operationType, startTime, endTime) {
        let copyCached = this.cached.slice()
        operationType = operationType ? operationType + '' : null
        name = name ? name + '' : null
        if (name) {
            copyCached = copyCached.filter(element => {
                return element.orgName.indexOf(name) >= 0 || element.username.indexOf(name) >= 0
            })
        }
        if (operationType) {
            copyCached = copyCached.filter(element => {
                return element.operationType + '' === operationType
            })
        }
        if (startTime && endTime) {
            copyCached = copyCached.filter(element => {
                const createdAt = new Date(element.createdAtFormat)
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

const orgLog = new OrgLog()

module.exports = orgLog
