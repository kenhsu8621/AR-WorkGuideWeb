<template>
  <TemplateModal>
    <template v-slot:default>
      <div class="m-modal-title">{{ $t("SETTINGS.LANGUAGE") }}</div>
      <div class="desc">
        <b-form-group class="radio-group" v-slot="{ ariaDescribedby }">
          <b-form-radio v-model="lang" class="my-3" :aria-describedby="ariaDescribedby" value="0"
            >繁體中文
          </b-form-radio>
          <b-form-radio v-model="lang" class="my-3" :aria-describedby="ariaDescribedby" value="1"
            >简体中文
          </b-form-radio>
          <b-form-radio v-model="lang" class="my-3" :aria-describedby="ariaDescribedby" value="2"
            >English
          </b-form-radio>
        </b-form-group>
      </div>

      <div class="form-group row mx-0">
        <b-button class="btn-cancel float-left" @click="cancel">{{ $t("GENERAL.CANCEL") }}</b-button>
        <b-button class="btn-ok float-right" @click="setActiveLang">{{ $t("GENERAL.CONFIRM") }}</b-button>
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
      lang: 0,
    }),
    mounted() {
      if (this.$cookies.get("language")) this.lang = this.$cookies.get("language");
    },
    methods: {
      setActiveLang() {
        this.$cookies.set("language", this.lang);
        this.$emit("ok");
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
