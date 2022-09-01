<template>
  <div class="workflow-management">
    <Header :title="$t('WF_M.TITLE')" />
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
              :placeholder="$t('WF_M.SEARCH_PH')"
              v-model="keyword"
            />
          </div>

          <b-form-select v-model="workflowType" class="select-component mr-2 mt-4 float-left">
            <b-form-select-option :key="item.value" v-for="(item, index) of workflowTypeList" :value="item.value">
              {{ index == 0 ? $t(item.text) : item.text }}
            </b-form-select-option>
          </b-form-select>

          <b-form-select v-model="statusType" class="select-component mr-2 mt-4 float-left">
            <b-form-select-option :key="item.value" v-for="item of statusTypeList" :value="item.value">
              {{ $t(item.text) }}
            </b-form-select-option>
          </b-form-select>

          <b-form-select v-model="expert" class="select-component mr-2 mt-4 float-left">
            <b-form-select-option :key="item.value" v-for="(item, index) of expertList" :value="item.value">
              {{ index == 0 ? $t(item.text) : item.text }}
            </b-form-select-option>
          </b-form-select>
        </div>

        <div v-if="searchType == 1">
          <b-form-select v-model="equipmentType" class="select-component mr-2 mt-4 float-left">
            <b-form-select-option :key="item.value" v-for="(item, index) of equipmentTypeList" :value="item.value">
              {{ index == 0 ? $t(item.text) : item.text }}
            </b-form-select-option>
          </b-form-select>

          <b-form-select v-model="equipment" class="select-component mr-2 mt-4 float-left">
            <b-form-select-option :key="item.value" v-for="(item, index) of equipmentList" :value="item.value">
              {{ index == 0 ? $t(item.text) : item.text }}
            </b-form-select-option>
          </b-form-select>
        </div>

        <button class="btn search-btn mt-4" @click="search">
          {{ $t("WF_M.SEARCH") }}
        </button>

        <button class="btn create-btn mt-4 float-right" @click="showModal('upsertWorkflow')">
          {{ $t("WF_M.ADD_WF") }}
        </button>
      </div>
      <div class="lower-section mt-4 mx-auto">
        <div class="m-table-container">
          <table class="m-table">
            <thead>
              <tr class="m-tr tr-item">
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("WF_M.WF_CODE") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("GENERAL.WF_NAME") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("WF_M.TYPE") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("GENERAL.VERSION") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("WF_M.STATUS") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("WF_M.EXPERT") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("WF_M.CREATED_DATE") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("WF_M.BUILT_BY") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("WF_M.EXECUTION_COUNT") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("WF_M.LAST_UPDATE") }}</span>
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
              <template v-for="(item, index) in workflowList">
                <tr class="m-tr tr-list" :key="index + 'first'">
                  <td class="m-td">{{ item.uuid }}</td>
                  <td class="m-td">
                    <span class="float-left mr-2">{{ item.name }}</span>
                    <div
                      class="round-btn float-left mr-2 grey"
                      role="button"
                      @click="showModal('showDesc', item)"
                      v-b-tooltip.hover.bottom
                      :title="$t('WF_M.WF_DESC')"
                    >
                      <font-awesome-icon icon="ellipsis-h" />
                    </div>
                  </td>
                  <td class="m-td">{{ item.type_name }}</td>
                  <td class="m-td" v-if="item.status != 2">V{{ item.version }}</td>
                  <td class="m-td" v-if="item.status == 2">-</td>
                  <td class="m-td">{{ GetStatusString(item.status) }}</td>
                  <td class="m-td" v-b-tooltip.hover.bottom :title="item.expert_name">
                    {{ item.expert_account }}
                  </td>
                  <td class="m-td">{{ GetDateString(item.created_time) }}</td>
                  <td class="m-td" v-b-tooltip.hover.bottom :title="item.creator_name">{{ item.creator_account }}</td>
                  <td class="m-td">{{ item.execute_times }}</td>
                  <td class="m-td">
                    <span class="float-left mr-2">{{ item.workflow_edit_record }}</span>
                    <div
                      class="round-btn float-left mr-2 blue-1"
                      role="button"
                      @click="showEdit(item)"
                      v-b-tooltip.hover.bottom
                      :title="$t('WF_M.EDIT')"
                    >
                      <font-awesome-icon icon="edit" />
                    </div>
                  </td>
                  <td class="m-td">
                    <div
                      class="round-btn float-left mr-2 blue-1"
                      role="button"
                      @click="showQRCodeList(item)"
                      v-b-tooltip.hover.bottom
                      :title="$t('WF_M.QRCODE_LIST')"
                    >
                      <font-awesome-icon icon="qrcode" />
                    </div>
                    <div
                      class="round-btn float-left mr-2 blue-2"
                      role="button"
                      @click="showUpsert(item)"
                      v-b-tooltip.hover.bottom
                      :title="$t('GENERAL.SETTINGS')"
                    >
                      <font-awesome-icon icon="cog" />
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
                      @click="confirmDeleteWorkflow(item)"
                      v-b-tooltip.hover.bottom
                      :title="$t('GENERAL.DELETE')"
                    >
                      <font-awesome-icon icon="trash-alt" />
                    </div>
                    <div class="round-btn float-right mr-2 grey" role="button" @click="toggleVisible(item)">
                      <font-awesome-icon v-if="item.visible" icon="chevron-up" />
                      <font-awesome-icon v-if="!item.visible" icon="chevron-down" />
                    </div>
                  </td>
                </tr>

                <!-- 第二層 table -->
                <transition name="slide-fade" :key="index + 'second'">
                  <tr class="m-tr tr-list" v-if="item.visible">
                    <td class="text-right p-0" colspan="20">
                      <table class="sub-table">
                        <thead>
                          <tr class="m-tr sub-tr-item">
                            <th class="m-th">
                              <div class="m-th-content"><span></span></div>
                            </th>
                            <th class="m-th">
                              <div class="m-th-content">
                                <span>{{ $t("GENERAL.VERSION") }}</span>
                              </div>
                            </th>
                            <th class="m-th">
                              <div class="m-th-content">
                                <span>{{ $t("WF_M.STATUS") }}</span>
                              </div>
                            </th>
                            <th class="m-th">
                              <div class="m-th-content">
                                <span>{{ $t("WF_M.PUBLICATION_DATE") }}</span>
                              </div>
                            </th>
                            <th class="m-th">
                              <div class="m-th-content">
                                <span>{{ $t("WF_M.BUILT_BY") }}</span>
                              </div>
                            </th>
                            <th class="m-th">
                              <div class="m-th-content">
                                <span>{{ $t("WF_M.EXECUTION_COUNT") }}</span>
                              </div>
                            </th>
                            <th class="m-th">
                              <div class="m-th-content">
                                <span>{{ $t("WF_M.VERSION_DESC") }}</span>
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
                          <tr v-if="item.subList && item.subList.length == 0">
                            <td colspan="8" class="text-center">{{ $t("WF_M.EMPTY_WF_DATA") }}</td>
                          </tr>
                          <tr class="m-tr sub-tr-list" v-for="(ver, index) in item.subList" :key="index">
                            <td class="m-td sub-td p-0">
                              <div class="left-border"></div>
                            </td>
                            <td class="m-td">V{{ ver.version }}</td>
                            <td class="m-td">{{ GetStatusString(ver.status) }}</td>
                            <td class="m-td">{{ GetDateString(ver.created_time) }}</td>
                            <td class="m-td" v-b-tooltip.hover.bottom :title="ver.creator_name">
                              {{ ver.creator_account }}
                            </td>
                            <td class="m-td">{{ ver.execute_times }}</td>
                            <td class="m-td">
                              <span class="float-left mr-2">{{ ver.description }}</span>
                              <div
                                class="round-btn float-left mr-2 grey"
                                role="button"
                                @click="showModal('showVersionDesc', { name: item.name, description: ver.description })"
                                v-b-tooltip.hover.bottom
                                :title="$t('WF_M.VERSION_DESC')"
                              >
                                <font-awesome-icon icon="ellipsis-h" />
                              </div>
                            </td>
                            <td class="m-td">
                              <div
                                class="round-btn float-left mr-2 blue-3 red-hover"
                                role="button"
                                @click="confirmDeleteVersion(item, ver)"
                                v-b-tooltip.hover.bottom
                                :title="$t('GENERAL.DELETE')"
                              >
                                <font-awesome-icon icon="trash-alt" />
                              </div>
                              <div
                                class="round-btn float-left mr-2 blue-4 red-hover"
                                role="button"
                                @click="
                                  (item.status == 0 ? confirmToggleActiveVersion : toggleActiveVersion)(item, ver)
                                "
                                v-b-tooltip.hover.bottom
                                :title="ver.status == 0 ? $t('WF_M.UNPUBLISH') : $t('WF_M.PUBLISH')"
                              >
                                <font-awesome-icon :icon="ver.status == 0 ? 'store-slash' : 'store'" />
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="sub-bottom-edge"></div>
                    </td>
                  </tr>
                </transition>
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

    <UpsertWorkflow
      v-if="modalType.upsertWorkflow"
      :workflowTypeList="workflowTypeList"
      :equipmentTypeList="equipmentTypeList"
      :expertList="expertList"
      :selectedData="selectedData"
      @ok="closeModal('upsertWorkflow', true)"
      @cancel="closeModal('upsertWorkflow', false)"
    ></UpsertWorkflow>

    <ShowDesc
      v-if="modalType.showDesc"
      :selectedData="selectedData"
      :type="'wf'"
      @cancel="closeModal('showDesc', false)"
    ></ShowDesc>

    <ShowDesc
      v-if="modalType.showVersionDesc"
      :selectedData="selectedData"
      @cancel="closeModal('showVersionDesc', false)"
    ></ShowDesc>

    <ShowQRCodeList
      v-if="modalType.showQRCodeList"
      :selectedData="selectedData"
      @cancel="closeModal('showQRCodeList', false)"
    ></ShowQRCodeList>

    <ShowCloneWorkflow
      v-if="modalType.showCloneWorkflow"
      :selectedData="selectedData"
      @ok="closeModal('showCloneWorkflow', true)"
      @cancel="closeModal('showCloneWorkflow', false)"
    ></ShowCloneWorkflow>

    <ShowEditWorkflow
      v-if="modalType.showEditWorkflow"
      :selectedData="selectedData"
      @ok="toEdit"
      @cancel="closeModal('showEditWorkflow', false)"
    ></ShowEditWorkflow>
  </div>
</template>

<script>
  import Header from "@/components/Header";
  import Sidebar from "@/components/Sidebar";
  import UpsertWorkflow from "@/components/modal/UpsertWorkflow";
  import ShowDesc from "@/components/modal/ShowDesc";
  import ShowQRCodeList from "@/components/modal/ShowQRCodeList";
  import ShowCloneWorkflow from "@/components/modal/ShowCloneWorkflow";
  import ShowEditWorkflow from "@/components/modal/ShowEditWorkflow";
  import { GetDateString } from "@/utils/date";

  export default {
    components: {
      Header,
      Sidebar,
      UpsertWorkflow,
      ShowDesc,
      ShowQRCodeList,
      ShowCloneWorkflow,
      ShowEditWorkflow,
    },
    data: () => ({
      modalType: {
        upsertWorkflow: false,
        showDesc: false,
        showQRCodeList: false,
        showCloneWorkflow: false,
        showEditWorkflow: false,
        showVersionDesc: false,
      },
      searchTypeList: [
        { value: 0, text: "WF_M.BY_WF" },
        { value: 1, text: "GENERAL.BY_RELATED_EQUIPMENT" },
      ],
      workflowTypeList: [{ value: null, text: "WF_M.WF_TYPE" }],
      equipmentTypeList: [],
      equipmentList: [{ value: null, text: "GENERAL.ALL_EQUIPMENTS" }],
      statusTypeList: [
        { value: 0, text: "WF_M.STATUS" },
        { value: 1, text: "WF_M.PUBLISHED" },
        { value: 2, text: "WF_M.UNPUBLISHED" },
      ],
      expertList: [{ value: null, text: "WF_M.CHOOSE_AN_EXPERT" }],
      searchType: 0,
      keyword: "",
      isSearchByKeyword: false,
      workflowType: null,
      equipmentType: null,
      equipment: null,
      statusType: 0,
      relatedEquipment: 0,
      expert: null,
      isSidebarMinified: false,
      isMenuMinified: false,
      isContentMinified: false,
      selectedData: null,
      workflowList: [],
      targetUuid: null,
      page: 1,
      perPage: 10,
      totalCount: 0,
    }),

    mounted() {
      this.getExpertList();
      this.getWorkflowTypeList();
      this.getEquipmentFullList();
      this.getWorkflowList();
    },

    methods: {
      GetDateString,

      GetStatusString(status) {
        if (status == 0) return this.$t("WF_M.PUBLISHED");
        if (status == 1) return this.$t("WF_M.DELETED");
        if (status == 2) return this.$t("WF_M.UNPUBLISHED");
        return "";
      },
      search() {
        if (
          this.keyword == "" &&
          !this.workflowType &&
          !this.statusType &&
          !this.expert &&
          !this.equipmentType &&
          !this.equipment
        ) {
          this.isSearchByKeyword = false;
        } else this.isSearchByKeyword = true;
        this.page == 1 ? this.getWorkflowList() : (this.page = 1);
      },

      getWorkflowList() {
        let data = { page: this.page, per_page: this.perPage };
        if (this.searchType == 0) {
          if (this.keyword) data.keyword = this.keyword;
          if (this.workflowType) data.type_uuid = this.workflowType;
          if (this.statusType) data.status = this.statusType == 1 ? 0 : 2;
          if (this.expert) data.expert_account = this.expert;
        } else if (this.searchType == 1) {
          if (this.equipmentType) data.equipment_type_uuid = this.equipmentType;
          if (this.equipment) data.equipment_uuid = this.equipment;
        }

        this.apiGet("workflow/list", data).then(({ data }) => {
          let visibles = this.workflowList.filter((w) => w.visible).map((w) => w.uuid);

          this.workflowList = data.workflows;
          this.totalCount = data.total;
          this.workflowList.filter((w) => visibles.indexOf(w.uuid) != -1).forEach((w) => this.toggleVisible(w));
        });
      },

      getWorkflowTypeList() {
        this.apiGet("workflow/type_list").then(({ data }) => {
          let workflowTypeList = [{ value: null, text: "WF_M.WF_TYPE" }];
          for (let type of data.types) {
            workflowTypeList.push({ value: type.type_uuid, text: type.type_name });
          }
          this.workflowTypeList = workflowTypeList;
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
          } else this.equipmentTypeList = [{ value: null, text: "WF_M.ALL_EQUIPMENT_TYPES" }];
        });
      },

      getExpertList() {
        this.apiGet("workflow/expert_list").then(({ data }) => {
          for (let expert of data.experts) {
            this.expertList.push({ value: expert.account, text: expert.name });
          }
        });
      },

      showUpsert(item) {
        this.apiGet("workflow/detail", { uuid: item.uuid }).then(({ data }) => {
          this.showModal("upsertWorkflow", data);
        });
      },

      showQRCodeList(item) {
        this.apiGet("workflow/detail", { uuid: item.uuid }).then(({ data }) => {
          this.showModal("showQRCodeList", data);
        });
      },

      showClone(item) {
        let data = { uuid: item.uuid };
        this.apiGet("workflow/version_list", data).then(({ data }) => {
          item.versions = data.versions;
          this.showModal("showCloneWorkflow", item);
        });
      },
      showEdit(item) {
        let data = { uuid: item.uuid };
        this.apiGet("workflow/version_list", data).then(({ data }) => {
          item.versions = data.versions;
          this.showModal("showEditWorkflow", item);
        });
      },
      toEdit(uuid, version) {
        if (version) this.$router.push({ name: "WorkflowByVersion", params: { uuid, version } });
        else this.$router.push({ name: "Workflow", params: { uuid } });
      },
      showModal(type, data) {
        if (data) this.selectedData = data;
        this.modalType[type] = true;
      },

      closeModal(type, reload) {
        if (reload) this.getWorkflowList();
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

      toggleVisible(item) {
        item.visible = !item.visible;
        this.workflowList.__ob__.dep.notify();
        if (!item.visible) return;
        let data = { uuid: item.uuid };
        this.apiGet("workflow/version_list", data).then(({ data }) => {
          if (data.versions && data.versions.length > 0) {
            item.subList = data.versions;
          } else item.subList = [];
          this.workflowList.__ob__.dep.notify();
        });
      },

      deleteWorkflow(item) {
        this.apiPost("workflow/delete", { uuid: item.uuid }).then(() => {
          this.getWorkflowList();
        });
      },

      deleteVersion(item, ver) {
        this.apiPost("workflow/update_version_status", {
          uuid: item.uuid,
          version: ver.version,
          status: 1,
        }).then(() => {
          this.getWorkflowList();
        });
      },

      toggleActiveVersion(item, ver) {
        this.apiPost("workflow/update_version_status", {
          uuid: item.uuid,
          version: ver.version,
          status: ver.status == 0 ? 2 : 0,
        }).then(() => {
          // 下架改上架
          if (item.status == 2) this.showToast();
          this.getWorkflowList();
        });
      },

      showToast() {
        this.toastCount++;
        this.$bvToast.toast("版本已上架", {
          autoHideDelay: 3000,
          toaster: "b-toaster-bottom-left",
          toastClass: "my-toast-class",
          solid: true,
          noCloseButton: true,
        });
      },
      confirmToggleActiveVersion(item, ver) {
        let title = this.$t("WF_M.UNPUBLISH_VERSION");
        let content = this.$t("WF_M.UNPUBLISH_CONFIRM");
        if (ver.status == 2) {
          title = this.$t("WF_M.PUBLISH_VERSION");
          content = `${this.$t("WF_M.PUBLISH_CONFIRM_1")}${item.version}${this.$t("WF_M.PUBLISH_CONFIRM_2")}${
            ver.version
          }？`;
        }

        this.$confirm(title, content, () => {
          this.toggleActiveVersion(item, ver);
        });
      },
      confirmDeleteWorkflow(item) {
        this.$confirm(this.$t("WF_M.DELETE_WORKFLOW"), this.$t("WF_M.DELETE_WORKFLOW_CONFIRM"), () => {
          this.deleteWorkflow(item);
        });
      },
      confirmDeleteVersion(item, ver) {
        let title = this.$t("WF_M.DELETE_PUBLISHED_VERSION");
        let content = this.$t("WF_M.DELETE_PUBLISHED_VERSION_CONFIRM");
        if (ver.status == 2) {
          title = this.$t("WF_M.DELETE_UNPUBLISHED_VERSION");
          content = `${this.$t("WF_M.PUBLISH_CONFIRM_1")}${item.name}${this.$t("WF_M.PUBLISH_CONFIRM_2")} v${
            ver.version
          } ${this.$t("WF_M.PUBLISH_CONFIRM_3")}`;
        }
        console.log(content);
        this.$confirm(title, content, () => {
          this.deleteVersion(item, ver);
        });
      },

      changePage() {
        if (this.isSearchByKeyword == false) {
          this.keyword = "";
          this.workflowType = null;
          this.statusType = 0;
          this.expert = null;
          this.equipmentType = this.equipmentTypeList[0].type_uuid;
          this.equipment = null;
        }
        this.getWorkflowList();
      },
    },
    watch: {
      equipmentType: {
        immediate: true,
        deep: true,
        handler() {
          let type = this.equipmentTypeList.find((type) => type.value == this.equipmentType);

          this.equipmentList = [{ value: null, text: "GENERAL.ALL_EQUIPMENTS" }];
          if (type) this.equipmentList.push(...type.equipments);
          this.equipment = null;
        },
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
          color: #fff;
          background-color: $darkBlue;
          border: 1px solid $darkBlue;
          height: 40px;
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

            /*第一欄第一列：左上*/
            tr:first-child th:first-child {
              border-top-left-radius: 6px;
            }

            /*最後欄第一列：右上*/
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
                max-width: 250px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

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

                /*第一欄第一列：左上*/
                tr:first-child th:first-child {
                  border-top-left-radius: 0;
                }

                /*最後欄第一列：右上*/
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
