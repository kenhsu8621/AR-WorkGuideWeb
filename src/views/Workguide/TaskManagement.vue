<template>
  <div class="workflow-management">
    <Header :title="$t('TASK.TITLE')" />
    <Sidebar :isSidebarMinified="isSidebarMinified" />
    <div class="main-content" :class="{ maximized: isSidebarMinified }">
      <div class="upper-section mx-auto">
        <b-form-select v-model="searchType" class="select-component mr-2 mt-4 float-left">
          <b-form-select-option :key="item.value" v-for="item of searchTypeList" :value="item.value">{{
            $t(item.text)
          }}</b-form-select-option>
        </b-form-select>

        <div v-if="searchType == 0">
          <div class="form-group mr-2 mt-4 float-left">
            <input
              type="text"
              class="form-control search-input"
              :placeholder="$t('TASK.BY_TASK_PH')"
              v-model="keyword"
            />
          </div>

          <b-form-select v-model="statusType" class="select-component mr-2 mt-4 float-left">
            <b-form-select-option :key="item.value" v-for="item of statusTypeList" :value="item.value">
              {{ $t(item.text) }}
            </b-form-select-option>
          </b-form-select>

          <b-form-select v-model="creator" class="select-component mr-2 mt-4 float-left">
            <b-form-select-option :key="item.value" v-for="(item, index) of creatorList" :value="item.value">
              {{ index == 0 ? $t(item.text) : item.text }}
            </b-form-select-option>
          </b-form-select>
        </div>

        <div v-if="searchType == 1">
          <div class="form-group mr-2 mt-4 float-left">
            <input type="text" class="form-control search-input" :placeholder="$t('TASK.BY_WF_PH')" v-model="keyword" />
          </div>
        </div>

        <div v-if="searchType == 2">
          <div class="form-group mr-2 mt-4 float-left">
            <input
              type="text"
              class="form-control search-input"
              :placeholder="$t('TASK.BY_EQUIPMENT_SN_PH')"
              v-model="keyword"
            />
          </div>
        </div>

        <button class="btn search-btn mt-4" @click="search">{{ $t("WF_M.SEARCH") }}</button>

        <button class="btn create-btn mt-4 float-right" @click="showModal('createTask')">
          {{ $t("TASK.ADD_TASK") }}
        </button>

        <button class="btn search-btn mt-4 mr-2 float-right" @click="showModal('taskReport')">
          {{ $t("TASK.TASK_REPORT") }}
        </button>
      </div>

      <div class="lower-section mt-4 mx-auto">
        <div class="m-table-container">
          <table class="m-table">
            <thead>
              <tr class="m-tr tr-item">
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("TASK.TASK_CODE") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("TASK.TASK_NAME") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("TASK.WF") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("TASK.STATUS") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("TASK.BUILT_BY") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("TASK.CREATED_DATE") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("TASK.START_TIME") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("TASK.END_TIME") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("TASK.OPERATOR") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("TASK.DONE_DATE") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("TASK.EQUIPMENT_SN") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("GENERAL.OPERATION") }}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item, index) in taskList">
                <tr class="m-tr tr-list" :key="index">
                  <td class="m-td">{{ item.uuid }}</td>
                  <td class="m-td">
                    <span class="float-left mr-2">{{ item.name }}</span>
                    <div
                      class="round-btn float-left mr-2 grey"
                      role="button"
                      @click="showModal('showDesc', item)"
                      v-b-tooltip.hover.bottom
                      :title="$t('TASK.TASK_DESC')"
                    >
                      <font-awesome-icon icon="ellipsis-h" />
                    </div>
                  </td>
                  <td class="m-td">{{ item.wf_name }}</td>
                  <td class="m-td">{{ GetStatusString(item.status) }}</td>
                  <td class="m-td" v-b-tooltip.hover.bottom :title="item.creator_name">{{ item.creator_account }}</td>
                  <td class="m-td">{{ GetDateString(item.created_time) }}</td>
                  <td class="m-td">{{ GetDatetimeString(item.begin_time) }}</td>
                  <td class="m-td">{{ GetDatetimeString(item.due_time) }}</td>
                  <td class="m-td" v-b-tooltip.hover.bottom :title="item.operator_name">{{ item.operator_account }}</td>
                  <td class="m-td">
                    <span class="float-left mr-2">{{ GetDateString(item.finished_time) || "-" }}</span>
                    <div
                      v-if="item.finished_time"
                      class="round-btn float-left mr-2 grey"
                      role="button"
                      @click="showModal('taskDetail', item)"
                      v-b-tooltip.hover.bottom
                      :title="$t('TASK.TASK_DETAIL')"
                    >
                      <font-awesome-icon icon="ellipsis-h" />
                    </div>
                  </td>
                  <td class="m-td">{{ item.equipment_serial || "" }}</td>
                  <td class="m-td">
                    <div
                      class="round-btn float-left mr-2 blue-2"
                      role="button"
                      @click="showEdit(item)"
                      v-b-tooltip.hover.bottom
                      :title="$t('GENERAL.EDIT')"
                    >
                      <font-awesome-icon icon="edit" />
                    </div>
                    <div
                      class="round-btn float-left mr-2 blue-3"
                      role="button"
                      @click="showClone(item)"
                      v-b-tooltip.hover.bottom
                      :title="$t('GENERAL.COPY')"
                    >
                      <font-awesome-icon icon="clone" />
                    </div>
                    <div
                      class="round-btn float-left mr-2 blue-4 red-hover"
                      role="button"
                      @click="confirmDeleteTask(item)"
                      v-b-tooltip.hover.bottom
                      :title="$t('GENERAL.DELETE')"
                    >
                      <font-awesome-icon icon="trash-alt" />
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

    <TaskReport
      v-if="modalType.taskReport"
      :selectedData="selectedData"
      @cancel="closeModal('taskReport', false)"
    ></TaskReport>

    <CreateTask
      v-if="modalType.createTask"
      :selectedData="selectedData"
      @ok="closeModal('createTask', true)"
      @cancel="closeModal('createTask', false)"
    ></CreateTask>

    <UpdateTask
      v-if="modalType.updateTask"
      :selectedData="selectedData"
      @ok="closeModal('updateTask', true)"
      @cancel="closeModal('updateTask', false)"
    ></UpdateTask>

    <ShowDesc
      v-if="modalType.showDesc"
      :selectedData="selectedData"
      :type="'task'"
      @cancel="closeModal('showDesc', false)"
    ></ShowDesc>

    <TaskDetail
      v-if="modalType.taskDetail"
      :selectedData="selectedData"
      @cancel="closeModal('taskDetail', false)"
    ></TaskDetail>
  </div>
</template>

<script>
  import Header from "@/components/Header";
  import Sidebar from "@/components/Sidebar";
  import TaskReport from "@/components/modal/TaskReport";
  import CreateTask from "@/components/modal/CreateTask";
  import UpdateTask from "@/components/modal/UpdateTask";
  import ShowDesc from "@/components/modal/ShowDesc";
  import TaskDetail from "@/components/modal/TaskDetail";
  import { GetDateString, GetDatetimeString } from "@/utils/date";

  export default {
    components: {
      Header,
      Sidebar,
      TaskReport,
      CreateTask,
      UpdateTask,
      ShowDesc,
      TaskDetail,
    },
    data: () => ({
      modalType: {
        taskReport: false,
        createTask: false,
        updateTask: false,
        showDesc: false,
        taskDetail: false,
        showCloneTask: false,
      },
      searchTypeList: [
        { value: 0, text: "TASK.BY_TASK" },
        { value: 1, text: "WF_M.BY_WF" },
        { value: 2, text: "TASK.BY_EQUIPMENT_SN" },
      ],
      statusTypeList: [
        { value: 0, text: "TASK.STATUS" },
        { value: 1, text: "TASK.DONE" },
        { value: 2, text: "TASK.UNDONE" },
        { value: 3, text: "TASK.OVERDUE" },
        { value: 4, text: "TASK.OVERDUE_DONE" },
      ],
      creatorList: [{ value: 0, text: "TASK.BUILT_BY" }],
      searchType: 0,
      keyword: "",
      isSearchByKeyword: false,
      statusType: 0,
      creator: 0,
      isSidebarMinified: false,
      isMenuMinified: false,
      isContentMinified: false,
      selectedData: null,
      taskList: [],
      targetUuid: null,
      page: 1,
      perPage: 10,
      totalCount: 0,
    }),

    mounted() {
      this.getTaskList();
      this.getCreatorList();
    },

    methods: {
      GetDateString,
      GetDatetimeString,

      GetStatusString(status) {
        let x = this.statusTypeList.find((item) => item.value === status);
        if (x) return this.$t(x.text);
        else return "";
      },

      search() {
        if (this.keyword == "" && this.statusType == 0 && this.creator == 0) {
          this.isSearchByKeyword = false;
        } else this.isSearchByKeyword = true;
        this.page == 1 ? this.getTaskList() : (this.page = 1);
      },

      getTaskList() {
        let data = {
          page: this.page,
          per_page: this.perPage,
        };
        if (this.searchType == 0) {
          if (this.keyword) data.keyword = this.keyword;
          if (this.statusType) data.status = this.statusType;
          if (this.creator) data.creator_account = this.creator;
        } else if (this.searchType == 1) {
          data.workflow_keyword = this.keyword;
        } else if (this.searchType == 2) {
          data.equipment_keyword = this.keyword;
        }

        this.apiGet("workflow/task_list", data).then(({ data }) => {
          this.taskList = data.tasks;
          this.totalCount = data.total;
        });
      },

      getCreatorList() {
        this.apiGet("enterprise/user_list").then(({ data }) => {
          this.creatorList = [
            { value: 0, text: "TASK.BUILT_BY" },
            ...data.users.map((u) => {
              return {
                value: u.account,
                text: u.account,
              };
            }),
          ];
        });
      },

      showEdit(item) {
        this.showModal("updateTask", item);
      },

      taskDetail(item) {
        this.showModal("taskDetail", item);
      },

      showClone(item) {
        this.showModal("createTask", item);
      },

      showModal(type, data) {
        if (data) this.selectedData = data;
        this.modalType[type] = true;
      },

      closeModal(type, reload) {
        if (reload) this.getTaskList();
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

      deleteTask(uuid) {
        this.apiPost("workflow/delete_task", { uuid }).then(() => {
          this.getTaskList();
        });
      },

      confirmDeleteTask(item) {
        this.$confirm(this.$t("TASK.DELETE_TASK"), this.$t("TASK.DELETE_TASK_CONFIRM"), () => {
          this.deleteTask(item.uuid);
        });
      },

      changePage() {
        if (this.isSearchByKeyword == false) {
          this.keyword = "";
          this.statusType = 0;
          this.creator = 0;
        }
        this.getTaskList();
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .workflow-management {
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

        .select-component {
          font-size: 14px;
          height: 38px;
          width: fit-content;
          max-width: 200px;
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

                .red-hover {
                  &:hover {
                    background-color: $red;
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
