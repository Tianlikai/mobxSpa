export default {
  getTextbookVersion(data) {
    const {
      urlParams: { type },
    } = data;
    return this.get(`11/public/getDict/${type}`);
  },
  createRecord(data) {
    return this.post('11/promotion/addPromotion', data);
  },
};
