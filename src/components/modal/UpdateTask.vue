<template>
  <TemplateModal :width="40">
    <template v-slot:default>
      <div class="m-modal-title">
        {{ $t("TASK.EDIT_TASK") }}
      </div>
      <form @submit.prevent="updateTask">
        <div class="form-group row">
          <div class="m-label text-right">{{ $t("TASK.TASK_NAME") }}</div>
          <input type="text" v-model="form.name" :placeholder="$t('TASK.TASK_NAME_PLACEHOLDER')" class="form-control" />
        </div>

        <div class="form-group row">
          <div class="m-label text-right">{{ $t("TASK.TASK_DESC") }}</div>
          <input type="text" v-model="form.desc" :placeholder="$t('TASK.TASK_DESC_PH')" class="form-control" />
        </div>

        <div class="form-group row">
          <div class="m-label text-right">{{ $t("TASK.WF") }}</div>
          <div class="m-text">{{ selectedData.wf_name }}</div>
        </div>

        <div class="form-group row">
          <div class="m-label text-right">{{ $t("TASK.OPERATOR") }}</div>
          <div class="m-text">{{ selectedData.operator_name }}</div>
        </div>

        <div class="form-group row">
          <div class="m-label text-right">{{ $t("TASK.START_END_TIME") }}</div>
          <div class="m-text">
            <span>{{ GetDatetimeString(selectedData.begin_time) }}</span> ~
            <span>{{ GetDatetimeString(selectedData.due_time) }}</span>
          </div>
        </div>

        <div class="form-group row">
          <div class="m-label text-right">{{ $t("TASK.EQUIPMENT_SN") }}</div>
          <div class="m-text">{{ selectedData.equipment_serial }}</div>
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
  import { GetDatetimeString } from "@/utils/date";

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
        desc: null,
      },
    }),

    mounted() {
      this.form.name = this.selectedData.name;
      this.form.desc = this.selectedData.description;
    },

    methods: {
      GetDatetimeString,
      updateTask() {
        let uuid = this.selectedData.uuid;
        let name = this.form.name;
        let description = this.form.desc;
        if (!name) return this.$alert(this.$t("TASK.CHECK_INPUT"));

        let data = { uuid, name, description };
        this.apiPost("workflow/update_task", data).then(({ data }) => {
          this.$emit("ok");
        });
      },

      cancel() {
        this.$emit("cancel");
      },
    },
    watch: {
      dateTimeRange: {
        immediate: true,
        handler(val) {
          if (!val || !val.length || val.length < 2) {
            return;
          }
          this.form.beginTime = val[0];
          this.form.endTime = val[1];
        },
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
      z-index: 9;
    }

    .m-text {
      width: 100%;
      padding: 12px;
      border: 2px solid #e7e7e9;
      border-radius: 10px;
      color: $grey;
      cursor: not-allowed;
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

    .select-component {
      border-radius: 10px;
      max-width: 200px;
      background-color: #fff;
      border: 2px solid #e7e7e9;
      background-image: linear-gradient(45deg, transparent 50%, $grey 60%),
        linear-gradient(135deg, $grey 40%, transparent 50%) !important;
      background-position: calc(100% - 17px) 14px, calc(100% - 10px) 14px, 100% 0;
      background-size: 7px 7px, 7px 7px;
      background-repeat: no-repeat;
      -webkit-appearance: none;
      -moz-appearance: none;
      cursor: pointer;
      option {
        background-color: #fff;
        border: 1px solid #fff;
      }

      &:focus {
        border: 2px solid #4b8bcf;
        box-shadow: none;
      }
    }

    .toggle-collapse {
      padding: 0px 5px 15px 15px;
      font-weight: bold;
      padding: 0 5px;
      line-height: 20px;
      color: $blue;
    }

    .divider {
      width: 100%;
      height: 1px;
      border-top: 2px solid #e7e7e9;
    }

    .collapse-component {
      width: 100%;

      .left,
      .right {
        width: 40%;
      }
      .right {
        margin-left: 2%;
      }

      .btns {
        width: 18%;
        padding-left: 2%;

        .round-btn {
          background-color: $blue;
          padding-left: 6px;
          margin-top: 6px;
          width: 24px;
          height: 24px;
          color: #fff;
          border-radius: 50%;
          // border-radius: 6px;

          &:hover {
            background-color: $darkBlue;
          }

          svg {
            width: 12px;
          }
        }
      }
    }

    /deep/ .date-picker-style {
      width: 100%;
      input {
        height: 38px;
        border-radius: 10px;
        border: 2px solid #e7e7e9;
        cursor: pointer;
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

    /deep/ .mx-datepicker-popup {
      z-index: 99999;
    }
  }
</style>
