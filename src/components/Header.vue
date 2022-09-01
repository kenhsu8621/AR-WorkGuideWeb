<template>
  <div class="header row m-0">
    <div class="col-9 header-title text-left">
      <span role="button" @click="toPage('Home')">
        <img class="header-icon mr-2" src="~@/assets/images/wg-logo.png" />
        <span class="header-main-title">{{ $t("GENERAL.TITLE") }}</span>
        <span class="header-sub-title ml-2">{{ title }}</span>
      </span>
    </div>
    <div class="col-3 login text-right">
      <router-link :to="{ name: 'RAContact' }" v-if="user.admin">
        <button class="btn call-btn mr-3">{{ $t("HEADER.CALL") }}</button>
      </router-link>

      <img class="user-icon" src="~@/assets/images/user.svg" />
      <b-dropdown :text="getUserName" variant="outline-none" border-transparent>
        <b-dropdown-item @click="toPage('Settings')">{{ $t("GENERAL.SETTINGS") }}</b-dropdown-item>
        <b-dropdown-item @click="showModal('logout')">
          <span>{{ $t("HEADER.LOGOUT") }}</span>
        </b-dropdown-item>
      </b-dropdown>
    </div>

    <Logout v-if="modalType.logout" @cancel="closeModal('logout', false)"></Logout>
  </div>
</template>

<script></script>

<script>
  import Logout from "@/components/modal/Logout";
  export default {
    components: {
      Logout,
    },
    props: {
      title: String,
      showCancelBtn: Boolean,
      pageUrl: Object,
      isCalling: Boolean,
      callName: String,
    },
    data: () => ({
      modalType: {
        logout: false,
      },
      user: {},
    }),
    created() {
      this.user = this.$cookies.get("user") || {};
    },
    methods: {
      toPage(pathName) {
        this.$router.push({ name: pathName });
      },

      showModal(type, data) {
        if (data) {
          this.selectedData = data;
        }
        this.modalType[type] = true;
      },

      closeModal(type) {
        this.modalType[type] = false;
        this.selectedData = null;
      },
    },
    computed: {
      getUserName() {
        return (this.$cookies.get("user") || {}).account;
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .header {
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 99999;
    color: #fff;
    background: linear-gradient(
      60deg,
      rgba(0, 0, 0, 1) 0%,
      rgba(42, 55, 70, 1) 35%,
      rgba(18, 39, 77, 1) 70%,
      rgba(2, 55, 115, 1) 100%
    );

    .header-title {
      font-weight: bold;

      .header-icon {
        width: 40px;
        margin-top: -10px;
      }

      .header-main-title {
        line-height: 60px;
        font-size: 24px;
        text-decoration: none;
      }

      .header-sub-title {
        color: #b3d5f4;
        line-height: 60px;
        font-size: 22px;
        text-decoration: none;
      }
    }

    .login {
      height: 62px;
      line-height: 62px;
      font-size: 18px;

      .user-icon {
        margin-right: -5px;
        width: 18px;
      }

      .call-btn {
        color: #fff;
        &:hover {
          color: #ccc;
        }
      }

      /deep/ .btn-outline-none {
        color: #fff;
      }

      /deep/ .btn:focus {
        box-shadow: none;
      }

      /deep/ .dropdown-item {
        line-height: 30px;
      }
    }
  }
</style>
