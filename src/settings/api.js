module.exports = {
    // 登陆
    signIn: {url: '8/user/login', method: 'post'},
    // 机构
    getOrganizationList: {url: '11/org/list'},
    getOrganizationDetail: {url: '11/org/getOrganisationById/{orgId}'},
    createOrganization: {url: '11/org/saveOrganisation', method: 'post'},
    getProductInfo: {url: '13/org/getOrgService/{orgId}'},
    updateOrganization: {url: '11/org/updateOrganisation', method: 'post'},
    resetOrgPassword: {url: '11/org/resetPasswordById/{organizationId}', method: 'put'},
    updateOrgState: {url: '11/org/updateOrganisationStateById', method: 'put'},
    getOrgLogList: {url: '11/org/log/list'},
    extensionTime: {url: '13/org/setDisabledTime', method: 'post'},
    // 订单
    getOpenService: {url: '13/productOrder/getOrg/{orgId}'},
    getOrderList: {url: '13/productOrder/getOrderList'},
    createOrder: {url: '13/productOrder/inOrder', method: 'post'},
    updateOrderState: {url: '13/productOrder/updateStateById', method: 'put'},
    getOrderDetail: {url: '13/productOrder/getOrderDetail/{orderId}'},
    editOrderNote: {url: '13/productOrder/updateNoteById/{orderId}', method: 'put'},
    getOrdLogList: {url: '13/org/getOrderLogList'},
    getInitService: {url: '13/productOrder/initService'},
    getOrderTotalAmount: {url: '13/productOrder/getMoney', method: 'post'},
    // 代理
    getArea: {url: '11/public/getArea'},
    getTextbookVersion: {url: '11/public/getDict/{type}'},
    createPromotion: {url: '11/promotion/addPromotion', method: 'post'},
    getPromotionDetail: {url: '11/promotion/getPromotionDetail'},
    getPromotionList: {url: '11/promotion/getPromotionList'},
    getMyProfit: {url: '11/promotion/getMyProfit'},
    getAgentInformation: {url: '11/promotion/getAgent'},
    getPromotionQrCode: {url: '11/promotion/getPromotionQrCode', method: 'post'}
}

/**
 * axiox 参数传递方式
 * get query 参数 {params}
 * post data 数据 {data}
 * url 拼接参数 {urlParams}
 */

// function localRequest({url, ...rest}) {
//     let result = {...rest}
//     if (__DEV__) {
//         result.url = `0${url}`
//     } else {
//         result.url = url
//         result.baseURL = ''
//     }
//     return result
// }
