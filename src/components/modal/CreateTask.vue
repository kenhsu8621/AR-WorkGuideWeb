<template>
  <TemplateModal :width="30">
    <template v-slot:default>
      <div class="m-modal-title">
        {{ selectedData ? $t("TASK.COPY_TASK") : $t("TASK.ADD_TASK") }}
      </div>
      <form @submit.prevent="createTask">
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
          <div
            class="search-group"
            :class="{
              'search-focus': workflowFocus,
              'row-1': rowWf == 1,
              'row-2': rowWf == 2,
              'row-3': rowWf == 3,
            }"
          >
            <input
              type="search"
              ref="inputWf"
              v-model="workflowKeyword"
              @focus="searchWorkflow"
              @blur="clearWorkFlowInput"
              @input="searchWorkflow"
              :placeholder="$t('TASK.WF_PH')"
              class="search-input"
            />
            <font-awesome-icon icon="search" class="search-icon" v-if="!workflowFocus" />
            <font-awesome-icon icon="caret-down" class="down-icon" v-if="workflowFocus" />

            <div class="search-wf-result mt-1" v-if="workflowFocus">
              <div
                class="result-list py-1"
                v-for="item of searchWorkflowList"
                :key="item.uuid"
                role="button"
                @mousedown="selectWorkflow(item)"
              >
                {{ item.name }}
              </div>
              <div class="result-empty" v-if="isWorkflowListEmpty">{{ $t("TASK.SEARCH_EMPTY") }}</div>
            </div>
            <input hidden v-model="form.wf_uuid" />
          </div>
        </div>

        <div class="form-group row">
          <div class="m-label text-right">{{ $t("TASK.OPERATOR") }}</div>
          <div
            class="search-group"
            :class="{
              'search-focus': operatorFocus,
              'row-1': rowOp == 1,
              'row-2': rowOp == 2,
              'row-3': rowOp == 3,
            }"
          >
            <input
              type="search"
              ref="inputOp"
              v-model="operatorKeyword"
              @focus="searchOperator"
              @blur="clearOperatorInput"
              @input="searchOperator"
              :placeholder="$t('TASK.OPERATOR_PH')"
              class="search-input"
            />
            <font-awesome-icon icon="search" class="search-icon" v-if="!operatorFocus" />
            <font-awesome-icon icon="caret-down" class="down-icon" v-if="operatorFocus" />

            <div class="search-op-result mt-1" v-if="operatorFocus">
              <div
                class="result-list py-1"
                v-for="item of searchOperatorList"
                :key="item.uuid"
                role="button"
                @mousedown="selectOperator(item)"
              >
                {{ item.name }}
              </div>
              <div class="result-empty" v-if="isOperatorListEmpty">{{ $t("TASK.SEARCH_EMPTY") }}</div>
            </div>
            <input hidden v-model="form.operator_account" />
          </div>
        </div>

        <div class="form-group row">
          <div class="m-label text-right">{{ $t("TASK.START_END_TIME") }}</div>
          <date-picker
            v-model="dateTimeRange"
            class="date-picker-style"
            range
            type="datetime"
            :show-second="false"
            :placeholder="$t('TASK.START_END_TIME_PH')"
            :clearable="false"
            required
          ></date-picker>
        </div>

        <div class="form-group row">
          <div class="toggle-collapse text-right">
            {{ $t("TASK.ASSIGN_EQUIPMENT") }}
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
            <div class="my-1">
              <b-form-select
                v-model="form.equipment_type"
                :options="equipmentTypeList"
                class="select-component left"
                @change="equipmentTypeChange"
              ></b-form-select>

              <b-form-select
                v-model="form.equipment_uuid"
                :options="equipmentList"
                class="select-component right"
              ></b-form-select>
            </div>
          </b-collapse>
        </div>

        <div class="form-group row">
          <b-button class="btn-cancel float-left" @click="cancel">{{ $t("GENERAL.CANCEL") }}</b-button>
          <b-button type="submit" class="btn-ok float-right">{{ $t("GENERAL.ADD") }}</b-button>
        </div>
      </form>
    </template>
  </TemplateModal>
</template>

<script>
  import TemplateModal from "@/components/modal/TemplateModal";
  import DatePicker from "vue2-datepicker";
  import "vue2-datepicker/index.css";

  export default {
    components: {
      TemplateModal,
      DatePicker,
    },
    props: {
      selectedData: Object,
    },

    data: () => ({
      form: {
        name: null,
        desc: null,
        wf_uuid: null,
        operator_account: null,
        equipment_type: null,
        equipment_uuid: null,
        beginTime: null,
        endTime: null,
      },
      dateTimeRange: [],
      enableEquipment: false,
      workflowTimeout: null,
      searchWorkflowList: null,
      searchOperatorList: null,
      workflowKeyword: "",
      workflowFocus: false,
      operatorKeyword: "",
      operatorFocus: false,
      workflowUuid: "",
      operatorAccount: "",
      equipmentTypeList: [],
      equipmentList: [],
      isWorkflowListEmpty: false,
      isOperatorListEmpty: false,
      rowWf: 0,
      rowOp: 0,
    }),

    mounted() {
      // 如果沒有關聯設備，還是要新增第一筆初始的
      // this.enableEquipment = false;
      this.getEquipmentFullList();
      if (this.selectedData) {
        this.dateTimeRange = [new Date(this.selectedData.begin_time), new Date(this.selectedData.due_time)];
        this.form.name = this.selectedData.name;
        this.form.desc = this.selectedData.description;
        this.form.wf_uuid = this.selectedData.wf_uuid;
        this.form.operator_account = this.selectedData.operator_account;
        this.form.equipment_type = this.selectedData.equipment_type;
        this.workflowUuid = this.selectedData.wf_uuid;
        this.operatorAccount = this.selectedData.operator_account;
      } else {
        let begin = new Date();
        begin.setHours(0, 0, 0, 0);
        let end = new Date();
        end.setDate(end.getDate() + 7);
        end.setHours(12, 0, 0, 0);
        // end.setSeconds(+30);
        this.dateTimeRange = [begin, end];
      }
    },

    methods: {
      getEquipmentFullList() {
        this.apiGet("equipment/full_list").then(({ data }) => {
          let arr = [];
          for (let type of data.list) {
            if (type.equipments.length) {
              arr.push({
                value: type.type_uuid,
                text: type.type_name,
                equipments: type.equipments.map((e) => {
                  return { value: e.equipment_uuid, text: e.serial };
                }),
              });
            }
          }
          this.equipmentTypeList = arr;
          if (arr.length) this.form.equipment_type = arr[0].value;
          this.equipmentTypeChange();
        });
      },

      createTask() {
        let name = this.form.name;
        let description = this.form.desc;
        let begin_time = this.form.beginTime && this.form.beginTime.getTime();
        let due_time = this.form.endTime && this.form.endTime.getTime();
        let equipment_uuid = null;
        if (this.enableEquipment) equipment_uuid = this.form.equipment_uuid;
        let wf_uuid = this.form.wf_uuid;
        let operator_account = this.form.operator_account;
        if (
          !name ||
          !begin_time ||
          !due_time ||
          !wf_uuid ||
          !operator_account ||
          (this.enableEquipment && !equipment_uuid)
        )
          return this.$alert(this.$t("TASK.SEARCH_ERR"));
        let data = {
          name,
          description,
          begin_time,
          due_time,
          equipment_uuid,
          wf_uuid,
          operator_account,
        };
        this.apiPost("workflow/insert_task", data)
          .then(({ data }) => {
            this.$emit("ok");
          })
          .catch((obj) => {});
      },

      cancel() {
        this.$emit("cancel");
      },

      searchWorkflow() {
        this.isSearchingWorkflow = true;
        clearTimeout(this.workflowTimeout);
        this.isWorkflowListEmpty = false;
        this.workflowFocus = true;
        this.searchWorkflowList = null;
        let data = {};
        if (this.workflowKeyword) {
          data.keyword = this.workflowKeyword;
        }
        this.workflowTimeout = setTimeout(() => {
          this.apiGet("workflow/list", data)
            .then(({ data }) => {
              if (data.workflows.length > 0) {
                this.searchWorkflowList = data.workflows;
                if (data.workflows.length > 2) {
                  this.rowWf = 3;
                } else this.rowWf = data.workflows.length;
              } else {
                this.isWorkflowListEmpty = true;
                this.rowWf = 1;
              }
            })
            .finally(() => {
              this.isSearchingWorkflow = false;
            });
        }, 500);
      },
      clearWorkflowKeyword() {
        this.workflowKeyword = "";
        this.$refs.inputWf.focus();
      },

      selectWorkflow(item) {
        this.workflowKeyword = item.name;
        this.form.wf_uuid = item.uuid;
        this.workflowUuid = "";
        this.searchWorkflowList = null;
        this.rowWf = 0;
        this.workflowFocus = false;
      },

      clearWorkFlowInput() {
        if (this.isSearchingWorkflow) return;
        this.searchWorkflowList = null;
        this.workflowFocus = false;
        this.rowWf = 0;
      },

      searchOperator() {
        this.isSearchingOperator = true;
        clearTimeout(this.operatorTimeout);
        this.isOperatorListEmpty = false;
        this.operatorFocus = true;
        this.searchOperatorList = null;
        let data = {};
        if (this.operatorKeyword) {
          data.keyword = this.operatorKeyword;
        }
        this.operatorTimeout = setTimeout(() => {
          this.apiGet("enterprise/user_list", data)
            .then(({ data }) => {
              if (data.users.length > 0) {
                this.searchOperatorList = data.users;
                if (data.users.length > 2) {
                  this.rowOp = 3;
                } else this.rowOp = data.users.length;
              } else {
                this.isOperatorListEmpty = true;
                this.rowOp = 1;
              }
            })
            .finally(() => {
              this.isSearchingOperator = false;
            });
        }, 500);
      },
      selectOperator(item) {
        this.operatorKeyword = item.name;
        this.form.operator_account = item.account;
        this.operatorUuid = "";
        this.searchOperatorList = null;
        this.rowOp = 0;
        this.operatorFocus = false;
      },

      clearOperatorInput() {
        if (this.isSearchingOperator) return;
        this.searchOperatorList = null;
        this.operatorFocus = false;
        this.rowOp = 0;
      },

      equipmentTypeChange() {
        let type = this.equipmentTypeList.find((t) => t.value == this.form.equipment_type);
        this.equipmentList = type.equipments;
        this.form.equipment_uuid = type.equipments[0].value;
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

    .form-control {
      border: 2px solid #e7e7e9;
      border-radius: 10px;
      transition: all 0.3s ease-in-out;

      &:focus {
        border: 2px solid #4b8bcf;
        box-shadow: none;
      }
    }

    .search-group {
      width: 100%;
      height: 42px;
      border: 2px solid #e7e7e9;
      border-radius: 10px;
      font-size: 1rem;
      padding: 0.375rem 0.75rem;
      transition: all 0.3s ease-in-out;

      .search-input {
        border: none;
        width: 100%;

        &:focus {
          outline: none;
        }

        &::-webkit-search-cancel-button {
          position: relative;
          right: 20px;
          cursor: pointer;
          width: 30px;
        }
      }

      .search-icon {
        position: absolute;
        top: 12px;
        right: 16px;
        color: #b3b3b3;
      }

      .down-icon {
        position: absolute;
        top: 12px;
        right: 16px;
        color: $blue;
      }

      .search-wf-result,
      .search-op-result {
        border-top: 1px solid $blue;
        padding-top: 0.375rem;
        height: 120px;
        overflow: scroll;

        .result-list {
          &:hover {
            background-color: aliceblue;
          }
        }

        .result-empty {
          color: $red;
          font-size: 12px;
        }
      }
    }

    .search-focus {
      border: 2px solid $blue;
      height: 50px;
    }

    .row-1 {
      height: 80px !important;
    }

    .row-2 {
      height: 117px !important;
    }

    .row-3 {
      height: 160px !important;
    }

    .select-component {
      border-radius: 10px;
      max-width: 200px;
      background-color: #fff;
      border: 2px solid #e7e7e9;
      //更改 select icon樣式
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
        width: 48%;
      }
      .right {
        margin-left: 2%;
        float: right;
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
