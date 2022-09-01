<template>
  <TemplateModal>
    <template v-slot:default>
      <div class="m-modal-title">
        {{ form.uuid ? $t("MODAL.UPSERT_WF.WF_SETTINGS") : $t("WF_M.ADD_WF") }}
      </div>
      <form @submit.prevent="createWorkflow('upsert')">
        <div class="form-group row">
          <div class="m-label text-right">{{ $t("GENERAL.WF_NAME") }}</div>
          <input
            type="text"
            v-model="form.name"
            :placeholder="$t('MODAL.UPSERT_WF.WF_PH')"
            class="form-control"
            maxlength="50"
          />
        </div>

        <div class="form-group row">
          <div class="m-label text-right">{{ $t("WF_M.WF_DESC") }}</div>
          <input
            type="text"
            v-model="form.desc"
            :placeholder="$t('MODAL.UPSERT_WF.WF_DESC_PH')"
            class="form-control"
            maxlength="200"
          />
        </div>

        <div class="form-group row">
          <div class="m-label text-right">{{ $t("WF_M.WF_TYPE") }}</div>
          <b-form-select v-model="form.type_uuid" class="select-component">
            <b-form-select-option
              :key="item.value"
              v-for="(item, index) of workflowTypeList"
              :value="item.value"
              :disabled="index == 0"
              >{{ index == 0 ? $t(item.text) : item.text }}</b-form-select-option
            >
          </b-form-select>
        </div>

        <div class="form-group row">
          <div class="m-label text-right">{{ $t("MODAL.UPSERT_WF.EXPERT_SETTINGS") }}</div>
          <b-form-select v-model="form.expertAccount" class="select-component">
            <b-form-select-option
              :key="item.value"
              v-for="(item, index) of expertList"
              :value="item.value"
              :disabled="index == 0"
              >{{ index == 0 ? $t(item.text) : item.text }}</b-form-select-option
            >
          </b-form-select>
        </div>

        <div class="form-group row">
          <div class="toggle-collapse text-right">
            {{ $t("GENERAL.RELATED_EQUIPMENT") }}
            <toggle-button
              @change="enableEquipment = !enableEquipment"
              :value="Boolean(enableEquipment)"
              :sync="true"
              :color="{ checked: '#2173c9', unchecked: '#7b7b7b' }"
              class="toggle-btn m-0"
            />
          </div>

          <div class="divider my-3" v-if="enableEquipment"></div>
          <b-collapse class="collapse-component" :visible="enableEquipment">
            <div class="my-1" v-for="(item, index) in form.relationArray" :key="index">
              <b-form-select
                v-model="item.equipmentType"
                :options="equipmentTypeList"
                class="select-component left"
                @change="equipmentTypeChange(item)"
              ></b-form-select>

              <b-form-select
                v-model="item.equipment"
                :options="item.equipmentList"
                class="select-component left ml-1"
              ></b-form-select>

              <div class="btns float-right">
                <div class="round-btn float-left" role="button" @click="addEquipmentType()">
                  <font-awesome-icon icon="plus" />
                </div>

                <div class="round-btn float-right" role="button" @click="deleteEquipmentTypes(index)" v-if="index != 0">
                  <font-awesome-icon icon="trash-alt" />
                </div>
              </div>
            </div>
          </b-collapse>
        </div>

        <div class="form-group row">
          <b-button class="btn-cancel float-left" @click="cancel">{{ $t("GENERAL.CANCEL") }}</b-button>
          <b-button type="submit" class="btn-ok float-right" v-if="form.uuid">{{ $t("GENERAL.SAVE") }}</b-button>
          <b-button class="btn-ok float-right" v-if="!form.uuid" @click="createWorkflow('create')">{{
            $t("MODAL.UPSERT_WF.START_EDITING")
          }}</b-button>
          <!-- <b-button class="btn-ok float-right" @click="createWorkflow">開始編輯</b-button> -->
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
      workflowTypeList: Array,
      equipmentTypeList: Array,
      expertList: Array,
      selectedData: Object,
    },

    mounted() {
      // update
      if (this.selectedData) {
        let relations = this.selectedData.relations;
        this.form.uuid = this.selectedData.uuid;
        this.form.name = this.selectedData.name;
        this.form.desc = this.selectedData.description;
        this.form.type_uuid = this.selectedData.type_uuid;
        this.form.expertAccount = this.selectedData.expert_account;
        if (relations.length > 0) {
          // 設備類型selector新增項目
          for (let relation of relations) {
            this.addEquipmentType(relation.equipment, relation.equipment_type);
          }
          // 讓所有列的設備都設定正確的值進去
          for (let relation of this.form.relationArray) {
            this.equipmentTypeChange(relation);
          }
          return;
        }
      }

      // 如果沒有關聯設備，還是要新增第一筆初始的
      this.enableEquipment = false;
      this.addEquipmentType();
      this.equipmentTypeChange(this.form.relationArray[0]);
    },

    data: () => ({
      form: {
        name: null,
        desc: null,
        type_uuid: null,
        expertAccount: null,
        relationArray: [],
      },
      enableEquipment: true,
    }),
    methods: {
      createWorkflow(type) {
        let equipments = [];
        let equipmentTypes = [];
        // 有勾才要傳
        if (this.enableEquipment) {
          for (let item of this.form.relationArray) {
            if (item.equipment) {
              if (equipments.indexOf(item.equipment) == -1) equipments.push(item.equipment);
            } else if (item.equipmentType) {
              if (equipmentTypes.indexOf(item.equipmentType) == -1) equipmentTypes.push(item.equipmentType);
            }
          }
        }
        let data = {
          uuid: this.form.uuid,
          name: this.form.name,
          description: this.form.desc,
          type_uuid: this.form.type_uuid,
          equipment_uuids: equipments,
          equipment_type_uuids: equipmentTypes,
          expert_account: this.form.expertAccount,
        };
        this.apiPost("workflow/upsert", data).then(({ data }) => {
          if (type == "upsert") {
            this.$emit("ok");
          } else {
            this.$router.push({ name: "Workflow", params: { uuid: data.uuid } });
          }
        });
      },

      addEquipmentType(equipment, equipmentType) {
        if (!equipment && !equipmentType) {
          equipment = 0;
          equipmentType = this.equipmentTypeList[0].value;
        }
        this.form.relationArray.push({ equipment, equipmentType });

        this.equipmentTypeChange(this.form.relationArray[this.form.relationArray.length - 1]);
      },

      deleteEquipmentTypes(index) {
        this.form.relationArray.splice(index, 1);
      },

      cancel() {
        this.$emit("cancel");
      },
      equipmentTypeChange(item) {
        let equipmentList = [{ value: 0, text: this.$t("GENERAL.ALL_EQUIPMENTS"), disabled: true }];
        for (let equipmentType of this.equipmentTypeList) {
          if (equipmentType.value == item.equipmentType) {
            equipmentList.push(...equipmentType.equipments);
          }
        }
        item.equipmentList = equipmentList;
        if (!item.equipment || equipmentList.every((e) => e.value != item.equipment)) item.equipment = 0;
        item.__ob__.dep.notify();
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
