const Mock = require('mockjs')
const moment = require('moment')
const mathVersion = ['通用版', '人教版', '浙教版', '苏教版', '北师大版']
const englishVersion = [
    '通用版',
    '人教版',
    '外研版',
    '苏教译林版',
    '上海牛津版'
]

class Agent {
    constructor(
        initialMyIncomeLength,
        initialMyProLength,
        code,
        settled,
        settling,
        noSettle
    ) {
        this.initialMyIncomeLength = initialMyIncomeLength || 0
        this.initialMyProLength = initialMyProLength || 55
        this.totalShare = code || 0
        this.settled = settled || 0
        this.settling = settling || 0
        this.noSettle = noSettle || 0
        let cached = []
        for (let i = 0; i < this.initialMyIncomeLength; ++i) {
            let mock = Mock.mock({
                item: {
                    'id|+1': 1200000 + i,
                    createdAt: Mock.Random.datetime(),
                    address: Mock.Random.city(),
                    school: '',
                    'grade|1': [7, 8, 9],
                    className: '',
                    'registerNumber|1-1000': 100,
                    'totalPayMoney|1-10000': 100,
                    'totalShare|1-10000': 100
                }
            })
            cached.push(mock.item)
        }
        let cachedPro = []
        for (let i = 0; i < this.initialMyProLength; ++i) {
            const courseOrderlist = this.getTable(this.initialMyProLength)
            let mock = Mock.mock({
                item: {
                    'id|+1': 1200000 + i,
                    createdAt: Mock.Random.datetime(),
                    address: Mock.Random.city(),
                    school: Mock.Random.cword(5) + '学校',
                    'grade|1': [7, 8, 9],
                    'className|1': [
                        '一班',
                        '二班',
                        '三班',
                        '四班',
                        '五班',
                        '六班',
                        '七班',
                        '八班',
                        '九班',
                        '十班',
                        '十一班'
                    ],
                    'registerNumber|1-1000': 100,
                    'totalPayMoney|1-10000': 100,
                    'yesterdayRegisterNumber|1-10000': 100,
                    'totalShare|1-10000': 100,
                    'yesterdayShare|1-10000': 100,
                    'payRegisterNumber|1-10000': 100,
                    'yesterdayPayRegisterNumber|1-10000': 100,
                    mathTeacher: Mock.Random.cname(),
                    'mathPressName|1': mathVersion,
                    englishTeacher: Mock.Random.cname(),
                    'englishPressName|1': englishVersion,
                    courseOrderlist: courseOrderlist
                }
            })
            cachedPro.push(mock.item)
        }
        this.cached = cached
        this.cachedPro = cachedPro
    }

    getTable(num) {
        let table = []
        for (let i = 0; i < num; ++i) {
            let mock = Mock.mock({
                item: {
                    mobile: /^1[385][1-9]\d{8}/,
                    userName: Mock.Random.cname(),
                    payTime: Mock.Random.datetime(),
                    courseName: Mock.Random.csentence(),
                    'grade|1': [7, 8, 9],
                    'payMoney|1-1000': 100,
                    'share|1-10000': 100
                }
            })
            table.push(mock.item)
        }
        return table
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
        return { start, end }
    }

    /**
     * 推广列表
     * @param {string: 搜索条件} name
     * @param {number: 页码} pageNo
     * @param {number: 每页长度} itemsPerPage
     * @param {number: 年级} grade
     * @param {string: 开始日期} startTime
     * @param {string: 截止日期} endTime
     */
    getProList(name, pageNo, itemsPerPage, grade, startTime, endTime) {
        let copyCached = this.cachedPro.slice()
        grade = grade ? grade + '' : null
        name = name ? name + '' : null
        if (name) {
            copyCached = copyCached.filter(element => {
                return (
                    element.school.indexOf(name) >= 0
                    || (element.className + '').indexOf(name) >= 0
                )
            })
        }
        if (grade) {
            copyCached = copyCached.filter(element => {
                return element.grade + '' === grade
            })
        }
        if (startTime && endTime) {
            copyCached = copyCached.filter(element => {
                const createdAt = new Date(element.createdAt)
                const start = new Date(startTime)
                const end = new Date(endTime)
                return createdAt >= start && createdAt <= end
            })
        }
        let len = copyCached.length
        let items = []
        let { start, end } = this.getStartAndStop(pageNo, itemsPerPage, len)
        while (start < end) {
            items.push(copyCached[start])
            ++start
        }
        return { items, count: len }
    }

    /**
     * 获取分成列表
     * @param {number: 页码} pageNo
     * @param {number: 每页长度} itemsPerPage
     */
    getMyShare(pageNo, itemsPerPage) {
        let items = []
        let len = this.cached.length
        let { start, end } = this.getStartAndStop(pageNo, itemsPerPage, len)
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

    /**
     * 获取推广详情
     * @param {number: 推广id} id
     */
    getPromotionById(id) {
        const res = this.cachedPro.find(element => {
            return element.id + '' === id + ''
        })
        return res
    }

    /**
     * 创建推广
     * @param {*} area
     * @param {*} city
     * @param {*} className
     * @param {*} englishTeacher
     * @param {*} englishPress
     * @param {*} grade
     * @param {*} mathPress
     * @param {*} mathTeacher
     * @param {*} province
     * @param {*} school
     */
    createPromotion(
        area = '',
        city = '',
        className = '',
        englishTeacher = '',
        englishPress = '',
        grade = '',
        mathPress = '',
        mathTeacher = '',
        province = '',
        school = ''
    ) {
        let id = this.cachedPro.length + 1
        const data = {
            id: id,
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
            address: city,
            school: school,
            grade: grade,
            className: className,
            registerNumber: 0,
            totalPayMoney: 0,
            yesterdayRegisterNumber: 0,
            totalShare: 0,
            yesterdayShare: 0,
            payRegisterNumber: 0,
            yesterdayPayRegisterNumber: 0,
            mathTeacher: mathTeacher,
            mathPressName: mathVersion[mathPress - 1],
            englishTeacher: englishTeacher,
            englishPressName: englishVersion[englishPress - 1]
        }
        this.cachedPro.unshift(data)
        return data
    }
}

const agent = new Agent()

module.exports = agent
