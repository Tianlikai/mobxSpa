/**
 * 接口统一管理
 * axios 参数传递方式
 * get query 参数 {params}
 * post data 数据 {data}
 * url 拼接参数 {urlParams}
 */
module.exports = {
  getOrganizationList: { url: '11/org/list' },
  getOrganizationDetail: { url: '11/org/getOrganisationById/{orgId}' },
  createOrganization: { url: '11/org/saveOrganisation', method: 'post' },
  getProductInfo: { url: '13/org/getOrgService/{orgId}' },
  updateOrganization: { url: '11/org/updateOrganisation', method: 'post' },
  resetOrgPassword: {
    url: '11/org/resetPasswordById/{organizationId}',
    method: 'put',
  },
  updateOrgState: {
    url: '11/org/updateOrganisationStateById',
    method: 'put',
  },
  getOrgLogList: { url: '11/org/log/list' },
  extensionTime: { url: '13/org/setDisabledTime', method: 'post' },

  // 订单
  getOpenService: { url: '13/productOrder/getOrg/{orgId}' },
  getOrderList: { url: '13/productOrder/getOrderList' },
  createOrder: { url: '13/productOrder/inOrder', method: 'post' },
  updateOrderState: { url: '13/productOrder/updateStateById', method: 'put' },
  getOrderDetail: { url: '13/productOrder/getOrderDetail/{orderId}' },
  editOrderNote: {
    url: '13/productOrder/updateNoteById/{orderId}',
    method: 'put',
  },
  getOrdLogList: { url: '13/org/getOrderLogList' },
  getInitService: { url: '13/productOrder/initService' },
  getOrderTotalAmount: { url: '13/productOrder/getMoney', method: 'post' },

  // 代理
  getTextbookVersion: { url: '11/public/getDict/{type}' },
  createPromotion: { url: '11/promotion/addPromotion', method: 'post' },
  getMyProfit: { url: '11/promotion/getMyProfit' },
  getAgentInformation: { url: '11/promotion/getAgent' },
};
