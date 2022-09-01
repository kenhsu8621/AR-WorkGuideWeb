<template>
  <div class="workflow-record">
    <Header :title="$t('RECORD.TITLE')" />
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
              v-model="keyword"
              type="text"
              class="form-control search-input"
              :placeholder="$t('RECORD.SEARCH_PH_0')"
              @focus="userKeyword = null"
            />
          </div>
        </div>

        <div v-if="searchType == 1">
          <div class="form-group mr-2 mt-4 float-left">
            <input
              v-model="userKeyword"
              type="text"
              class="form-control search-input"
              :placeholder="$t('RECORD.SEARCH_PH_1')"
              @focus="keyword = null"
            />
          </div>
        </div>

        <div v-if="searchType == 2">
          <b-form-select v-model="equipmentType" class="select-component mr-2 mt-4 float-left">
            <b-form-select-option :key="item.value" v-for="item of equipmentTypeList" :value="item.value">{{
              $t(item.text)
            }}</b-form-select-option>
          </b-form-select>

          <b-form-select v-model="equipment" class="select-component mr-2 mt-4 float-left">
            <b-form-select-option :key="item.value" v-for="item of equipmentList" :value="item.value">{{
              $t(item.text)
            }}</b-form-select-option>
          </b-form-select>
        </div>

        <div v-if="searchType == 3">
          <date-picker
            v-model="timeRange"
            class="mr-2 mt-4 float-left"
            range
            value-type="format"
            format="YYYY-MM-DD"
            :clearable="false"
            @change="updateRange(timeRange)"
          ></date-picker>
        </div>

        <button class="btn search-btn mt-4" @click="search">{{ $t("RECORD.SEARCH") }}</button>
      </div>

      <div class="lower-section mt-4 mx-auto">
        <div class="m-table-container">
          <table class="m-table">
            <thead>
              <tr class="m-tr tr-item">
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("GENERAL.WF_NAME") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("GENERAL.VERSION") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("RECORD.ACCOUNT") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("RECORD.USERNAME") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("RECORD.START_TIME") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("RECORD.END_TIME") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("RECORD.LAST") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("RECORD.DEVICE_ID") }}</span>
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
              <template v-for="(item, index) in recordList">
                <tr class="m-tr tr-list" :key="index + 'first'">
                  <td class="m-td">{{ item.wf_name }}</td>
                  <td class="m-td">{{ item.version }}</td>
                  <td class="m-td">{{ item.account }}</td>
                  <td class="m-td">{{ item.username }}</td>
                  <td class="m-td">{{ GetDatetimeString(item.started_time) }}</td>
                  <td class="m-td">{{ GetDatetimeString(item.ended_time) }}</td>
                  <td class="m-td">{{ item.duration }}</td>
                  <td class="m-td">
                    {{ item.equipment_uuid || "-" }}
                  </td>
                  <td class="m-td">
                    <div
                      class="round-btn float-left mr-2 blue red-hover"
                      role="button"
                      @click="confirmDelete(item)"
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
                                <span>{{ $t("RECORD.STEP") }}</span>
                              </div>
                            </th>
                            <th class="m-th">
                              <div class="m-th-content">
                                <span>{{ $t("RECORD.STEP_TITLE") }}</span>
                              </div>
                            </th>
                            <th class="m-th">
                              <div class="m-th-content">
                                <span>{{ $t("RECORD.STEP_CHECK") }}</span>
                              </div>
                            </th>
                            <th class="m-th">
                              <div class="m-th-content">
                                <span>{{ $t("RECORD.STEP_RECORD") }}</span>
                              </div>
                            </th>
                            <th class="m-th">
                              <div class="m-th-content">
                                <span>{{ $t("RECORD.FINISH_DATE") }}</span>
                              </div>
                            </th>
                            <th class="m-th">
                              <div class="m-th-content">
                                <span>{{ $t("RECORD.EXECUTE_TIMES") }}</span>
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody v-if="!item.subList || item.subList.length == 0">
                          <tr class="m-tr sub-tr-list">
                            <td class="m-td sub-td p-0">
                              <div class="left-border"></div>
                            </td>
                            <td class="m-td" colspan="6">{{ $t("RECORD.EMPTY_STEP_DATA") }}</td>
                          </tr>
                        </tbody>
                        <tbody v-if="item.subList && item.subList.length > 0">
                          <tr class="m-tr sub-tr-list" v-for="(sub_item, index) in item.subList" :key="index">
                            <td class="m-td sub-td p-0">
                              <div class="left-border"></div>
                            </td>

                            <td class="m-td">{{ sub_item.serial }}</td>
                            <td class="m-td">{{ sub_item.name }}</td>
                            <td class="m-td">
                              <div v-if="sub_item.record_type == 0">
                                <span style="margin-left: 20px;">- </span>
                              </div>
                              <div
                                class="round-btn white"
                                v-b-tooltip.hover.right
                                :title="$t('RECORD.SKIP')"
                                v-if="sub_item.record_type != 0 && sub_item.result == 0"
                              >
                                <img src="~@/assets/images/next.svg" />
                              </div>

                              <div
                                class="round-btn green"
                                v-b-tooltip.hover.right
                                :title="$t('RECORD.PASS')"
                                v-if="sub_item.record_type != 0 && sub_item.result == 1"
                              >
                                <font-awesome-icon icon="check" />
                              </div>

                              <div
                                class="round-btn red"
                                v-b-tooltip.hover.right
                                :title="$t('RECORD.FAIL')"
                                v-if="sub_item.record_type != 0 && sub_item.result == 2"
                              >
                                <font-awesome-icon icon="times" />
                              </div>

                              <div
                                class="round-btn white"
                                v-b-tooltip.hover.right
                                :title="$t('GENERAL.NEXT')"
                                v-if="sub_item.result == 3"
                              >
                                <img src="~@/assets/images/skip.svg" />
                              </div>
                            </td>
                            <td class="m-td">
                              <div
                                v-if="sub_item.pic"
                                class="round-btn float-left mr-2 blue"
                                v-b-tooltip.hover.right
                                :title="$t('RECORD.IMAGE')"
                                role="button"
                                @click="showModal('imageViewer', sub_item)"
                              >
                                <font-awesome-icon icon="image" />
                              </div>
                              <div
                                v-if="sub_item.vid"
                                class="round-btn float-left mr-2 blue"
                                v-b-tooltip.hover.right
                                :title="$t('RECORD.VIDEO')"
                                role="button"
                                @click="showModal('imageViewer', sub_item)"
                              >
                                <font-awesome-icon icon="video" />
                              </div>
                              <span v-if="sub_item.is_record && !sub_item.pic && !sub_item.vid">{{
                                $t("RECORD.EMPTY_RECORD")
                              }}</span
                              ><span v-if="!sub_item.is_record" style="padding: 20px;">-</span>
                            </td>
                            <td class="m-td">
                              {{ GetDatetimeString(sub_item.finished_time) }}
                            </td>
                            <td class="m-td">
                              {{ sub_item.execute_times }}
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

    <ImageViewer
      v-if="modalType.imageViewer"
      :selectedData="selectedData"
      @ok="closeModal('imageViewer', true)"
      @cancel="closeModal('imageViewer', false)"
    ></ImageViewer>
  </div>
</template>

<script>
  import Header from "@/components/Header";
  import Sidebar from "@/components/Sidebar";
  import ImageViewer from "@/components/modal/ImageViewer";
  import DatePicker from "vue2-datepicker";
  import "vue2-datepicker/index.css";
  import { GetDatetimeString, GetHmsByTotalSeconds } from "@/utils/date";

  export default {
    components: {
      Header,
      Sidebar,
      DatePicker,
      ImageViewer,
    },
    data: () => ({
      modalType: {
        imageViewer: false,
      },
      searchTypeList: [
        { value: 0, text: "RECORD.BY_WF" },
        { value: 1, text: "RECORD.BY_USER" },
        { value: 2, text: "GENERAL.BY_RELATED_EQUIPMENT" },
        { value: 3, text: "RECORD.BY_DATE_DURATION" },
      ],
      equipmentTypeList: [
        { value: 0, text: "GENERAL.EQUIPMENT_TYPE" },
        { value: 1, text: "RECORD.PRODUCTION" },
        { value: 2, text: "RECORD.REPAIR" },
        { value: 3, text: "RECORD.SERVICE" },
        { value: 4, text: "RECORD.CLEAN" },
      ],
      equipmentList: [{ value: 0, text: "GENERAL.ALL_EQUIPMENTS" }],
      recordList: [],
      recordDetail: [],
      keyword: "",
      userKeyword: "",
      isSearchByKeyword: false,
      searchType: 0,
      equipmentType: 0,
      equipment: 0,
      timeRange: ["2021-01-01", "2021-09-01"],
      startTime: null,
      endTime: null,
      isSidebarMinified: false,
      isMenuMinified: false,
      isContentMinified: false,
      selectedData: null,
      page: 1,
      perPage: 10,
      totalCount: 0,
    }),

    mounted() {
      this.getRecordList();
      this.getEquipmentFullList();
    },

    methods: {
      GetDatetimeString,
      GetHmsByTotalSeconds,
      search() {
        if (this.keyword == "" && this.userKeyword == "" && this.equipmentType == 0 && this.equipment == 0) {
          this.isSearchByKeyword = false;
        } else this.isSearchByKeyword = true;
        this.page == 1 ? this.getRecordList() : (this.page = 1);
      },

      getRecordList() {
        let data = {
          page: this.page,
          per_page: this.perPage,
          keyword: this.keyword || null,
          user_keyword: this.userKeyword || null,
          start_time: this.startTime,
          end_time: this.endTime,
        };
        this.apiGet("workflow/record_list", data).then(({ data }) => {
          this.recordList = data.records;
          this.totalCount = data.total;
          for (let record of this.recordList) {
            record.visible = false;
            record.duration = GetHmsByTotalSeconds((record.duration || record.ended_time - record.started_time) / 1000); // Return is HH : MM : SS
          }
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

      deleteRecord(uuid) {
        this.apiPost("workflow/delete_record", { uuid }).then(() => {
          this.getRecordList();
        });
      },

      updateRange(timeRange) {
        this.startTime = timeRange[0];
        this.endTime = timeRange[1];
      },

      showModal(type, data) {
        if (data) this.selectedData = data;
        this.modalType[type] = true;
      },

      closeModal(type, reload) {
        if (reload) this.getRecordList();
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
        this.recordList.__ob__.dep.notify();

        if (!item.visible) return;
        let data = { uuid: item.uuid };
        this.apiGet("workflow/record_detail", data).then(({ data }) => {
          item.subList = data.steps;
          console.log(item.subList);
          this.recordList.__ob__.dep.notify();
        });
      },

      confirmDelete(item) {
        this.$confirm(this.$t("RECORD.DELETE_WORKFLOW"), this.$t("RECORD.DELETE_WORKFLOW_CONFIRM"), () => {
          this.deleteRecord(item.uuid);
        });
      },

      changePage() {
        if (this.isSearchByKeyword == false) {
          this.keyword = "";
          this.userKeyword = "";
          this.equipmentType = this.equipmentTypeList[0].type_uuid;
          this.equipment = 0;
        }
        this.getRecordList();
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .workflow-record {
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

        /deep/ .mx-datepicker-range {
          width: 210px;
        }

        /deep/ .mx-input {
          height: 38px;
          cursor: pointer;
        }

        .search-btn {
          font-size: 14px;
          height: 38px;
          border: 1px solid $blue;
          color: $blue;
          background-color: aliceblue;
          font-weight: bold;
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
                  padding-left: 5px;
                  margin-left: 15px;
                  width: 24px;
                  height: 24px;
                  color: #fff;
                  background-color: #7b7b7b;
                  border-radius: 50%;

                  img {
                    margin-top: -5px;
                    width: 12px;
                  }
                }

                .blue {
                  background-color: $blue;
                }

                .green {
                  background-color: $green;
                }

                .red {
                  background-color: $red;
                  padding-left: 7px;
                }

                .white {
                  color: $grey;
                  background-color: #fff;
                  border: 1px solid $grey;
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
        // left: 15vw;
        left: calc(15vw - 1px);
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
        // left: 4vw;
        left: calc(4vw - 1px);
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
