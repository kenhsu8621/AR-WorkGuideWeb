<template>
  <TemplateModal>
    <template v-slot:default>
      <div class="m-modal-title">
        {{ form.equipment_uuid ? $t("EQ.EQUIPMENT_SETTINGS") : $t("EQ.ADD_EQUIPMENT") }}
      </div>
      <form @submit.prevent="updateEquipment">
        <div class="form-group row">
          <div class="m-label text-right">{{ $t("GENERAL.EQUIPMENT_TYPE") }}</div>
          <b-form-select v-model="form.type" class="select-component">
            <b-form-select-option :key="item.value" v-for="item of typeList" :value="item.value">{{
              $t(item.text)
            }}</b-form-select-option>
          </b-form-select>
        </div>

        <div class="form-group row">
          <div class="m-label text-right">Serial No.</div>
          <input type="text" v-model="form.serial" :placeholder="$t('EQ.SN_PH')" class="form-control" />
        </div>

        <div class="form-group row">
          <div class="m-label text-right">{{ $t("EQ.EQUIPMENT_LOCATION") }}</div>
          <b-form-select v-model="form.location" class="select-component">
            <b-form-select-option :key="item.value" v-for="item of locationList" :value="item.value">{{
              $t(item.text)
            }}</b-form-select-option>
          </b-form-select>
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
      typeList: Array,
      locationList: Array,
      selectedData: Object,
    },
    data: () => ({
      form: {
        equipment_uuid: null,
        type: 0,
        serial: null,
        location: 0,
      },
    }),
    mounted() {
      if (this.selectedData) {
        this.form.equipment_uuid = this.selectedData.equipment_uuid;
        this.form.serial = this.selectedData.serial;
        this.form.type = this.selectedData.type_uuid;
        this.form.location = this.selectedData.position_uuid || 0;
      }
    },
    methods: {
      updateEquipment() {
        let data = {
          equipment_uuid: this.form.equipment_uuid,
          type_uuid: this.form.type,
          position_uuid: this.form.location || null,
          serial: this.form.serial,
        };
        this.apiPost("equipment/upsert", data).then(({ data }) => {
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
        // border-bottom-left-radius: 0;
        // border-bottom-right-radius: 0;
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
