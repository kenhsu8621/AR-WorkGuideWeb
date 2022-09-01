<template>
  <TemplateModal>
    <template v-slot:default>
      <div class="m-modal-title">
        {{ form.file_uuid ? $t("MODAL.UPSERT_FILE.FILE_SETTINGS") : $t("MODAL.UPSERT_FILE.ADD_FILE") }}
      </div>
      <form @submit.prevent="upsertFile">
        <div class="form-group row">
          <div class="m-label text-right">{{ $t("MODAL.UPSERT_FILE.CHOOSE_FILE") }}</div>
          <div class="m-text">
            <div v-show="!uploadedFile">
              <div>{{ $t("MODAL.UPSERT_FILE.FILE_DESC") }}</div>
              <div>
                <button type="button" class="btn upload-btn mt-2" @click="chooseFiles">
                  <!-- TODO: 加入Drag & Drop功能 -->
                  <font-awesome-icon icon="cloud-upload-alt" />{{ $t("MODAL.UPSERT_FILE.UPLOAD_FILE") }}
                </button>
                <input
                  type="file"
                  id="file"
                  ref="file"
                  accept=".jpg, .png, .jpeg, .pdf, .mp4"
                  hidden
                  @change="onChangeFileUpload"
                />
              </div>
            </div>

            <div v-if="uploadedFile">
              <div class="upload-file row">
                <div class="col-8 pr-0">
                  <div class="mt-3">
                    {{ $t("MODAL.UPSERT_FILE.NAME") }}
                    <!-- <a
                      v-if="uploadedFile.path"
                      :href="uploadedFile.path"
                      target="_blank"
                      @mouseover="showImage(uploadedFile)"
                      @mouseleave="hoverImage = null"
                      >{{ uploadedFile.name }}</a
                    > -->
                    <a
                      :href="uploadedFile.path"
                      target="_blank"
                      @mouseover="showImage(uploadedFile)"
                      @mouseleave="hoverImage = null"
                      v-if="uploadedFile.path"
                      >{{ uploadedFile.name }}</a
                    >
                    <template v-if="!uploadedFile.path">{{ uploadedFile.name }}</template>
                  </div>
                  <div>{{ $t("MODAL.UPSERT_FILE.SIZE") }}{{ (uploadedFile.size / 1024 / 1024).toFixed(2) }} mb</div>
                </div>

                <div class="hover-image" v-if="hoverImage">
                  <img :src="uploadedFile.path" />
                </div>

                <div class="col-4 pl-0 text-right">
                  <button type="button" class="btn delete-btn mt-3" @click="deleteFiles">
                    <font-awesome-icon icon="times" class="mr-2" />{{ $t("GENERAL.DELETE") }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group row">
          <div class="m-label text-right">{{ $t("MODAL.UPSERT_FILE.FILE_NAME") }}</div>
          <input type="text" v-model="form.fileName" :placeholder="$t('FILE.SEARCH_PH')" class="form-control" />
        </div>

        <div class="form-group row">
          <div class="m-label text-right">{{ $t("MODAL.UPSERT_FILE.FILE_TYPE") }}</div>
          <b-form-select v-model="form.fileType" class="select-component">
            <b-form-select-option :key="item.value" v-for="item of fileTypeList" :value="item.value">{{
              $t(item.text)
            }}</b-form-select-option>
          </b-form-select>
        </div>

        <div class="form-group row">
          <div class="toggle-collapse text-right">
            {{ $t("GENERAL.RELATED_EQUIPMENT") }}
            <toggle-button
              @change="enableEquipment = !enableEquipment"
              :value="Boolean(enableEquipment)"
              :sync="true"
              :color="{ checked: '#2173c9', unchecked: '#7b7b7b' }"
              class="toggle-btn m-0"
            />
          </div>
          <b-collapse class="collapse-component" :visible="enableEquipment">
            <div class="my-1" v-for="(item, index) in form.relationArray" :key="index">
              <b-form-select
                v-model="item.equipmentType"
                class="select-component left"
                @change="equipmentTypeChange(item)"
              >
                <b-form-select-option :key="item.value" v-for="item of equipmentTypeList" :value="item.value">{{
                  $t(item.text)
                }}</b-form-select-option>
              </b-form-select>

              <b-form-select v-model="item.equipment" class="select-component right">
                <b-form-select-option
                  :key="equipment.value"
                  v-for="equipment of item.equipmentList"
                  :value="equipment.value"
                  >{{ $t(equipment.text) }}</b-form-select-option
                >
              </b-form-select>

              <div class="btns float-right">
                <div class="round-btn float-left" role="button" @click="addEquipmentType()">
                  <font-awesome-icon icon="plus" />
                </div>

                <div class="round-btn float-right" role="button" @click="deleteEquipmentTypes(index)" v-if="index != 0">
                  <font-awesome-icon icon="trash-alt" />
                </div>
              </div>
            </div>
          </b-collapse>
        </div>

        <div class="form-group row">
          <b-button class="btn-cancel float-left" @click="cancel">{{ $t("GENERAL.CANCEL") }}</b-button>
          <b-button type="submit" class="btn-ok float-right">{{ $t("GENERAL.SAVE") }}</b-button>
        </div>
      </form>
    </template>
  </TemplateModal>
</template>

<script>
  import TemplateModal from "@/components/modal/TemplateModal";

  export default {
    components: {
      TemplateModal,
    },

    props: {
      selectedData: Object,
      equipmentTypeList: Array,
      fileTypeList: Array,
    },

    mounted() {
      // update
      if (this.selectedData) {
        let relations = this.selectedData.relations;
        this.uploadedFile = {
          name: this.selectedData.file_name,
          size: this.selectedData.file_size,
          path: `https://${process.env.VUE_APP_STORAGE_URL}/uuid?uuid=${this.selectedData.file_path}`,
        };
        this.form.file_uuid = this.selectedData.file_uuid;
        this.form.fileName = this.selectedData.name;
        this.form.fileType = this.selectedData.file_type;
        if (relations.length > 0) {
          // 設備類型selector新增項目
          for (let relation of relations) {
            this.addEquipmentType(relation.equipment, relation.equipment_type);
          }
          // 讓所有列的設備都設定正確的值進去
          for (let relation of this.form.relationArray) {
            this.equipmentTypeChange(relation);
          }
          return;
        }
      }

      // 如果沒有關聯設備，還是要新增第一筆初始的
      this.enableEquipment = false;
      this.addEquipmentType();
      this.equipmentTypeChange(this.form.relationArray[0]);
    },

    data: () => ({
      form: {
        fileName: null,
        fileType: 0,
        relationArray: [],
      },
      uploadedFile: null,
      enableEquipment: true,
      hoverImage: null,
    }),
    methods: {
      upsertFile(type) {
        let validExts = new Array(".jpg", ".jpeg", ".png");
        let validVidExts = new Array(".mp4", ".pdf");
        let file = this.$refs.file.files[0];
        if (!this.uploadedFile && !file) return this.$alert(this.$t("MODAL.UPSERT_FILE.CHOOSE_FILE_ALERT"));
        if (file) {
          let fileExt = file.name;
          fileExt = fileExt.substring(fileExt.lastIndexOf("."));
          let isPic = validExts.indexOf(fileExt) >= 0;
          let isVid = validVidExts.indexOf(fileExt) >= 0;
          if (!isPic && !isVid) {
            return this.$alert(this.$t("MODAL.UPSERT_FILE.FORMAT_ERR"));
          } else if (isPic && file.size > 5 * 1024 * 1024) {
            return this.$alert(this.$t("MODAL.UPSERT_FILE.SIZE_ERR") + "5M");
          } else if (isVid && file.size > 25 * 1024 * 1024) {
            return this.$alert(this.$t("MODAL.UPSERT_FILE.SIZE_ERR") + "25M");
          }
        }
        if ([1, 2, 3].indexOf(this.form.fileType) === -1) {
          return this.$alert(this.$t("MODAL.UPSERT_FILE.FILE_TYPE_ERR"));
        }

        const formData = new FormData();
        if (file) formData.append("file", file);
        formData.append("file_name", this.form.fileName);
        formData.append("file_type", this.form.fileType);

        // 有勾才要傳
        if (this.enableEquipment) {
          let equipments = [];
          let equipmentTypes = [];
          for (let item of this.form.relationArray) {
            if (item.equipment) {
              if (equipments.indexOf(item.equipment) == -1) equipments.push(item.equipment);
            } else if (item.equipmentType) {
              if (equipmentTypes.indexOf(item.equipmentType) == -1) equipmentTypes.push(item.equipmentType);
            }
          }
          if (equipments.length) formData.append("equipment_uuids", equipments.join(","));
          if (equipmentTypes.length) formData.append("equipment_type_uuids", equipmentTypes.join(","));
        }
        if (this.form.file_uuid) {
          formData.append("file_uuid", this.form.file_uuid);
        }

        this.apiPost("equipment/upsert_file", formData)
          .then(({ data }) => {
            // node[type] = data.file_uuid;
            this.$emit("ok");
          })
          .catch(({ message }) => {});
      },

      chooseFiles() {
        this.$refs.file.click();
      },

      deleteFiles() {
        if (this.uploadedFile) {
          let checkFilename = this.uploadedFile.name.replace(/\.[^/.]+$/, "");
          if (this.form.fileName == checkFilename) this.form.fileName = "";
        }
        this.$refs.file.value = "";
        this.uploadedFile = null;
      },
      addEquipmentType(equipment, equipmentType) {
        if (!equipment && !equipmentType) {
          equipment = 0;
          equipmentType = this.equipmentTypeList[0].value;
        }
        this.form.relationArray.push({ equipment, equipmentType });

        this.equipmentTypeChange(this.form.relationArray[this.form.relationArray.length - 1]);
      },

      deleteEquipmentTypes(index) {
        this.form.relationArray.splice(index, 1);
      },

      cancel() {
        this.$emit("cancel");
      },

      onChangeFileUpload() {
        let validExts = new Array(".jpg", ".jpeg", ".png");
        let validVidExts = new Array(".mp4", ".pdf");
        let file = this.$refs.file.files[0];
        if (file) {
          let fileExt = file.name;
          fileExt = fileExt.substring(fileExt.lastIndexOf("."));
          let isPic = validExts.indexOf(fileExt) >= 0;
          let isVid = validVidExts.indexOf(fileExt) >= 0;
          if (!isPic && !isVid) {
            this.$refs.file.value = "";
            return this.$alert(this.$t("MODAL.UPSERT_FILE.FORMAT_ERR"));
          } else if (isPic && file.size > 5 * 1024 * 1024) {
            this.$refs.file.value = "";
            return this.$alert(this.$t("MODAL.UPSERT_FILE.SIZE_ERR") + "5M");
          } else if (isVid && file.size > 25 * 1024 * 1024) {
            this.$refs.file.value = "";
            return this.$alert(this.$t("MODAL.UPSERT_FILE.SIZE_ERR") + "25M");
          }
          if (!this.form.fileName) this.form.fileName = file.name.replace(/\.[^/.]+$/, "");
          console.log(file);
          this.uploadedFile = file;
        } else this.uploadedFile = null;
      },

      equipmentTypeChange(item) {
        let equipmentList = [{ value: 0, text: this.$t("GENERAL.ALL_EQUIPMENTS") }];
        for (let equipmentType of this.equipmentTypeList) {
          if (equipmentType.value == item.equipmentType) {
            equipmentList.push(...equipmentType.equipments);
          }
        }
        item.equipmentList = equipmentList;
        if (!item.equipment || equipmentList.every((e) => e.value != item.equipment)) item.equipment = 0;
        item.__ob__.dep.notify();
      },

      showImage(file) {
        if (file.name.substring(file.name.length - 1) != "g") return;
        console.log(file);
        this.hoverImage = file.path;
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
  }
  .form-group {
    position: relative;
    margin: 20px auto;
    width: 100%;

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
      min-height: 100px;

      .upload-btn {
        color: #fff;
        background-color: $blue;
      }

      .delete-btn {
        color: #fff;
        background-color: $red;
      }

      .upload-file {
        .hover-image {
          position: absolute;
          top: 80px;
          z-index: 99999;

          img {
            height: 60vh;
          }
        }
      }
    }

    .form-control {
      border: 2px solid #e7e7e9;
      border-radius: 10px;
      transition: all 0.3s ease-in-out;

      &:focus {
        border: 2px solid #4b8bcf;
        box-shadow: none;
      }
    }

    .select-component {
      border-radius: 10px;
      max-width: 200px;
      background-color: #fff;
      border: 2px solid #e7e7e9;
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

      &:focus {
        border: 2px solid #4b8bcf;
        box-shadow: none;
        // border-bottom-left-radius: 0;
        // border-bottom-right-radius: 0;
      }
    }

    .toggle-collapse {
      padding: 0px 5px 15px 15px;

      font-weight: bold;
      padding: 0 5px;
      line-height: 20px;
      color: $blue;
    }

    .collapse-component {
      margin-top: 20px;
      padding-top: 20px;
      width: 100%;
      border-top: 2px solid #e7e7e9;

      .left,
      .right {
        width: 40%;
      }
      .right {
        margin-left: 2%;
      }

      .btns {
        width: 18%;
        padding-left: 2%;

        .round-btn {
          background-color: $blue;
          padding-left: 6px;
          margin-top: 6px;
          width: 24px;
          height: 24px;
          color: #fff;
          border-radius: 50%;
          // border-radius: 6px;

          &:hover {
            background-color: $darkBlue;
          }

          svg {
            width: 12px;
          }
        }
      }
    }

    .btn-ok,
    .btn-cancel {
      width: 47%;
      height: 38px;
      padding: 0 12px;
      border-radius: 10px;
      box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;

      @media (max-width: 1200px) {
        width: 100%;
        margin: 5px 0;
      }
    }

    .btn-cancel {
      color: $blue;
      background-color: #fff;
      border: 1px solid $blue;
    }

    .btn-ok {
      margin-left: 6%;
      color: #fff;
      background-color: $blue;
      border: 1px solid $blue;

      @media (max-width: 1200px) {
        margin-left: 0;
      }
    }
  }
</style>
