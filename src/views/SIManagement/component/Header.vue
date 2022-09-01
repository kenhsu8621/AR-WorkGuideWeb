<template>
  <div class="header-container">
    <div class="tabs float-left">
      <img class="ar-logo" src="~@/assets/images/logo-digiwin-alt.png" />
      <span class="ar-title">{{ title }}</span>
      <span class="si" v-if="type == 1">SI管理中心</span>
      <span class="enterprise" v-if="type == 2">企業管理中心</span>
      <span class="fii" v-if="type == 3">Fii管理中心</span>
    </div>

    <!-- <div class="login float-right">Amber Liu <font-awesome-icon icon="angle-down" class="ml-2" /></div> -->
    <div class="login float-right">
      <b-dropdown :text="userinfo.name" class="login-color" variant="outline-light" border-transparent>
        <!-- <b-dropdown-item @click="type = 1">SI管理中心</b-dropdown-item>
        <b-dropdown-item @click="type = 2">企業管理中心</b-dropdown-item>
        <b-dropdown-item @click="type = 3">Fii管理中心</b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider> -->
        <b-dropdown-item @click="$logout()">登出</b-dropdown-item>
      </b-dropdown>
    </div>
    <!-- <div class="cancel mx-auto text-right">
      <router-link :to="pageUrl">
        <font-awesome-icon icon="times" size="2x" />
      </router-link>
    </div> -->
  </div>
</template>

<script>
  export default {
    name: "Header",

    props: {
      title: String,
    },
    data: () => ({
      type: 1,
      userinfo: "",
    }),
    mounted() {
      this.getUserInfo();
    },
    methods: {
      getUserInfo() {
        this.userinfo = this.$cookies.get("user");
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .header-container {
    width: 100%;
    height: 75px;
    position: fixed;
    top: 0;
    z-index: 900;
    color: #fff;
    background-color: #313131;
    .tabs {
      margin-left: 10px;
      line-height: 75px;
      .ar-logo {
        margin-right: 80px;
      }
      .ar-title {
        margin-right: 30px;
      }
    }
    .login {
      margin-right: 25px;
      margin-top: 20px;
    }
  }
  /deep/ .btn-outline-light {
    border: none !important;
  }
</style>
