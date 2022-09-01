<template>
  <TemplateModal>
    <template v-slot:default>
      <div class="m-modal-title">{{ $t("MODAL.SHOW_CLONE_WF.COPY_WF") }}</div>
      <div class="form-group row mx-0">
        <b-form-group class="radio-group" v-slot="{ ariaDescribedby }">
          <b-form-radio v-model="selected" class="my-3" :aria-describedby="ariaDescribedby" value="1"
            >{{ $t("MODAL.SHOW_CLONE_WF.CONTENT_ONLY") }}
          </b-form-radio>
          <b-form-radio
            v-model="selected"
            :disabled="versionList.length <= 1"
            class="my-3"
            :aria-describedby="ariaDescribedby"
            value="2"
            >{{ $t("MODAL.SHOW_CLONE_WF.CONTENT_AND_VERSION") }}
          </b-form-radio>
        </b-form-group>
      </div>
      <div class="form-group row" v-if="selected == 2">
        <b-form-select v-model="version" class="select-component">
          <b-form-select-option :key="item.value" v-for="item of versionList" :value="item.value">{{
            $t(item.text)
          }}</b-form-select-option>
        </b-form-select>
      </div>

      <div class="form-group row mx-0">
        <b-button class="btn-cancel float-left" @click="cancel">{{ $t("GENERAL.CANCEL") }}</b-button>
        <b-button class="btn-ok float-right" @click="ok">{{ $t("GENERAL.CONFIRM") }}</b-button>
      </div>
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
    },

    data: () => ({
      selected: 1,
      version: 0,
      versionList: [],
    }),

    mounted() {
      this.versionList = [{ value: 0, text: this.$t("MODAL.SHOW_CLONE_WF.CHOOSE_VERSION") }];

      for (let version of this.selectedData.versions) {
        this.versionList.push({
          value: version.version,
          text: "V" + version.version,
        });
      }
    },

    methods: {
      ok() {
        if (this.selected == 2 && !this.version)
          return this.$alert(this.$t("MODAL.SHOW_CLONE_WF.CHOOSE_VERSION_ALERT"));
        let version = (this.selected == 2 && this.version) || null;
        this.apiPost("workflow/clone", { uuid: this.selectedData.uuid, version }).then(() => {
          this.$emit("ok");
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
    color: #212529;
    padding-bottom: 15px;
    font-size: 22px;
    font-weight: bold;
    border-bottom: 2px solid #e7e7e9;
  }
  .form-group {
    position: relative;
    width: 100%;

    &:focus {
      border: 2px solid #4b8bcf;
      box-shadow: none;
    }

    .desc {
      font-size: 16px;
      color: $grey;
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
