<template>
  <div class="type-management">
    <Header :title="$t('TYPE.TITLE')" />
    <Sidebar :isSidebarMinified="isSidebarMinified" />
    <div class="main-content" :class="{ maximized: isSidebarMinified }">
      <div class="upper-section mx-auto">
        <button class="btn create-btn mt-4 float-right" @click="showModal('createType')">
          {{ $t("TYPE.ADD_EQUIPMENT_TYPE") }}
        </button>
      </div>
      <div class="lower-section mt-4 mx-auto">
        <div class="m-table-container">
          <table class="m-table">
            <thead>
              <tr class="m-tr tr-item">
                <th class="m-th">
                  <div class="m-th-content">
                    <span>{{ $t("GENERAL.EQUIPMENT_TYPE") }}</span>
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
              <template v-for="(item, index) in typeList">
                <tr class="m-tr tr-list" :key="index">
                  <td class="m-td">{{ item.type_name }}</td>
                  <td class="m-td">
                    <div
                      class="round-btn float-left mr-2 blue-1"
                      role="button"
                      @click="downloadQRCode(item)"
                      v-b-tooltip.hover.bottom
                      :title="$t('EQ.QRCODE_DOWNLOAD')"
                    >
                      <vue-qrcode
                        :value="getQRCodeContent(item)"
                        :width="400"
                        :ref="item.type_uuid"
                        errorCorrectionLevel="H"
                        class="d-none"
                      />
                      <font-awesome-icon icon="qrcode" />
                    </div>
                    <div
                      class="round-btn float-left mr-2 blue-2"
                      role="button"
                      @click="showModal('updateType', item)"
                      v-b-tooltip.hover.bottom
                      :title="$t('GENERAL.SETTINGS')"
                    >
                      <font-awesome-icon icon="cog" />
                    </div>
                    <div
                      class="round-btn float-left mr-2 blue-3 red-hover"
                      role="button"
                      @click="confirmDeleteType(item)"
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
        @paginate="getTypeList"
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

    <canvas class="qrcode-cv d-none" id="qrcodeCv" ref="qrcodeCv" width="400" height="415"></canvas>

    <CreateType
      v-if="modalType.createType"
      @ok="closeModal('createType', true)"
      @cancel="closeModal('createType', false)"
    ></CreateType>

    <UpdateType
      v-if="modalType.updateType"
      :selectedData="selectedData"
      @ok="closeModal('updateType', true)"
      @cancel="closeModal('updateType', false)"
    ></UpdateType>
  </div>
</template>

<script>
  import Header from "@/components/Header";
  import Sidebar from "@/components/Sidebar";
  import CreateType from "@/components/modal/CreateType";
  import UpdateType from "@/components/modal/UpdateType";
  import VueQrcode from "vue-qrcode";

  export default {
    components: {
      Header,
      Sidebar,
      CreateType,
      UpdateType,
      VueQrcode,
    },
    data: () => ({
      modalType: {
        createType: false,
        updateType: false,
      },
      isSidebarMinified: false,
      isMenuMinified: false,
      isContentMinified: false,
      selectedData: null,
      keyword: null,
      typeList: [],
      page: 1,
      perPage: 10,
      totalCount: 0,
    }),
    mounted() {
      this.getTypeList();
    },
    methods: {
      getTypeList() {
        let data = { page: this.page, per_page: this.perPage, keyword: this.keyword || null };
        this.apiGet("equipment/type_list", data).then(({ data }) => {
          console.log(data);
          this.typeList = data.types;
          this.totalCount = data.total;
        });
      },

      createType(uuid) {
        let data = {
          name: uuid,
        };
        this.apiPost("equipment/create_type", data).then(({ data }) => {
          console.log(data);
          this.getTypeList();
        });
      },

      deleteType(type_uuid) {
        this.apiPost("equipment/delete_type", { type_uuid })
          .then(({ data }) => {
            this.getTypeList();
          })
          .catch(({ message, data }) => {
            this.confirmData.content = this.$t("TYPE.DELETE_ERR");
            this.confirmData.hideConfirmBtn = true;
          });
      },

      showModal(type, data) {
        if (data) this.selectedData = data;
        this.modalType[type] = true;
      },

      closeModal(type, reload) {
        if (reload) this.getTypeList();
        this.modalType[type] = false;
        this.confirmData.content = this.$t("TYPE.DELETE_TYPE_CONFIRM");
        this.confirmData.hideConfirmBtn = false;
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

      downloadQRCode(item) {
        console.log(item);
        let qrcode = this.$refs[item.type_uuid];
        if (!qrcode) return;
        if (Array.isArray(qrcode)) qrcode = qrcode[0];

        let canvas = this.$refs.qrcodeCv;
        let ctx = canvas.getContext("2d");
        let img = new Image();
        img.src = qrcode.dataUrl;

        img.onload = async () => {
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          ctx.font = "30px Arial";
          ctx.fillStyle = "#333";
          ctx.textAlign = "center";
          ctx.fillText(item.type_name, 200, 400);

          let a = document.createElement("a");
          a.href = await canvas.toDataURL("image/jpeg");
          a.download = item.type_name + ".jpg";
          document.body.appendChild(a);
          a.click();
          a.remove();
        };
      },

      getQRCodeContent(item) {
        return JSON.stringify({
          t: 2,
          e: item.type_uuid,
        });
      },

      confirmDeleteType(item) {
        this.$confirm(this.$t("TYPE.DELETE_TYPE"), this.$t("TYPE.DELETE_TYPE_CONFIRM"), () => {
          this.deleteType(item.type_uuid);
        });
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .type-management {
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

        .create-btn {
          font-size: 14px;
          height: 38px;
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
