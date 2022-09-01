<template>
  <div class="register text-center">
    <div v-if="step == 1">
      <div class="logo py-4">
        <img v-if="this.$store.state.deployType == 1" src="~@/assets/images/wg-logo-alt.png" />
        <img v-if="this.$store.state.deployType == 2" src="~@/assets/images/logo-digiwin.png" />
      </div>
      <h2 class="mb-4">{{ $t("REGISTER.TITLE") }}</h2>
      <div v-if="alertMsg" class="alert-msg">{{ alertMsg }}</div>
      <form @submit.prevent="registerSubmit">
        <div class="ra-form-group my-3 mx-auto text-left">
          <label for="account">{{ $t("FORM.ACCOUNT") }}</label>
          <input
            type="text"
            v-model="user.account"
            id="account"
            aria-describedby="accountDesc"
            :placeholder="$t('FORM.ACCOUNT_PLACEHOLDER')"
            class="form-control"
            :class="{ 'is-invalid': submitted && $v.user.account.$error }"
          />
          <small id="accountDesc" v-if="!submitted && !$v.user.account.$error" class="form-text text-muted">{{
            $t("FORM.INPUT_RULE")
          }}</small>
          <small id="accountDesc" v-if="submitted && !$v.user.account.required" class="invalid-feedback">{{
            $t("FORM.REQUIRED")
          }}</small>
          <small id="accountDesc" v-if="submitted && !$v.user.account.minLength" class="invalid-feedback">{{
            $t("FORM.MINLENGTH")
          }}</small>
          <small id="accountDesc" v-if="submitted && !$v.user.account.maxLength" class="invalid-feedback">{{
            $t("FORM.MAXLENGTH")
          }}</small>
          <small id="accountDesc" v-if="submitted && !$v.user.account.accountRule" class="invalid-feedback">{{
            $t("FORM.INPUT_RULE")
          }}</small>
        </div>

        <div class="ra-form-group my-3 mx-auto text-left">
          <label for="password">{{ $t("FORM.PW") }}</label>
          <input
            type="password"
            v-model="user.password"
            id="password"
            aria-describedby="passwordDesc"
            :placeholder="$t('FORM.PW_PLACEHOLDER')"
            autocomplete="off"
            class="form-control"
            :class="{ 'is-invalid': submitted && $v.user.password.$error }"
          />
          <font-awesome-icon
            class="eye-position"
            :icon="pwClass"
            v-if="!$v.user.password.$error"
            @click="pwVisibility()"
          />
          <small id="passwordDesc" v-if="!submitted && !$v.user.password.$error" class="form-text text-muted">{{
            $t("FORM.INPUT_RULE_1")
          }}</small>
          <small id="passwordDesc" v-if="submitted && !$v.user.password.required" class="invalid-feedback">{{
            $t("FORM.REQUIRED")
          }}</small>
          <small id="passwordDesc" v-if="submitted && !$v.user.password.minLength" class="invalid-feedback">{{
            $t("FORM.MINLENGTH")
          }}</small>
          <small id="passwordDesc" v-if="submitted && !$v.user.password.maxLength" class="invalid-feedback">{{
            $t("FORM.MAXLENGTH")
          }}</small>
          <small id="passwordDesc" v-if="submitted && !$v.user.password.passwordRule" class="invalid-feedback">{{
            $t("FORM.INPUT_RULE_1")
          }}</small>
        </div>

        <div class="ra-form-group my-3 mx-auto text-left">
          <label for="email">{{ $t("FORM.EMAIL") }}</label>
          <input
            type="email"
            v-model="user.email"
            id="email"
            aria-describedby="emailDesc"
            placeholder="example@mail.com"
            formnovalidate
            class="form-control"
            :class="{ 'is-invalid': submitted && $v.user.email.$error }"
          />
          <small id="emailDesc" v-if="submitted && !$v.user.email.required" class="invalid-feedback">{{
            $t("FORM.REQUIRED")
          }}</small>
          <small id="emailDesc" v-if="submitted && !$v.user.email.email" class="invalid-feedback">{{
            $t("FORM.EMAIL_ERR")
          }}</small>
        </div>

        <div class="ra-form-group my-3 mx-auto text-left">
          <label for="username">{{ $t("FORM.USERNAME") }}</label>
          <input
            type="text"
            v-model="user.username"
            id="username"
            aria-describedby="usernameDesc"
            :placeholder="$t('FORM.USERNAME_PLACEHOLDER')"
            class="form-control"
            :class="{ 'is-invalid': submitted && $v.user.username.$error }"
          />
          <small id="usernameDesc" v-if="submitted && !$v.user.username.required" class="invalid-feedback">{{
            $t("FORM.REQUIRED")
          }}</small>
        </div>
        <div class="ra-form-group mt-3 mb-2 mx-auto text-left">
          <b-form-checkbox
            id="service"
            v-model="serviceStatus"
            name="service"
            value="accepted"
            unchecked-value="not_accepted"
            class="service"
          >
            {{ $t("REGISTER.AGREE") }}
            <router-link :to="{ name: 'RAPrivacyPolicy' }" target="_blank" v-if="this.$store.state.deployType == 1">{{
              $t("REGISTER.TERMS")
            }}</router-link>
            <a
              v-if="this.$store.state.deployType == 2"
              href="https://market.digiwincloud.com/assets/legal/index-tw.html"
              target="_blank"
              >{{ $t("REGISTER.TERMS") }}</a
            >
          </b-form-checkbox>
          <small v-if="clicked && serviceStatus == 'not_accepted'" class="alert-msg">{{
            $t("REGISTER.AGREE_TERMS")
          }}</small>
          <b-form-checkbox
            id="privacy"
            v-model="privacyStatus"
            name="privacy"
            value="accepted"
            unchecked-value="not_accepted"
            class="privacy mt-2"
          >
            {{ $t("REGISTER.AGREE") }}

            <router-link :to="{ name: 'RAServiceTerms' }" target="_blank" v-if="this.$store.state.deployType == 1">{{
              $t("REGISTER.POLICY")
            }}</router-link>
            <a v-if="this.$store.state.deployType == 2" href="https://www.digiwin.com/tw/legal.html" target="_blank">{{
              $t("REGISTER.POLICY")
            }}</a>
          </b-form-checkbox>
          <small v-if="clicked && privacyStatus == 'not_accepted'" class="alert-msg">{{
            $t("REGISTER.AGREE_POLICY")
          }}</small>
        </div>

        <b-button
          type="submit"
          class="ra-confirm-btn my-2"
          :disabled="clicked && (serviceStatus == 'not_accepted' || privacyStatus == 'not_accepted' || $v.user.$error)"
          >{{ $t("FORM.NEXT_STEP") }}</b-button
        >
      </form>
      <b-modal id="notificationModal" ok-only :ok-title="$t('GENERAL.CONFIRM')" hide-header-close centered>
        <div class="success-check-modal text-center">
          <p class="ra-title y-4">{{ $t("FORM.PERMISSIONS") }}</p>
          <p class="ra-sub-title my-4 mx-auto">{{ $t("FORM.PERMISSIONS_DESC_1") }}</p>
          <a
            href="https://support.google.com/chrome/answer/3220216?co=GENIE.Platform%3DDesktop&hl=zh-Hant&oco=1"
            target="_blank"
            style="color: $blue"
            >{{ $t("FORM.PERMISSIONS_DESC_2") }}</a
          >
        </div>
      </b-modal>
    </div>
    <transition name="slide-fade">
      <div v-if="step == 2">
        <div class="logo py-5"><font-awesome-icon icon="envelope-open-text" size="10x" class="email-icon" /></div>
        <h2 class="ra-title b-4">{{ $t("FORM.EMAIL_VERIFICATION") }}</h2>
        <h3 class="ra-sub-title my-2 mx-auto">{{ $t("FORM.CAPTCHA_SENT_1") }}</h3>
        <h3 class="ra-sub-title my-2 mx-auto">{{ user.email }}</h3>
        <h3 class="ra-sub-title my-2 mx-auto">{{ $t("FORM.CAPTCHA_SENT_2") }}</h3>
        <form @submit.prevent="verificationSubmit">
          <div class="ra-form-group my-3 mx-auto text-left">
            <input
              type="text"
              v-model="verification"
              aria-describedby="verificationDesc"
              :placeholder="$t('FORM.CAPTCHA_PLACEHOLDER')"
              class="form-control"
              :class="{ 'is-invalid': submitted && $v.verification.$error }"
              minlength="6"
              maxlength="6"
            />
            <small id="verificationDesc" v-if="submitted && isCodeInvalid" class="form-text alert-msg"
              >{{ $t("FORM.NUM_ONLY") }}
            </small>
            <small
              id="verificationDesc"
              v-if="submitted && retryCountRemain && retryCountRemain != 0 && alertMsg"
              class="form-text alert-msg"
            >
              {{ $t("FORM.CAPTCHA_ERR_1") }}<br />
              {{ $t("FORM.CAPTCHA_ERR_2") }} {{ retryCountRemain }} {{ $t("FORM.CAPTCHA_ERR_3") }}
            </small>
            <small id="verificationDesc" v-if="submitted && retryCountRemain == 0" class="form-text alert-msg">
              {{ $t("FORM.CAPTCHA_LIMIT") }}
            </small>
          </div>
          <b-button type="submit" class="ra-confirm-btn my-2">{{ $t("GENERAL.COMPLETE") }}</b-button>
        </form>
        <div class="timer text-center" v-if="countDown">
          {{ $t("FORM.CAPTCHA_COUNTDOWN_1") }} {{ countDown }} {{ $t("FORM.CAPTCHA_COUNTDOWN_2") }}
        </div>

        <div
          class="resend my-3"
          @click="
            showAlert();
            checkRegister();
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

        <b-modal
          id="verificationModal"
          @ok="redirectToLoginPage"
          @hidden="redirectToLoginPage"
          ok-only
          :ok-title="$t('GENERAL.CONFIRM')"
          hide-header-close
          no-close-on-backdrop
          centered
        >
          <div class="success-check-modal text-center">
            <div class="success-checkmark">
              <div class="check-icon">
                <span class="icon-line line-tip"></span>
                <span class="icon-line line-long"></span>
                <div class="icon-circle"></div>
                <div class="icon-fix"></div>
              </div>
            </div>
            <p class="ra-title y-4">{{ $t("REGISTER.REGISTER_SUCCESS") }}</p>
            <p v-if="this.$store.state.deployType == 1" class="ra-sub-title my-4">
              {{ $t("REGISTER.REGISTER_SUCCESS_DESC_1") }}
            </p>
            <p v-if="this.$store.state.deployType == 2" class="ra-sub-title my-4">
              {{ $t("REGISTER.REGISTER_SUCCESS_DESC_2") }}
            </p>
          </div>
        </b-modal>
      </div>
    </transition>
  </div>
</template>

<script>
  import { required, email, minLength, maxLength, helpers } from "vuelidate/lib/validators";
  import constants from "@/constants";
  const accountRule = helpers.regex("accountRule", /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{0,}$/);
  const passwordRule = helpers.regex(
    "passwordRule",
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d(){}<>+-/?,.:;"'_~`!@#$%^&=\]\\[*|]{0,}$/
  );

  export default {
    name: "Register",
    data: () => ({
      step: 1,
      pwClass: "eye",
      user: {
        account: "",
        password: "",
        email: "",
        username: "",
      },
      verification: "",
      dismissSecs: 3,
      dismissCountDown: 0,
      alertMsg: "",
      submitted: false,
      valid_until: null,
      timer: null,
      countDown: null,
      retryCountRemain: null,
      serviceStatus: "not_accepted",
      privacyStatus: "not_accepted",
      clicked: false,
      isCodeInvalid: false,
    }),
    validations: {
      user: {
        account: { required, minLength: minLength(6), maxLength: maxLength(20), accountRule },
        password: { required, minLength: minLength(6), maxLength: maxLength(20), passwordRule },
        email: { required, email },
        username: { required },
      },
      verification: { required },
      serviceStatus: {
        required(val) {
          return val;
        },
      },
    },
    methods: {
      registerSubmit() {
        this.clicked = true;
        this.submitted = true;
        this.$v.user.$touch();
        if (this.$v.user.$invalid || this.serviceStatus == "not_accepted" || this.privacyStatus == "not_accepted") {
          return;
        }
        if (this.$cookies.get("fcm_token")) {
          this.checkRegister();
        } else {
          this.$bvModal.show("notificationModal");
        }
      },
      verificationSubmit() {
        this.submitted = true;
        this.$v.verification.$touch();
        if (this.$v.verification.$invalid) {
          return;
        }
        this.register();
      },
      checkRegister() {
        let data = {
          account: this.user.account,
          password: this.CryptoJS.MD5(this.user.password).toString(),
          email: this.user.email,
          name: this.user.username,
        };

        this.apiPost("user/check_register", data, { noShowError: true })
          .then(({ data }) => {
            let email = this.user.email;
            this.apiPost(
              "captcha/register_email",
              {
                email,
                lang: parseInt(this.$cookies.get("language")) || constants.Lang.CHINESE,
              },
              { noShowError: true }
            )
              .then(({ data }) => {
                this.valid_until = data.valid_until;
                this.setTimer();
                this.step = 2;
                this.submitted = false;
                this.alertMsg = "";
              })
              .catch(({ code, message, data }) => {
                //-1013: captcha未過期，-1011: captcha已過期
                if (code == -1013 || code == -1011) {
                  this.valid_until = data.valid_until;
                  this.setTimer();
                  this.step = 2;
                  this.submitted = false;
                  this.alertMsg = "";
                } else this.alertMsg = message;
              });
          })
          .catch(({ message }) => {
            this.alertMsg = message;
          });
      },
      register() {
        let data = {
          account: this.user.account,
          password: this.CryptoJS.MD5(this.user.password).toString(),
          email: this.user.email,
          name: this.user.username,
          code: this.verification,
          device_id: this.$cookies.get("fcm_token"),
          fcm_token: this.$cookies.get("fcm_token"),
        };
        this.apiPost("user/register", data, { noShowError: true })
          .then(({ data }) => {
            this.$cookies.set("token", data.token);
            this.$cookies.set("user", data.userinfo);
            this.$bvModal.show("verificationModal");
          })
          .catch(({ code, message, data }) => {
            this.isCodeInvalid = false;
            this.retryCountRemain = null;
            if (code == -1014) {
              this.alertMsg = message;
              this.retryCountRemain = data.retry_count_remain;
            } else if (code == -10008) {
              this.isCodeInvalid = true;
            } else this.alertMsg = message;
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
      redirectToLoginPage() {
        this.$router.push({ name: "Login" });
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
    beforeDestroy() {
      clearTimeout(this.timer);
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/main.scss";
  @import "~@/assets/scss/successCheck.scss";

  .register {
    background-image: url("~@/assets/images/background.png");
    height: 100vh;

    .logo {
      img {
        width: 200px;
      }
    }

    .ra-form-group {
      .form-control {
        height: 38px !important;
      }

      .eye-position {
        position: absolute;
        margin-top: -33px;
        margin-left: 265px;
        cursor: pointer;
      }
    }

    .email-icon {
      color: $placeholder;
    }

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

    .close {
      &:hover {
        color: #fff;
      }
    }

    .service,
    .privacy {
      text-align: left;
      a {
        color: $blue;
      }
    }

    // checkbox style
    /deep/ .custom-control-input:checked ~ .custom-control-label::before {
      border-color: $blue;
      background-color: $blue;
    }
    /deep/ .custom-control-label::before {
      background-color: #f5f5f5;
      border: #f5f5f5 solid 1px;
    }
  }
</style>
