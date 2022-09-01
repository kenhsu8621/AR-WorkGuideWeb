<template>
  <div class="change-password text-center">
    <RAHeader :title="$t('SETTINGS.CHANGE_PASSWORD.TITLE')" />

    <div class="ra-main-content">
      <div v-if="alertMsg" class="alert-msg">{{ alertMsg }}</div>
      <form @submit.prevent="changePasswordSubmit" class="mt-5">
        <div class="ra-form-group my-3 mx-auto text-left">
          <label for="password">{{ $t("FORM.PW_OLD") }}</label>
          <input
            type="password"
            v-model="password"
            id="password"
            aria-describedby="passwordDesc"
            :placeholder="$t('FORM.PW_OLD_PLACEHOLDER')"
            autocomplete="off"
            class="form-control"
            :class="{ 'is-invalid': submitted && $v.password.$error }"
            @focus="$v.password.$reset"
          />
          <font-awesome-icon
            class="eye-position top"
            :icon="pwClassTop"
            v-if="!$v.password.$error"
            @click="pwVisibilityTop()"
          />
          <small id="passwordDesc" v-if="submitted && $v.password.$dirty" class="invalid-feedback">
            {{ $t("FORM.PW_ERR") }}
          </small>
        </div>

        <div class="ra-form-group my-3 mx-auto text-left">
          <label for="newPassword">{{ $t("FORM.PW_NEW") }}</label>
          <input
            type="password"
            v-model="newPassword"
            id="newPassword"
            aria-describedby="newPasswordDesc"
            :placeholder="$t('FORM.PW_NEW_PLACEHOLDER')"
            autocomplete="off"
            class="form-control"
            :class="{ 'is-invalid': submitted && $v.newPassword.$error }"
          />
          <font-awesome-icon
            class="eye-position bottom"
            :icon="pwClassBottom"
            v-if="!$v.newPassword.$error"
            @click="pwVisibilityBottom()"
          />
          <small id="newPasswordDesc" class="form-text text-muted" v-if="!submitted && !$v.newPassword.$error">{{
            $t("FORM.INPUT_RULE_1")
          }}</small>
          <small id="newPasswordDesc" v-if="submitted && !$v.newPassword.required" class="invalid-feedback">
            {{ $t("FORM.REQUIRED") }}
          </small>
          <small id="newPasswordDesc" v-if="submitted && !$v.newPassword.minLength" class="invalid-feedback">{{
            $t("FORM.MINLENGTH")
          }}</small>
          <small id="newPasswordDesc" v-if="submitted && !$v.newPassword.maxLength" class="invalid-feedback">{{
            $t("FORM.MAXLENGTH")
          }}</small>
          <small id="newPasswordDesc" v-if="submitted && !$v.newPassword.notSameAsPassword" class="invalid-feedback">{{
            $t("FORM.PW_SAME_ERR")
          }}</small>
          <small id="passwordDesc" v-if="submitted && !$v.newPassword.passwordRule" class="invalid-feedback">{{
            $t("FORM.INPUT_RULE_1")
          }}</small>
        </div>
        <b-button type="submit" class="ra-confirm-btn my-2" :disabled="$v.$error">{{ $t("GENERAL.SAVE") }}</b-button>
      </form>
    </div>

    <Footer />

    <b-modal
      id="verificationModal"
      @ok="$logout()"
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
        <p class="ra-title y-4">{{ $t("SETTINGS.CHANGE_PASSWORD.UPDATE_SUCCESS") }}</p>
        <p class="ra-sub-title my-4">{{ $t("SETTINGS.CHANGE_PASSWORD.UPDATE_SUCCESS") }}</p>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import RAHeader from "@/components/RAHeader.vue";
  import Footer from "@/components/Footer.vue";
  import { required, not, sameAs, minLength, maxLength, helpers } from "vuelidate/lib/validators";
  const passwordRule = helpers.regex(
    "passwordRule",
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d(){}<>+-/?,.:;"'_~`!@#$%^&=]{0,}$/
  );

  export default {
    name: "ChangePassword",
    components: {
      RAHeader,
      Footer,
    },
    data: () => ({
      pwClassTop: "eye",
      pwClassBottom: "eye",
      password: "",
      newPassword: "",
      alertMsg: "",
      submitted: false,
    }),
    validations: {
      password: {
        required,
      },
      newPassword: {
        required,
        notSameAsPassword: not(sameAs("password")),
        minLength: minLength(6),
        maxLength: maxLength(20),
        passwordRule,
      },
    },
    methods: {
      changePasswordSubmit() {
        this.submitted = true;
        this.$v.$touch();
        if (this.$v.$invalid) {
          return;
        }
        this.updatePassword();
      },
      pwVisibilityTop() {
        let x = document.getElementById("password");
        if (x.type === "password") {
          x.type = "text";
          this.pwClassTop = "eye-slash";
        } else {
          x.type = "password";
          this.pwClassTop = "eye";
        }
      },
      pwVisibilityBottom() {
        let x = document.getElementById("newPassword");
        if (x.type === "password") {
          x.type = "text";
          this.pwClassBottom = "eye-slash";
        } else {
          x.type = "password";
          this.pwClassBottom = "eye";
        }
      },
      // redirectToSettingsPage() {
      //   this.$router.push({name:"RASettings"});
      // },
      updatePassword() {
        let data = {
          password: this.CryptoJS.MD5(this.password).toString(),
          new_password: this.CryptoJS.MD5(this.newPassword).toString(),
        };
        this.apiPost("user/update_password", data, { noShowError: true })
          .then(() => {
            this.$bvModal.show("verificationModal");
          })
          .catch(({ message }) => {
            this.alertMsg = message;
          });
      },
    },
  };
</script>

<style lang="scss">
  @import "~@/assets/scss/_variables.scss";
  @import "~@/assets/scss/successCheck.scss";

  .ra-main-content {
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
