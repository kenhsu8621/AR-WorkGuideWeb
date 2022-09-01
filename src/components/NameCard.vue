<template>
  <div class="name-card-component mx-auto row" :class="{ pointer: type == 2 }" @click="onClick">
    <div class="col-1 left">
      <font-awesome-icon icon="phone" v-if="is_host" rotation="90" class="phone" />
      <font-awesome-icon icon="arrow-left" v-if="is_host" size="xs" rotation="90" class="arrow" />
    </div>
    <div class="col-2 left">
      <div class="icon">{{ prefix }}</div>
    </div>
    <div class="col-3 middle text-left pl-3 pt-4">
      <div class="target-name" :class="{ 'not-read': !isRead }">{{ target_name }}</div>
      <div class="is-share">{{ shareScreen }}</div>
    </div>
    <div class="col-6 right text-right">
      {{ transformedTime }}
    </div>
  </div>
</template>

<script>
  import dayjs from "dayjs";
  import isToday from "dayjs/plugin/isToday";
  import isYesterday from "dayjs/plugin/isYesterday";
  import constants from "@/constants";
  dayjs.extend(isToday);
  dayjs.extend(isYesterday);

  export default {
    name: "NameCard",
    props: {
      account: String,
      name: String,
      target_name: String,
      room_uuid: String,
      is_host: Boolean,
      is_share: Number,
      is_read: Number,
      room_created_at: String,
      callModal: Function,
      fileModal: Function,
      type: Number,
    },
    methods: {
      onClick() {
        if (this.type == 1) {
          return; // disable 回播功能
          // this.callModal(this.account, this.name);
        } else if (this.type == 2) {
          this.fileModal(this.room_uuid);
        }
      },
    },
    computed: {
      // 取使用者名稱字首作為大頭貼
      prefix: function() {
        return this.target_name.slice(0, 1);
      },
      shareScreen: function() {
        //是否為分享端
        if (this.type == 2) return this.$t("NAME_CARD.CONFERENCE_VIEW");
        else if (this.is_share == 1) return this.$t("NAME_CARD.MY_VIEW");
        else return this.$t("NAME_CARD.PARTNER_VIEW");
      },
      isRead: function() {
        if (this.is_read == 1) {
          return 1;
        } else return 0;
      },
      transformedTime: function() {
        let lastTime = new Date(this.room_created_at + "+0");
        let timeGap = Date.now() - lastTime.getTime();
        let timeGapToSeconds = Math.floor(timeGap / 1000);
        let weekDays = ["日", "一", "二", "三", "四", "五", "六"];
        let weekDaysEN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let lang = parseInt(this.$cookies.get("language")) || constants.Lang.CHINESE;

        if (dayjs(lastTime).isToday()) {
          let today = lastTime.getHours() + ":" + lastTime.getMinutes() + ":" + lastTime.getSeconds();
          return this.$t("NAME_CARD.TODAY") + today;
        } else if (dayjs(lastTime).isToday()) {
          return this.$t("NAME_CARD.YESTERDAY");
        } else if (timeGapToSeconds < 604800) {
          return (
            this.$t("NAME_CARD.WEEKDAY") +
            (lang == 0 ? weekDays : weekDaysEN)[new Date(this.room_created_at + "+0").getDay()]
          );
        } else {
          return new Date(this.room_created_at + "+0");
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .name-card-component {
    width: 33vw;
    height: 100px;
    background-color: #fff;
    border: 1px solid #fff;
    border-bottom: 1px solid $lightgrey;
    border-radius: 0;
    @media (max-width: 1440px) {
      width: 50vw;
    }
    @media (max-width: 992px) {
      width: 90vw;
    }
    .left,
    .right {
      line-height: 100px;
    }
    .left {
      color: $grey;
      .phone {
        position: absolute;
        top: 40%;
        left: 15px;
      }
      .arrow {
        position: absolute;
        top: 35%;
        left: 25px;
        transform: rotate(135deg);
      }
      .icon {
        position: absolute;
        top: 25%;
        left: 25%;
        height: 55px;
        line-height: 55px;
        width: 55px;
        color: #fff;
        background-color: lightgrey;
        font-size: 20px;
        border-radius: 50%;
      }
    }
    .middle {
      .target-name {
        font-weight: bold;
        color: #5f5f5f;
      }
      .is-share {
        color: $placeholder;
      }
      .not-read {
        color: $red;
      }
    }
    .right {
      font-size: 12px;
      color: $placeholder;
      overflow: hidden;
    }
  }

  .pointer {
    cursor: pointer;
  }
</style>
