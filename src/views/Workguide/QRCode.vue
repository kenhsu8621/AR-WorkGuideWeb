<template>
  <div class="qrcode">
    <Header :title="$t('QRCODE.TITLE')" />
    <div class="text-center">
      <div class="title">{{ $t("QRCODE.DESC") }}</div>
      <vue-qrcode :value="code" :width="400" ref="qrcodeSrc" errorCorrectionLevel="H" v-if="code" />
    </div>
  </div>
</template>

<script>
  import Header from "@/components/Header";
  import VueQrcode from "vue-qrcode";

  export default {
    name: "QRCode",
    components: {
      Header,
      VueQrcode,
    },
    data: () => ({
      password: "",
      code: null,
    }),
    created() {
      let data = {
        password: this.CryptoJS.MD5(this.password).toString(),
      };
      this.apiPost("auth/gen_code", data)
        .then(({ data }) => {
          this.code = data.code;
        })
        .catch(({ code, message, data }) => {
          // todo
        });
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .qrcode {
    padding-top: 100px;

    .title {
      font-size: 20px;
      font-weight: bold;
    }
  }
</style>
