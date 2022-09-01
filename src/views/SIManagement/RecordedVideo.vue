<template>
  <div class="recorded-video">
    <div class="filter-section">
      <date-picker
        v-model="timeRange"
        range
        value-type="format"
        format="YYYY-MM-DD"
        :clearable="false"
        @change="updateRange(timeRange)"
        class="m-date-picker ml-3 mr-2 mt-4 float-left"
      ></date-picker>
      <b-form-select
        v-model="selectedAccountOrFileName"
        :options="accountOrFileNameList"
        class="select-component mr-2 mt-4 float-left"
      ></b-form-select>
      <div class="ra-form-group mr-2 mt-4 float-left">
        <input type="text" class="form-control" placeholder="請輸入與會者帳號" />
      </div>
      <b-form-select
        v-model="selectedEnterprise"
        :options="enterpriseList"
        class="select-component mr-2 mt-4 float-left"
      ></b-form-select>
      <b-form-select
        v-model="selectedType"
        :options="typeList"
        class="select-component mr-2 mt-4 float-left"
      ></b-form-select>
      <b-form-select
        v-model="selectedTag"
        :options="tagList"
        class="select-component mr-2 mt-4 float-left"
      ></b-form-select>
      <b-button class="search-btn mr-2 mt-4 float-left" @click="showModal('createEnterpriseAccount')">搜尋</b-button>
    </div>

    <div class="recycle-bin-section mx-3 text-right">
      <!-- <span class="file-desc">檔案共125GB</span> -->
      <strong class="file-desc mr-2">檔案共125GB</strong>
      <b-button class="delete-selected mr-2" @click="showModal('createEnterpriseAccount')">刪除選取的檔案</b-button>
      <b-button class="delete-all mr-2" @click="showModal('createEnterpriseAccount')">全部刪除</b-button>
      <strong class="recycle-bin-link" role="button">垃圾桶 (10)</strong>
    </div>

    <div class="m-table-container mx-3">
      <table class="m-table mx-auto">
        <thead>
          <tr class="m-tr tr-item">
            <th class="m-th">
              <div class="m-th-content">
                <span>企業</span>
                <!-- TODO: Sort 功能待完成
                <div class="m-th-sort" role="button">
                  <font-awesome-icon class="icon-up" icon="caret-up" />
                  <font-awesome-icon class="icon-down" icon="caret-down" />
                </div> -->
              </div>
            </th>
            <th class="m-th">
              <div class="m-th-content">
                <span>類型</span>
                <div class="m-th-sort" role="button"></div>
              </div>
            </th>
            <th class="m-th">
              <div class="m-th-content">
                <span>檔案名稱</span>
                <div class="m-th-sort" role="button"></div>
              </div>
            </th>
            <th class="m-th">
              <div class="m-th-content">
                <span>與會者帳號</span>
                <div class="m-th-sort" role="button"></div>
              </div>
            </th>
            <th class="m-th">
              <div class="m-th-content"><span>錄製時間</span></div>
            </th>
            <th class="m-th">
              <div class="m-th-content"><span>通話長度</span></div>
            </th>
            <th class="m-th">
              <div class="m-th-content"><span>檔案大小</span></div>
            </th>
            <th class="m-th">
              <div class="m-th-content"><span>標籤</span></div>
            </th>
            <th class="m-th">
              <div class="m-th-content"><span>修改紀錄</span></div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="m-tr tr-list" v-for="(item, index) in videoList" :key="index">
            <td class="m-td">
              <span class="m-value">
                {{ item.enterprise }}
              </span>
            </td>
            <td class="m-td">
              <span class="m-value">{{ item.type }}</span>
            </td>
            <td class="m-td">
              <span class="m-value">{{ item.file_name }}</span>
            </td>
            <td class="m-td">
              <div class="accounts">
                <span class="m-value" v-for="(account, index) in item.accounts" :key="index">
                  {{ account.account }}<span v-if="item.accounts">, </span></span
                >
              </div>
            </td>
            <td class="m-td">
              <span class="m-value">{{ GetDatetimeString(item.recorded_time) }}</span>
            </td>
            <td class="m-td">
              {{ item.video_length }}
            </td>
            <td class="m-td">
              <span class="m-value">{{ item.file_size }}</span>
            </td>
            <td class="m-td">
              <!-- {{ item.tags }} -->
              <b-button class="tags mx-1" v-for="(tag, index) in item.tags" :key="index"> {{ tag }}</b-button>
            </td>
            <td class="m-td">
              <div class="float-left">{{ item.update_time }}</div>
              <div class="user-log float-left" role="button" @click="showModal('enterpriseUserLog', item)"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import DatePicker from "vue2-datepicker";
  import "vue2-datepicker/index.css";
  import { GetDatetimeString } from "@/utils/date";

  export default {
    components: {
      DatePicker,
    },
    data: () => ({
      modalType: {
        // createEnterpriseAccount: false,
        // updateEnterpriseAccount: false,
        // enterpriseUserLog: false,
      },
      selectedData: null,
      timeRange: ["2021-01-01", "2021-09-01"],
      beginTime: null,
      endTime: null,
      accountOrFileNameList: [
        { value: 0, text: "搜尋與會者帳戶" },
        { value: 1, text: "搜尋檔案名稱" },
      ],
      enterpriseList: [{ value: 0, text: "所有企業" }],
      typeList: [
        { value: 0, text: "所有通話" },
        { value: 1, text: "一對一" },
        { value: 2, text: "多人" },
      ],
      tagList: [
        { value: 0, text: "所有標籤" },
        { value: 1, text: "母項目1" },
        { value: 2, text: "母項目1/子項目1" },
        { value: 1, text: "母項目2" },
        { value: 2, text: "母項目2/子項目1" },
        { value: 2, text: "母項目2/子項目2" },
      ],
      selectedAccountOrFileName: 0,
      selectedEnterprise: 0,
      selectedType: 0,
      selectedTag: 0,
      videoList: [
        {
          enterprise: "ABC_Company",
          type: "多人",
          file_name: "20211231",
          accounts: [{ account: "Stella001" }, { account: "Jino001" }, { account: "Sandy123" }, { account: "Yang005" }],
          recorded_time: "2021/05/31 20:30",
          video_length: "00:12:22",
          file_size: "125MB",
          tags: ["工具機A", "製程C", "ABCD"],
          update_time: "2021/06/15 19:55",
        },
        {
          enterprise: "ZZZ_Company",
          type: "多人",
          file_name: "20210707",
          accounts: [{ account: "Stella002" }, { account: "Jino002" }, { account: "Sandy456" }, { account: "Yang010" }],
          recorded_time: "2021/07/10 20:30",
          video_length: "00:12:22",
          file_size: "125MB",
          tags: ["工具機A", "製程C"],
          update_time: "2021/09/25 19:55",
        },
      ],
      selectedVideoList: [],
    }),
    mounted() {
      // this.getEnterpriseUserList();
      this.getEnterpriseList();
    },
    methods: {
      GetDatetimeString,
      getEnterpriseList() {
        this.apiGet("si/enterprise_list").then(({ data }) => {
          for (let enterprise of data.list) {
            this.enterpriseList.push({ value: enterprise.code, text: enterprise.name });
          }
        });
      },
      updateRange(timeRange) {
        this.beginTime = timeRange[0];
        this.endTime = timeRange[1];
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .recorded-video {
    .filter-section {
      height: 65px;
      padding-left: 100px;
      .m-date-picker {
        width: 300px;
      }
      .ra-form-group {
        width: 180px !important;
        .form-control {
          font-size: 14px !important;
          height: 38px !important;
          background-color: #fff;
          border: 1px solid #ccc;
          &::placeholder {
            color: $placeholder;
          }
        }
      }
      .select-component {
        width: 180px;
        height: 38px;
        color: $placeholder;
        font-size: 14px !important;
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
      .search-btn {
        width: 100px;
        height: 38px;
        background-color: $blue;
        border: 1px solid $blue;
      }
    }
    .recycle-bin-section {
      height: 65px;
      line-height: 60px;
      font-size: 14px;
      .file-desc {
        color: #7f7f7f;
      }
      .delete-selected {
        font-size: 14px;
        color: $placeholder;
        border: 1px solid #ccc;
        background-color: #fff;
      }
      .delete-all {
        font-size: 14px;
        color: $red;
        border: 1px solid $red;
        background-color: #fff;
      }
      .recycle-bin-link {
        color: $blue;
      }
    }
    .m-table-container {
      padding-left: 100px;
      // padding-right: 20px;
      font-size: 14px;

      .m-table {
        box-sizing: border-box;
        border: 1px solid #d0d0d0;
        border-radius: 5px;
        // width: 80vw;
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
          .tags {
            height: 30px;
            font-size: 12px;
            color: $grey;
            border: 1px solid #ccc;
            background-color: #fff;
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
        }
        .accounts {
          width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  /deep/ input {
    height: 38px !important;
  }
</style>
