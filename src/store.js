import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuthorized: false,
    user: {
      FIRST_NAME: '',
      LAST_NAME: '',
      EMAIL: '',
    },
  },
  mutations: {
    authorize(state) {
      state.isAuthorized = true;
    },
    setName(state, name) {
      state.user.FIRST_NAME = name;
    },
    setLastName(state, lastName) {
      state.user.LAST_NAME = lastName;
    },
    setEmail(state, email) {
      state.user.LAST_NAME = email;
    },
  },
  getters: {
    getFullName(state) {
      return `${state.user.FIRST_NAME} ${state.user.LAST_NAME}`;
    },
  },
});
