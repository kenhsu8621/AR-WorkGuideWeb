<template>
  <div class="qrcode text-center">
    <RAHeader title="QR Code" />

    <div class="ra-main-content">
      <div v-if="alertMsg" class="alert-msg">{{ alertMsg }}</div>
      <div class="ra-title">{{ $t("SETTINGS.QRCODE.DESC") }}</div>
      <vue-qrcode class="my-2" v-if="code" :value="code" :width="300" />
      <div class="timer text-center" v-if="countDown">
        {{ $t("FORM.CAPTCHA_COUNTDOWN_1") }} {{ countDown }} {{ $t("FORM.CAPTCHA_COUNTDOWN_2") }}
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
  import RAHeader from "@/components/RAHeader.vue";
  import Footer from "@/components/Footer.vue";
  import VueQrcode from "vue-qrcode";

  export default {
    name: "QRCode",
    components: {
      RAHeader,
      Footer,
      VueQrcode,
    },
    data: () => ({
      password: "",
      alertMsg: "",
      valid_until: null,
      timer: null,
      countDown: null,
      retryCountRemain: null,
      code: null,
    }),
    mounted() {
      this.getQRCode();
    },
    methods: {
      getQRCode() {
        let data = {
          password: this.CryptoJS.MD5("kenken").toString(),
        };
        this.apiPost("auth/gen_code", data, { noShowError: true })
          .then(({ data }) => {
            this.code = data.code;
            this.valid_until = data.valid_until;
            this.setTimer();
          })
          .catch(({ code, message, data }) => {
            if (code == -1013) {
              this.valid_until = data.valid_until;
              this.setTimer();
              this.submitted = false;
            } else this.alertMsg = message;
          });
      },
      setTimer() {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
          let duration = Math.floor((new Date(this.valid_until + " UTC") - new Date()) / 1000);
          if (duration <= 0) {
            clearInterval(this.timer);
            this.countDown = null;
          } else
            this.countDown =
              ("0" + Math.floor(duration / 60)).slice(-2) + ":" + ("0" + Math.floor(duration % 60)).slice(-2);
        }, 1000);
      },
    },
  };
</script>

<style lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .ra-main-content {
    .title {
      font-size: 20px;
    }
  }
</style>
