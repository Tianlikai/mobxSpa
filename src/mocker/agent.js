const Mock = require('mockjs')

class Agent {
    constructor(
        initialMyIncomeLength,
        initialMyProLength,
        code,
        settled,
        settling,
        noSettle) {
        this.initialMyIncomeLength = initialMyIncomeLength || 0
        this.initialMyProLength = initialMyProLength || 55
        this.totalShare = code || 0
        this.settled = settled || 0
        this.settling = settling || 0
        this.noSettle = noSettle || 0
        let cached = []
        for (let i = 0; i < this.initialMyIncomeLength; ++i) {
            let mock = Mock.mock({
                'item': {
                    'id|+1': 1200000 + i,
                    'createdAt': Mock.Random.datetime(),
                    'address': Mock.Random.city(),
                    'school': '',
                    'grade|1': [7, 8, 9],
                    'className': '',
                    'registerNumber|1-1000': 100,
                    'totalPayMoney|1-10000': 100,
                    'totalShare|1-10000': 100
                }
            })
            cached.push(mock.item)
        }
        let cachedPro = []
        for (let i = 0; i < this.initialMyProLength; ++i) {
            let mock = Mock.mock({
                'item': {
                    'id|+1': 1200000 + i,
                    'createdAt': Mock.Random.datetime(),
                    'address': Mock.Random.city(),
                    'school': Mock.Random.cword(5) + '学校',
                    'grade|1': [7, 8, 9],
                    'className': '',
                    'registerNumber|1-1000': 100,
                    'totalPayMoney|1-10000': 100,
                    'totalShare|1-10000': 100
                }
            })
            cachedPro.push(mock.item)
        }
        this.cached = cached
        this.cachedPro = cachedPro
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
     * 推广列表
     * @param {string: 搜索条件} name
     * @param {number: 页码} pageNo
     * @param {number: 每页长度} itemsPerPage
     * @param {number: 年级} grade
     */
    getProList(name, pageNo, itemsPerPage, grade) {
        let copyCached = this.cachedPro.slice()
        grade = grade ? grade + '' : null
        name = name ? name + '' : null
        if (name) {
            copyCached = copyCached.filter(element => {
                return element.name.indexOf(name) >= 0 || (element.id + '').indexOf(name) >= 0 || (element.mobile + '').indexOf(name) >= 0
            })
        }
        if (grade) {
            copyCached = copyCached.filter(element => {
                return element.grade + '' === grade
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

    /**
     * 获取分成列表
     * @param {number: 页码} pageNo
     * @param {number: 每页长度} itemsPerPage
     */
    getMyShare(pageNo, itemsPerPage) {
        let items = []
        let len = this.cached.length
        let {start, end} = this.getStartAndStop(pageNo, itemsPerPage, len)
        while (start < end) {
            items.push(this.cached[start])
            ++start
        }
        return {
            items,
            count: len,
            totalShare: this.totalShare,
            settled: this.settled,
            settling: this.settling,
            noSettle: this.noSettle
        }
    }

    /**
     * 我的信息
     */
    getMyInfo() {
        return {
            id: 3,
            createdBy: null,
            updatedBy: '51223',
            createdAt: '2018-07-09 16:52:52',
            updatedAt: '2018-07-09 16:52:52',
            userId: 51074,
            agentNumber: '18300000001',
            agentPassword: '871e99571e0df7a5e616a962ccf66ec6d4cb4934',
            agentName: '代理商名称',
            agentType: '代理商',
            state: 0,
            profitShare: '33',
            receivablesType: '对公转账',
            receivables: '收款账号',
            bank: '开户行',
            accountName: '账户名称',
            companyName: '公司名称'
        }
    }
}

const agent = new Agent()

module.exports = agent
