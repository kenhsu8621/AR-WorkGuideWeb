<template>
  <TemplateModal :width="33">
    <template v-slot:default>
      <div class="m-modal-title text-center">編輯企業</div>
      <form @submit.prevent="updateEnterprise">
        <div class="ra-form-group row">
          <div class="col-2"></div>
          <div class="col-8 row">
            <div class="col-3 m-label text-right">企業名稱</div>
            <input type="text" v-model="form.name" :placeholder="selectedData.name" class="col-9 form-control" />
          </div>
          <div class="col-2"></div>
        </div>
        <div class="ra-form-group row">
          <div class="col-2"></div>
          <div class="col-8 row">
            <div class="col-3 m-label text-right">企業代碼</div>
            <input
              type="text"
              disabled
              v-model="form.code"
              :placeholder="selectedData.code"
              class="col-9 form-control"
              style="color:#b7b7b7"
            />
          </div>
          <div class="col-2"></div>
        </div>
        <div class="ra-form-group row">
          <div class="col-2"></div>
          <div class="col-8 row">
            <div class="col-3 m-label text-right">帳號數</div>
            <input
              type="text"
              v-model="form.account_count"
              :placeholder="selectedData.account_count"
              class="col-9 form-control"
            />
          </div>
          <div class="col-2"></div>
        </div>
        <div class="ra-form-group row">
          <div class="col-2"></div>
          <div class="col-8 row">
            <div class="col-3 m-label text-right">起始日期</div>
            <input
              type="text"
              v-model="form.begin_time"
              :placeholder="GetDateString(selectedData.begin_time)"
              class="col-9 form-control"
            />
          </div>
          <div class="col-2"></div>
        </div>
        <div class="ra-form-group row">
          <div class="col-2"></div>
          <div class="col-8 row">
            <div class="col-3 m-label text-right">到期日期</div>
            <input
              type="text"
              v-model="form.end_time"
              :placeholder="GetDateString(selectedData.end_time)"
              class="col-9 form-control"
            />
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

  import { GetDateString, GetDatetimeString } from "@/utils/date";

  export default {
    components: {
      TemplateModal,
    },
    props: {
      selectedData: Object,
    },
    created() {
      this.form.name = this.selectedData.name;
      this.form.code = this.selectedData.code;
      this.form.account_count = this.selectedData.account_count;
      this.form.begin_time = this.GetDateString(this.selectedData.begin_time);
      this.form.end_time = this.GetDateString(this.selectedData.end_time);
    },
    data: () => ({
      form: {
        name: null,
        code: null,
        account_count: null,
        begin_time: null,
        end_time: null,
      },
    }),
    methods: {
      GetDateString,
      GetDatetimeString,
      updateEnterprise() {
        let data = {
          name: this.form.name,
          code: this.selectedData.code,
          account_count: this.form.account_count,
          begin_time: this.getBeginDate(this.form.begin_time),
          end_time: this.getEndDate(this.form.end_time),
        };
        this.apiPost("si/update_enterprise", data).then(({ data }) => {
          this.$emit("ok");
        });
      },
      cancel() {
        this.$emit("cancel");
      },
      getBeginDate(str) {
        let date = new Date(str);
        if (isNaN(date.getTime())) return "";
        date.setHours(0, 0, 0, 0);
        console.log(date);
        return GetDatetimeString(date);
      },
      getEndDate(str) {
        let date = new Date(str);
        if (isNaN(date.getTime())) return "";
        date.setHours(23, 59, 59, 999);
        console.log(date);
        return GetDatetimeString(date);
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
