var loaderCount = 0;
var loader = null;

export const loaderMixin = {
  methods: {
    showLoader() {
      if (loaderCount++ > 0) return;
      if (!loader)
        loader = this.$loading.show({
          //options
          color: "#2173c9",
          opacity: 0.1,
          "z-index": 9999999,
        });
    },
    dismissLoader() {
      if (--loaderCount <= 0 && loader) {
        loader.hide();
        loader = null;
        loaderCount = 0;
      }
    },
  },
};
