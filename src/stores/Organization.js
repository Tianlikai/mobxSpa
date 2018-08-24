import { action, observable } from 'mobx'

class Organization {
    @observable
    username = null
    @observable
    orgId = null
    @observable
    mobile = null
    @observable
    organizationList = []
    @observable
    organizationListTotal = 0
    @observable
    organizationLog = []
    @observable
    organizationLogTotal = 0
    @observable
    pageSize = 10
    @observable
    organizationDetail = null
    @observable
    productInfo = null
    @observable
    listLoading = false

    @action
    getOrganizationList({ name, pageNo = 1, state }) {
        this.listLoading = true
        G.api
            .getOrganizationList({
                params: { name, pageNo, itemsPerPage: this.pageSize, state }
            })
            .then(data => {
                this.listLoading = false
                this.organizationListTotal = data.count
                this.organizationList = data.items.map(item => {
                    item.key = item.id
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
    getOrganizationLog({
        name,
        type,
        pageNo = 1,
        startTime,
        endTime,
        username
    }) {
        this.listLoading = true
        const types = ['全部', '创建', '禁用', '启用', '编辑', '重置密码']
        const params = this.deleteEmptyValue({
            username,
            startTime,
            endTime,
            name: name,
            pageNo,
            pageSize: this.pageSize,
            operationType: type
        })
        console.log(params)
        G.api.getOrgLogList({ params }).then(data => {
            this.listLoading = false
            this.organizationLogTotal = data.count
            this.organizationLog = data.items.map((item, index) => {
                item.key = index
                item.operationType
                    = typeof item.operationType === 'number'
                        ? types[item.operationType]
                        : item.operationType
                return item
            })
        })
    }

    @action
    disableOrg(organizationId, state, callback) {
        let data = { organizationId, state }
        G.api.updateOrgState({ data }).then(data => {
            const list = this.organizationList.slice()
            list.find(v => v.id === organizationId).state = state
            this.organizationList = list
            callback && callback()
        })
    }

    @action
    getOrgDetail(id) {
        G.api.getOrganizationDetail({ urlParams: { orgId: id } }).then(data => {
            this.organizationDetail = data
        })
    }

    @action
    clearDetail() {
        this.organizationDetail = null
    }

    @action
    getProductInfo(id, cb) {
        G.api.getProductInfo({ urlParams: { orgId: id } }).then(data => {
            this.productInfo = data
            cb && cb()
        })
    }

    @action
    clearProductInfo(id) {
        this.productInfo = null
    }
}

export default new Organization()
