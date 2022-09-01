import ConfirmComponent from "@/components/modal/ConfirmModal.vue";

const Alert = {};

Alert.install = (Vue) => {
  const ConfirmConstructor = Vue.extend(ConfirmComponent);

  Vue.prototype.$confirm = function (title, content, confirmCallback, cancelCallback, confirmMsg, cancelMsg) {
    let div = document.createElement("div");
    document.body.appendChild(div);
    let instance = new ConfirmConstructor({
      propsData: {
        title,
        content,
        showCancel: true,
        showConfirm: true,
        confirmMsg: confirmMsg || this.$t("GENERAL.CONFIRM"),
        cancelMsg: cancelMsg || this.$t("GENERAL.CANCEL"),
      },
    }).$mount(div);

    instance.$on("ok", (data) => {
      if (confirmCallback) confirmCallback(data);
      destroy();
    });
    instance.$on("cancel", (data) => {
      if (cancelCallback) cancelCallback(data);
      destroy();
    });
    function destroy() {
      instance?.$destroy();
      instance?.$el?.remove();
      instance = null;
    }
    instance.destroy = destroy;
    return instance;
  };
};

export default Alert;
