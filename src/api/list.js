export default {
  fetchList(params) {
    const { params: data } = params;
    return this.post('2/video/orgVideo/list/1', data);
  },
};
