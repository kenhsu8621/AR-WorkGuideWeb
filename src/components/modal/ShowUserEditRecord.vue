<template>
  <TemplateModal :width="40">
    <template v-slot:default>
      <div class="m-modal-title">{{ $t("MODAL.SHOW_USER_EDIT_RECORD.EDIT_RECORD") }}</div>

      <div class="form-group row">
        <div class="m-text">
          <div v-if="logList.length == 0">{{ $t("MODAL.SHOW_USER_EDIT_RECORD.EMPTY_EDIT_RECORD") }}</div>
          <div v-if="logList.length > 0">
            <div class="user-info">
              <div class="float-left">
                <strong class="title">{{ $t("MODAL.SHOW_USER_EDIT_RECORD.ACC") }} </strong> {{ selectedData.account }}
              </div>
              <div class="float-right">
                <strong class="title">{{ $t("MODAL.SHOW_USER_EDIT_RECORD.USERNAME") }} </strong>
                {{ selectedData.name }}
              </div>
            </div>
            <div class="m-table-container mt-3">
              <table class="m-table">
                <thead>
                  <tr class="m-tr tr-item">
                    <th class="m-th">
                      <div class="m-th-content">
                        <span>{{ $t("MODAL.SHOW_USER_EDIT_RECORD.EDITOR_ACC") }}</span>
                      </div>
                    </th>
                    <th class="m-th">
                      <div class="m-th-content">
                        <span>{{ $t("MODAL.SHOW_USER_EDIT_RECORD.CONTENT") }}</span>
                      </div>
                    </th>
                    <th class="m-th">
                      <div class="m-th-content">
                        <span>{{ $t("MODAL.SHOW_USER_EDIT_RECORD.TIME") }}</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, index) in logList">
                    <tr class="m-tr tr-list" :key="index">
                      <td class="m-td" v-b-tooltip.hover.bottom :title="item.operator_name">
                        <span v-if="item.operator_type === 3">{{ $t("MODAL.SHOW_USER_EDIT_RECORD.SI_ADMIN") }}</span>
                        <span v-else-if="item.is_self">{{ selectedData.account }}</span>
                        <span v-else>{{ $t("MODAL.SHOW_USER_EDIT_RECORD.ENTERPRISE_ADMIN") }}</span>
                      </td>
                      <td class="m-td">{{ stringifyData(item.data) }}</td>
                      <td class="m-td">{{ GetDatetimeString(item.time) }}</td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>

            <div class="bottom-edge">
              <canvas class="d-none" id="qrcodeCv" ref="qrcodeCv" width="400" height="440"></canvas>
            </div>
          </div>
        </div>
      </div>

      <div class="form-group row">
        <b-button class="btn-ok" @click="cancel">{{ $t("GENERAL.CLOSE") }}</b-button>
      </div>
    </template>
  </TemplateModal>
</template>

<script>
  import TemplateModal from "@/components/modal/TemplateModal";
  import { GetDatetimeString } from "@/utils/date";

  export default {
    components: {
      TemplateModal,
    },
    props: {
      selectedData: Object,
    },
    mounted() {
      this.getUserLog();
    },
    data: () => ({
      logList: [],
    }),
    methods: {
      GetDatetimeString,
      stringifyData(data) {
        let arr = [];
        for (let item of data) {
          if (item.key === "status") {
            if (item.new_value === 0) arr.push(this.$t("MODAL.SHOW_USER_EDIT_RECORD.ACTIVATE_ACCOUNT"));
            else arr.push(this.$t("MODAL.SHOW_USER_EDIT_RECORD.INACTIVATE_ACCOUNT"));
          } else if (item.key === "name") arr.push(this.$t("MODAL.SHOW_USER_EDIT_RECORD.EDIT_USERNAME"));
          else if (item.key === "email") arr.push(this.$t("MODAL.SHOW_USER_EDIT_RECORD.EDIT_EMAIL"));
          else if (item.key === "created_time") arr.push(this.$t("MODAL.SHOW_USER_EDIT_RECORD.CREATE_ACCOUNT"));
          else if (item.key === "password") arr.push(this.$t("MODAL.SHOW_USER_EDIT_RECORD.CHANGE_PASSWORD"));
        }
        return arr.join(", ");
      },
      getUserLog() {
        let data = {
          account: this.selectedData.account,
        };
        this.apiGet("enterprise/user_log", data).then(({ data }) => {
          this.logList = data.logs;
        });
      },
      cancel() {
        this.$emit("cancel");
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .m-modal-title {
    font-size: 22px;
    font-weight: bold;
  }

  .form-group {
    position: relative;
    margin: 20px auto;
    width: 100%;

    &:focus {
      border: 2px solid #4b8bcf;
      box-shadow: none;
    }

    .m-label {
      position: absolute;
      font-weight: bold;
      padding: 0 5px;
      line-height: 20px;
      top: -10px;
      left: 10px;
      background-color: #fff;
      color: $blue;
    }

    .m-text {
      width: 100%;
      height: unset;

      .user-info {
        width: 100%;
        height: 30px;
        font-size: 16px;

        .title {
          color: $blue;
        }
      }

      .m-table-container {
        font-size: 14px;
        max-height: 250px;
        overflow: scroll;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);

        &::-webkit-scrollbar {
          display: none;
        }

        .m-table {
          box-sizing: border-box;
          width: 100%;
          border-collapse: collapse;
          border-spacing: 0;

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
              padding-right: 15px;
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
                  background-color: $blue;
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
          }

          .tr-item {
            background-color: $blue;
            height: 40px;
            line-height: 40px;

            &:hover {
              background-color: $blue;
            }
          }

          .tr-list {
            height: 30px;
            line-height: 30px;
          }
        }
      }

      .bottom-edge {
        height: 6px;
        background-color: $blue;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        canvas {
          border: 1px solid #d3d3d3;
        }
      }
    }

    .pr-25 {
      padding-right: 25px;
    }

    .btn-ok {
      width: 100%;
      height: 38px;
      padding: 0 12px;
      color: #fff;
      background-color: $blue;
      border: 1px solid $blue;
      border-radius: 10px;
      box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;

      @media (max-width: 1200px) {
        margin: 5px 0;
      }
    }

    .btn-download {
      width: 32%;
      font-size: 14px;
      height: 30px;
      line-height: 14px;
      border: 1px solid $blue;
      color: $blue;
      background-color: aliceblue;
      font-weight: bold;
    }
  }
</style>
