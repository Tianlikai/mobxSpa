const qs = require('qs')
const login = require('./login')
const org = require('./org')
const order = require('./order')
const agent = require('./agent')
const orgLog = require('./orgLog')
const orderLog = require('./orderLog')

const proxy = {
    'POST /__api/8/user/login': login,
    'GET /__api/11/org/list': function(req, res) {
        console.log('mock: /__api/11/org/list')
        const {name, pageNo, itemsPerPage, state} = qs.parse(req._parsedUrl.query)
        const {items, count} = org.getOrgList(name, pageNo, itemsPerPage, state)
        res.json({
            code: '0',
            data: {
                items: items,
                count: count
            },
            err: null,
            message: 'success!',
            successful: true
        })
    },
    'GET /__api/13/productOrder/getOrderList': function(req, res) {
        console.log('mock: /__api/13/productOrder/getOrderList')
        const {name, pageNo, itemsPerPage, state} = qs.parse(req._parsedUrl.query)
        const {items, count} = order.getOrderList(name, pageNo, itemsPerPage, state)
        res.json({
            code: '0',
            data: {
                items: items,
                count: count
            },
            err: null,
            message: 'success!',
            successful: true
        })
    },
    'GET /__api/11/promotion/getMyProfit': function(req, res) {
        console.log('mock: /__api/11/promotion/getMyProfit')
        const {pageNo, itemsPerPage} = qs.parse(req._parsedUrl.query)
        const {items, totalShare, settled, settling, noSettle, count} = agent.getMyShare(pageNo, itemsPerPage)
        res.json({
            code: '0',
            data: {
                totalShare,
                settled,
                settling,
                noSettle,
                totalCourseOrderNumber: count,
                courseOrderlist: items
            },
            err: null,
            message: 'success!',
            successful: true
        })
    },
    'GET /__api/11/promotion/getPromotionList': function(req, res) {
        console.log('mock: /__api/11/promotion/getPromotionList')
        const {name, pageNo, itemsPerPage, grade} = qs.parse(req._parsedUrl.query)
        const {items, count} = agent.getProList(name, pageNo, itemsPerPage, grade)
        res.json({
            code: '0',
            data: {
                count: count,
                items: items
            },
            err: null,
            message: 'success!',
            successful: true
        })
    },
    'GET /__api/11/promotion/getAgent': function(req, res) {
        console.log('mock: /__api/11/promotion/getAgent')
        const data = agent.getMyInfo()
        res.json({
            code: '0',
            data: data,
            err: null,
            message: 'success!',
            successful: true
        })
    },
    'GET /__api/11/org/log/list': function(req, res) {
        console.log('mock: /__api/11/org/log/list')
        const {name, pageNo, itemsPerPage, state} = qs.parse(req._parsedUrl.query)
        const {items, count} = orgLog.getLog(name, pageNo, itemsPerPage, state)
        res.json({
            code: '0',
            data: {
                items: items,
                count: count
            },
            err: null,
            message: 'success!',
            successful: true
        })
    },
    'GET /__api/13/org/getOrderLogList': function(req, res) {
        console.log('mock: /__api/13/org/getOrderLogList')
        const {name, pageNo, itemsPerPage, state} = qs.parse(req._parsedUrl.query)
        const {items, count} = orderLog.getLog(name, pageNo, itemsPerPage, state)
        res.json({
            code: '0',
            data: {
                items: items,
                count: count
            },
            err: null,
            message: 'success!',
            successful: true
        })
    }
}

module.exports = proxy

