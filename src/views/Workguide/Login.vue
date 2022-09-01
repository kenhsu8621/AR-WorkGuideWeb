<template>
  <div class="login">
    <div class="bg">
      <div class="logo-section text-center">
        <img class="logo" :class="{ 'op-0': step == 2 }" src="~@/assets/images/wg-logo.png" />
        <h2 class="title mt-4" :class="{ 'op-0': step == 2 }">{{ $t("GENERAL.TITLE") }}</h2>

        <img
          class="fii-logo"
          :class="{ 'op-0': step == 2 }"
          src="~@/assets/images/fii-vision-logo.svg"
          @click="maintenanceClick++"
        />
      </div>

      <div class="form-section" :class="{ 'shift-left': step == 2 }">
        <div v-if="step == 1" class="form-container mx-auto" :class="{ 'shift-down': step == 2 }">
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

          <form @submit.prevent="getCaptcha">
            <h3 class="mb-5 text-center">
              <div class="login-title mb-2" :class="{ en: lang == 2 }">
                {{ $t("LOGIN.WELCOME_1") }}
              </div>
              <div class="login-title mb-2" :class="{ en: lang == 2 }">
                {{ $t("LOGIN.WELCOME_2") }}
              </div>
            </h3>

            <div class="login-switch mb-4">
              <b-button :class="showEnterprise ? 'inactive-btn' : 'active-btn'" @click="showEnterprise = false">
                {{ $t("LOGIN.LOGIN_NORMAL") }}
              </b-button>
              <b-button :class="showEnterprise ? 'active-btn' : 'inactive-btn'" @click="showEnterprise = true">
                {{ $t("LOGIN.LOGIN_ENTERPRISE") }}
              </b-button>
            </div>

            <div v-if="alertMsg" class="alert-msg text-center">{{ alertMsg }}</div>

            <div class="form-group" v-if="showEnterprise">
              <label for="code">{{ $t("FORM.CODE") }}</label>
              <input
                type="text"
                name="code"
                class="form-control"
                v-model="form.code"
                :placeholder="$t('FORM.CODE_PLACEHOLDER')"
                required
              />
            </div>
            <div class="form-group">
              <label for="username">{{ $t("FORM.ACCOUNT") }}</label>
              <input
                type="text"
                name="username"
                class="form-control"
                v-model="form.username"
                :placeholder="$t('FORM.ACCOUNT_PLACEHOLDER')"
                required
              />
            </div>

            <div class="form-group mb-0">
              <label for="password">{{ $t("FORM.PW") }}</label>

              <input
                type="password"
                name="password"
                class="form-control"
                v-model="form.password"
                id="password"
                :placeholder="$t('FORM.PW_PLACEHOLDER')"
                autocomplete="off"
                required
              />
              <font-awesome-icon class="eye-position" :icon="pwClass" @click="pwVisibility()" />
            </div>
            <div class="text-right mx-auto" v-if="!showEnterprise">
              <router-link :to="{ name: 'RAResetPassword' }">
                <b-button variant="link" class="text-decoration-none forgot-password">{{
                  $t("FORM.FORGOT_PW")
                }}</b-button>
              </router-link>
            </div>

            <b-button
              type="submit"
              class=" my-3"
              :class="maintenanceClick > 10 ? 'confirm-btn-maintenance' : 'confirm-btn'"
            >
              {{ $t("LOGIN.TITLE") }}
            </b-button>

            <div class="register text-center mt-3 pt-3" v-if="!showEnterprise">
              <span>{{ $t("LOGIN.NO_ACCOUNT") }}</span>
              <router-link :to="{ name: 'RARegister' }">
                <a variant="link" class="ml-2">{{ $t("LOGIN.REGISTER") }}</a>
              </router-link>
            </div>
          </form>
        </div>
        <div v-if="step == 2" class="form-container mx-auto" :class="{ 'shift-down': step == 2 }">
          <form @submit.prevent="login">
            <div class="text-center">
              <img class="logo-alt mb-5" v-if="step == 2" src="~@/assets/images/wg-logo-alt.png" />
            </div>
            <h3 class="mb-4 text-center">
              <strong>{{ $t("LOGIN.2FA") }} </strong>
            </h3>
            <div v-if="alertMsg" class="alert-msg text-center mb-2">{{ alertMsg }}</div>
            <div class="form-group mb-4">
              <input
                type="text"
                v-model="captcha"
                ref="captcha"
                :placeholder="$t('FORM.CAPTCHA_PLACEHOLDER')"
                class="form-control"
                minlength="6"
                maxlength="6"
                required
              />
            </div>
            <b-button type="submit" class="confirm-btn mb-3"> {{ $t("LOGIN.TITLE") }} </b-button>

            <div class="text-center" v-if="countDown">
              {{ $t("FORM.CAPTCHA_COUNTDOWN_1") }} {{ countDown }} {{ $t("FORM.CAPTCHA_COUNTDOWN_2") }}
            </div>

            <div
              class="resend-captcha text-center my-3"
              role="button"
              @click="
                showAlert();
                getCaptcha();
              "
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
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import constants from "@/constants";
  function _uuid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
  }

  export default {
    components: {},
    props: {
      isNotPermitted: Boolean,
    },
    data: () => ({
      step: 1,
      pwClass: "eye",
      form: { code: "", username: "", password: "" },
      captcha: null,
      dismissSecs: 3,
      dismissCountDown: 0,
      submitted: false,
      valid_until: null,
      timer: null,
      countDown: null,
      retryCountRemain: null,
      lang: 0,
      expandLangList: false,
      showLangList: false,
      showEnterprise: false,
      maintenanceClick: 0,
      alertMsg: null,
    }),
    mounted() {
      let user = this.$cookies.get("user");
      if (user) {
        if (user.type == 1) this.$router.push({ name: "RAContact" });
        if (user.type == 2) this.$router.push({ name: "Home" });
        if (user.type == 3) this.$router.push({ name: "SIMaintenance" });
      }
      if (this.$cookies.get("language")) this.lang = this.$cookies.get("language");
      if (this.isNotPermitted) {
        this.$bvModal.show("notPermittedModal");
        setTimeout(() => {
          this.$bvModal.hide("notPermittedModal");
        }, 3000);
      }
    },
    methods: {
      getCaptcha() {
        this.alertMsg = null;
        let data = {
          type: 1,
          account: this.form.username,
          password: this.CryptoJS.MD5(this.form.password).toString(),
          lang: parseInt(this.$cookies.get("language")) || constants.Lang.CHINESE,
        };
        if (this.showEnterprise) {
          data.code = this.form.code;
          data.type = 2;
        } else if (this.maintenanceClick > 10) {
          data.type = 4;
        }

        // if (this.captcha) data.captcha = this.captcha;
        this.apiPost("captcha/login", data, { noShowError: true })
          .then(({ data }) => {
            this.valid_until = data.valid_until;
            this.setTimer();
            this.step = 2;
            this.submitted = false;
            this.$nextTick(() => {
              this.$refs.captcha.focus();
            });
          })
          .catch(({ data, code, message }) => {
            //-1013: captcha未過期，-1011: captcha已過期
            console.log(data, code, message);
            if (code == -1013) {
              this.valid_until = data.valid_until;
              this.setTimer();
              this.step = 2;
              this.submitted = false;
              this.$nextTick(() => {
                this.$refs.captcha.focus();
              });
            } else if (code == -1011) {
              this.valid_until = data.valid_until;
              this.setTimer();
              this.submitted = false;
            } else {
              this.alertMsg = message;
              // this.$alert(message);
            }
          });
      },

      login() {
        this.alertMsg = null;
        this.submitted = true;
        let uuid = _uuid();
        this.$cookies.set("device_id", uuid);
        let url = "auth/login";
        let data = {
          account: this.form.username,
          password: this.CryptoJS.MD5(this.form.password).toString(),
          captcha: this.captcha,
          device_id: this.$cookies.get("fcm_token") || uuid,
          fcm_token: this.$cookies.get("fcm_token") || uuid,
        };
        if (this.showEnterprise) {
          data.code = this.form.code;
          url = "auth/login_enterprise";
        } else if (this.maintenanceClick > 10) {
          url = "auth/login_maintenance";
        }
        let that = this;
        func(0);
        function func(isForce) {
          data.is_force = isForce;

          that
            .apiPost(url, data, { noShowError: true })
            .then(({ data }) => {
              that.$cookies.set("token", data.token);
              that.$cookies.set("user", JSON.stringify(data.userinfo));
              if (data.userinfo.type == 2) that.$router.push({ name: "Home" });
              else if (data.userinfo.type == 4 && data.userinfo.admin) that.$router.push({ name: "Maintenance" });
              else that.$router.push({ name: "RAContact" });
            })
            .catch(({ code, message, data }) => {
              if (code == -1017) {
                that.$confirm(
                  that.$t("LOGIN.FORCE_LOGIN_1"),
                  that.$t("LOGIN.FORCE_LOGIN_2"),
                  () => func(1),
                  () => {
                    that.step = 1;
                    that.form.code = "";
                    that.form.username = "";
                    that.form.password = "";
                    that.captcha = "";
                  }
                );
              } else {
                that.alertMsg = message;
                // that.$alert(message);
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
        setTimeout(() => {
          return history.go(0);
        }, 200);
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
    .bg {
      height: 100vh;
      background: linear-gradient(
        -45deg,
        rgba(0, 0, 0, 1),
        rgba(42, 55, 70, 1),
        rgba(21, 64, 140, 1),
        rgba(0, 75, 159, 1)
      );
      background-size: 400% 400%;
      animation: gradient 10s ease infinite;

      @keyframes gradient {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }

      .logo-section,
      .form-section {
        height: 100%;
        position: absolute;
        transition: all 0.5s ease-in-out;

        .form-container {
          padding-top: 150px;
          width: 300px;
          transition: all 0.5s ease-in-out;

          .logo-alt {
            width: 150px;
            transition: all 0.5s ease-in-out;
          }

          .login-title {
            font-weight: bold;
            letter-spacing: 5px;
          }

          .en {
            letter-spacing: 2px;
          }

          .form-group {
            text-align: left;
            position: relative;
            margin-bottom: 10px;

            .eye-position {
              position: absolute;
              right: 12px;
              margin-top: -25px;
              cursor: pointer;
              color: $blue;
            }

            .form-control {
              height: 34px;
              line-height: 34px;
              font-size: 14px;
              border-radius: 17px;
            }
          }

          .confirm-btn {
            width: 100%;
            background-color: $blue;
            border-radius: 19px;
          }
          .confirm-btn-maintenance {
            width: 100%;
            background-color: $red;
            border-radius: 19px;
          }

          .register {
            border-top: 2px solid #eee;
          }

          .resend-captcha {
            color: $blue;
            font-size: 14px;

            &:hover {
              color: $blueHover;
            }
          }

          .forgot-password {
            font-size: 12px;
            color: $grey;

            &:hover {
              color: $blueHover;
            }
          }

          .register {
            font-size: 12px;
            color: $grey;

            a {
              font-size: 16px;
              color: $blue;

              &:hover {
                color: $blueHover;
              }
            }
          }
        }

        .shift-down {
          padding-top: 200px;
        }
      }

      .logo-section {
        width: 45%;
        left: 0;

        .logo {
          margin-top: 30vh;
          width: 150px;
          transition: all 0.3s ease-in-out;
        }

        .fii-logo {
          margin-top: 30vh;
          margin-left: -15px;
          width: 180px;
          transition: all 0.3s ease-in-out;
        }

        .title {
          color: #fff;
          transition: all 0.3s ease-in-out;
        }
      }

      .form-section {
        width: 55%;
        right: 0;
        background-color: #fff;
        transition: all 0.5s ease-in-out;

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

            .btn-active,
            .btn-inactive {
              width: 30%;
              height: 23px;
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
      }

      .shift-left {
        top: 5%;
        right: 35%;
        width: 30%;
        height: 90%;
        border-radius: 30px;
        transition: all 0.5s ease-in-out;
      }
    }

    .op-0 {
      opacity: 0;
    }

    .op-1 {
      opacity: 1;
    }
  }

  .login-switch {
    display: flex;
    justify-content: center;
    margin: 0 -5px;

    .active-btn,
    .inactive-btn {
      font-size: 14px;
      width: 145px;
      height: 38px;
      border-radius: 19px;
    }

    .active-btn {
      background-color: $blue;
      border-color: $blue;
      margin: 0 5px;
    }

    .inactive-btn {
      color: $grey;
      background-color: #f0f0f0;
      border-color: #f0f0f0;
      margin: 0 5px;
    }

    .btn:focus,
    .btn.focus {
      outline: 0;
      box-shadow: none;
    }
  }
</style>
