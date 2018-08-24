import { action, observable } from 'mobx'
import { DEFAULT_OPTION, ORDER_TYPE, UNIT, PAY_TYPE } from '../settings/consts'
import { message } from 'antd'

class Orders {
    @observable
    username = null
    @observable
    orgId = null
    @observable
    mobile = null
    @observable
    orderList = []
    @observable
    orderListTotal = 0
    @observable
    orderLog = []
    @observable
    orderLogTotal = 0
    @observable
    pageSize = 10
    @observable
    orderDetail = null
    @observable
    listLoading = false

    @action
    getOrderList({
        name,
        pageNo = 1,
        listType = 1,
        state,
        startTime,
        endTime
    }) {
        this.listLoading = true
        G.api
            .getOrderList({
                params: {
                    name,
                    pageNo,
                    listType,
                    itemsPerPage: this.pageSize,
                    state,
                    startTime,
                    endTime
                }
            })
            .then(data => {
                this.listLoading = false
                this.orderListTotal = data.count
                this.orderList = data.items.map(item => {
                    item.payTime = item.payTime || '-'
                    item.payMoney = item.payMoney ? `¥${item.payMoney}` : '-'
                    item.key = item.id
                    item.note = item.note || ''
                    return item
                })
            })
    }

    deleteEmptyValue(obj) {
        const result = {}
        Object.keys(obj).forEach(key => {
            if (obj[key] || obj[key] === false) {
                result[key] = obj[key]
            }
        })
        return result
    }

    @action
    getOrderLog({ name, type, pageNo = 1, startTime, endTime }) {
        this.listLoading = true
        const types = ['全部', '创建订单', '取消订单', '确认收款']
        const params = this.deleteEmptyValue({
            startTime,
            endTime,
            name,
            pageNo,
            itemsPerPage: this.pageSize,
            type
        })
        console.log(params)
        G.api.getOrdLogList({ params }).then(data => {
            this.listLoading = false
            this.orderLogTotal = data.count
            this.orderLog = data.items.map((item, index) => {
                item.key = index
                item.operationType = types[item.operationType]
                return item
            })
        })
    }

    @action
    updateOrderState(orderId, orgId, state, note, query, callback) {
        let data = { orgId, note, state, orderId }
        G.api
            .updateOrderState({ data })
            .then(data => {
                this.getOrderList(query)
                callback && callback()
            })
            .catch(e => {
                message.error(e.message || '抱歉，出错啦！')
            })
    }

    @action
    getOrdDetail(id, cb) {
        G.api.getOrderDetail({ urlParams: { orderId: id } }).then(data => {
            Object.keys(data).forEach(key => {
                let target = data[key]
                if (key === 'state') data[key] = DEFAULT_OPTION[target].text
                else if (key === 'type') data[key] = ORDER_TYPE[target]
                else if (key === 'price') {
                    data[key]
                        = target === '9.9' ? target + UNIT[0] : target + UNIT[1]
                } else if (key === 'payType') data[key] = PAY_TYPE[target] || '-'
                else if (key === 'payMoney') data[key] = `¥${target}`
            })
            this.orderDetail = data
            cb && cb()
        })
    }

    @action
    clearDetail() {
        this.orderDetail = null
    }

    @action
    editOrderNote(id, data, cb) {
        G.api.editOrderNote({ urlParams: { orderId: id }, data }).then(data => {
            let orderDetail = Object.assign({}, this.orderDetail)
            orderDetail.note = data.note
            this.orderDetail = orderDetail
            message.success('修改备注成功')
            cb()
        })
    }
}

export default new Orders()
