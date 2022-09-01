<template>
  <TemplateModal>
    <template v-slot:default>
      <div class="m-modal-title">
        {{ selectedData.account ? $t("USER.EDIT_ENTERPRISE_USER") : $t("USER.ADD_USER") }}
        <span class="desc ml-2" v-if="!selectedData.account"
          >({{ $t("MODAL.UPSERT_USER.REGISTERABLE_ACC") }}{{ selectedData.account_count_remain }})</span
        >
      </div>

      <div v-show="form.type == 0">
        <b-form-group class="radio-group m-0" v-slot="{ ariaDescribedby }">
          <b-form-radio v-model="type" class="my-3" :aria-describedby="ariaDescribedby" value="1"
            >{{ $t("GENERAL.ADD") }} Admin
          </b-form-radio>
          <b-form-radio v-model="type" class="my-3" :aria-describedby="ariaDescribedby" value="2"
            >{{ $t("GENERAL.ADD") }} User
          </b-form-radio>
        </b-form-group>
        <div class="form-group row mx-0">
          <b-button class="btn-cancel float-left" @click="cancel">{{ $t("GENERAL.CANCEL") }}</b-button>
          <b-button class="btn-ok float-right" @click="next">{{ $t("GENERAL.NEXT") }}</b-button>
        </div>
      </div>

      <div v-show="form.type != 0">
        <form @submit.prevent="UpsertUser">
          <div class="form-group row" v-if="selectedData.account">
            <div class="m-label text-right">{{ $t("FORM.ACCOUNT") }}</div>
            <div class="m-text form-control">{{ form.account }}</div>
          </div>

          <div class="form-group row" v-if="!selectedData.account">
            <div class="m-label text-right">{{ $t("FORM.ACCOUNT") }}</div>
            <input
              type="text"
              v-model="form.account"
              id="account"
              aria-describedby="accountDesc"
              :placeholder="$t('FORM.ACCOUNT_PLACEHOLDER')"
              class="form-control"
              :class="{ 'is-invalid': submitted && $v.form.account.$error }"
            />
            <small id="accountDesc" v-if="!submitted && !$v.form.account.$error" class="form-text text-muted">{{
              $t("FORM.INPUT_RULE")
            }}</small>
            <small id="accountDesc" v-if="submitted && !$v.form.account.required" class="invalid-feedback">{{
              $t("FORM.REQUIRED")
            }}</small>
            <small id="accountDesc" v-if="submitted && !$v.form.account.minLength" class="invalid-feedback">{{
              $t("FORM.MINLENGTH")
            }}</small>
            <small id="accountDesc" v-if="submitted && !$v.form.account.maxLength" class="invalid-feedback">{{
              $t("FORM.MAXLENGTH")
            }}</small>
            <small id="accountDesc" v-if="submitted && !$v.form.account.accountRule" class="invalid-feedback">{{
              $t("FORM.INPUT_RULE")
            }}</small>
          </div>

          <div class="form-group row">
            <div class="m-label text-right">{{ $t("FORM.PW") }}</div>
            <input
              type="password"
              v-model="form.password"
              id="password"
              aria-describedby="passwordDesc"
              :placeholder="$t('FORM.PW_PLACEHOLDER')"
              autocomplete="off"
              class="form-control"
              :required="!selectedData.account"
              :class="{ 'is-invalid': submitted && $v.form.password.$error }"
            />
            <font-awesome-icon
              class="eye-position"
              :icon="pwClass"
              :class="{ offset: submitted && $v.form.password.$error }"
              @click="pwVisibility()"
            />
            <small id="passwordDesc" v-if="!submitted && !$v.form.password.$error" class="form-text text-muted">{{
              $t("FORM.INPUT_RULE_1")
            }}</small>
            <small id="passwordDesc" v-if="submitted && !$v.form.password.required" class="invalid-feedback">{{
              $t("FORM.REQUIRED")
            }}</small>
            <small id="passwordDesc" v-if="submitted && !$v.form.password.minLength" class="invalid-feedback">{{
              $t("FORM.MINLENGTH")
            }}</small>
            <small id="passwordDesc" v-if="submitted && !$v.form.password.maxLength" class="invalid-feedback">{{
              $t("FORM.MAXLENGTH")
            }}</small>
            <small id="passwordDesc" v-if="submitted && !$v.form.password.passwordRule" class="invalid-feedback">{{
              $t("FORM.INPUT_RULE_1")
            }}</small>
          </div>
          <div class="form-group row">
            <div class="m-label text-right">Email</div>
            <input
              type="text"
              v-model="form.email"
              aria-describedby="emailDesc"
              placeholder="example@mail.com"
              class="form-control"
              :class="{ 'is-invalid': submitted && $v.form.email.$error }"
            />
            <small id="emailDesc" v-if="$v.form.email.$invalid" class="invalid-feedback">{{
              $t("FORM.EMAIL_ERR")
            }}</small>
          </div>

          <div class="form-group row">
            <div class="m-label text-right">{{ $t("FORM.USERNAME") }}</div>
            <input
              type="text"
              v-model="form.name"
              aria-describedby="nameDesc"
              :placeholder="$t('FORM.USERNAME_PLACEHOLDER')"
              class="form-control"
              :class="{ 'is-invalid': submitted && $v.form.name.$error }"
              maxlength="30"
            />
            <small id="nameDesc" v-if="$v.form.name.$invalid" class="invalid-feedback">{{
              $t("FORM.ACCOUNT_ERR")
            }}</small>
          </div>
          <div class="form-group row">
            <div class="m-label text-right">{{ $t("FORM.ROLE") }}</div>
            <div class="m-text form-control">{{ $t("FORM.ENTERPRISE") }} {{ form.type == 1 ? "Admin" : "User" }}</div>
          </div>
          <div class="form-group row" v-if="!selectedData">
            <span>{{ $t("MODAL.UPSERT_USER.DESC") }}</span>
          </div>

          <div class="form-group row">
            <b-button class="btn-cancel float-left" :class="{ 'one-third': !selectedData }" @click="cancel">{{
              $t("GENERAL.CANCEL")
            }}</b-button>
            <b-button
              class="btn-prev float-right"
              :class="{ 'one-third': !selectedData }"
              @click="back"
              v-if="!selectedData"
              >{{ $t("GENERAL.PREV") }}</b-button
            >
            <b-button
              type="submit"
              class="btn-ok float-right"
              :class="{ 'one-third': !selectedData }"
              :disabled="$v.form.$error"
              >{{ $t("GENERAL.SAVE") }}</b-button
            >
          </div>
        </form>
      </div>
    </template>
  </TemplateModal>
</template>

<script>
  import TemplateModal from "@/components/modal/TemplateModal";
  import { required, email, minLength, maxLength, helpers } from "vuelidate/lib/validators";
  const accountRule = helpers.regex("accountRule", /^[A-Za-z\d]{0,}$/);
  const passwordRule = helpers.regex(
    "passwordRule",
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d(){}<>+-/?,.:;"'_~`!@#$%^&=\]\\[*|]{0,}$/
  );

  export default {
    components: {
      TemplateModal,
    },
    props: {
      selectedData: Object,
    },
    data: () => ({
      form: {
        account: null,
        password: null,
        email: null,
        name: null,
        type: 0,
      },
      submitted: false,
      enableEquipment: true,
      type: 1,
      pwClass: "eye",
    }),
    validations() {
      return {
        form: {
          account: { required, minLength: minLength(6), maxLength: maxLength(20), accountRule },
          password: {
            required: !this.selectedData.account,
            minLength: minLength(6),
            maxLength: maxLength(20),
            passwordRule,
          },
          email: { required, email },
          name: { required, minLength: maxLength(30) },
          type: { required },
        },
      };
    },
    mounted() {
      if (this.selectedData.account) {
        this.form.type = this.selectedData.admin ? 1 : 2;
        this.form.account = this.selectedData.account;
        this.form.email = this.selectedData.email;
        this.form.name = this.selectedData.name;
      }
    },
    methods: {
      UpsertUser() {
        console.log(this.$v);
        this.submitted = true;
        this.$v.form.$touch();
        if (this.$v.form.$invalid) return;

        let data = {
          is_admin: this.form.type == 1 ? 1 : 0,
          account: this.form.account,
          password: this.form.password && this.CryptoJS.MD5(this.form.password).toString(),
          email: this.form.email,
          name: this.form.name,
        };
        let url = "enterprise/create_user";
        if (this.selectedData.account) url = "enterprise/update_user";
        this.apiPost(url, data)
          .then(({ data }) => {
            this.$emit("ok");
            this.submitted = false;
          })
          .catch(() => {
            this.submitted = false;
          });
      },

      back() {
        this.form.type = null;
      },

      next() {
        if (this.selectedData.account_count_remain <= 0) {
          if (confirm(this.$t("MODAL.UPSERT_USER.REGISTERABLE_ACC_ERR"))) {
            return;
          }
        } else this.form.type = this.type;
      },

      cancel() {
        this.$emit("cancel");
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
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .m-modal-title {
    margin-bottom: 30px;
    padding-bottom: 15px;
    font-size: 22px;
    font-weight: bold;
    border-bottom: 2px solid #e7e7e9;

    .desc {
      font-size: 16px;
      color: $blue;
    }
  }

  .form-group {
    margin: 20px auto;
    position: relative;
    width: 100%;

    .m-label {
      position: absolute;
      font-weight: bold;
      padding: 0 5px;
      line-height: 20px;
      top: -10px;
      left: 10px;
      background-color: #fff;
      color: $blue;
    }

    .m-text {
      width: 100%;
      border: 2px solid #e7e7e9;
      border-radius: 10px;
    }

    .eye-position {
      position: absolute;
      right: 12px;
      margin-top: 12px;
      cursor: pointer;
      color: $blue;
    }

    .offset {
      right: 32px;
    }

    .form-control {
      border: 2px solid #e7e7e9;
      border-radius: 10px;
      // transition: all 0.3s ease-in-out;

      &:focus {
        border: 2px solid #4b8bcf;
        box-shadow: none;
      }
    }

    .select-component {
      border-radius: 10px;
      max-width: 200px;
      background-color: #fff;
      border: 2px solid #e7e7e9;
      background-image: linear-gradient(45deg, transparent 50%, $grey 60%),
        linear-gradient(135deg, $grey 40%, transparent 50%) !important;
      background-position: calc(100% - 17px) 14px, calc(100% - 10px) 14px, 100% 0;
      background-size: 7px 7px, 7px 7px;
      background-repeat: no-repeat;
      -webkit-appearance: none;
      -moz-appearance: none;
      cursor: pointer;
      option {
        background-color: #fff;
        border: 1px solid #fff;
      }

      &:focus {
        border: 2px solid #4b8bcf;
        box-shadow: none;
      }
    }

    .btn-ok,
    .btn-cancel,
    .btn-prev {
      width: 47%;
      height: 38px;
      padding: 0 12px;
      border-radius: 10px;
      box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;

      @media (max-width: 1200px) {
        width: 100%;
        margin: 5px 0;
      }
    }

    .btn-cancel {
      color: $blue;
      background-color: #fff;
      border: 1px solid $blue;
    }

    .btn-ok {
      margin-left: 6%;
      color: #fff;
      background-color: $blue;
      border: 1px solid $blue;

      @media (max-width: 1200px) {
        margin-left: 0;
      }
    }

    .btn-prev {
      color: $blue;
      background-color: aliceblue;
      border: 1px solid $blue;
    }

    .one-third {
      width: 30%;
      margin-left: 3%;
    }
  }
</style>
