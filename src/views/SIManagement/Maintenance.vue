<template>
  <div class="maintenance">
    <Searchbar @search="getUserList" />
    <div class="filter-section float-right">
      <b-button class="add-btn my-4" @click="showModal('createMaintenanceAccount')">新增運維帳號</b-button>
    </div>
    <div class="m-table-container">
      <table class="m-table mx-auto">
        <thead>
          <tr class="m-tr tr-item">
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
          <tr class="m-tr tr-list" v-for="(item, index) in userList" :key="index">
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
              <span class="m-value">{{ item.admin == 1 ? "SI Admin" : "SI User" }}</span>
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
                @click="showModal('updateMaintenanceAccount', item)"
              />
            </td>
            <td class="m-td">
              <div class="float-left">{{ GetDatetimeString(item.update_time) }}</div>
              <div class="user-log float-left" role="button" @click="showModal('userLog', item)"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <CreateMaintenanceAccount
      v-if="modalType.createMaintenanceAccount"
      @ok="closeModal('createMaintenanceAccount', true)"
      @cancel="closeModal('createMaintenanceAccount', false)"
    ></CreateMaintenanceAccount>
    <UpdateMaintenanceAccount
      v-if="modalType.updateMaintenanceAccount"
      @ok="closeModal('updateMaintenanceAccount', true)"
      @cancel="closeModal('updateMaintenanceAccount', false)"
      :selectedData="selectedData"
    ></UpdateMaintenanceAccount>
    <UserLog v-if="modalType.userLog" @cancel="closeModal('userLog', false)" :selectedData="selectedData"></UserLog>
  </div>
</template>

<script>
  import Searchbar from "./component/Searchbar";
  import SwitchButton from "@/components/SwitchButton";
  import CreateMaintenanceAccount from "./modal/CreateMaintenanceAccount";
  import UpdateMaintenanceAccount from "./modal/UpdateMaintenanceAccount";
  import UserLog from "./modal/UserLog";

  import { GetDatetimeString, GetDateString } from "@/utils/date";

  export default {
    components: {
      Searchbar,
      SwitchButton,
      CreateMaintenanceAccount,
      UpdateMaintenanceAccount,
      UserLog,
    },
    data: () => ({
      modalType: {
        createMaintenanceAccount: false,
        updateMaintenanceAccount: false,
        userLog: false,
      },
      selectedData: null,
      userList: [],
    }),
    mounted() {
      this.getUserList();
    },
    methods: {
      GetDateString,
      GetDatetimeString,
      getUserList(keyword) {
        let data = {
          keyword: keyword,
        };
        this.apiGet("si/user_list", data).then(({ data }) => {
          this.userList = data.users;
        });
      },
      showModal(type, data) {
        if (data) {
          this.selectedData = data;
        }
        this.modalType[type] = true;
      },
      closeModal(type, reload) {
        if (reload) this.reloadUserList();
        this.modalType[type] = false;
        this.selectedData = null;
      },
      reloadUserList() {
        this.getUserList();
      },
      updateUserStatus(item) {
        if (item.status == 0) item.status = 2;
        else item.status = 0;
        let data = {
          account: item.account,
          status: item.status,
        };
        this.apiPost("si/toggle_user_active", data).then(({ data }) => {
          this.$emit("update");
        });
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";
  .maintenance {
    .filter-section {
      margin-right: 7vw;
      height: 44px;
      margin-top: 2px;
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
