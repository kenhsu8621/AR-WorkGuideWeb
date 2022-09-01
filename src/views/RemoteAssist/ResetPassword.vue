<template>
  <div class="reset-password text-center">
    <div class="logo py-5"><font-awesome-icon icon="user-lock" size="9x" class="user-lock" /></div>

    <h2 class="ra-title b-4">{{ $t("RESET_PASSWORD.TITLE") }}</h2>
    <div v-if="step == 1">
      <h3 class="ra-sub-title my-2 mx-auto">{{ $t("RESET_PASSWORD.DESC_1") }}</h3>
      <h3 class="ra-sub-title my-2 mx-auto">{{ $t("RESET_PASSWORD.DESC_2") }}</h3>
      <div v-if="alertMsg" class="alert-msg">{{ alertMsg }}</div>
      <form @submit.prevent="resetPasswordSubmit">
        <div class="ra-form-group mt-4 mb-2 mx-auto text-left">
          <label for="account">{{ $t("FORM.ACCOUNT") }}</label>
          <input
            type="text"
            v-model="user.account"
            id="account "
            aria-describedby="accountDesc"
            :placeholder="$t('FORM.ACCOUNT_PLACEHOLDER')"
            class="form-control"
            :class="{ 'is-invalid': submitted && $v.user.account.$error }"
          />
          <small v-if="submitted && !$v.user.account.required" id="accountDesc" class="form-text alert-msg">{{
            $t("FORM.ACCOUNT_ERR")
          }}</small>
        </div>
        <div class="ra-form-group mt-3 mb-2 mx-auto text-left">
          <label for="email">{{ $t("FORM.EMAIL") }}</label>
          <input
            type="email"
            v-model="user.email"
            id="email"
            aria-describedby="emailDesc"
            placeholder="example@mail.com"
            class="form-control"
            :class="{ 'is-invalid': submitted && $v.user.email.$error }"
          />
          <small v-if="submitted && !$v.user.email.required" id="emailDesc" class="form-text alert-msg">{{
            $t("FORM.REQUIRED")
          }}</small>
          <small id="emailDesc" v-if="submitted && !$v.user.email.email" class="invalid-feedback">{{
            $t("FORM.EMAIL_ERR")
          }}</small>
        </div>
        <b-button type="submit" class="ra-confirm-btn my-3" :disabled="$v.user.$error">{{
          $t("FORM.SUBMIT")
        }}</b-button>
      </form>
    </div>

    <transition name="slide-fade">
      <div v-if="step == 2">
        <h3 class="ra-sub-title my-2 mx-auto">{{ $t("FORM.CAPTCHA_SENT_1") }}</h3>
        <h3 class="ra-sub-title my-2 mx-auto">{{ user.email }}</h3>
        <h3 class="ra-sub-title my-2 mx-auto">{{ $t("FORM.CAPTCHA_SENT_2") }}</h3>
        <form @submit.prevent="verificationSubmit">
          <div class="ra-form-group mt-4 mb-2 mx-auto text-left">
            <label for="verification">{{ $t("FORM.CAPTCHA") }}</label>
            <input
              type="text"
              v-model="verification.captcha"
              id="captcha "
              aria-describedby="captchaDesc"
              :placeholder="$t('FORM.CAPTCHA_PLACEHOLDER')"
              class="form-control"
              :class="{ 'is-invalid': submitted && $v.verification.captcha.$error }"
              minlength="6"
              maxlength="6"
            />
            <small
              id="captchaDesc"
              v-if="submitted && !$v.verification.captcha.$dirty && code == -1011"
              class="form-text alert-msg"
              >{{ alertMsg }}
            </small>
            <small id="captchaDesc" v-if="submitted && retryCountRemain != 0" class="form-text alert-msg">
              {{ $t("FORM.CAPTCHA_ERR_1") }}<br />
              {{ $t("FORM.CAPTCHA_ERR_2") }} {{ retryCountRemain }} {{ $t("FORM.CAPTCHA_ERR_3") }}
            </small>
            <small
              id="verificationDesc"
              v-if="submitted && retryCountRemain == 0 && code != -1011"
              class="form-text alert-msg"
            >
              {{ $t("FORM.CAPTCHA_LIMIT") }}
            </small>
          </div>
          <div class="ra-form-group mt-3 mb-2 mx-auto text-left">
            <label for="newPassword">{{ $t("FORM.PW_NEW") }}</label>
            <input
              type="password"
              v-model="verification.newPassword"
              id="newPassword"
              aria-describedby="newPasswordDesc"
              :placeholder="$t('FORM.PW_NEW_PLACEHOLDER')"
              autocomplete="off"
              class="form-control"
              :class="{ 'is-invalid': submitted && $v.verification.newPassword.$error }"
            />
            <font-awesome-icon
              class="eye-position bottom"
              :icon="pwClass"
              v-if="!$v.verification.newPassword.$error"
              @click="pwVisibility"
            />
            <small
              id="newPasswordDesc"
              class="form-text text-muted"
              v-if="!submitted && !$v.verification.newPassword.$error"
              >{{ $t("FORM.INPUT_RULE_1") }}</small
            >
            <small id="emailDesc" v-if="submitted && !$v.verification.newPassword.required" class="invalid-feedback">{{
              $t("FORM.REQUIRED")
            }}</small>
            <small
              id="newPasswordDesc"
              v-if="submitted && !$v.verification.newPassword.minLength"
              class="invalid-feedback"
              >{{ $t("FORM.MINLENGTH") }}</small
            >
            <small
              id="newPasswordDesc"
              v-if="submitted && !$v.verification.newPassword.maxLength"
              class="invalid-feedback"
              >{{ $t("FORM.MAXLENGTH") }}</small
            >
            <small
              id="newPasswordDesc"
              v-if="submitted && !$v.verification.newPassword.passwordRule"
              class="invalid-feedback"
              >{{ $t("FORM.INPUT_RULE_1") }}</small
            >
          </div>
          <b-button type="submit" class="ra-confirm-btn my-2">{{ $t("GENERAL.COMPLETE") }}</b-button>
          <div class="timer text-center" v-if="countDown">
            {{ $t("FORM.CAPTCHA_COUNTDOWN_1") }} {{ countDown }} {{ $t("FORM.CAPTCHA_COUNTDOWN_2") }}
          </div>
        </form>
      </div>
    </transition>

    <b-modal
      id="resetSuccessModal"
      @ok="redirectToLoginPage"
      ok-only
      :ok-title="$t('GENERAL.CONFIRM')"
      hide-header-close
      no-close-on-backdrop
      centered
    >
      <div class="text-center">
        <div class="success-checkmark">
          <div class="check-icon">
            <span class="icon-line line-tip"></span>
            <span class="icon-line line-long"></span>
            <div class="icon-circle"></div>
            <div class="icon-fix"></div>
          </div>
        </div>
        <p class="ra-title y-4">{{ $t("RESET_PASSWORD.UPDATE_SUCCESS") }}</p>
        <p class="ra-sub-title my-4">{{ $t("RESET_PASSWORD.UPDATE_SUCCESS_DESC") }}</p>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import { required, email, minLength, maxLength, helpers } from "vuelidate/lib/validators";
  import constants from "@/constants";
  const passwordRule = helpers.regex(
    "passwordRule",
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d(){}<>+-/?,.:;"'_~`!@#$%^&=]{0,}$/
  );

  export default {
    name: "ResetPassword",
    data: () => ({
      step: 1,
      pwClass: "eye",
      user: {
        account: "",
        email: "",
      },
      verification: {
        captcha: "",
        newPassword: "",
      },
      alertMsg: "",
      submitted: false,
      valid_until: null,
      timer: null,
      countDown: null,
      retryCountRemain: null,
      code: null,
    }),
    validations: {
      user: {
        account: { required },
        email: { required, email },
      },
      verification: {
        captcha: { required },
        newPassword: {
          required,
          minLength: minLength(6),
          maxLength: maxLength(20),
          passwordRule,
        },
      },
    },
    methods: {
      resetPasswordSubmit() {
        this.submitted = true;
        this.$v.user.$touch();
        if (this.$v.user.$invalid) {
          return;
        }
        this.getCaptcha();
      },
      verificationSubmit() {
        this.submitted = true;
        this.$v.verification.$touch();
        if (this.$v.verification.$invalid) {
          return;
        }
        this.resetPassword();
      },
      getCaptcha() {
        let data = {
          account: this.user.account,
          email: this.user.email,
          lang: parseInt(this.$cookies.get("language")) || constants.Lang.CHINESE,
        };

        this.apiPost("captcha/reset_password_email", data, { noShowError: true })
          .then(({ data }) => {
            this.valid_until = data.valid_until;
            this.setTimer();
            this.step = 2;
            this.submitted = false;
          })
          .catch(({ code, message, data }) => {
            if (code == -1013) {
              this.valid_until = data.valid_until;
              this.setTimer();
              this.step = 2;
              this.submitted = false;
            } else if (code == -1) {
              this.alertMsg = data.error;
            } else this.alertMsg = message;
          });
      },
      resetPassword() {
        let data = {
          account: this.user.account,
          email: this.user.email,
          captcha: this.verification.captcha,
          password: this.CryptoJS.MD5(this.verification.newPassword).toString(),
        };
        this.apiPost("user/reset_password", data, { noShowError: true })
          .then(() => {
            this.$bvModal.show("resetSuccessModal");
          })
          .catch(({ code, message, data }) => {
            if (code == -1014) {
              this.code = code;
              this.alertMsg = message;
              this.retryCountRemain = data.retry_count_remain;
            } else if (code == -1011) {
              this.code = code;
              this.alertMsg = message;
            } else if (code == -1) {
              this.alertMsg = data.error;
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
      pwVisibility() {
        let x = document.getElementById("newPassword");
        if (x.type === "password") {
          x.type = "text";
          this.pwClass = "eye-slash";
        } else {
          x.type = "password";
          this.pwClass = "eye";
        }
      },
      redirectToLoginPage() {
        this.$cookies.remove("token");
        this.$router.push({ name: "Login" });
      },
    },
    beforeDestroy() {
      clearTimeout(this.timer);
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";
  @import "~@/assets/scss/successCheck.scss";

  .reset-password {
    background-image: url("~@/assets/images/background.png");
    height: 100vh;
    font-size: 16px;
    .user-lock {
      margin-top: 100px;
      color: $placeholder;
    }
    .eye-position {
      position: absolute;
      margin-left: 265px;
      cursor: pointer;
    }
    .top,
    .bottom {
      margin-top: -33px;
    }
  }
</style>
