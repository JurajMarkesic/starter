export default {
  nuxtServerInit({ commit }, { req }) {
    // console.log('nuxtServerInit -> req', req);
    if (req.session.user) {
      commit('user', req.session.user);
    }
  },
  register(context, payload) {
    return this.$axios.post('auth/register', payload);
  },
};
