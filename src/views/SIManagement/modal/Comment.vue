<template>
  <TemplateModal :width="33">
    <template v-slot:default>
      <div class="m-close"><font-awesome-icon icon="times" size="2x" @click="cancel" /></div>
      <div class="m-modal-title text-center">其他意見</div>
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
      <div class="message text-left my-4">
        {{ selectedData.message }}
        <div class="photo-section text-left my-4 mx-0 row" v-if="selectedData.photos && selectedData.photos.length > 0">
          <div class="col-6 photo-container my-2" v-for="(item, index) in selectedData.photos" v-bind:key="index">
            <img
              class="photo"
              role="button"
              :src="'https://' + prefix + '/' + item.storage_path"
              @click="showPhotoInNewWindow(item.storage_path)"
            />
          </div>
        </div>
      </div>

      <b-button class="btn-ok" @click="showReplyModal">回覆意見</b-button>
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
    methods: {
      cancel() {
        this.$emit("cancel");
      },
      showReplyModal() {
        this.$emit("showReplyModal");
      },
      showPhotoInNewWindow(path) {
        window.open(`${this.$origin}/${path}`, "_blank");
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
  .message {
    margin: 0 -15px;
    padding-left: 30px;
    width: 33vw;
    overflow-wrap: break-word;
    max-height: 300px;
    overflow-x: hidden;
    .photo-section {
      .photo-container {
        height: 150px;
        overflow: hidden;
        .photo {
          width: 100%;
        }
      }
    }
  }
  .btn-ok {
    width: 6vw;
    height: 32px;
    padding: 0 12px;
    border-radius: 16px;
    color: #fff;
    background-color: $blue;
    border: 1px solid $blue;
    @media (max-width: 1200px) {
      width: 40%;
      margin: 5px 0;
    }
  }
</style>
