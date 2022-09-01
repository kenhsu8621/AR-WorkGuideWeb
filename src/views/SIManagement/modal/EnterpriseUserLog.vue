<template>
  <TemplateModal :width="33">
    <template v-slot:default>
      <div class="m-close"><font-awesome-icon icon="times" size="2x" @click="cancel" /></div>
      <div class="m-modal-title text-center">修改紀錄</div>
      <div class="record-info row mt-4 mb-2 mx-0">
        <div class="col-6 text-left">
          <strong class="m-label mr-3">企業名稱</strong>
          <span class="m-text">{{ selectedData.enterprise }}</span>
        </div>
        <div class="col-6 text-left">
          <strong class="m-label mr-3">企業代碼</strong>
          <span class="m-text">{{ selectedData.code }}</span>
        </div>
      </div>
      <div class="m-table-container">
        <table class="m-table mx-auto">
          <thead>
            <tr class="m-tr tr-item">
              <th class="m-th">
                <div class="m-th-content">
                  <span>編輯帳號</span>
                </div>
              </th>
              <th class="m-th">
                <div class="m-th-content">
                  <span>內容</span>
                  <div class="m-th-sort" role="button"></div>
                </div>
              </th>
              <th class="m-th">
                <div class="m-th-content">
                  <span>時間</span>
                  <div class="m-th-sort" role="button"></div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="m-tr tr-list" v-for="(item, index) in enterpriseUserLog" :key="index">
              <td class="m-td">
                <span class="m-value">
                  {{ item.operator_id }}
                </span>
              </td>
              <td class="m-td">
                <span class="m-value">{{ item.id }}</span>
              </td>
              <td class="m-td">
                <span class="m-value">{{ item.time }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
      enterpriseUserLog: [],
    }),
    mounted() {
      this.getEnterpriseUserLog();
    },
    methods: {
      getEnterpriseUserLog() {
        let data = {
          account: this.selectedData.account,
          code: this.selectedData.code,
          // page: this.page,
          // per_page: this.per_page,
        };
        this.apiGet("si/enterprise_user_log", data).then(({ data }) => {
          this.enterpriseUserLog = data;
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
  .m-close {
    position: absolute;
    top: 15px;
    right: 15px;
    color: #aaa;
    cursor: pointer;
    &:hover {
      color: #999;
    }
  }
  .m-modal-title {
    font-size: 20px;
    font-weight: bold;
  }
  .record-info {
    .col-6 {
      width: 150px;
      .m-text {
        color: #5f5f5f;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .m-table-container {
    padding: 15px;
    font-size: 14px;

    .m-table {
      box-sizing: border-box;
      border: 1px solid #d0d0d0;
      border-radius: 5px;
      width: 100%;

      .m-th {
        background-color: #eaeaea;
        text-align: left;
        padding-left: 15px;

        .m-th-content {
          font-size: 14px;
          font-weight: bold;

          .m-th-sort {
            position: relative;
            float: right;
            margin-left: -10px;
            margin-top: 10px;
            .icon-up {
              position: absolute;
            }
            .icon-down {
              position: absolute;
              top: 7px;
            }
          }
        }
      }
      .m-tr {
        border: 1px solid #ccc;
        &:hover {
          background-color: #f6f6f6;
        }
      }
      .tr-item {
        height: 44px;
        line-height: 44px;
      }
      .tr-list {
        color: #aeaeae;
        height: 40px;
        line-height: 40px;
      }
      .m-td {
        text-align: left;
        padding-left: 15px;
        height: 44px;
      }
    }
  }
</style>
