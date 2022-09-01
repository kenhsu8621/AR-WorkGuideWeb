<template>
  <div class="enterprise-setting">
    <Searchbar @search="getEnterpriseList" />
    <div class="filter-section">
      <div class="account-arrangement float-left">
        <span class="ml-5">可分配帳號數</span>
        <strong class="mx-3 number">{{ siDetail.account_count_remain }}</strong>
        <span class="ml-4">已分配帳號數</span>
        <strong class="mx-3 number">{{ siDetail.account_count }}</strong>
      </div>
      <b-button class="add-btn my-4 float-right" @click="showModal('createEnterprise')">新增企業帳號</b-button>
    </div>
    <div class="m-table-container">
      <table class="m-table mx-auto">
        <thead>
          <tr class="m-tr tr-item">
            <th class="m-th">
              <div class="m-th-content"><span>企業名稱</span></div>
            </th>
            <th class="m-th">
              <div class="m-th-content"><span>企業代碼</span></div>
            </th>
            <th class="m-th">
              <div class="m-th-content"><span>可用帳號數</span></div>
            </th>
            <th class="m-th">
              <div class="m-th-content"><span>已用帳號數</span></div>
            </th>
            <th class="m-th">
              <div class="m-th-content"><span>狀態</span></div>
            </th>
            <th class="m-th">
              <div class="m-th-content"><span>起始日期</span></div>
            </th>
            <th class="m-th">
              <div class="m-th-content"><span>到期日期</span></div>
            </th>
            <th class="m-th">
              <div class="m-th-content"><span>編輯</span></div>
            </th>
            <th class="m-th">
              <div class="m-th-content"><span>修改紀錄</span></div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="m-tr tr-list" v-for="(item, index) in enterpriseList" :key="index">
            <td class="m-td">
              <span class="m-value">{{ item.name }}</span>
            </td>
            <td class="m-td">
              <span class="m-value">{{ item.code }}</span>
            </td>
            <td class="m-td">
              <span class="m-value">{{ item.account_count }}</span>
            </td>
            <td class="m-td">
              <span class="m-value">{{ item.account_count - item.account_count_remain }}</span>
            </td>
            <td class="m-td">
              <switch-button :isActive="item.status == 0" @update="updateEnterpriseStatus(item)" />
            </td>
            <td class="m-td">
              <span class="m-value">{{ GetDateString(item.begin_time) }}</span>
            </td>
            <td class="m-td">
              <span class="m-value">{{ GetDateString(item.end_time) }}</span>
            </td>
            <td class="m-td">
              <font-awesome-icon
                class="edit-img"
                role="button"
                icon="pencil-alt"
                @click="showModal('updateEnterprise', item)"
              />
            </td>
            <td class="m-td">
              <div class="float-left">{{ GetDatetimeString(item.update_time) }}</div>
              <div class="user-log float-left" role="button" @click="showModal('enterpriseLog', item)"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <CreateEnterprise
      v-if="modalType.createEnterprise"
      @ok="closeModal('createEnterprise', true)"
      @cancel="closeModal('createEnterprise', false)"
    ></CreateEnterprise>
    <UpdateEnterprise
      v-if="modalType.updateEnterprise"
      @ok="closeModal('updateEnterprise', true)"
      @cancel="closeModal('updateEnterprise', false)"
      :selectedData="selectedData"
    ></UpdateEnterprise>
    <EnterpriseLog
      v-if="modalType.enterpriseLog"
      @cancel="closeModal('enterpriseLog', false)"
      :selectedData="selectedData"
    ></EnterpriseLog>
  </div>
</template>

<script>
  import Searchbar from "./component/Searchbar";
  import SwitchButton from "@/components/SwitchButton";
  import CreateEnterprise from "./modal/CreateEnterprise";
  import UpdateEnterprise from "./modal/UpdateEnterprise";
  import EnterpriseLog from "./modal/EnterpriseLog";

  import { GetDatetimeString, GetDateString } from "@/utils/date";

  export default {
    components: {
      Searchbar,
      SwitchButton,
      CreateEnterprise,
      UpdateEnterprise,
      EnterpriseLog,
    },
    data: () => ({
      modalType: {
        createEnterprise: false,
        updateEnterprise: false,
        enterpriseLog: false,
      },
      selectedData: null,
      enterpriseList: [],
      siDetail: {},
    }),
    mounted() {
      this.getEnterpriseList();
      this.getSiDetail();
    },
    methods: {
      GetDateString,
      GetDatetimeString,
      getEnterpriseList(keyword) {
        let data = {
          keyword: keyword,
        };
        this.apiGet("si/enterprise_list", data).then(({ data }) => {
          this.enterpriseList = data.list;
        });
      },
      getSiDetail() {
        this.apiGet("si/si_detail").then(({ data }) => {
          this.siDetail = data;
        });
      },
      showModal(type, data) {
        if (data) {
          this.selectedData = data;
        }
        this.modalType[type] = true;
      },
      closeModal(type, reload) {
        if (reload) this.reloadEnterpriseList();
        this.modalType[type] = false;
        this.selectedData = null;
      },
      reloadEnterpriseList() {
        this.getEnterpriseList();
      },
      updateEnterpriseStatus(item) {
        if (item.status == 0) item.status = 2;
        else item.status = 0;
        let data = {
          code: item.code,
          status: item.status,
        };
        this.apiPost("si/toggle_enterprise_active", data).then(({ data }) => {
          this.$emit("update");
        });
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";
  .enterprise-setting {
    .filter-section {
      margin-right: 7vw;
      height: 44px;
      .account-arrangement {
        margin-top: 24px;
        .number {
          font-size: 24px;
        }
      }
      .add-btn {
        background-color: $blue;
        border: 1px solid $blue;
        height: 40px;
      }
    }
    .m-table-container {
      padding-left: 100px;
      font-size: 14px;

      .m-table {
        box-sizing: border-box;
        border: 1px solid #d0d0d0;
        border-radius: 5px;
        width: 80vw;

        .m-th {
          background-color: #eaeaea;
          text-align: left;
          padding-left: 15px;

          .m-th-content {
            font-size: 14px;
            font-weight: bold;

            .m-th-sort {
              position: relative;
              float: right;
              margin-left: -10px;
              margin-top: 10px;
              .icon-up {
                position: absolute;
              }
              .icon-down {
                position: absolute;
                top: 7px;
              }
            }
          }
        }
        .m-tr {
          border: 1px solid #ccc;
          &:hover {
            background-color: #f6f6f6;
          }
        }
        .tr-item {
          height: 60px;
          line-height: 60px;
        }
        .tr-list {
          height: 40px;
          line-height: 40px;
        }
        .m-td {
          text-align: left;
          padding-left: 15px;
          height: 45px;
          .edit-img {
            font-size: 20px;
            color: #7f7f7f;
            &:hover {
              color: $blue;
            }
          }
          .user-log {
            width: 25px;
            height: 25px;
            margin-top: 5px;
            background-image: url("~@/assets/images/management/user-log.svg");
            background-repeat: no-repeat;
            transform: rotate(180deg);
            &:hover {
              background-image: url("~@/assets/images/management/user-log-hover.svg");
            }
          }
        }
      }
    }
  }
</style>
