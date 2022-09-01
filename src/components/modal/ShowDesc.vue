<template>
  <TemplateModal>
    <template v-slot:default>
      <div class="m-modal-title">{{ selectedData.name }}</div>
      <div class="form-group row">
        <div class="m-label text-right" v-if="type == 'wf'">{{ $t("WF_M.WF_DESC") }}</div>
        <div class="m-label text-right" v-if="type == 'wf_version'">{{ $t("WF_M.VERSION_DESC") }}</div>
        <div class="m-label text-right" v-if="type == 'task'">{{ $t("TASK.TASK_DESC") }}</div>
        <div class="m-text">{{ selectedData.description }}</div>
      </div>

      <div class="form-group row">
        <b-button class="btn-ok" @click="cancel">{{ $t("GENERAL.CLOSE") }}</b-button>
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
      type: String,
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
    padding-bottom: 15px;
    font-size: 22px;
    font-weight: bold;
    border-bottom: 2px solid #e7e7e9;
  }
  .form-group {
    position: relative;
    margin: 20px auto;
    width: 100%;

    &:focus {
      border: 2px solid #4b8bcf;
      box-shadow: none;
    }

    .m-label {
      position: absolute;
      font-weight: bold;
      padding: 0 5px;
      line-height: 20px;
      top: -10px;
      left: 10px;
      background-color: #fff;
      color: $blue;
    }

    .m-text {
      width: 100%;
      padding: 12px;
      border: 2px solid #e7e7e9;
      border-radius: 10px;
      min-height: 100px;
      max-height: 400px;
      overflow: scroll;
    }

    .btn-ok {
      width: 100%;
      height: 38px;
      padding: 0 12px;
      color: #fff;
      background-color: $blue;
      border: 1px solid $blue;
      border-radius: 10px;
      box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;

      @media (max-width: 1200px) {
        width: 100%;
        margin: 5px 0;
      }
    }
  }
</style>
