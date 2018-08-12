import {action, observable} from 'mobx'
import {GRADE} from '../settings/consts'
import moment from 'moment'

class Orders {
    @observable promotionList = []
    @observable promotionListotal = 0
    @observable pageSize = 10
    @observable listLoading = false
    @observable imgByte = {}
    @observable chooseImgByte = null
    @observable activeId = null

    @action
    getPromotionList({name, grade, pageNo = 1, startTime, endTime}) {
        this.listLoading = true
        G.api.getPromotionList({params: {name, grade, pageNo, itemsPerPage: this.pageSize, startTime, endTime}}).then(data => {
            this.listLoading = false
            this.promotionListotal = data.count
            this.promotionList = data.items.map((item) => {
                const pos = GRADE.findIndex(grade => grade.value === item.grade)
                item.createdAt = item.createdAt ? moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss') : '-'
                item.payTime = item.payTime || '-'
                item.grade = item.grade && pos >= 0 ? GRADE[pos].text : '-'
                item.payMoney = item.payMoney ? `¥${item.payMoney}` : '-'
                item.className = item.className || '-'
                item.key = item.id
                item.note = item.note || ''
                return item
            })
        })
    }

    @action
    getWeiCode({promotionId, record, width = 200, autoColor = false, isHyaline = false}) {
        if (!this.imgByte[promotionId]) {
            G.api.getPromotionQrCode({params: {promotionId, width, autoColor, isHyaline}}).then(data => {
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

export default new Orders()
