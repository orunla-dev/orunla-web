import Vue from "vue";
import Vuex from "vuex";

import VuexPersistence from "vuex-persist";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    user_reading: [],
    user_list: [],
    user_notification: [],
  },
  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
    SET_USER_LIST(state, payload) {
      state.user_list = payload;
    },
    SET_READING(state, payload) {
      state.user_reading = payload;
    },
    SET_NOTIFICATION(state, payload) {
      state.user_notification = payload;
    },
    ADD_TO_LIST(state, payload) {
      state.user_list.push(payload);
    },
  },
  actions: {},
  modules: {},
  plugins: [new VuexPersistence().plugin],
});
