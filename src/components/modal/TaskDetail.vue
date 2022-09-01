<template>
  <TemplateModal :width="40">
    <template v-slot:default>
      <div class="m-modal-title">{{ selectedData.name }}</div>

      <div class="m-modal-body" v-if="data">
        <div class="flexbox-container">
          <div class="flexbox-item item-1 p-3 mr-3">
            <div class="title">{{ $t("RECORD.START_TIME") }}</div>
            <div class="time">{{ GetDatetimeString(data.started_time) }}</div>
          </div>
          <div class="flexbox-item item-2 p-3 mr-3">
            <div class="title">{{ $t("RECORD.END_TIME") }}</div>
            <div class="time">{{ GetDatetimeString(data.ended_time) }}</div>
          </div>
          <div class="flexbox-item item-3 p-3">
            <div class="title">{{ $t("RECORD.LAST") }}</div>
            <div class="time">{{ GetHmsByTotalSeconds((data.ended_time - data.started_time) / 1000) }}</div>
          </div>
        </div>

        <div class="m-table-container mt-4">
          <table class="m-table">
            <thead>
              <tr class="m-tr tr-item">
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
              </tr>
            </thead>
            <tbody>
              <tr class="m-tr tr-list" v-for="(item, index) in data.steps" :key="index">
                <td class="m-td p-0">
                  <div class="left-border"></div>
                </td>

                <td class="m-td">{{ item.serial }}</td>
                <td class="m-td">{{ item.name }}</td>
                <td class="m-td">
                  <div v-if="item.record_type == 0">
                    <span style="margin-left: 10px;">- </span>
                  </div>
                  <div
                    class="round-btn white"
                    v-b-tooltip.hover.right
                    :title="$t('RECORD.SKIP')"
                    v-if="item.record_type != 0 && item.result == 0"
                  >
                    <img src="~@/assets/images/next.svg" />
                  </div>

                  <div
                    class="round-btn green"
                    v-b-tooltip.hover.right
                    :title="$t('RECORD.PASS')"
                    v-if="item.record_type != 0 && item.result == 1"
                  >
                    <font-awesome-icon icon="check" />
                  </div>

                  <div
                    class="round-btn red"
                    v-b-tooltip.hover.right
                    :title="$t('RECORD.FAIL')"
                    v-if="item.record_type != 0 && item.result == 2"
                    style="padding-left: 7px;"
                  >
                    <font-awesome-icon icon="times" />
                  </div>

                  <div
                    class="round-btn white"
                    v-b-tooltip.hover.right
                    :title="$t('GENERAL.NEXT')"
                    v-if="item.record_type != 0 && item.result == 3"
                  >
                    <img src="~@/assets/images/skip.svg" />
                  </div>
                </td>
                <td class="m-td">
                  <div
                    v-if="item.pic"
                    class="round-btn float-left mr-2 blue"
                    v-b-tooltip.hover.right
                    :title="$t('RECORD.IMAGE')"
                    role="button"
                    @click="showModal('imageViewer', item)"
                  >
                    <font-awesome-icon icon="image" />
                  </div>
                  <div
                    v-if="item.vid"
                    class="round-btn float-left mr-2 blue"
                    v-b-tooltip.hover.right
                    :title="$t('RECORD.VIDEO')"
                    role="button"
                    @click="showModal('imageViewer', item)"
                  >
                    <font-awesome-icon icon="video" />
                  </div>
                  <span v-if="item.is_record && !item.pic && !item.vid">{{ $t("RECORD.EMPTY_RECORD") }}</span>
                  <span v-if="!item.is_record" style="padding: 10px;">-</span>
                </td>
                <td class="m-td">{{ GetDatetimeString(item.finished_time) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="bottom-edge"></div>
      </div>

      <div class="m-modal-footer text-center">
        <b-button class="btn-ok" @click="cancel">{{ $t("GENERAL.CLOSE") }}</b-button>
      </div>

      <ImageViewer
        v-if="modalType.imageViewer"
        :selectedData="imageData"
        @ok="closeModal('imageViewer', true)"
        @cancel="closeModal('imageViewer', false)"
      ></ImageViewer>
    </template>
  </TemplateModal>
</template>

<script>
  import TemplateModal from "@/components/modal/TemplateModal";
  import { GetDatetimeString, GetHmsByTotalSeconds } from "@/utils/date";
  import ImageViewer from "@/components/modal/ImageViewer";

  export default {
    components: {
      TemplateModal,
      ImageViewer,
    },
    props: {
      selectedData: Object,
    },
    mounted() {
      this.getDetail();
    },
    data: () => ({
      modalType: {
        imageViewer: false,
      },
      imageData: null,
      data: null,
    }),
    methods: {
      GetDatetimeString,
      GetHmsByTotalSeconds,
      getDetail() {
        this.apiGet("workflow/record_detail", { uuid: this.selectedData.record_uuid }).then(({ data }) => {
          this.data = data;
          console.log(data);
        });
      },

      cancel() {
        this.$emit("cancel");
      },
      showModal(type, data) {
        if (data) {
          this.imageData = data;
        }
        this.modalType[type] = true;
      },

      closeModal(type) {
        this.modalType[type] = false;
        this.imageData = null;
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .m-modal-title {
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: bold;
  }

  .m-modal-body {
    .flexbox-container {
      display: flex;
      justify-content: center;
      align-items: center;

      .flexbox-item {
        width: 33%;
        height: 80px;
        color: #fff;
        border-radius: 15px;
        box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;

        .title {
          font-size: 18px;
          font-weight: bold;
        }

        .time {
          font-size: 14px;

          @media (max-width: 1200px) {
            font-size: 12px;
          }
        }
      }

      .item-1 {
        background-color: $green;
      }

      .item-2 {
        background-color: #ec9d68;
      }

      .item-3 {
        background-color: #488bd3;
      }
    }

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
              padding-left: 5px;
              width: 24px;
              height: 24px;
              color: #fff;
              border-radius: 50%;

              img {
                margin-top: -5px;
                width: 12px;
              }
            }
            .red {
              background-color: $red;
            }

            .blue {
              background-color: $blue;
            }

            .green {
              background-color: $green;
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

    .pr-25 {
      padding-right: 25px;
    }
  }

  .m-modal-footer {
    height: 32px;
    padding: 0 20%;
    margin: 20px 0;

    @media (max-width: 1200px) {
      height: 60px;
      margin: 30px 0;
    }

    .btn-ok {
      width: 50%;
      height: 32px;
      padding: 0 12px;
      border-radius: 16px;
      color: $blue;
      background-color: #fff;
      border: 1px solid $blue;
      box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;

      @media (max-width: 1200px) {
        width: 100%;
      }
    }
  }
</style>
