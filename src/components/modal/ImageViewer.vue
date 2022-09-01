<template>
  <TemplateModal :width="75">
    <template v-slot:default>
      <div class="m-modal-title text-center">{{ selectedData.name }}</div>
      <div class="m-modal-body my-3">
        <div class="text-center" v-if="picsrc">
          <img :src="picsrc" />
        </div>
        <div class="text-center" v-if="vidsrc">
          <video :src="vidsrc" autoplay="true" controls />
        </div>
      </div>
      <div class="m-modal-footer text-center">
        <b-button class="btn-cancel" @click="cancel">{{ $t("GENERAL.CLOSE") }}</b-button>
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
    mounted() {
      if (this.selectedData.pic)
        this.picsrc = `https://${process.env.VUE_APP_STORAGE_URL}/uuid?uuid=${this.selectedData.pic}`;
      if (this.selectedData.vid)
        this.vidsrc = `https://${process.env.VUE_APP_STORAGE_URL}/uuid?uuid=${this.selectedData.vid}`;
    },
    data: () => ({
      picsrc: null,
      vidsrc: null,
    }),
    methods: {
      ok() {
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
    margin-bottom: 30px;
    font-size: 20px;
    font-weight: bold;
  }

  .m-modal-body {
    img,
    video {
      max-width: 900px;
      max-height: 500px;
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

    .btn-cancel {
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
        margin: 5px 0;
      }
    }
  }
</style>
