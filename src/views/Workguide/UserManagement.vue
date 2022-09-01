<template>
  <div class="user-management">
    <Header :title="$t('USER.TITLE')" />
    <Sidebar :isSidebarMinified="isSidebarMinified" />
    <div class="main-content" :class="{ maximized: isSidebarMinified }">
      <div class="upper-section mx-auto">
        <div class="form-group mr-2 mt-4 float-left">
          <input
            v-model="keyword"
            type="text"
            class="form-control search-input"
            :placeholder="$t('USER.SEARCH_PH')"
            @focus="userKeyword = null"
          />
        </div>

        <button class="btn search-btn mr-2 mt-4 float-left" @click="search">{{ $t("USER.SEARCH") }}</button>

        <div class="form-group mr-2 mt-4 float-left">
          <div class="acc-count px-2">
            <strong class="acc-total mr-2"
              >{{ enterpriseDetail.account_count - enterpriseDetail.account_count_remain }} /
              {{ enterpriseDetail.account_count || "-" }}
            </strong>
            <strong class="acc-active">{{ $t("USER.ACTIVE_ACCOUNT") }} </strong>
          </div>
        </div>

        <button class="btn create-btn mt-4 float-right" @click="showUpsertUser()">
          {{ $t("USER.ADD_USER") }}
        </button>
      </div>
      <div class="lower-section mt-4 mx-auto">
        <div class="m-table-container">
          <table class="m-table">
            <thead>
              <tr class="m-tr tr-item">
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("USER.ACCOUNT") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("USER.USERNAME") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>Email</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("USER.ROLE") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("USER.STATUS") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("USER.CREATED_DATE") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("USER.EDIT") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("USER.EDIT_RECORD") }}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item, index) in userList">
                <tr class="m-tr tr-list" :key="index">
                  <td class="m-td">{{ item.account }}</td>
                  <td class="m-td">{{ item.name }}</td>
                  <td class="m-td">{{ item.email }}</td>
                  <td class="m-td">
                    <span v-if="item.admin == 0">User</span>
                    <span v-if="item.admin == 1">Admin</span>
                  </td>
                  <td class="m-td">
                    <switch-button :isActive="item.status == 0" @update="updateUserStatus(item)" />
                  </td>
                  <td class="m-td">{{ GetDateString(item.create_time) }}</td>
                  <td class="m-td">
                    <div
                      class="round-btn float-left mr-2 blue-1"
                      role="button"
                      @click="showUpsertUser(item)"
                      v-b-tooltip.hover.bottom
                      :title="$t('USER.EDIT_USER')"
                    >
                      <font-awesome-icon icon="edit" />
                    </div>
                    <div
                      class="round-btn float-left mr-2 blue-4 red-hover"
                      role="button"
                      @click="confirmDeleteUser(item)"
                      v-b-tooltip.hover.bottom
                      :title="$t('GENERAL.DELETE')"
                    >
                      <font-awesome-icon icon="trash-alt" />
                    </div>
                  </td>
                  <td class="m-td">
                    <span class="float-left mr-2">{{ GetDatetimeString(item.update_time) }}</span>
                    <div
                      class="round-btn float-left grey"
                      role="button"
                      @click="showModal('showUserEditRecord', item)"
                      v-b-tooltip.hover.bottom
                      :title="$t('USER.EDIT_RECORD')"
                    >
                      <font-awesome-icon icon="ellipsis-h" />
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div class="bottom-edge"></div>
      </div>
      <pagination
        v-model="page"
        class="custom-pagination mt-3 mx-auto"
        :records="totalCount"
        :per-page="perPage"
        @paginate="changePage"
      />

      <div
        class="toggle-sidebar"
        :class="{ 'minified-sidebar': isSidebarMinified }"
        @click="toggleSidebar"
        role="button"
      >
        <font-awesome-icon icon="chevron-left" v-if="!isSidebarMinified" />
        <font-awesome-icon icon="chevron-right" class="arrow-right" v-if="isSidebarMinified" />
      </div>
    </div>

    <ShowUserEditRecord
      v-if="modalType.showUserEditRecord"
      :selectedData="selectedData"
      @cancel="closeModal('showUserEditRecord', false)"
    ></ShowUserEditRecord>

    <UpsertUser
      v-if="modalType.showUpsertUser"
      :selectedData="selectedData"
      @ok="closeModal('showUpsertUser', true)"
      @cancel="closeModal('showUpsertUser', false)"
    ></UpsertUser>
  </div>
</template>

<script>
  import Header from "@/components/Header";
  import Sidebar from "@/components/Sidebar";
  import SwitchButton from "@/components/SwitchButton";
  import ShowUserEditRecord from "@/components/modal/ShowUserEditRecord";
  import UpsertUser from "@/components/modal/UpsertUser";
  import { GetDateString, GetDatetimeString } from "@/utils/date";

  export default {
    components: {
      Header,
      Sidebar,
      SwitchButton,
      ShowUserEditRecord,
      UpsertUser,
    },
    data: () => ({
      modalType: {
        showUserEditRecord: false,
        showUpsertUser: false,
      },
      isSidebarMinified: false,
      isMenuMinified: false,
      isContentMinified: false,
      selectedData: null,
      searchType: 0,
      keyword: null,
      isSearchByKeyword: false,
      fileType: 0,
      userList: [],
      enterpriseDetail: {},
      page: 1,
      perPage: 10,
      totalCount: 0,
    }),
    mounted() {
      this.reload();
      this.getEquipmentFullList();
    },
    methods: {
      GetDateString,
      GetDatetimeString,

      search() {
        if (this.keyword == "") {
          this.isSearchByKeyword = false;
        } else this.isSearchByKeyword = true;
        this.page == 1 ? this.getUserList() : (this.page = 1);
      },

      getUserList() {
        let data = {
          page: this.page,
          per_page: this.perPage,
        };
        if (this.searchType == 0) {
          data.keyword = this.keyword || null;
          data.type = this.fileType || null;
        }
        this.apiGet("enterprise/user_list", data).then(({ data }) => {
          this.userList = data.users;
          this.totalCount = data.total;
        });
      },

      getEnterpriseDetail() {
        this.apiGet("enterprise/detail").then(({ data }) => {
          this.enterpriseDetail = data;
        });
      },

      getEquipmentFullList() {
        this.apiGet("equipment/full_list").then(({ data }) => {
          if (data.list.length > 0) {
            for (let type of data.list) {
              type.value = type.type_uuid;
              type.text = type.type_name;
              for (let equipment of type.equipments) {
                equipment.value = equipment.equipment_uuid;
                equipment.text = equipment.serial;
              }
            }
            this.equipmentTypeList = data.list;
            this.equipmentType = this.equipmentTypeList[0].type_uuid;
          } else this.equipmentTypeList = [{ value: 0, text: this.$t("GENERAL.ALL_EQUIPMENT_TYPES") }];
        });
      },

      showUpsertUser(data = {}) {
        data.account_count_remain = this.enterpriseDetail.account_count_remain;
        this.showModal("showUpsertUser", data);
      },

      deleteUser(account) {
        this.apiPost("enterprise/delete_user", { account }).then(({ data }) => {
          this.reload();
        });
      },

      showModal(type, data) {
        if (data) this.selectedData = data;
        this.modalType[type] = true;
      },

      closeModal(type, reload) {
        if (reload) this.reload();
        console.log(type);
        this.modalType[type] = false;
        this.selectedData = null;
      },

      toggleSidebar() {
        if (this.isSidebarMinified) {
          this.isSidebarMinified = false;
          setTimeout(() => {
            this.isContentMinified = false;
            this.isMenuMinified = false;
          }, 500);
        } else {
          this.isSidebarMinified = true;
          this.isContentMinified = true;
          setTimeout(() => {
            this.isMenuMinified = true;
          }, 300);
        }
      },

      reload() {
        this.getUserList();
        this.getEnterpriseDetail();
      },

      confirmDeleteUser(item) {
        this.$confirm("刪除帳號", this.$t("USER.DELETE_CONFIRM") + item.account + "？", () => {
          this.deleteUser(item.account);
        });
      },

      changePage() {
        if (this.isSearchByKeyword == false) {
          this.keyword = "";
        }
        this.getUserList();
      },
      updateUserStatus(item) {
        if (item.status == 0) item.status = 2;
        else item.status = 0;

        this.apiPost("enterprise/toggle_user_active", {
          account: item.account,
          status: item.status,
        });
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .user-management {
    padding-top: 60px;

    .main-content {
      float: right;
      width: 85%;
      height: calc(100vh - 60px);
      box-shadow: rgba(17, 17, 26, 0.05) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px;
      z-index: 9;
      transition: all 0.3s ease-in-out;
      overflow: scroll;

      .upper-section {
        width: calc(100% - 60px);
        height: 84px;
        border-bottom: 1px solid $grey;

        .search-input {
          font-size: 14px;
          height: 38px;
          width: 200px;
        }

        .acc-count {
          height: 38px;
          line-height: 34px;
          border: 1px solid #ced4da;
          border-radius: 0.25rem;

          .acc-total {
            color: $blue;
            font-size: 18px;
          }

          .acc-active {
            color: $grey;
            font-size: 14px;
          }
        }

        .search-btn {
          font-size: 14px;
          height: 38px;
          border: 1px solid $blue;
          color: $blue;
          background-color: aliceblue;
          font-weight: bold;
        }

        .create-btn {
          font-size: 14px;
          height: 38px;
          color: #fff;
          background-color: $darkBlue;
          border: 1px solid $darkBlue;
        }
      }

      .lower-section {
        width: calc(100% - 60px);

        .m-table-container {
          font-size: 14px;

          .m-table {
            box-sizing: border-box;
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);

            tr:first-child th:first-child {
              border-top-left-radius: 6px;
            }

            tr:first-child th:last-child {
              border-top-right-radius: 6px;
            }

            .m-tr {
              border-bottom: 1px solid $lightgrey;

              &:hover {
                background-color: aliceblue;
              }

              .m-th {
                color: #fff;
                text-align: left;
                padding-left: 15px;

                .m-th-content {
                  font-size: 14px;
                  font-weight: bold;
                }
              }

              .m-td {
                text-align: left;
                padding-left: 15px;
                height: 45px;
                line-height: 24px;

                .edit-img {
                  font-size: 20px;
                  color: #7f7f7f;

                  &:hover {
                    color: $blue;
                  }
                }

                .round-btn {
                  padding-left: 6px;
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

                .blue-1 {
                  background-color: $blue;
                }

                .blue-2 {
                  background-color: #337fcf;
                }

                .blue-3 {
                  background-color: #488bd3;
                }

                .blue-4 {
                  background-color: #5a96d6;
                }

                .grey {
                  background-color: #ccc;

                  &:hover {
                    background-color: #aaa;
                  }
                }
              }

              .sub-table {
                width: 95%;
                margin-left: 5%;
                box-shadow: rgba(17, 17, 26, 0.05) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px;

                .sub-tr-item {
                  background-color: #5a96d6;
                }

                tr:first-child th:first-child {
                  border-top-left-radius: 0;
                }

                tr:first-child th:last-child {
                  border-top-right-radius: 0;
                }

                .sub-tr-list {
                  border-bottom: 1px solid #5a96d6;

                  .sub-td {
                    .left-border {
                      height: 100%;
                    }
                  }
                }
              }

              .sub-bottom-edge {
                width: 95%;
                margin-left: 5%;
                height: 4px;
                background-color: #5a96d6;
                border-bottom-left-radius: 4px;
                margin-bottom: 15px;
              }
            }

            .tr-item {
              background-color: $darkBlue;
              height: 60px;

              &:hover {
                background-color: $darkBlue;
              }
            }

            .tr-list {
              height: 40px;
              line-height: 40px;
            }
          }
        }

        .bottom-edge {
          height: 6px;
          background-color: $darkBlue;
          border-bottom-left-radius: 6px;
          border-bottom-right-radius: 6px;
        }
      }

      .toggle-sidebar {
        position: absolute;
        top: 45%;
        left: 15vw;
        width: 20px;
        height: 40px;
        background-color: #ededed;
        border-bottom-right-radius: 5px;
        border-top-right-radius: 5px;
        padding-top: 8px;
        transition: all 0.2s ease-in-out;

        svg {
          color: $grey;
          width: 20px;
          height: 24px;
          transition: all 1s ease-in-out;
        }

        .arrow-right {
          color: #fff;
          transition: all 1s ease-in-out;
        }
      }

      .minified-sidebar {
        background-color: #abcbe9;
        left: 4vw;
      }
    }

    .maximized {
      width: 96%;
      transition: all 0.3s ease-in-out;
    }
  }

  .slide-fade-enter-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-fade-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateY(-5px);
    opacity: 0;
  }
</style>
