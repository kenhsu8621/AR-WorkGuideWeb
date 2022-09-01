<template>
  <TemplateModal :width="33">
    <template v-slot:default>
      <div class="m-modal-title text-center">新增運維帳號</div>
      <form @submit.prevent="createUser">
        <div class="ra-form-group row">
          <div class="col-2"></div>
          <div class="col-8 row">
            <div class="col-3 m-label text-right">帳號</div>
            <input
              type="text"
              v-model="form.account"
              :placeholder="$t('FORM.ACCOUNT_PLACEHOLDER')"
              class="col-9 form-control"
            />
            <div class="col-3"></div>
            <small class="col-9 form-text text-left p-0">請輸入6-20字英文或數字組合</small>
          </div>
          <div class="col-2"></div>
        </div>

        <div class="ra-form-group row">
          <div class="col-2"></div>
          <div class="col-8 row">
            <div class="col-3 m-label text-right">密碼</div>
            <input
              type="password"
              v-model="form.password"
              :placeholder="$t('FORM.PW_PLACEHOLDER')"
              autocomplete="off"
              class="col-9 form-control"
            />
            <div class="col-3"></div>
            <small class="col-9 form-text text-left p-0">請輸入6-20字英文或數字組合</small>
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
              placeholder="example@mail.com"
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
            <input
              type="text"
              v-model="form.name"
              :placeholder="$t('FORM.NAME_PLACEHOLDER')"
              class="col-9 form-control"
            />
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
    data: () => ({
      form: {
        account: null,
        password: null,
        email: null,
        name: null,
        is_admin: 0,
      },
      roleList: [
        // { value: 0, text: "選擇帳號角色", disabled: true },
        { value: 0, text: "SI User" },
        { value: 1, text: "SI Admin" },
      ],
    }),
    methods: {
      createUser() {
        let data = {
          account: this.form.account,
          // password: this.form.password,
          password: this.CryptoJS.MD5(this.form.password).toString(),
          email: this.form.email,
          name: this.form.name,
          is_admin: this.form.is_admin,
        };
        this.apiPost("si/create_user", data).then(({ data }) => {
          this.$emit("ok");
        });
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
      line-height: 40px;
    }
    .form-control {
      height: 40px !important;
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
