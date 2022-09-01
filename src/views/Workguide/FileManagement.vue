<template>
  <div class="equipment-management">
    <Header :title="$t('FILE.TITLE')" />
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
              :placeholder="$t('FILE.SEARCH_PH')"
              @focus="userKeyword = null"
            />
          </div>
          <b-form-select v-model="fileType" class="select-component mr-2 mt-4 float-left">
            <b-form-select-option :key="item.value" v-for="item of fileTypeList" :value="item.value">{{
              $t(item.text)
            }}</b-form-select-option>
          </b-form-select>
        </div>

        <div v-if="searchType == 1">
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

        <button class="btn search-btn mt-4" @click="search">{{ $t("FILE.SEARCH") }}</button>

        <button class="btn create-btn mt-4 float-right" @click="showModal('upsertFile')">
          {{ $t("FILE.ADD_FILE") }}
        </button>
      </div>
      <div class="lower-section mt-4 mx-auto">
        <div class="m-table-container">
          <table class="m-table">
            <thead>
              <tr class="m-tr tr-item">
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("FILE.FILE_NAME") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("FILE.FILE_TYPE") }}</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("FILE.FILE_FORMAT") }}</span>
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
              <template v-for="(item, index) in fileList">
                <tr class="m-tr tr-list" :key="index">
                  <td class="m-td">{{ item.name }}</td>
                  <td class="m-td">
                    <span v-if="item.file_type == 1">{{ $t("FILE.EQUIPMENT_INFO") }}</span>
                    <span v-if="item.file_type == 2">{{ $t("FILE.USER_MANUAL") }}</span>
                    <span v-if="item.file_type == 3">{{ $t("FILE.TROUBLESHOOTING") }}</span>
                  </td>
                  <td class="m-td">{{ item.mimetype }}</td>
                  <td class="m-td">
                    <div
                      class="round-btn float-left mr-2 blue-2"
                      role="button"
                      @click="showEdit(item)"
                      v-b-tooltip.hover.bottom
                      :title="$t('GENERAL.SETTINGS')"
                    >
                      <font-awesome-icon icon="cog" />
                    </div>
                    <div
                      class="round-btn float-left mr-2 blue-3 red-hover"
                      role="button"
                      @click="confirmDeleteFile(item)"
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

    <UpsertFile
      v-if="modalType.upsertFile"
      :equipmentTypeList="equipmentTypeList"
      :fileTypeList="fileTypeList"
      :selectedData="selectedData"
      @ok="closeModal('upsertFile', true)"
      @cancel="closeModal('upsertFile', false)"
    ></UpsertFile>
  </div>
</template>

<script>
  import Header from "@/components/Header";
  import Sidebar from "@/components/Sidebar";
  import UpsertFile from "@/components/modal/UpsertFile";

  export default {
    components: {
      Header,
      Sidebar,
      UpsertFile,
    },
    data: () => ({
      modalType: {
        upsertFile: false,
      },
      searchTypeList: [
        { value: 0, text: "FILE.BY_FILE_NAME" },
        { value: 1, text: "GENERAL.BY_RELATED_EQUIPMENT" },
      ],
      fileTypeList: [
        { value: 0, text: "FILE.CHOOSE_FILE_TYPE" },
        { value: 1, text: "FILE.EQUIPMENT_INFO" },
        { value: 2, text: "FILE.USER_MANUAL" },
        { value: 3, text: "FILE.TROUBLESHOOTING" },
      ],
      equipmentTypeList: [{ value: 0, text: "FILE.CHOOSE_EQUIPMENT_TYPE", equipments: [] }],
      equipmentList: [{ value: 0, text: "GENERAL.ALL_EQUIPMENTS" }],
      isSidebarMinified: false,
      isMenuMinified: false,
      isContentMinified: false,
      selectedData: null,
      searchType: 0,
      keyword: "",
      isSearchByKeyword: false,
      fileType: 0,
      equipment: 0,
      equipmentType: 0,
      fileList: [],
      page: 1,
      perPage: 10,
      totalCount: 0,
    }),
    mounted() {
      this.getFileList();
      this.getEquipmentFullList();
    },
    methods: {
      search() {
        if (this.keyword == "" && this.fileType == 0 && this.equipment == 0) {
          this.isSearchByKeyword = false;
        } else this.isSearchByKeyword = true;
        this.page == 1 ? this.getFileList() : (this.page = 1);
      },

      getFileList() {
        let data = {
          page: this.page,
          per_page: this.perPage,
        };
        if (this.searchType == 0) {
          data.keyword = this.keyword || null;
          data.type = this.fileType || null;
        } else if (this.searchType == 1) {
          data.equipments = this.equipment || null;
          data.equipment_types = this.equipmentType || null;
        }
        this.apiGet("equipment/file_list", data).then(({ data }) => {
          this.fileList = data.files;
          this.totalCount = data.total;
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

      deleteFile(file_uuid) {
        this.apiPost("equipment/delete_file", { file_uuid }).then(({ data }) => {
          this.getFileList();
        });
      },

      showEdit(item) {
        this.apiGet("equipment/file_detail", { file_uuid: item.file_uuid }).then(({ data }) => {
          console.log(data);

          this.showModal("upsertFile", data);
        });
      },

      showModal(type, data) {
        if (data) this.selectedData = data;
        this.modalType[type] = true;
      },

      closeModal(type, reload) {
        if (reload) this.getFileList();
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

      confirmDeleteFile(item) {
        this.$confirm(this.$t("FILE.DELETE_FILE"), this.$t("FILE.DELETE_FILE_CONFIRM"), () => {
          this.deleteFile(item.file_uuid);
        });
      },

      changePage() {
        if (this.isSearchByKeyword == false) {
          this.keyword = "";
          this.equipment = 0;
        }
        this.getFileList();
      },
    },
    watch: {
      equipmentType: {
        immediate: true,
        deep: true,
        handler() {
          let type = this.equipmentTypeList.find((type) => type.value == this.equipmentType);

          this.equipmentList = [{ value: 0, text: this.$t("GENERAL.ALL_EQUIPMENTS") }];
          if (type) this.equipmentList.push(...type.equipments);
          this.equipment = 0;
        },
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .equipment-management {
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
