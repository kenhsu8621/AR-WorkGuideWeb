<template>
  <TemplateModal :width="33">
    <template v-slot:default>
      <div class="m-modal-title text-center">編輯運維帳號</div>
      <form @submit.prevent="updateUser">
        <div class="ra-form-group row">
          <div class="col-2"></div>
          <div class="col-8 row">
            <div class="col-3 m-label text-right">帳號</div>
            <div class="col-9 m-text text-left p-0">{{ selectedData.account }}</div>
          </div>
          <div class="col-2"></div>
        </div>
        <div class="ra-form-group row">
          <div class="col-2"></div>
          <div class="col-8 row">
            <div class="col-3 m-label text-right">密碼</div>
            <b-button v-if="!typePassword" @click="typePassword = !typePassword" class="col-9 reset-pw"
              >重設密碼</b-button
            >
            <input
              v-if="typePassword"
              type="text"
              v-model="form.newPassword"
              :placeholder="$t('FORM.PW_NEW_PLACEHOLDER')"
              class="col-9 form-control"
            />
            <span v-if="typePassword" class="clear-icon" role="button" @click="clearNewPw">
              <font-awesome-icon icon="times" />
            </span>
          </div>
          <div class="col-2"></div>
        </div>
        <div class="ra-form-group row">
          <div class="col-2"></div>
          <div class="col-8 row">
            <div class="col-3 m-label text-right">Email</div>
            <input
              type="email"
              v-model="form.email"
              :placeholder="selectedData.email"
              formnovalidate
              class="col-9 form-control"
            />
          </div>
          <div class="col-2"></div>
        </div>
        <div class="ra-form-group row">
          <div class="col-2"></div>
          <div class="col-8 row">
            <div class="col-3 m-label text-right">用戶名稱</div>
            <input type="text" v-model="form.name" :placeholder="selectedData.name" class="col-9 form-control" />
          </div>
          <div class="col-2"></div>
        </div>
        <div class="ra-form-group row">
          <div class="col-2"></div>
          <div class="col-8 row">
            <div class="col-3 m-label text-right">角色</div>
            <b-form-select
              v-model="form.is_admin"
              :options="roleList"
              class="col-9 mb-3 select-component"
            ></b-form-select>
          </div>
          <div class="col-2"></div>
        </div>
        <div class="ra-form-group row">
          <div class="col-3"></div>
          <div class="col-6">
            <b-button class="btn-cancel float-left" @click="cancel">取消</b-button>
            <b-button type="submit" class="btn-ok float-right">儲存</b-button>
          </div>
          <div class="col-3"></div>
        </div>
      </form>
    </template>
  </TemplateModal>
</template>

<script>
  import TemplateModal from "@/components/modal/TemplateModal";

  export default {
    components: {
      TemplateModal,
    },
    props: {
      selectedData: Object,
    },
    data: () => ({
      form: {
        newPassword: null,
        email: null,
        username: null,
        is_admin: 0,
      },
      roleList: [
        // { value: 0, text: "選擇帳號角色", disabled: true },
        { value: 0, text: "SI User" },
        { value: 1, text: "SI Admin" },
      ],
      typePassword: false,
    }),
    methods: {
      updateUser() {
        let data = {
          account: this.selectedData.account,
          password: this.CryptoJS.MD5(this.form.newPassword).toString() || this.selectedData.password,
          email: this.form.email,
          name: this.form.name,
          is_admin: this.form.is_admin,
        };
        this.apiPost("si/update_user", data).then(({ data }) => {
          this.$emit("ok");
        });
      },
      clearNewPw() {
        this.form.newPassword = null;
        this.typePassword = false;
      },
      cancel() {
        this.$emit("cancel");
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .m-modal-title {
    font-size: 20px;
    font-weight: bold;
  }
  .ra-form-group {
    margin: 30px 0;
    width: 100% !important;
    .m-label {
      font-weight: bold;
      padding: 0 15px 0 0;
      margin-bottom: 0;
      line-height: 38px;
    }
    .clear-icon {
      position: absolute;
      top: 9px;
      right: 25px;
      color: $placeholder;
      &:hover {
        color: $red;
      }
    }
    .m-text {
      line-height: 38px;
    }
    .form-control {
      height: 38px !important;
    }
    .reset-pw {
      width: 100%;
      color: #fff;
      background-color: $blue;
      border: 1px solid $blue;
    }
    .select-component {
      background-color: #fff;
      border: 1px solid #ccc;
      //更改 select icon樣式
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
    }
    .btn-ok,
    .btn-cancel {
      width: 6vw;
      height: 32px;
      padding: 0 12px;
      border-radius: 16px;
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
      color: #fff;
      background-color: $blue;
      border: 1px solid $blue;
    }
  }
</style>
