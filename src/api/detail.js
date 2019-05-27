export default {
  getDetailData(data) {
    const { params } = data;
    return this.get('11/promotion/getPromotionDetail', {
      params,
    });
  },
};
