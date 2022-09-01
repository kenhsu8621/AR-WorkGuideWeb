<template>
  <div class="login text-center">
    <div class="step-1" v-if="step == 1">
      <div class="lang-select text-center" :class="{ expand: expandLangList }">
        <font-awesome-icon icon="globe" role="button" class="float-right" @click="toggleLangList" />

        <div class="current-lang float-left pl-2" v-if="!showLangList">
          <span v-if="lang == 0">繁中</span>
          <span v-if="lang == 1">简中</span>
          <span v-if="lang == 2" class="pl-1">EN</span>
        </div>

        <div class="lang-list float-left" v-if="showLangList">
          <b-button class="mr-1" :class="lang == 0 ? 'btn-active' : 'btn-inactive'" @click="setActiveLang(0)"
            >繁中</b-button
          >
          <b-button class="mr-1" :class="lang == 1 ? 'btn-active' : 'btn-inactive'" @click="setActiveLang(1)"
            >简中</b-button
          >
          <b-button class="mr-1" :class="lang == 2 ? 'btn-active' : 'btn-inactive'" @click="setActiveLang(2)"
            >English</b-button
          >
        </div>
      </div>

      <div class="logo">
        <img v-if="this.$store.state.deployType == 1" src="~@/assets/images/logo.png" />
        <img v-if="this.$store.state.deployType == 2" src="~@/assets/images/logo-digiwin.png" />
      </div>

      <transition name="slide-fade" appear>
        <h2 v-if="show && this.$store.state.deployType == 1" class="mb-4">{{ $t("LOGIN.WELCOME_1") }}</h2>
        <h2 v-if="show && this.$store.state.deployType == 2" class="mb-4">{{ $t("LOGIN.WELCOME_2") }}</h2>
      </transition>
      <transition name="slide-fade">
        <h2 v-if="!show" class="mb-4">{{ $t("LOGIN.LOGIN") }}</h2>
      </transition>

      <div v-if="alertMsg" class="alert-msg">{{ alertMsg }}</div>
      <transition name="slide-fade">
        <form v-if="!show" @submit.prevent="getCaptcha">
          <div class="login-switch my-2">
            <b-button :class="showEnterprise ? 'inactive-btn' : 'active-btn'" @click="showEnterprise = false">
              <span v-if="showEnterprise">{{ $t("LOGIN.SWITCH_TO") }}</span
              >{{ $t("LOGIN.LOGIN_NORMAL") }}
            </b-button>
            <b-button :class="showEnterprise ? 'active-btn' : 'inactive-btn'" @click="showEnterprise = true">
              <span v-if="!showEnterprise">{{ $t("LOGIN.SWITCH_TO") }}</span
              >{{ $t("LOGIN.LOGIN_ENTERPRISE") }}
            </b-button>
          </div>

          <div class="ra-form-group my-3 mx-auto" v-if="showEnterprise">
            <input
              type="text"
              class="form-control"
              v-model="code"
              :placeholder="$t('FORM.ENTERPRISE_CODE_PLACEHOLDER')"
              required
            />
          </div>
          <div class="ra-form-group my-3 mx-auto">
            <input
              type="text"
              class="form-control"
              v-model="username"
              :placeholder="$t('FORM.ACCOUNT_PLACEHOLDER')"
              required
            />
          </div>
          <div class="ra-form-group my-3 mx-auto">
            <input
              type="password"
              v-model="password"
              id="password"
              :placeholder="$t('FORM.PW_PLACEHOLDER')"
              autocomplete="off"
              class="form-control"
              required
            />
            <font-awesome-icon class="eye-position" :icon="pwClass" @click="pwVisibility()" />
          </div>
          <b-button type="submit" v-if="!show" class="ra-confirm-btn mb-2">
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
    <div v-if="step == 1" class="fii-logo text-right">
      <img src="~@/assets/images/fii-logo.png" />
    </div>
    <b-modal id="verificationModal" ok-only :ok-title="$t('GENERAL.CONTINUE')" hide-header-close centered>
      <div class="success-check-modal text-center">
        <p class="ra-title y-4">{{ $t("LOGIN.NOT_LOGGED_IN") }}</p>
        <p class="ra-sub-title my-4">{{ $t("LOGIN.NOT_LOGGED_IN_DESC") }}</p>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import constants from "@/constants";
  import { fcmMixin } from "@/mixin/fcmMixin";
  // const show = true
  export default {
    name: "Login",
    props: {
      requiresAuth: Boolean,
    },
    data: () => ({
      step: 1,
      pwClass: "eye",
      show: true,
      code: "",
      username: "",
      password: "",
      dismissSecs: 3,
      dismissCountDown: 0,
      alertMsg: "",
      submitted: false,
      captcha: null,
      valid_until: null,
      timer: null,
      countDown: null,
      retryCountRemain: null,
      lang: 0,
      showEnterprise: false,
      expandLangList: false,
      showLangList: false,
    }),
    mounted() {
      let token = this.$cookies.get("token");
      this.lang = parseInt(this.$cookies.get("language")) || constants.Lang.CHINESE;
      // 若已經登入，轉址到聯絡人頁面
      if (token) {
        this.$router.push({ name: "RAContact" });
      } else {
        // 若從別頁轉進登入頁時有requiresAuth這個prop，則顯示modal(3秒後關閉)
        if (this.requiresAuth) {
          this.$bvModal.show("verificationModal");
          setTimeout(() => {
            this.$bvModal.hide("verificationModal");
          }, 3000);
        }
      }
    },
    methods: {
      getCaptcha() {
        let data = {
          type: 1,
          account: this.username,
          password: this.CryptoJS.MD5(this.password).toString(),
          lang: parseInt(this.$cookies.get("language")) || constants.Lang.CHINESE,
        };
        if (this.showEnterprise) {
          data.code = this.code;
          data.type = 2;
        }

        // if (this.captcha) data.captcha = this.captcha;
        this.apiPost("captcha/login", data, { noShowError: true })
          .then(({ data }) => {
            this.valid_until = data.valid_until;
            this.setTimer();
            this.step = 2;
            this.submitted = false;
          })
          .catch(({ code, message }) => {
            console.log(`code=${code}, message=${message}`);
            //-1013: captcha未過期，-1011: captcha已過期
            if (code == -1013) {
              this.valid_until = data.valid_until;
              this.setTimer();
              this.step = 2;
              this.submitted = false;
            } else if (code == -1011) {
              this.valid_until = data.valid_until;
              this.setTimer();
              this.submitted = false;
            } else this.alertMsg = message;
          });
      },

      login() {
        let that = this;
        this.submitted = true;
        let loginUrl = "auth/login";
        let data = {
          account: this.username,
          password: this.CryptoJS.MD5(this.password).toString(),
          captcha: this.captcha,
          device_id: this.$cookies.get("fcm_token") || this.CryptoJS.MD5(new Date().toString()).toString(),
          fcm_token: this.$cookies.get("fcm_token") || this.CryptoJS.MD5(new Date().toString()).toString(),
          is_force: 0,
        };
        if (this.showEnterprise) {
          loginUrl = "auth/login_enterprise";
          data.code = this.code;
        }
        func(0);
        function func(isForce) {
          data.is_force = isForce;

          that
            .apiPost(loginUrl, data, { noShowError: true })
            .then(({ data }) => {
              console.log(data.token);
              console.log(data.userinfo);
              that.$cookies.set("token", data.token);
              that.$cookies.set("user", data.userinfo);

              that.$router.push({ name: "RAContact" });
            })
            .catch(({ code, message, data }) => {
              if (code == -1017) {
                if (confirm(this.$t("LOGIN.FORCE_LOGIN"))) func(1);
                else {
                  that.show = true;
                  that.step = 1;
                  that.username = "";
                  that.password = "";
                  that.captcha = "";
                  that.code = "";
                }
              } else {
                that.alertMsg = message;
                if (data) that.retryCountRemain = data.retry_count_remain;
              }
            });
        }
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

      setActiveLang(lang) {
        this.lang = lang;
        this.$cookies.set("language", lang);
        return history.go(0);
      },

      toggleLangList() {
        if (this.showLangList) {
          this.expandLangList = false;
          this.showLangList = false;
        } else {
          this.expandLangList = true;
          setTimeout(() => {
            this.showLangList = true;
          }, 200);
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .login {
    background-image: url("~@/assets/images/background.png");
    height: 100vh;

    .step-1 {
      .lang-select {
        width: 80px;
        height: 38px;
        position: absolute;
        padding: 6px;
        top: 15px;
        right: 15px;
        color: $blue;
        background-color: #fff;
        border-radius: 19px;
        border: 1px solid $blue;
        transition: all 0.2s ease-in-out;

        svg {
          margin-top: 2px;
          margin-right: 2px;
          font-size: 20px;
        }

        .current-lang {
          font-size: 14px;
          font-weight: bold;
          line-height: 24px;
        }

        .lang-list {
          width: 180px;
          line-height: 26px;

          .btn-active,
          .btn-inactive {
            width: 30%;
            height: 24px;
            margin-top: -4px;
            padding: 0 6px;
            font-size: 12px;
            border-radius: 15px;
          }

          .btn-active {
            color: #fff;
            background-color: $blue;
            border: 1px solid $blue;
          }

          .btn-inactive {
            color: $blue;
            background-color: #fff;
            border: 1px solid $blue;
          }
        }
      }

      .expand {
        width: 230px;
        transition: all 0.2s ease-in-out;
      }

      .logo {
        padding-top: 15vh;
        padding-bottom: 2vh;

        @media (max-height: 768px) {
          padding-top: 5vh;
          padding-bottom: 2vh;
        }
      }

      .login-switch {
        display: flex;
        justify-content: center;

        .active-btn,
        .inactive-btn {
          font-size: 14px;
          width: 145px;
          height: 50px;
          margin: 0 5px;
        }

        .active-btn {
          background-color: $blue;
          border-color: $blue;
        }

        .inactive-btn {
          color: $grey;
          background-color: #f0f0f0;
          border-color: #f0f0f0;
        }

        .btn:focus,
        .btn.focus {
          outline: 0;
          box-shadow: none;
        }
      }

      .eye-position {
        position: absolute;
        margin-top: -33px;
        margin-left: 115px;
        cursor: pointer;
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

      @media (max-height: 768px) {
        bottom: 15px;
      }
    }

    .fii-logo {
      position: fixed;
      bottom: 20px;
      width: 100%;
      padding-right: 20px;

      img {
        height: 7vh;
      }
    }

    /deep/ .modal {
      background-color: #ccc;
    }
  }
</style>
