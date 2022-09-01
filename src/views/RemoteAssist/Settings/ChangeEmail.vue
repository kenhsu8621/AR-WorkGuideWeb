<template>
  <div class="change-email text-center">
    <RAHeader :title="$t('SETTINGS.CHANGE_EMAIL.TITLE')" />

    <div class="ra-main-content" v-if="step == 1">
      <div v-if="alertMsg" class="alert-msg">{{ alertMsg }}</div>
      <form @submit.prevent="changeEmailSubmit" class="mt-5">
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
            @focus="$v.user.password.$reset"
          />
          <font-awesome-icon
            class="eye-position"
            :icon="pwClass"
            v-if="!$v.user.password.$error"
            @click="pwVisibility()"
          />
          <small id="passwordDesc" v-if="submitted && $v.user.password.$dirty" class="invalid-feedback">
            {{ $t("FORM.PW_ERR") }}
          </small>
        </div>

        <div class="ra-form-group my-3 mx-auto text-left">
          <label for="newEmail">{{ $t("FORM.EMAIL_NEW") }}</label>
          <input
            type="email"
            v-model="user.newEmail"
            id="newEmail"
            aria-describedby="newEmailDesc"
            :placeholder="$t('FORM.EMAIL_NEW_PLACEHOLDER')"
            class="form-control"
            :class="{ 'is-invalid': submitted && $v.user.newEmail.$error }"
          />
          <small id="newEmailDesc" v-if="submitted && !$v.user.newEmail.required" class="invalid-feedback">{{
            $t("FORM.REQUIRED")
          }}</small>
          <small id="newEmailDesc" v-if="submitted && !$v.user.newEmail.email" class="invalid-feedback">{{
            $t("FORM.EMAIL_ERR")
          }}</small>
        </div>

        <b-button type="submit" class="ra-confirm-btn my-2" :disabled="$v.user.$error">{{
          $t("FORM.NEXT_STEP")
        }}</b-button>
      </form>
    </div>

    <transition name="slide-fade">
      <div class="ra-main-content" v-if="step == 2">
        <div class="logo py-5"><font-awesome-icon icon="envelope-open-text" size="10x" class="email-icon" /></div>
        <h2 class="ra-title b-4">{{ $t("FORM.EMAIL_VERIFICATION") }}</h2>
        <h3 class="ra-sub-title my-2 mx-auto">{{ $t("FORM.CAPTCHA_SENT_1") }}</h3>
        <h3 class="ra-sub-title my-2 mx-auto">{{ user.newEmail }}</h3>
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
            <small
              id="verificationDesc"
              v-if="submitted && retryCountRemain && retryCountRemain != 0 && alertMsg"
              class="form-text alert-msg"
            >
              {{ $t("FORM.CAPTCHA_ERR_1") }}<br />
              {{ $t("FORM.CAPTCHA_ERR_2") }} {{ retryCountRemain }}{{ $t("FORM.CAPTCHA_ERR_3") }}
            </small>
            <small id="verificationDesc" v-if="submitted && retryCountRemain == 0" class="form-text alert-msg">
              {{ $t("FORM.CAPTCHA_LIMIT") }}
            </small>
          </div>
          <b-button type="submit" class="ra-confirm-btn my-2">{{ $t("GENERAL.COMPLETE") }}</b-button>
          <div class="timer text-center" v-if="countDown">
            {{ $t("FORM.CAPTCHA_COUNTDOWN_1") }} {{ countDown }} {{ $t("FORM.CAPTCHA_COUNTDOWN_2") }}
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

    <Footer />
  </div>
</template>

<script>
  import RAHeader from "@/components/RAHeader.vue";
  import Footer from "@/components/Footer.vue";
  import { required, email } from "vuelidate/lib/validators";
  import constants from "@/constants";

  export default {
    name: "ChangeEmail",
    components: {
      RAHeader,
      Footer,
    },
    data: () => ({
      step: 1,
      pwClass: "eye",
      user: {
        password: "",
        newEmail: "",
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
    }),
    validations: {
      user: {
        password: { required },
        newEmail: { required, email },
      },
      verification: { required },
    },
    methods: {
      changeEmailSubmit() {
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
        this.updateEmail();
      },
      getCaptcha() {
        let data = {
          new_email: this.user.newEmail,
          password: this.CryptoJS.MD5(this.user.password).toString(),
          lang: parseInt(this.$cookies.get("language")) || constants.Lang.CHINESE,
        };

        if (this.captcha) data.captcha = this.captcha;
        this.apiPost("captcha/modify_email", data, { noShowError: true })
          .then(({ data }) => {
            this.valid_until = data.valid_until;
            this.setTimer();
            this.step = 2;
            this.submitted = false;
            this.alertMsg = "";
          })
          .catch(({ code, message, data }) => {
            if (code == -1013 || code == -1011) {
              this.valid_until = data.valid_until;
              this.setTimer();
              this.step = 2;
              this.submitted = false;
              this.alertMsg = "";
            } else this.alertMsg = message;
          });
      },
      updateEmail() {
        let data = {
          captcha: this.verification,
          new_email: this.user.newEmail,
        };
        this.apiPost("user/update_email", data, { noShowError: true })
          .then(() => {
            this.$router.push({ name: "RASettings" });
          })
          .catch(({ code, data, message }) => {
            if (code == -1014) {
              this.alertMsg = message;
              this.retryCountRemain = data.retry_count_remain;
            } else {
              this.alertMsg = data.error;
            }
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
        let x = document.getElementById("password");
        if (x.type === "password") {
          x.type = "text";
          this.pwClass = "eye-slash";
        } else {
          x.type = "password";
          this.pwClass = "eye";
        }
      },
      countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown;
      },
      showAlert() {
        this.dismissCountDown = this.dismissSecs;
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";
  .change-email {
    .ra-main-content {
      .email-icon {
        color: $placeholder;
      }
      .eye-position {
        position: absolute;
        margin-top: -33px;
        margin-left: 265px;
        cursor: pointer;
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
    }
  }
</style>
