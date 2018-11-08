import { action, observable } from 'mobx'
import { GRADE } from '../settings/consts'
import moment from 'moment'

class TableSearch {
    @observable
    table

    @observable
    imgByte = {}
    @observable
    chooseImgByte = null
    @observable
    activeId = null

    constructor() {
        this.table = {
            loading: false,
            count: 0,
            list: []
        }
    }

    @action
    getPromotionList({
        name,
        grade,
        pageNo = 1,
        pageSize = 10,
        startTime,
        endTime
    }) {
        this.table.loading = true
        G.api
            .getPromotionList({
                params: {
                    name,
                    grade,
                    pageNo,
                    itemsPerPage: pageSize,
                    startTime,
                    endTime
                }
            })
            .then(data => {
                const count = data.count
                const list = data.items.map(item => {
                    const pos = GRADE.findIndex(
                        grade => grade.value === item.grade
                    )
                    item.createdAt = item.createdAt
                        ? moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
                        : '-'
                    item.payTime = item.payTime || '-'
                    item.grade = item.grade && pos >= 0 ? GRADE[pos].text : '-'
                    item.payMoney = item.payMoney ? `¥${item.payMoney}` : '-'
                    item.className = item.className || '-'
                    item.key = item.id
                    item.note = item.note || ''
                    return item
                })
                this.table = {
                    loading: false,
                    count: count,
                    list: list
                }
            })
    }

    @action
    getWeiCode({
        promotionId,
        record,
        width = 200,
        autoColor = false,
        isHyaline = false
    }) {
        if (!this.imgByte[promotionId]) {
            G.api
                .getPromotionQrCode({
                    params: { promotionId, width, autoColor, isHyaline }
                })
                .then(data => {
                    this.imgByte[promotionId] = data
                    this.chooseImgByte = data
                    this.activeId = promotionId
                })
        } else {
            this.chooseImgByte = this.imgByte[promotionId]
            this.activeId = promotionId
        }
    }

    @action
    delWeiCode() {
        this.activeId = null
        this.chooseImgByte = null
    }
}

export default new TableSearch()
