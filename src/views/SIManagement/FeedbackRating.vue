<template>
  <div class="feedback-rating">
    <Searchbar @search="searchCallRatingList" />
    <div class="filter-section">
      <b-form-select
        v-model="selectedEnterprise"
        :options="enterpriseList"
        class="select-component ml-3 my-4"
        @change="getCallRatingList(selectedEnterprise)"
      ></b-form-select>
    </div>
    <div class="m-table-container">
      <table class="m-table mx-auto">
        <thead>
          <tr class="m-tr tr-item">
            <th class="m-th">
              <div class="m-th-content"><span>企業</span></div>
            </th>
            <th class="m-th">
              <div class="m-th-content"><span>帳號</span></div>
            </th>
            <th class="m-th">
              <div class="m-th-content"><span>用戶名稱</span></div>
            </th>
            <th class="m-th">
              <div class="m-th-content"><span>通話評分</span></div>
            </th>
            <th class="m-th">
              <div class="m-th-content"><span>標註評分</span></div>
            </th>
            <th class="m-th">
              <div class="m-th-content"><span>其他意見</span></div>
            </th>
            <th class="m-th">
              <div class="m-th-content"><span>評分時間</span></div>
            </th>
            <th class="m-th">
              <div class="m-th-content"><span>回覆用戶</span></div>
            </th>
            <th class="m-th">
              <div class="m-th-content"><span>回覆紀錄</span></div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="m-tr tr-list" v-for="(item, index) in callRatingList" :key="index">
            <td class="m-td">
              <span class="m-value">
                {{ item.enterprise }}
              </span>
            </td>
            <td class="m-td">
              <span class="m-value">{{ item.account }}</span>
            </td>
            <td class="m-td">
              <span class="m-value">{{ item.name }}</span>
            </td>
            <td class="m-td">
              <span class="m-value">{{ item.stream_rate }}</span>
            </td>
            <td class="m-td">
              <span class="m-value">{{ item.tag_rate }}</span>
            </td>
            <td class="m-td">
              <div class="float-left">{{ item.message ? item.message : "尚未有紀錄" }}</div>
              <div class="user-log float-left" role="button" @click="showModal('comment', item)"></div>
            </td>

            <td class="m-td">
              <span class="m-value">{{ GetDatetimeString(item.created_time) }}</span>
            </td>
            <td class="m-td">
              <div class="comments" role="button" @click="showModal('reply', item)"></div>
            </td>
            <td class="m-td">
              <div class="float-left">
                {{ item.responsed_time ? GetDatetimeString(item.responsed_time) : "尚未有紀錄" }}
              </div>
              <div
                v-if="item.responsed_time"
                class="user-log float-left"
                role="button"
                @click="showModal('replyList', item)"
              ></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Comment
      v-if="modalType.comment"
      :selectedData="selectedData"
      @cancel="closeModal('comment', false)"
      @showReplyModal="showReplyModal"
    ></Comment>
    <Reply
      v-if="modalType.reply"
      :selectedData="selectedData"
      @ok="closeModal('reply', true)"
      @cancel="closeModal('reply', false)"
    ></Reply>
    <ReplyList
      v-if="modalType.replyList"
      :selectedData="selectedData"
      @cancel="closeModal('replyList', false)"
    ></ReplyList>
  </div>
</template>

<script>
  import Searchbar from "./component/Searchbar";
  import Comment from "./modal/Comment";
  import Reply from "./modal/Reply";
  import ReplyList from "./modal/ReplyList";

  import { GetDatetimeString } from "@/utils/date";

  export default {
    components: {
      Searchbar,
      Comment,
      Reply,
      ReplyList,
    },
    data: () => ({
      modalType: {
        comment: false,
        reply: false,
        replyList: false,
      },
      selectedData: null,
      callRatingList: [],
      enterpriseList: [{ value: 0, text: "所有企業" }],
      selectedEnterprise: 0,
    }),
    mounted() {
      this.getCallRatingList();
      this.getEnterpriseList();
    },
    methods: {
      GetDatetimeString,
      getCallRatingList(code) {
        let data = {
          code: code == 0 ? null : code,
        };
        this.apiGet("si/call_rating_list", data).then(({ data }) => {
          this.callRatingList = data.list;
        });
      },

      searchCallRatingList(keyword) {
        let data = {
          code: this.selectedEnterprise == 0 ? null : this.selectedEnterprise,
          keyword: keyword,
        };
        this.apiGet("si/call_rating_list", data).then(({ data }) => {
          this.callRatingList = data.list;
        });
      },

      getEnterpriseList() {
        this.apiGet("si/enterprise_list").then(({ data }) => {
          for (let enterprise of data.list) {
            this.enterpriseList.push({ value: enterprise.code, text: enterprise.name });
          }
        });
      },

      showModal(type, data) {
        if (data) this.selectedData = data;
        this.modalType[type] = true;
      },

      showReplyModal() {
        this.modalType.comment = false;
        this.modalType.reply = true;
      },

      closeModal(type, reload) {
        if (reload) this.getCallRatingList();
        this.modalType[type] = false;

        this.selectedData = null;
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";
  .feedback-rating {
    .filter-section {
      margin-right: 7vw;
      margin-top: 2px;

      .select-component {
        float: left;
        width: 300px;
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
      .add-btn {
        float: right;
        background-color: $blue;
        border: 1px solid $blue;
        height: 40px;
      }
    }
    .m-table-container {
      padding-left: 100px;
      font-size: 14px;

      .m-table {
        box-sizing: border-box;
        border: 1px solid #d0d0d0;
        border-radius: 5px;
        width: 80vw;

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
          height: 60px;
          line-height: 60px;
        }
        .tr-list {
          height: 40px;
          line-height: 40px;
        }
        .m-td {
          text-align: left;
          padding-left: 15px;
          height: 45px;
          .edit-img {
            font-size: 20px;
            color: #7f7f7f;
            &:hover {
              color: $blue;
            }
          }
          .user-log {
            width: 25px;
            height: 25px;
            margin-top: 5px;
            background-image: url("~@/assets/images/management/user-log.svg");
            background-repeat: no-repeat;
            transform: rotate(180deg);
            &:hover {
              background-image: url("~@/assets/images/management/user-log-hover.svg");
            }
          }
          .comments {
            width: 25px;
            height: 25px;
            margin-top: 5px;
            background-image: url("~@/assets/images/management/comments.svg");
            background-repeat: no-repeat;
            &:hover {
              background-image: url("~@/assets/images/management/comments-hover.svg");
            }
          }
        }
      }
    }
  }
</style>
