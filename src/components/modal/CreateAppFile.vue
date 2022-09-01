<template>
  <TemplateModal>
    <template v-slot:default>
      <div class="m-modal-title">
        {{ $t("MODAL.UPSERT_FILE.ADD_FILE") }}
      </div>
      <form @submit.prevent="upsertFile">
        <div class="form-group row">
          <div class="m-label text-right">{{ $t("MODAL.UPSERT_FILE.CHOOSE_FILE") }}</div>
          <div class="m-text">
            <div v-show="!uploadedFile">
              <div>僅支援apk</div>
              <div>
                <button type="button" class="btn upload-btn mt-2" @click="chooseFiles">
                  <!-- TODO: 加入Drag & Drop功能 -->
                  <font-awesome-icon icon="cloud-upload-alt" />{{ $t("MODAL.UPSERT_FILE.UPLOAD_FILE") }}
                </button>
                <input type="file" id="file" ref="file" accept=".apk" hidden @change="onChangeFileUpload" />
              </div>
            </div>

            <div v-if="uploadedFile">
              <div class="upload-file row">
                <div class="col-8 pr-0">
                  <div class="mt-3">
                    {{ $t("MODAL.UPSERT_FILE.NAME") }}
                    <a
                      :href="uploadedFile.path"
                      target="_blank"
                      @mouseover="showImage(uploadedFile)"
                      @mouseleave="hoverImage = null"
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
          <div class="m-label text-right">版號(如1.0.0)</div>
          <input type="text" v-model="form.version" placeholder="請輸入版號" class="form-control" />
        </div>

        <div class="form-group row">
          <div class="m-label text-right">{{ $t("MODAL.UPSERT_FILE.FILE_TYPE") }}</div>
          <b-form-select v-model="form.type" class="select-component">
            <template v-for="item of typeList">
              <b-form-select-option :key="item.value" v-if="item.value != 0" :value="item.value">{{
                item.text
              }}</b-form-select-option>
            </template>
          </b-form-select>
        </div>
        <div class="form-group row">
          <div class="m-label text-right">說明</div>
          <input type="text" v-model="form.description" placeholder="請輸入描述" class="form-control" />
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
      typeList: Array,
    },
    created() {
      console.log(this.typeList);
    },
    data: () => ({
      form: {
        type: 3,
        version: "",
        description: "",
        fileName: "",
      },
      uploadedFile: null,
      enableEquipment: true,
      hoverImage: null,
    }),
    methods: {
      upsertFile(type) {
        let validExts = new Array(".apk");
        let file = this.$refs.file.files[0];
        if (!this.uploadedFile && !file) return this.$alert(this.$t("MODAL.UPSERT_FILE.CHOOSE_FILE_ALERT"));
        if (file) {
          let fileExt = file.name;
          fileExt = fileExt.substring(fileExt.lastIndexOf("."));
          if (validExts.indexOf(fileExt) == -1) {
            return this.$alert(this.$t("MODAL.UPSERT_FILE.FORMAT_ERR"));
          } else if (file.size > 200 * 1024 * 1024) {
            return this.$alert(this.$t("MODAL.UPSERT_FILE.SIZE_ERR") + "200M");
          }
        }
        if (
          this.typeList
            .map((t) => t.value)
            .filter((v) => v > 0)
            .indexOf(this.form.type) === -1
        ) {
          return this.$alert(this.$t("MODAL.UPSERT_FILE.FILE_TYPE_ERR"));
        }
        if (!this.form.version) return this.$alert("請填寫版本");

        const formData = new FormData();
        if (file) formData.append("file", file);
        formData.append("type", this.form.type);
        formData.append("version", this.form.version);
        formData.append("description", this.form.description);

        this.apiPost("maintenance/upload_app_file", formData).then(({ data }) => {
          // node[type] = data.file_uuid;
          this.$emit("ok");
        });
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

      cancel() {
        this.$emit("cancel");
      },

      onChangeFileUpload() {
        let validExts = new Array(".apk");
        let file = this.$refs.file.files[0];
        if (file) {
          let fileExt = file.name;
          fileExt = fileExt.substring(fileExt.lastIndexOf("."));
          if (validExts.indexOf(fileExt) == -1) {
            return this.$alert(this.$t("MODAL.UPSERT_FILE.FORMAT_ERR"));
          } else if (file.size > 200 * 1024 * 1024) {
            return this.$alert(this.$t("MODAL.UPSERT_FILE.SIZE_ERR") + "200M");
          }
          if (!this.form.fileName) this.form.fileName = file.name.replace(/\.[^/.]+$/, "");
          this.uploadedFile = file;
        } else this.uploadedFile = null;
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
