export default {
  signIn(data) {
    const { username, password } = data;
    return this.post('8/user/login', {
      username,
      password,
    });
  },
};
