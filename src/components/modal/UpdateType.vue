<template>
  <TemplateModal>
    <template v-slot:default>
      <div class="m-modal-title">{{ $t("TYPE.EDIT_EQUIPMENT_TYPE") }}</div>
      <form @submit.prevent="updateType">
        <div class="form-group row">
          <div class="m-label text-right">{{ $t("GENERAL.EQUIPMENT_TYPE") }}</div>
          <input type="text" v-model="form.name" class="form-control" maxlength="100" />
        </div>

        <div class="form-group row">
          <b-button class="btn-cancel float-left" @click="cancel">{{ $t("GENERAL.CANCEL") }}</b-button>
          <b-button type="submit" class="btn-ok float-right">{{ $t("GENERAL.SAVE") }}</b-button>
        </div>
      </form>
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
    data: () => ({
      form: {
        name: null,
      },
    }),
    mounted() {
      this.form.name = this.selectedData.type_name;
    },
    methods: {
      updateType() {
        let data = {
          name: this.form.name,
          type_uuid: this.selectedData.type_uuid,
        };
        this.apiPost("equipment/update_type", data).then(({ data }) => {
          this.$emit("ok");
        });
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
    padding-bottom: 15px;
    font-size: 22px;
    font-weight: bold;
    border-bottom: 2px solid #e7e7e9;
  }
  .form-group {
    position: relative;
    margin: 20px auto;
    width: 100%;

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

    .form-control {
      border: 2px solid #e7e7e9;
      border-radius: 10px;
      transition: all 0.3s ease-in-out;

      &:focus {
        border: 2px solid #4b8bcf;
        box-shadow: none;
      }
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
