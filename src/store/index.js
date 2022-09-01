import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    contact: false,
    callHistory: false,
    settings: false,
    isEditing: false,
    noNetworkFlag: false,
    deployType: 1,
  },
});
