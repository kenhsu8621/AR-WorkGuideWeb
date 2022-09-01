<template>
  <div class="m-login text-center">
    <div v-if="step == 1">
      <div class="py-4"></div>
      <div class="logo py-4">
        <img v-if="this.$store.state.deployType == 1" src="~@/assets/images/logo.png" />
        <img v-if="this.$store.state.deployType == 2" src="~@/assets/images/logo-digiwin.png" />
      </div>
      <transition name="slide-fade" appear>
        <h2 v-if="show && this.$store.state.deployType == 1" class="mb-4">{{ $t("LOGIN.WELCOME_REMOTE_ASSIST_1") }}</h2>
        <h2 v-if="show && this.$store.state.deployType == 2" class="mb-4">{{ $t("LOGIN.WELCOME_REMOTE_ASSIST_2") }}</h2>
      </transition>
      <transition name="slide-fade">
        <h2 v-if="!show" class="mb-4">{{ $t("TERMS.TITLE_1") }}<br />SI管理中心</h2>
      </transition>

      <div v-if="alertMsg" class="alert-msg">{{ alertMsg }}</div>
      <transition name="slide-fade">
        <form v-if="!show" @submit.prevent="getCaptcha">
          <div class="ra-form-group my-3 mx-auto text-left">
            <label for="code">{{ $t("FORM.CODE") }}</label>
            <input
              type="text"
              class="form-control"
              v-model="form.code"
              id="code"
              :placeholder="$t('FORM.CODE_PLACEHOLDER')"
              required
            />
          </div>
          <div class="ra-form-group my-3 mx-auto text-left">
            <label for="username">{{ $t("FORM.ACCOUNT") }}</label>
            <input
              type="text"
              class="form-control"
              v-model="form.username"
              :placeholder="$t('FORM.ACCOUNT_PLACEHOLDER')"
              required
            />
          </div>
          <div class="ra-form-group my-3 mx-auto text-left">
            <label for="code">{{ $t("FORM.PW") }}</label>

            <input
              type="password"
              v-model="form.password"
              id="password"
              :placeholder="$t('FORM.PW_PLACEHOLDER')"
              autocomplete="off"
              class="form-control"
              required
            />
            <font-awesome-icon class="eye-position" :icon="pwClass" @click="pwVisibility()" />
          </div>
          <b-button type="submit" v-if="!show" class="ra-confirm-btn">
            {{ $t("LOGIN.LOGIN") }}
          </b-button>
          <div class="forgot-password text-right mx-auto">
            <router-link :to="{ name: 'RAResetPassword' }">
              <transition name="slide-fade" appear>
                <b-button variant="link" class="text-decoration-none">{{ $t("FORM.FORGOT_PW") }}</b-button>
              </transition>
            </router-link>
          </div>
        </form>
      </transition>
      <transition name="slide-fade">
        <b-button @click="show = !show" v-if="show" class="ra-confirm-btn my-2">
          {{ $t("LOGIN.LOGIN") }}
        </b-button>
      </transition>
      <br />
      <transition name="slide-fade">
        <router-link :to="{ name: 'RARegister' }">
          <b-button v-if="show" class="ra-confirm-btn-alt my-2">{{ $t("LOGIN.REGISTER") }}</b-button>
        </router-link>
      </transition>
    </div>

    <transition name="slide-fade">
      <div class="step-2" v-if="step == 2">
        <h2 class="ra-title b-4">{{ $t("LOGIN.2FA") }}</h2>
        <h3 v-if="this.$store.state.deployType == 1" class="ra-sub-title my-2 mx-auto">
          {{ $t("LOGIN.2FA_DESC_1") }}
        </h3>
        <h3 v-if="this.$store.state.deployType == 2" class="ra-sub-title my-2 mx-auto">
          {{ $t("LOGIN.2FA_DESC_2") }}
        </h3>
        <form @submit.prevent="login">
          <div class="ra-form-group mt-4 mb-2 mx-auto text-left">
            <div class="ra-form-group mt-3 mb-2 mx-auto">
              <input
                type="text"
                ref="captcha"
                v-model="captcha"
                :placeholder="$t('FORM.CAPTCHA_PLACEHOLDER')"
                class="form-control"
                minlength="6"
                maxlength="6"
                required
              />
              <small
                id="verificationDesc"
                v-if="submitted && alertMsg && retryCountRemain != 0"
                class="form-text alert-msg"
              >
                {{ $t("FORM.CAPTCHA_ERR_1") }}<br />
                {{ $t("FORM.CAPTCHA_ERR_2") }} {{ retryCountRemain }}{{ $t("FORM.CAPTCHA_ERR_3") }}
              </small>
              <small id="verificationDesc" v-if="submitted && retryCountRemain == 0" class="form-text alert-msg">
                {{ $t("FORM.CAPTCHA_LIMIT") }}
              </small>
            </div>
          </div>
          <b-button type="submit" class="ra-confirm-btn my-3">{{ $t("GENERAL.CONTINUE") }}</b-button>
          <div class="timer text-center" v-if="countDown && lang != 'en'">
            {{ $t("FORM.CAPTCHA_COUNTDOWN_1") }} {{ countDown }} {{ $t("FORM.CAPTCHA_COUNTDOWN_2") }}
          </div>
          <div class="timer text-center" v-if="countDown && lang == 'en'">
            {{ $t("FORM.CAPTCHA_COUNTDOWN_1") }}{{ $t("FORM.CAPTCHA_COUNTDOWN_2") }} {{ countDown }}
          </div>
        </form>
        <div
          class="resend my-3"
          @click="
            showAlert();
            getCaptcha();
          "
          v-if="!countDown"
        >
          {{ $t("FORM.CAPTCHA_RESEND") }}
        </div>
        <b-alert
          :show="dismissCountDown"
          dismissible
          variant="dark"
          @dismissed="dismissCountDown = 0"
          @dismiss-count-down="countDownChanged"
          class="mx-auto"
        >
          <p>{{ $t("FORM.CAPTCHA_RESEND_TIP") }}</p>
        </b-alert>
      </div>
    </transition>
    <div v-if="step == 1 && this.$store.state.deployType == 1" class="terms">
      <a href="/serviceTerms" target="_blank">{{ $t("REGISTER.TERMS") }}</a>
      - <a href="/privacyPolicy" target="_blank">{{ $t("REGISTER.POLICY") }}</a>
    </div>
    <div v-if="step == 1 && this.$store.state.deployType == 2" class="terms">
      <a href="https://market.digiwincloud.com/assets/legal/index-tw.html" target="_blank">{{
        $t("REGISTER.TERMS")
      }}</a>
      - <a href="https://www.digiwin.com/tw/legal.html" target="_blank">{{ $t("REGISTER.POLICY") }}</a>
    </div>
    <!-- <div v-if="step == 1" class="fii-logo text-right">
      <img src="~@/assets/images/fii-logo.png" />
    </div> -->
    <b-modal id="verificationModal" ok-only :ok-title="$t('GENERAL.CONTINUE')" hide-header-close centered>
      <div class="success-check-modal text-center">
        <p class="ra-title y-4">{{ $t("LOGIN.NOT_LOGGED_IN") }}</p>
        <p class="ra-sub-title my-4">{{ $t("LOGIN.NOT_LOGGED_IN_DESC") }}</p>
      </div>
    </b-modal>
    <b-modal id="notPermittedModal" ok-only :ok-title="$t('GENERAL.CONTINUE')" hide-header-close centered>
      <div class="success-check-modal text-center">
        <p class="ra-title y-4">{{ $t("LOGIN.NOT_PERMITTED") }}</p>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import constants from "@/constants";

  import { fcmMixin } from "@/mixin/fcmMixin";
  // const show = true
  export default {
    mixins: [fcmMixin],
    name: "Login",
    props: {
      requiresAuth: Boolean,
      isNotPermitted: Boolean,
    },
    data: () => ({
      step: 1,
      pwClass: "eye",
      show: true,
      form: { code: "", username: "", password: "" },
      dismissSecs: 3,
      dismissCountDown: 0,
      alertMsg: "",
      submitted: false,
      captcha: null,
      valid_until: null,
      timer: null,
      countDown: null,
      retryCountRemain: null,
      lang: null,
    }),
    mounted() {
      let token = this.$cookies.get("token");
      this.lang = parseInt(this.$cookies.get("language")) || constants.Lang.CHINESE;
      // 若已經登入，轉址到聯絡人頁面
      if (token) {
        this.$router.push({ name: "SIMaintenance" });
      } else {
        // 若從別頁轉進登入頁時有requiresAuth這個prop，則顯示modal(3秒後關閉)
        if (this.requiresAuth) {
          this.$bvModal.show("verificationModal");
          setTimeout(() => {
            this.$bvModal.hide("verificationModal");
          }, 3000);
        }
        if (this.isNotPermitted) {
          this.$bvModal.show("notPermittedModal");
          setTimeout(() => {
            this.$bvModal.hide("notPermittedModal");
          }, 3000);
        }
      }
    },
    methods: {
      getCaptcha() {
        let data = {
          account: this.form.username,
          password: this.CryptoJS.MD5(this.form.password).toString(),
          type: 3,
          lang: parseInt(this.$cookies.get("language")) || constants.Lang.CHINESE,
          code: this.form.code,
        };
        this.apiPost("captcha/login", data, { noShowError: true })
          .then(({ data }) => {
            this.valid_until = data.valid_until;
            this.setTimer();
            this.step = 2;
            this.submitted = false;
            this.$nextTick(() => {
              console.log(this.$refs);
              this.$refs.captcha.focus();
            });
          })
          .catch(({ code, message }) => {
            console.log(`code=${code}, message=${message}`);
            //-1013: captcha未過期，-1011: captcha已過期
            if (code == -1013) {
              this.valid_until = data.valid_until;
              this.setTimer();
              this.step = 2;
              this.submitted = false;
              this.$nextTick(() => {
                console.log(this.$refs);
                this.$refs.captcha.focus();
              });
            } else if (code == -1011) {
              this.valid_until = data.valid_until;
              this.setTimer();
              this.submitted = false;
            } else this.alertMsg = message;
          });
      },
      login() {
        this.submitted = true;
        let data = {
          code: this.form.code,
          account: this.form.username,
          password: this.CryptoJS.MD5(this.form.password).toString(),
          captcha: this.captcha,
          device_id: this.$cookies.get("fcm_token"),
          fcm_token: this.$cookies.get("fcm_token"),
          // type: 3,
        };
        this.apiPost("auth/login_si", data, { noShowError: true })
          .then(({ data }) => {
            this.$cookies.set("token", data.token);
            this.$cookies.set("user", data.userinfo);
            console.log("si登入成功");
            this.$router.push({ name: "SIMaintenance" });
          })
          .catch(({ message, data }) => {
            this.alertMsg = message;
            if (data) this.retryCountRemain = data.retry_count_remain;
          });
      },
      pwVisibility() {
        let x = document.getElementById("password");
        if (x.type === "password") {
          x.type = "text";
          this.pwClass = "eye-slash";
        } else {
          x.type = "password";
          this.pwClass = "eye";
        }
      },
      setTimer() {
        if (this.timer) clearInterval(this.timer);
        let _this = this;
        this.timer = setInterval(() => {
          let duration = Math.floor((new Date(_this.valid_until + " UTC") - new Date()) / 1000);
          if (duration <= 0) {
            clearInterval(_this.timer);
            _this.countDown = null;
          } else
            _this.countDown =
              ("0" + Math.floor(duration / 60)).slice(-2) + ":" + ("0" + Math.floor(duration % 60)).slice(-2);
        }, 1000);
      },
      showAlert() {
        this.dismissCountDown = this.dismissSecs;
      },
      countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown;
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";
  .m-login {
    background-image: url("~@/assets/images/background.png");
    height: 100vh;
    .ra-form-group {
      position: relative;
      .eye-position {
        position: absolute;
        right: 15px;
        margin-top: -33px;
        cursor: pointer;
      }
    }
    .forgot-password {
      width: 300px;
      button {
        font-size: 16px;
        color: $placeholder;
        &:hover {
          color: $placeholderHover;
        }
      }
    }
    .step-2 {
      padding-top: 300px;
      .resend {
        color: $blue;
        cursor: pointer;
        &:hover {
          color: $blueHover;
        }
      }
      .alert {
        width: 440px;
        height: 50px;
        margin-top: 150px;
        border-radius: 25px;
        color: #fff;
        background-color: #4c4c4c;
      }
    }
    .terms {
      position: fixed;
      bottom: 60px;
      width: 100%;
      font-size: 12px;
      z-index: 99;
      a {
        color: $placeholder;
        &:hover {
          color: $placeholderHover;
        }
      }
    }
    .fii-logo {
      position: fixed;
      bottom: 20px;
      width: 100%;
      padding-right: 20px;
      img {
        width: 100px;
      }
    }
    /deep/ .modal {
      background-color: #ccc;
    }
  }
</style>
