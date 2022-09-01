<template>
  <TemplateModal>
    <template v-slot:default>
      <div class="m-modal-title">{{ $t("MODAL.LOGOUT.TITLE") }}</div>
      <div class="form-group row">
        <div class="desc text-right">{{ $t("MODAL.LOGOUT.DESC") }}</div>
      </div>

      <div class="form-group row">
        <b-button class="btn-cancel float-left" @click="cancel">{{ $t("GENERAL.CANCEL") }}</b-button>
        <b-button class="btn-ok float-right" @click="$logout()">{{ $t("GENERAL.CONFIRM") }}</b-button>
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
    padding-bottom: 15px;
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
