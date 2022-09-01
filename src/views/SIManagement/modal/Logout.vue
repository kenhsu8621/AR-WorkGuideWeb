<template>
  <TemplateModal :width="33">
    <template v-slot:default>
      <!-- <div class="m-close"><font-awesome-icon icon="times" size="2x" @click="cancel" /></div> -->
      <div class="m-modal-title text-center">強制登出帳號</div>
      <div class="m-modal-body my-3">
        <div>
          是否要強制登出 <strong>{{ selectedData.name }}</strong> 的帳號？
        </div>
        <div>{{ selectedData.account }}</div>
      </div>
      <div class="m-modal-footer">
        <b-button class="btn-cancel float-left" @click="cancel">取消</b-button>
        <b-button class="btn-ok float-right" @click="ok">儲存</b-button>
      </div>
    </template>
  </TemplateModal>
</template>

<script>
  import TemplateModal from "@/components/modal/TemplateModal";

  export default {
    components: {
      TemplateModal,
    },
    props: {
      selectedData: Object,
    },
    data: () => ({}),
    methods: {
      ok() {
        this.$emit("ok");
      },
      cancel() {
        this.$emit("cancel");
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";
  .m-modal-title {
    font-size: 20px;
    font-weight: bold;
  }
  .m-modal-footer {
    height: 32px;
    // margin-top: 30px;
    padding: 0 20%;
    @media (max-width: 1200px) {
      height: 60px;
      margin: 30px 0;
    }
    .btn-ok,
    .btn-cancel {
      // width: 7vw;
      width: 45%;
      height: 32px;
      padding: 0 12px;
      border-radius: 16px;
      @media (max-width: 1200px) {
        width: 100%;
        margin: 5px 0;
      }
    }
    .btn-cancel {
      color: $blue;
      background-color: #fff;
      border: 1px solid $blue;
    }
    .btn-ok {
      color: #fff;
      background-color: $blue;
      border: 1px solid $blue;
    }
  }
</style>
