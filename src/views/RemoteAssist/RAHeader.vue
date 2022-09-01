<template>
  <div class="header text-center" :class="{ 'height-unset': isCalling }">
    <transition name="top-fade" mode="out-in">
      <div class="row calling" v-if="isCalling">
        <div class="col-3 caller">
          <div class="prefix float-left ml-5 mr-3" role="button">
            <div class="prefix-text">{{ callName.slice(0, 1) }}</div>
          </div>
          <div class="float-left text-left">
            <div class="call-name">{{ callName }}</div>
            <div>邀請通話</div>
          </div>
        </div>
        <span class="col-6">提醒您，若您在完成儲存截圖前接通新的來電，本次截圖將無法再次儲存！</span>
        <div class="col-3">
          <div class="accept float-right mr-5" role="button">
            <font-awesome-icon icon="phone" size="2x" :transform="{ rotate: 90 }" @click="accept" />
          </div>
          <div class="decline float-right mx-3" role="button">
            <font-awesome-icon icon="phone" size="2x" :transform="{ rotate: 225 }" @click="decline" />
          </div>
        </div>
      </div>
    </transition>
    <div class="header-title text-center">{{ title }}</div>
    <div class="cancel mx-auto text-right" v-if="showCancelBtn && !isCalling">
      <router-link :to="pageUrl">
        <font-awesome-icon icon="times" size="2x" />
      </router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: "RAHeader",
    props: {
      title: String,
      showCancelBtn: Boolean,
      pageUrl: Object,
      isCalling: Boolean,
      callName: String,
    },
    methods: {
      accept() {
        this.$emit("accept", true);
      },
      decline() {
        this.$emit("accept", false);
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .header {
    width: 100%;
    height: 60px;
    position: fixed;
    top: 0;
    z-index: 900;
    color: #fff;
    .calling {
      height: 110px;
      line-height: 110px;
      background-color: #313131;
      box-shadow: 0px 3px 5px #00000080;
      border-bottom: 2px solid rgb(31, 31, 31);
      .prefix,
      .decline,
      .accept {
        margin-top: 15px;
        width: 75px;
        height: 75px;
        line-height: 85px;
        border-radius: 50%;
      }
      .prefix {
        background-color: #b7b7b7;
        .prefix-text {
          font-size: 30px;
          margin-top: -5px;
        }
      }
      .decline {
        background-color: $red;
      }
      .accept {
        background-color: $green;
      }
      .call-name {
        margin-top: -12px;
        height: 24px;
        font-size: 24px;
      }
    }
    .header-title {
      height: 60px;
      line-height: 60px;
      font-size: 24px;
      background-color: #313131;
    }
    .cancel {
      width: 600px;
      margin-top: -45px;
      a {
        color: #fff;
        &:hover {
          color: #ddd;
        }
      }
    }
  }
  .height-unset {
    height: unset;
  }
</style>
