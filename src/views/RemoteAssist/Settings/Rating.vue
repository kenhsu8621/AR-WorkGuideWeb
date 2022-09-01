<template>
  <div class="rating text-center">
    <h2 class="ra-title pt-5 mb-4">{{ $t("SETTINGS.RATING.TITLE") }}</h2>
    <h3 class="ra-sub-title my-2 mx-auto">{{ $t("SETTINGS.RATING.DESC") }}</h3>
    <div class="ra-form-group mt-5 mb-2 mx-auto text-left">
      <div class="stream-rate ">
        <p class="rate-title font-weight-bold">{{ $t("SETTINGS.RATING.QUALITY") }}</p>
        <rate :length="5" v-model="streamRate" />
        <div class="float-left placeholder">{{ $t("SETTINGS.RATING.BAD") }}</div>
        <div class="float-right placeholder">{{ $t("SETTINGS.RATING.GOOD") }}</div>
      </div>
      <br />
      <div class="tag-rate my-4" v-show="this.hasTag">
        <p class="rate-title font-weight-bold">{{ $t("SETTINGS.RATING.ACCURACY") }}</p>
        <rate :length="5" v-model="tagRate" />
        <div class="float-left placeholder">{{ $t("SETTINGS.RATING.BAD") }}</div>
        <div class="float-right placeholder">{{ $t("SETTINGS.RATING.GOOD") }}</div>
      </div>
      <br />
      <div class="tag-rate mt-4 mb-3">
        <p class="rate-title font-weight-bold">{{ $t("SETTINGS.RATING.FEEDBACK") }}</p>
        <textarea class="message grey" rows="5" v-model="message" maxlength="1000"></textarea>
      </div>
      <b-button type="submit" class="ra-confirm-btn my-2" @click="ratingSubmit">{{ $t("FORM.SUBMIT") }}</b-button>
      <div class="timer mt-2 text-center" role="button" @click="toContact">{{ $t("SETTINGS.RATING.SKIP") }}</div>
    </div>

    <b-modal
      id="recordCanceledModal"
      :title="$t('SETTINGS.RATING.END_CALL')"
      size="md"
      hide-header-close
      hide-footer
      centered
    >
      <div class="ra-form-group my-3 mx-auto text-center">
        {{ $t("SETTINGS.RATING.DOWNLOADING") }}
        <b-button
          type="submit"
          class="ra-confirm-btn mt-4 mb-3 mx-auto"
          aria-label="Close"
          data-dismiss="modal"
          @click="closeModal"
          >{{ $t("GENERAL.OK") }}</b-button
        >
      </div>
    </b-modal>
  </div>
</template>

<script>
  export default {
    name: "Rating",
    props: ["recordStatus"],
    data: () => ({
      hasTag: false,
      streamRate: 5,
      tagRate: 5,
      roomUuid: "",
      message: "",
    }),
    mounted() {
      this.roomUuid = sessionStorage.getItem("roomUuid");
      if (!this.roomUuid) return this.toContact();
      this.hasTag = sessionStorage.getItem("tagCount") > 0;

      if (!this.hasTag) this.tagRate = 0;

      if (this.recordStatus) {
        this.$bvModal.show("recordCanceledModal");
      }
    },
    methods: {
      ratingSubmit() {
        let data = {
          call_room_uuid: this.roomUuid,
          stream_rate: this.streamRate,
          tag_rate: this.tagRate,
          message: this.message,
        };
        this.apiPost("call/rate", data).then(this.toContact);
      },
      toContact() {
        if (this.redirectFlag) return;
        this.redirectFlag = true;
        sessionStorage.removeItem("tagCount");
        sessionStorage.removeItem("roomUuid");
        this.$router.push({ name: "RAContact" });
      },
      closeModal() {
        this.$bvModal.hide("recordCanceledModal");
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .rating {
    background-image: url("~@/assets/images/background.png");
    font-size: 16px;
    height: 100vh;

    .stream-rate,
    .tag-rate {
      .rate-title,
      .Rate {
        margin-bottom: 0.5rem;
      }
      .message {
        width: -webkit-fill-available;
        padding: 13px 20px;
        background-color: #f0f0f0;
        border: none;
        border-radius: 5px;
        &:focus {
          outline: none;
          border-radius: 5px;
        }
      }
    }
  }
  /deep/ svg.icon {
    width: 36px;
    height: 30px;
  }
  /deep/ .Rate__star {
    &:focus {
      outline: none;
    }
  }
  /deep/ .modal-header {
    margin: auto;
  }
</style>
