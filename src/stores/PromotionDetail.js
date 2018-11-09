import moment from 'moment'
import CloneDeep from 'lodash/cloneDeep'

import { action, observable } from 'mobx'
import { GRADE } from '../settings/consts'

const INFORMATION = {
    createdAt: { label: '开始时间:', value: '-' },
    address: { label: '地区:', value: '-' },
    grade: { label: '年级:', value: '-' },
    mathPressName: { label: '数学版本:', value: '-' },
    mathTeacher: { label: '数学老师:', value: '-' },
    englishPressName: { label: '英语版本:', value: '-' },
    englishTeacher: { label: '英语老师:', value: '-' },
    school: { label: '学校:', value: '-' },
    className: { label: '班级:', value: '-' }
}

const DATA_OVERVIEW = [
    {
        key: 'registerNumber',
        title: '注册用户总数',
        footer: '昨日增长',
        hint: '本推广带来注册用户数',
        total: '-',
        yesterday: '-'
    },
    {
        key: 'payRegisterNumber',
        title: '付费用户总数',
        footer: '昨日增长',
        hint: '本推广带来付费用户数',
        total: '-',
        yesterday: '-'
    },
    {
        key: 'totalShare',
        title: '累计分成',
        footer: '昨日收益',
        hint: '本推广带来累计分成',
        total: '-',
        yesterday: '-'
    }
]

class PromotionDetail {
    @observable
    table

    constructor() {
        this.table = {
            loading: false,
            count: 0,
            list: []
        }
        this.basicInformation = INFORMATION
        this.dataOverview = DATA_OVERVIEW
    }

    @action
    getPromotionDetail({ id, pageNo = 1, pageSize = 10 }) {
        this.table.loading = true
        G.api
            .getPromotionDetail({
                params: { promotionId: id, pageNo, itemsPerPage: pageSize }
            })
            .then(data => {
                let basicInformation = CloneDeep(this.basicInformation)
                const keys = Object.keys(basicInformation)
                keys.forEach(key => {
                    if (key === 'createdAt') {
                        basicInformation[key].value = data[key]
                            ? moment(data[key]).format('YYYY-MM-DD HH:mm:ss')
                            : '-'
                    } else if (key === 'grade') {
                        const pos = GRADE.findIndex(
                            grade => grade.value === data[key]
                        )
                        basicInformation[key].value
                            = data[key] && pos >= 0 ? GRADE[pos].text : '-'
                    } else {
                        basicInformation[key].value = data[key] || '-'
                    }
                })
                this.basicInformation = basicInformation

                let dataOverview = this.dataOverview.slice()
                dataOverview.forEach((item, i) => {
                    switch (item.key) {
                        case 'registerNumber': {
                            item.total = data['registerNumber']
                            item.yesterday = data['yesterdayRegisterNumber']
                            break
                        }
                        case 'payRegisterNumber': {
                            item.total = data['payRegisterNumber']
                            item.yesterday = data['yesterdayPayRegisterNumber']
                            break
                        }
                        case 'totalShare': {
                            item.total = data['totalShare']
                            item.yesterday = data['yesterdayShare']
                            break
                        }
                        default:
                            break
                    }
                })
                this.dataOverview = dataOverview

                const count = data.totalCourseOrderNumber
                const list = data.courseOrderlist.map(item => {
                    const pos = GRADE.findIndex(
                        grade => grade.value === item.grade
                    )
                    item.payTime = item.payTime
                        ? moment(item.payTime).format('YYYY-MM-DD HH:mm:ss')
                        : '-'
                    item.payMoney = item.payMoney ? `¥${item.payMoney}` : '-'
                    item.share = item.share ? `¥${item.share}` : '-'
                    if (item.grade && pos >= 0) {
                        let pos = GRADE.findIndex(
                            grade => grade.value === item.grade
                        )
                        item.grade = pos >= 0 ? GRADE[pos].text : '-'
                    } else {
                        item.grade = '-'
                    }
                    item.key = item.id
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
    clearPromotionDetail() {
        this.basicInformation = INFORMATION
        this.dataOverview = DATA_OVERVIEW
    }
}

export default new PromotionDetail()
