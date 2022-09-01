<template>
  <div class="enterprise-account">
    <Searchbar @search="searchEnterpriseUserList" />
    <div class="filter-section">
      <b-form-select
        v-model="selectedEnterprise"
        :options="enterpriseList"
        class="select-component ml-3 my-4 float-left"
        @change="getEnterpriseUserList(selectedEnterprise)"
      ></b-form-select>
      <b-button class="add-btn my-4 float-right" @click="showModal('createEnterpriseAccount')">新增企業用戶</b-button>
    </div>
    <div class="m-table-container">
      <table class="m-table mx-auto">
        <thead>
          <tr class="m-tr tr-item">
            <th class="m-th">
              <div class="m-th-content">
                <span>企業</span>
                <!-- TODO: Sort 功能待完成
                <div class="m-th-sort" role="button">
                  <font-awesome-icon class="icon-up" icon="caret-up" />
                  <font-awesome-icon class="icon-down" icon="caret-down" />
                </div> -->
              </div>
            </th>
            <th class="m-th">
              <div class="m-th-content">
                <span>帳號</span>
                <div class="m-th-sort" role="button"></div>
              </div>
            </th>
            <th class="m-th">
              <div class="m-th-content">
                <span>用戶名稱</span>
                <div class="m-th-sort" role="button"></div>
              </div>
            </th>
            <th class="m-th">
              <div class="m-th-content">
                <span>Email</span>
                <div class="m-th-sort" role="button"></div>
              </div>
            </th>
            <th class="m-th">
              <div class="m-th-content"><span>角色</span></div>
            </th>
            <th class="m-th">
              <div class="m-th-content"><span>狀態</span></div>
            </th>
            <th class="m-th">
              <div class="m-th-content"><span>建立日期</span></div>
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
          <tr class="m-tr tr-list" v-for="(item, index) in enterpriseUserList" :key="index">
            <td class="m-td">
              <span class="m-value">
                {{ item.enterprise }}
              </span>
            </td>
            <td class="m-td">
              <span class="m-value">{{ item.account }}</span>
            </td>
            <td class="m-td">
              <span class="m-value">{{ item.name }}</span>
            </td>
            <td class="m-td">
              <span class="m-value">{{ item.email }}</span>
            </td>
            <td class="m-td">
              <span class="m-value">{{ item.admin == 1 ? "企業 Admin" : "企業 User" }}</span>
            </td>
            <td class="m-td">
              <switch-button :isActive="item.status == 0" @update="updateUserStatus(item)" />
            </td>
            <td class="m-td">
              <span class="m-value">{{ GetDateString(item.create_time) }}</span>
            </td>
            <td class="m-td">
              <font-awesome-icon
                class="edit-img"
                role="button"
                icon="pencil-alt"
                @click="showModal('updateEnterpriseAccount', item)"
              />
            </td>
            <td class="m-td">
              <div class="float-left">{{ GetDatetimeString(item.update_time) }}</div>
              <div class="user-log float-left" role="button" @click="showModal('enterpriseUserLog', item)"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <CreateEnterpriseAccount
      v-if="modalType.createEnterpriseAccount"
      :enterpriseList="enterpriseList"
      @ok="closeModal('createEnterpriseAccount', true)"
      @cancel="closeModal('createEnterpriseAccount', false)"
    ></CreateEnterpriseAccount>
    <UpdateEnterpriseAccount
      v-if="modalType.updateEnterpriseAccount"
      @ok="closeModal('updateEnterpriseAccount', true)"
      @cancel="closeModal('updateEnterpriseAccount', false)"
      :selectedData="selectedData"
    ></UpdateEnterpriseAccount>
    <EnterpriseUserLog
      v-if="modalType.enterpriseUserLog"
      @cancel="closeModal('enterpriseUserLog', false)"
      :selectedData="selectedData"
    ></EnterpriseUserLog>
  </div>
</template>

<script>
  import Searchbar from "./component/Searchbar";
  import SwitchButton from "@/components/SwitchButton";
  import CreateEnterpriseAccount from "./modal/CreateEnterpriseAccount";
  import UpdateEnterpriseAccount from "./modal/UpdateEnterpriseAccount";
  import EnterpriseUserLog from "./modal/EnterpriseUserLog";

  import { GetDatetimeString, GetDateString } from "@/utils/date";

  export default {
    components: {
      Searchbar,
      SwitchButton,
      CreateEnterpriseAccount,
      UpdateEnterpriseAccount,
      EnterpriseUserLog,
    },
    data: () => ({
      modalType: {
        createEnterpriseAccount: false,
        updateEnterpriseAccount: false,
        enterpriseUserLog: false,
      },
      selectedData: null,
      enterpriseUserList: [],
      enterpriseList: [{ value: 0, text: "所有企業" }],
      selectedEnterprise: 0,
    }),
    mounted() {
      this.getEnterpriseUserList();
      this.getEnterpriseList();
    },
    methods: {
      GetDateString,
      GetDatetimeString,
      getEnterpriseUserList(code) {
        let data = {
          code: code == 0 ? null : code,
        };
        this.apiGet("si/enterprise_user_list", data).then(({ data }) => {
          this.enterpriseUserList = data.users;
        });
      },
      searchEnterpriseUserList(keyword) {
        let data = {
          code: this.selectedEnterprise == 0 ? null : this.selectedEnterprise,
          keyword: keyword,
        };
        this.apiGet("si/enterprise_user_list", data).then(({ data }) => {
          this.enterpriseUserList = data.users;
        });
      },
      getEnterpriseList() {
        this.apiGet("si/enterprise_list").then(({ data }) => {
          for (let enterprise of data.list) {
            this.enterpriseList.push({ value: enterprise.code, text: enterprise.name });
          }
        });
      },
      showModal(type, data) {
        if (data) {
          this.selectedData = data;
        }
        this.modalType[type] = true;
      },
      closeModal(type, reload) {
        if (reload) this.reloadEnterpriseUserList();
        this.modalType[type] = false;
        this.selectedData = null;
      },
      reloadEnterpriseUserList() {
        this.getEnterpriseUserList();
      },
      updateUserStatus(item) {
        if (item.status == 0) item.status = 2;
        else item.status = 0;

        this.apiPost("si/toggle_enterprise_admin_active", {
          account: item.account,
          code: item.code,
          status: item.status,
        });
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";
  .enterprise-account {
    .filter-section {
      margin-right: 7vw;
      margin-top: 2px;

      .select-component {
        width: 300px;
        background-color: #fff;
        border: 1px solid #ccc;
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
