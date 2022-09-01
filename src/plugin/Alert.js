import ConfirmComponent from "@/components/modal/ConfirmModal.vue";

const Confirm = {};

Confirm.install = (Vue) => {
  const ConfirmConstructor = Vue.extend(ConfirmComponent);

  Vue.prototype.$alert = function (title, content, callback, confirmMsg) {
    let div = document.createElement("div");
    document.body.appendChild(div);
    let instance = new ConfirmConstructor({
      propsData: {
        title,
        content,
        showCancel: false,
        showConfirm: true,
        confirmMsg: confirmMsg || this.$t("GENERAL.CONFIRM"),
      },
    }).$mount(div);

    instance.$on("ok", (data) => {
      if (callback) callback(data);
      destroy();
    });
    instance.$on("cancel", () => {
      destroy();
    });
    let destroy = function () {
      instance?.$destroy();
      instance?.$el.remove();
      instance = null;
    };
    instance.destroy = destroy;
    return instance;
  };
};

export default Confirm;
