<template>
  <TemplateModal :width="33">
    <template v-slot:default>
      <div class="m-modal-title" v-b-tooltip.hover.bottom :title="selectedData.name">{{ selectedData.name }}</div>
      <div class="form-group row">
        <div class="m-label">{{ $t("MODAL.SHOW_QRCODE_LIST.WF_QRCODE") }}</div>
        <div class="m-text text-right pr-25">
          <vue-qrcode
            :value="getQRCodeContent()"
            :width="400"
            ref="qrcodeSrc"
            errorCorrectionLevel="H"
            class="d-none"
          />
          <b-button class="btn-download" @click="downloadQRCode()"
            ><font-awesome-icon icon="arrow-down" class="mr-1" />{{ $t("GENERAL.DOWNLOAD") }}</b-button
          >
        </div>
      </div>

      <div class="form-group row">
        <div class="m-label text-right">{{ $t("MODAL.SHOW_QRCODE_LIST.RELATED_EQUIPMENT_QRCODE") }}</div>
        <div class="m-text">
          <div v-if="equipmentList.length == 0">{{ $t("MODAL.SHOW_QRCODE_LIST.EMPTY_INFO") }}</div>
          <div v-if="equipmentList.length > 0">
            {{ $t("MODAL.SHOW_QRCODE_LIST.QRCODE_DESC") }}
            <div class="m-table-container mt-3">
              <table class="m-table">
                <thead>
                  <tr class="m-tr tr-item">
                    <th class="m-th">
                      <div class="m-th-content">
                        <span>{{ $t("GENERAL.EQUIPMENT_TYPE") }}</span>
                      </div>
                    </th>
                    <th class="m-th">
                      <div class="m-th-content"><span>Serial No.</span></div>
                    </th>
                    <th class="m-th">
                      <div class="m-th-content">
                        <span>{{ $t("GENERAL.OPERATION") }}</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, index) in equipmentList">
                    <tr class="m-tr tr-list" :key="index">
                      <td class="m-td">{{ item.equipment_type_name }}</td>
                      <td class="m-td">{{ item.equipment_serial }}</td>
                      <td class="m-td">
                        <vue-qrcode
                          :value="getQRCodeContent(item)"
                          :width="400"
                          :ref="item.equipment"
                          errorCorrectionLevel="H"
                          class="d-none"
                        />
                        <b-button class="btn-download w-100" @click="downloadQRCode(item)"
                          ><font-awesome-icon icon="arrow-down" class="mr-1" />{{ $t("GENERAL.DOWNLOAD") }}</b-button
                        >
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="bottom-edge d-none">
        <canvas class="d-none" id="qrcodeCv" ref="qrcodeCv" width="400" height="400"></canvas>
      </div>

      <div class="form-group row">
        <b-button class="btn-ok" @click="cancel">{{ $t("GENERAL.CLOSE") }}</b-button>
      </div>
    </template>
  </TemplateModal>
</template>

<script>
  import TemplateModal from "@/components/modal/TemplateModal";
  import VueQrcode from "vue-qrcode";

  const TITLE_SIZE = 30;
  const CONTENT_SIZE = 20;

  export default {
    components: {
      TemplateModal,
      VueQrcode,
    },
    props: {
      selectedData: Object,
    },
    mounted() {
      this.getTypeList();
    },
    data: () => ({
      equipmentList: [],
    }),
    methods: {
      getTypeList() {
        let data = {
          uuid: this.selectedData.uuid,
        };
        this.apiGet("workflow/get_equipment_list", data).then(({ data }) => {
          this.equipmentList = data.equipments;
        });
      },

      cancel() {
        this.$emit("cancel");
      },

      downloadQRCode(item) {
        let qrcode = this.$refs[item ? item.equipment : "qrcodeSrc"];
        if (!qrcode) return;
        if (Array.isArray(qrcode)) qrcode = qrcode[0];

        let canvas = this.$refs.qrcodeCv;
        let ctx = canvas.getContext("2d");
        let img = new Image();
        img.src = qrcode.dataUrl;

        img.onload = async () => {
          // 要字型大小才能正確估算
          ctx.font = `${TITLE_SIZE}px Arial`;
          let metrics = ctx.measureText(this.selectedData.name);
          let wfLineCount = Math.ceil(metrics.width / canvas.width);
          let equipmentName = item && item.equipment_type_name + "_" + item.equipment_serial;
          console.log(`equipmentName = ${equipmentName}`);
          // 要字型大小才能正確估算
          ctx.font = `${CONTENT_SIZE}px Arial`;
          metrics = ctx.measureText(equipmentName);
          console.log(metrics.width);
          let eqLineCount = Math.ceil(metrics.width / canvas.width);
          console.log(`eqLineCount = ${eqLineCount}`);
          canvas.height = canvas.width + TITLE_SIZE * (wfLineCount + 1) + CONTENT_SIZE * eqLineCount;

          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);

          ctx.font = `${TITLE_SIZE}px Arial`;
          ctx.fillStyle = "#333";
          ctx.textAlign = "center";
          console.log(wfLineCount);
          for (let i = 0; i < wfLineCount; i++) {
            let text = this.selectedData.name.substring(
              (this.selectedData.name.length / wfLineCount) * i,
              (this.selectedData.name.length / wfLineCount) * (i + 1)
            );
            console.log(text);
            ctx.fillText(text, canvas.width / 2, canvas.width + TITLE_SIZE * (i + 1));
          }

          if (item) {
            ctx.font = `${CONTENT_SIZE}px Arial`;
            ctx.fillStyle = "#666";
            for (let i = 0; i < eqLineCount; i++) {
              let text = equipmentName.substring(
                (equipmentName.length / eqLineCount) * i,
                (equipmentName.length / eqLineCount) * (i + 1)
              );
              ctx.fillText(text, canvas.width / 2, canvas.width + TITLE_SIZE * (wfLineCount + 1) + CONTENT_SIZE * i);
            }
          }

          let a = document.createElement("a");
          a.href = await canvas.toDataURL("image/jpeg");
          if (item) {
            a.download = this.selectedData.name + "_" + item.equipment_type_name + "_" + item.equipment_serial + ".jpg";
          } else {
            a.download = this.selectedData.name + ".jpg";
          }
          document.body.appendChild(a);
          a.click();
          a.remove();
        };
      },

      getQRCodeContent(item) {
        return JSON.stringify({
          t: 1,
          u: this.selectedData.uuid,
          e: (item && item.equipment) || null,
          n: this.selectedData.name,
          en: (item && item.equipment_serial) || null,
        });
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .m-modal-title {
    margin-bottom: 30px;
    padding-bottom: 15px;
    font-size: 22px;
    font-weight: bold;
    border-bottom: 2px solid #e7e7e9;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
      padding: 12px;
      border: 2px solid #e7e7e9;
      border-radius: 10px;
      min-height: 50px;

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
      padding: 0 6px;
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
