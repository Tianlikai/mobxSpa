export default {
  initTableData(data) {
    const { params } = data;
    return this.get('11/promotion/getPromotionList', {
      params,
    });
  },
  getQRCode(data) {
    return this.post('11/promotion/getPromotionQrCode', data);
  },
};
