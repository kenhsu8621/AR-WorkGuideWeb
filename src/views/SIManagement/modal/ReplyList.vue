<template>
  <TemplateModal :width="33">
    <template v-slot:default>
      <div class="m-close"><font-awesome-icon icon="times" size="2x" @click="cancel" /></div>
      <div class="m-modal-title text-center">回覆紀錄</div>
      <div class="record-info row mt-4 mb-2 mx-0">
        <div class="col-6 text-left">
          <strong class="m-label mr-3">帳號</strong>
          <span class="m-text">{{ selectedData.account }}</span>
        </div>
        <div class="col-6 text-left">
          <strong class="m-label mr-3">用戶名稱</strong>
          <span class="m-text">{{ selectedData.name }}</span>
        </div>
      </div>
      <div class="response-section">
        <div class="response-component" v-for="item in replyList" :key="item.index">
          <div class="response-title">
            <div class="float-left pt-3 pb-2">{{ item.title }}</div>
            <div class="float-right pt-3 pb-2">{{ item.time }}</div>
          </div>
          <div class="response-content p-3">
            <pre class="text-left">{{ item.content }}</pre>
          </div>
          <hr />
        </div>
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
      replyList: [],
    }),
    mounted() {
      this.getReplyList();
    },
    methods: {
      getReplyList() {
        if (this.selectedData.contact_us_id) {
          let data = {
            contact_us_id: this.selectedData.contact_us_id,
            // page: this.page,
            // per_page: this.per_page,
          };
          this.apiGet("si/contact_us_response_list", data).then(({ data }) => {
            this.replyList = data;
          });
        } else {
          let data = {
            rate_id: this.selectedData.rate_id,
            // page: this.page,
            // per_page: this.per_page,
          };
          this.apiGet("si/call_rating_response_list", data).then(({ data }) => {
            this.replyList = data;
          });
        }
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
      .m-text {
        color: #5f5f5f;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .response-section {
    margin: 0 15px;
    max-height: 400px;
    overflow-x: hidden;
    .response-component {
      margin-right: 10px;
      .response-content {
        width: 100%;
        background-color: #eaeaea;
        border: 1px solid #ccc;
        overflow-x: hidden;
        pre {
          overflow-wrap: break-word;
          white-space: pre-wrap;
        }
      }
    }
  }
</style>
