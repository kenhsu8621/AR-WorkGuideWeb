<template>
  <div class="home">
    <Header :title="$t('HOME.TITLE')" />
    <div class="main-content">
      <div class="upper-section mx-auto">
        <b-form-select v-model="searchType" class="select-component mr-2 mt-4 float-left">
          <b-form-select-option :key="item.value" v-for="item of searchTypeList" :value="item.value">{{
            item.text
          }}</b-form-select-option>
        </b-form-select>

        <button class="btn search-btn mt-4" @click="search">
          {{ $t("WF_M.SEARCH") }}
        </button>

        <button class="btn create-btn mt-4 float-right" @click="showModal('createAppFile')">
          新增檔案
        </button>
      </div>
      <div class="lower-section mt-4 mx-auto">
        <div class="m-table-container">
          <table class="m-table">
            <thead>
              <tr class="m-tr tr-item">
                <th class="m-th">
                  <div class="m-th-content">
                    <span>類型</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>版號</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>下載</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>說明</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>新增時間</span>
                  </div>
                </th>
                <th class="m-th">
                  <div class="m-th-content">
                    <span>刪除</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item, index) in versionList">
                <tr class="m-tr tr-list" :key="index + 'first'">
                  <td class="m-td">{{ GetTypeText(item.type) }}</td>
                  <td class="m-td">{{ item.version }}</td>
                  <td class="m-td">
                    <a :href="item.file_path" target="_blank"
                      ><font-awesome-icon icon="file-download" class="download"
                    /></a>
                  </td>
                  <td class="m-td">{{ item.description }}</td>
                  <td class="m-td">{{ GetDatetimeString(item.created_time) }}</td>
                  <td class="m-td">
                    <font-awesome-icon
                      role="button"
                      icon="trash-alt"
                      class="delete"
                      @click="confirmClick(item.type, item.version)"
                    />
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
        @paginate="getAppVersionList"
      />
    </div>
    <CreateAppFile
      v-if="modalType.createAppFile"
      :typeList="searchTypeList"
      @ok="closeModal('createAppFile', true)"
      @cancel="closeModal('createAppFile', false)"
    ></CreateAppFile>
  </div>
</template>

<script>
  import Header from "@/components/Header";
  import { GetDatetimeString } from "@/utils/date";
  import CreateAppFile from "@/components/modal/CreateAppFile";

  export default {
    components: {
      Header,
      CreateAppFile,
    },
    data: () => ({
      modalType: {
        createAppFile: false,
      },
      page: 1,
      perPage: 10,
      totalCount: 0,
      versionList: [],
      searchType: 0,
      searchTypeList: [
        { value: 0, text: "全部" },
        { value: 1, text: "Android" },
        { value: 2, text: "iOS" },
        { value: 3, text: "RealWear" },
        { value: 4, text: "Other Glasses" },
        { value: 5, text: "ICAM DPAD" },
        { value: 6, text: "ICAM PHONE" },
        { value: 7, text: "UCAM PHONE" },
        { value: 8, text: "ICAM DPAD RA" },
        { value: 9, text: "ICAM PHONE RA" },
        { value: 10, text: "UCAM PHONE RA" },
      ],
    }),
    mounted() {
      this.getAppVersionList();
    },
    methods: {
      GetDatetimeString,
      GetTypeText(searchType) {
        if (searchType == 1) return "Android";
        else if (searchType == 2) return "iOS";
        else if (searchType == 3) return "RealWear";
        else if (searchType == 4) return "Other Glasses";
        else if (searchType == 5) return "ICAM DPAD";
        else if (searchType == 6) return "ICAM PHONE";
        else if (searchType == 7) return "UCAM PHONE";
        else if (searchType == 8) return "ICAM DPAD RA";
        else if (searchType == 9) return "ICAM PHONE RA";
        else if (searchType == 10) return "UCAM PHONE RA";
        else return "";
      },
      search() {
        this.page == 1 ? this.getAppVersionList() : (this.page = 1);
      },
      getAppVersionList() {
        let data = { type: this.searchType || null, page: this.page, per_page: this.perPage };
        this.apiGet("maintenance/get_app_version_list", data).then(({ data }) => {
          for (let item of data.versions) {
            item.file_path = `https://${process.env.VUE_APP_STORAGE_URL}/uuid?uuid=${item.file_path}`;
          }
          this.versionList = data.versions;
          this.totalCount = data.total;
        });
      },
      showModal(type, data) {
        if (data) this.selectedData = data;
        this.modalType[type] = true;
      },

      closeModal(type, reload) {
        if (reload) this.search();
        this.modalType[type] = false;
        this.selectedData = null;
      },
      confirmClick(type, version) {
        if (confirm(`確定刪除${this.GetTypeText(type)} 版本 ${version}`)) {
          this.apiPost("maintenance/delete_app_version", { type, version }).then(() => {
            this.search();
          });
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .home {
    padding-top: 60px;

    .main-content {
      float: right;
      width: 100%;
      height: calc(100vh - 60px);
      box-shadow: rgba(17, 17, 26, 0.05) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px;
      z-index: 9;
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

                .download {
                  font-size: 20px;
                  margin-left: 5px;
                  color: $blue;

                  &:hover {
                    color: $blueHover;
                  }
                }
                .edit {
                  font-size: 20px;
                  margin-left: 5px;
                  color: $blue;

                  &:hover {
                    color: $blueHover;
                  }
                }

                .delete {
                  font-size: 20px;
                  margin-left: 5px;
                  color: $red;

                  &:hover {
                    color: $redHover;
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

      .minified-sidebar {
        background-color: #abcbe9;
        left: 4vw;
      }
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
