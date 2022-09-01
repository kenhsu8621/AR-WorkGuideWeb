<template>
  <div class="backdrop">
    <div class="m-modal-container">
      <div class="m-close"><font-awesome-icon icon="times" size="2x" @click="cancel" /></div>
      <div class="m-modal-title text-center">回覆用戶意見</div>
      <!-- <div class="row"> -->
      <div class="comment-section mt-4 mb-2 mx-0 row">
        <div class="col-6 text-left">
          <strong class="m-label mr-3">帳號：</strong>
          <span class="m-text">{{ selectedData.account }}</span>
        </div>
        <div class="col-6 text-left">
          <strong class="m-label mr-3">用戶名稱：</strong>
          <span class="m-text">{{ selectedData.name }}</span>
        </div>
        <div class="col-12 message text-left my-4">
          <span class="m-text">{{ selectedData.name }}</span>
          {{ selectedData.message }}
          <div
            class="photo-section text-left my-4 mx-0 row"
            v-if="selectedData.photos && selectedData.photos.length > 0"
          >
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
      </div>

      <div class="reply-section mt-4 mb-2 text-left">
        <form @submit.prevent="reply">
          <div>
            <strong class="m-label mr-3">Mail to：</strong> <span class="m-text">{{ selectedData.account }}</span>
          </div>
          <div class="my-3">
            <strong class="m-label mr-3">標題：</strong>
            <input class="form-control reply-title" v-model="form.title" :maxlength="titleLimit" />
          </div>
          <textarea
            class="form-control my-2 reply-content"
            rows="10"
            :maxlength="contentLimit"
            v-model="form.content"
          ></textarea>
          <div class="text-right my-2">已輸入字數 {{ form.content.length }} / {{ contentLimit }}</div>

          <div class="text-center">
            <b-button class="btn-cancel mx-2" @click="cancel">取消</b-button>
            <b-button type="submit" class="btn-ok mx-2">儲存</b-button>
          </div>
        </form>
      </div>
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      selectedData: Object,
    },
    data: () => ({
      form: {
        title: "",
        content: "",
      },
      titleLimit: 200,
      contentLimit: 10000,
    }),
    methods: {
      reply() {
        if (this.selectedData.photos) {
          let data = {
            contact_us_id: this.selectedData.contact_us_id,
            title: this.form.title,
            content: this.form.content,
          };
          this.apiPost("si/contact_us_response", data).then(({ data }) => {
            this.$emit("ok");
          });
        } else {
          let data = {
            rate_id: this.selectedData.rate_id,
            title: this.form.title,
            content: this.form.content,
          };
          this.apiPost("si/call_rating_response", data).then(({ data }) => {
            this.$emit("ok");
          });
        }
      },
      cancel() {
        this.$emit("cancel");
      },
      showPhotoInNewWindow(path) {
        window.open(`${this.$origin}/${path}`, "_blank");
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";
  .backdrop {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99999;
    .m-modal-container {
      position: relative;
      background-color: #fff;
      border-radius: 5px;
      width: 70vw;
      margin: 15vh auto;
      padding: 50px 0;
      font-size: 14px;
      height: 600px;
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
      .comment-section {
        width: 45%;
        float: left;
        padding-left: 30px;
        .col-6 {
          .m-text {
            color: #5f5f5f;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
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
      }
      .reply-section {
        width: 50%;
        float: right;
        padding-right: 30px;
        .reply-title {
          width: 50%;
          display: inline;
        }
        .reply-content {
          resize: none;
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
    }
  }
</style>
