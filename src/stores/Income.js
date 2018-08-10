import {action, observable} from 'mobx'
import {GRADE} from '../config'
import moment from 'moment'

class Income {
    @observable incomeList = []
    @observable incomeTotal = 0
    @observable pageSize = 10
    @observable listLoading = false
    @observable totalShare = {title: '分成总额', value: '-'}
    @observable settled = {title: '已结算金额', value: '-'}
    @observable noSettle = {title: '未结算金额', value: '-'}
    @observable settling = {title: '结算中金额', value: '-'}

    @action
    getMyProfit({pageNo = 1}) {
        this.listLoading = true
        G.api.getMyProfit({params: {pageNo, itemsPerPage: this.pageSize}}).then(data => {
            this.listLoading = false
            this.incomeTotal = data.totalCourseOrderNumber
            this.noSettle.value = data.noSettle
            this.settled.value = data.settled
            this.settling.value = data.settling
            this.totalShare.value = data.totalShare
            this.incomeList = data.courseOrderlist.map((item) => {
                const pos = GRADE.findIndex(grade => grade.value === item.grade)
                item.key = item.id
                item.payMoney = item.payMoney ? `¥${item.payMoney}` : '-'
                item.grade = item.grade && pos >= 0 ? GRADE[pos].text : '-'
                item.payTime = item.payTime ? moment(item.payTime).format('YYYY-MM-DD HH:mm:ss') : '-'
                return item
            })
        })
    }
}

export default new Income()
