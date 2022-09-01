<template>
  <div class="footer">
    <div class="row m-0">
      <div class="col-md-4 d-none d-md-block"></div>
      <div class="footer-nav col-md-4 col-12 row mx-0">
        <div class="footer-nav-item col-4">
          <router-link :to="{ name: 'RAContact' }" class="inactive" :class="{ active: contactStatus }">
            <font-awesome-icon icon="user-friends" size="2x" /><br />
            {{ $t("FOOTER.CONTACTS") }}
          </router-link>
        </div>
        <div class="footer-nav-item col-4">
          <router-link :to="{ name: 'RACallHistory' }" class="inactive" :class="{ active: callHistoryStatus }">
            <div class="counter" v-if="unread_count">
              {{ unread_count }}
            </div>
            <font-awesome-icon icon="clock" size="2x" /><br />{{ $t("FOOTER.RECENTS") }}
          </router-link>
        </div>
        <div class="footer-nav-item col-4">
          <router-link :to="{ name: 'RASettings' }" class="inactive" :class="{ active: settingsStatus }">
            <font-awesome-icon icon="cog" size="2x" /><br />{{ $t("FOOTER.SETTINGS") }}
          </router-link>
        </div>
      </div>
      <div class="col-md-4 d-none d-md-block"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Footer",
    props: {
      title: String,
    },
    data: () => ({
      unread_count: 0,
    }),
    mounted() {
      this.getUnreadCount();
    },
    computed: {
      contactStatus() {
        return this.$store.state.contact;
      },
      callHistoryStatus() {
        return this.$store.state.callHistory;
      },
      settingsStatus() {
        return this.$store.state.settings;
      },
    },
    methods: {
      getUnreadCount() {
        this.apiGet("user/info").then(({ data }) => {
          this.unread_count = data.userinfo.unread_count;
        });
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .footer {
    width: 100%;
    height: 75px;
    position: fixed;
    bottom: 0;
    z-index: 90;
    background-color: #fff;
    border-top: 1px solid #b1b1b1;
    text-align: center;
    .footer-nav {
      .footer-nav-item {
        margin-top: 10px;
        .inactive {
          color: $placeholder;
          text-decoration: none;
          &:hover {
            color: $placeholderHover;
          }
        }
        .active {
          color: $blue;
          text-decoration: none;
          &:hover {
            color: $blueHover;
          }
        }
        .counter {
          position: absolute;
          right: 3.8vw;
          top: -5px;
          color: #fff;
          background-color: $red;
          font-size: 12px;
          padding: 1px 6px;
          border-radius: 10px;
          @media (max-width: 1440px) {
            right: 3vw;
          }
          @media (max-width: 992px) {
            right: 2vw;
          }
          @media (max-width: 768px) {
            right: 12vw;
          }
          @media (max-width: 576px) {
            right: 10vw;
          }
        }
      }
    }
  }
</style>
