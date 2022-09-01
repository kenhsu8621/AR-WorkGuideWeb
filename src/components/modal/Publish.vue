<template>
  <TemplateModal>
    <template v-slot:default>
      <div class="m-modal-title">{{ $t("MODAL.PUBLISH.PUBLISH_CHECK") }}</div>
      <form @submit.prevent="publish">
        <div class="form-group row">
          <div class="m-label text-right">{{ $t("GENERAL.WF_NAME") }}</div>
          <div class="m-text">{{ detail ? detail.name : $t("GENERAL.WF_NAME") }}</div>
        </div>

        <div class="form-group row">
          <div class="m-label text-right">{{ $t("GENERAL.VERSION") }}</div>
          <div class="m-text">V{{ ((detail && detail.latestVersion) || 0) + 1 }}</div>
        </div>

        <div class="form-group row">
          <div class="m-label text-right">{{ $t("MODAL.PUBLISH.RELEASE_NOTES") }}</div>
          <textarea
            type="text"
            :placeholder="$t('MODAL.PUBLISH.RELEASE_NOTES_PH')"
            v-model="description"
            class="form-control"
            rows="5"
            maxlength="500"
            required
          />

          <div class="desc-count text-right">{{ (description && description.length) || 0 }}/500</div>
        </div>

        <!-- <div class="form-group row">
          <div class="m-label text-right">{{ $t("MODAL.PUBLISH.PUBLISH_SETTINGS") }}</div>
          <div class="m-text">
            <b-form-group class="radio-group" v-slot="{ ariaDescribedby }">
              <b-form-radio v-model="selected" :aria-describedby="ariaDescribedby" value="A"
                >{{ $t("MODAL.PUBLISH.ALLOWED") }}
              </b-form-radio>
              <b-form-radio v-model="selected" :aria-describedby="ariaDescribedby" value="B"
                >{{ $t("MODAL.PUBLISH.NOT_ALLOWED") }}
              </b-form-radio>
            </b-form-group>
          </div>
        </div> -->

        <div class="form-group row">
          <b-button class="btn-cancel float-left" @click="cancel">{{ $t("GENERAL.CANCEL") }}</b-button>
          <b-button type="submit" class="btn-ok float-right">{{ $t("MODAL.PUBLISH.PUBLISH") }}</b-button>
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
      doPublish: Function,
    },
    mounted() {
      this.getDetail();
    },
    data: () => ({
      // selected: "A",
      detail: null,
      description: "",
    }),
    methods: {
      publish() {
        if (this.detail.version != 0) {
          this.$confirm(
            this.$t("MODAL.PUBLISH.UPDATE_CHECK"),
            `${this.$t("MODAL.PUBLISH.UPDATE_CONFIRM_1")}${this.detail.version}${this.$t(
              "MODAL.PUBLISH.UPDATE_CONFIRM_2"
            )}${this.detail.latestVersion + 1}？`,
            () => {
              this.doPublish(this.description);
            }
          );
        } else this.doPublish(this.description);
      },

      cancel() {
        this.$emit("cancel");
      },

      getDetail() {
        let data = {
          uuid: this.$route.params.uuid,
        };
        this.apiGet("workflow/detail", data).then(({ data }) => {
          this.detail = data;
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
      color: $lightgrey;
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

    .desc-count {
      width: 100%;
      font-size: 12px;
    }

    .radio-group {
      margin: 0 auto;
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
