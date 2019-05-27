export default {
  signIn(data) {
    const { username, password } = data;
    return this.post('8/user/login', {
      username,
      password,
    });
  },
  getArea() {
    return this.get('11/public/getArea');
  },
  getUploadToken() {
    return this.get('0/upload');
  },
};
