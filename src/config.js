export default {
  install(Vue, options) {
    let config = {};
    Vue.prototype.$config = config;
  },
};
