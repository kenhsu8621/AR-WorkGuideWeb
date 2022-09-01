<template>
  <TemplateModal :z_index="9999" :width="33">
    <template v-slot:default>
      <div class="m-modal-title">{{ title }}</div>
      <div class="form-group row">
        <div class="desc">{{ content }}</div>
      </div>

      <div class="form-group row">
        <b-button v-if="showCancel" class="btn-cancel mx-auto" :class="{ 'float-left': showConfirm }" @click="cancel">{{
          cancelMsg
        }}</b-button>
        <b-button
          v-if="showConfirm"
          ref="confirm"
          class="btn-ok mx-auto"
          :class="{ 'float-right': showCancel }"
          @click="confirm"
          >{{ confirmMsg }}</b-button
        >
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
      title: String,
      content: String,
      showCancel: Boolean,
      showConfirm: Boolean,
      confirmMsg: String,
      cancelMsg: String,
    },
    data: () => ({}),
    mounted() {
      this.$refs.confirm.focus();
    },
    methods: {
      confirm() {
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
    margin-bottom: 30px;
    color: #212529;
    padding: 5px 0 5px 15px;
    font-size: 22px;
    font-weight: bold;
    border-bottom: 2px solid #e7e7e9;
  }
  .form-group {
    position: relative;
    margin: 20px auto;
    margin-bottom: 30px;
    width: 100%;

    &:focus {
      border: 2px solid #4b8bcf;
      box-shadow: none;
    }

    .desc {
      font-size: 16px;
      color: $grey;
    }

    .m-text {
      color: #212529;
      width: 100%;
      padding: 12px;
      border: 2px solid #e7e7e9;
      border-radius: 10px;
      min-height: 100px;
    }

    .btn-ok,
    .btn-cancel {
      width: 47%;
      height: 38px;
      padding: 0 12px;
      border-radius: 10px;
      box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;

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
      margin-left: 6%;
      color: #fff;
      background-color: $blue;
      border: 1px solid $blue;

      @media (max-width: 1200px) {
        margin-left: 0;
      }
    }
  }
</style>
