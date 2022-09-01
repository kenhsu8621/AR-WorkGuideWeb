<template>
  <div id="app">
    <transition name="slide-fade" mode="out-in" v-if="ready">
      <router-view :key="$route.name" ref="route" />
    </transition>

    <div v-if="noNetworkFlag" class="no-network-background">
      <p class="no-network-text">正在嘗試連線</p>
    </div>
    <b-modal
      id="modal"
      title="您正要離開截圖畫面"
      size="md"
      hide-header-close
      hide-footer
      no-close-on-backdrop
      centered
    >
      <div class="form-group my-3 mx-auto text-center">
        確定要離開截圖畫面? 截圖將不會被保存
        <b-button
          type="submit"
          class="confirm-btn mt-4 mb-3"
          aria-label="Close"
          data-dismiss="modal"
          style="width:140px !important"
          @click="callFromCapture('agree')"
          >{{ $t("GENERAL.OK") }}</b-button
        >
        <b-button
          type="submit"
          class="confirm-btn-alt mt-4 mb-3 ml-2"
          aria-label="Close"
          data-dismiss="modal"
          style="width:140px !important"
          @click="callFromCapture('decline')"
          >{{ $t("GENERAL.CANCEL") }}</b-button
        >
      </div>
    </b-modal>
    <b-modal id="notificationModal" ok-only :ok-title="$t('GENERAL.CONFIRM')" @ok="close" hide-header-close centered>
      <div class="success-check-modal text-center">
        <p class="title my-4">{{ $t("FORM.PERMISSIONS") }}</p>
        <p class="sub-title my-4">{{ $t("FORM.PERMISSIONS_DESC_1") }}</p>
        <a
          href="https://support.google.com/chrome/answer/3220216?co=GENIE.Platform%3DDesktop&hl=zh-Hant&oco=1"
          target="_blank"
          style="color: #2e83df"
          >{{ $t("FORM.PERMISSIONS_DESC_2") }}</a
        >
        <!-- TODO: 直接導到網站開啟權限的頁面，但僅適用於chrome -->
        <!-- chrome://settings/content/siteDetails?site="網站url" -->
      </div>
    </b-modal>
  </div>
</template>
route
<script>
  import "firebase/messaging";
  import { fcmMixin } from "@/mixin/fcmMixin";
  import { v4 as uuidv4 } from "uuid";
  import constants from "@/constants";

  export default {
    name: "App",
    mixins: [fcmMixin],
    data: () => ({
      isAgree: null,
      agreeCallback: null,
      ready: false,
    }),
    computed: {
      noNetworkFlag() {
        return this.$store.state.noNetworkFlag;
      },
    },
    created() {
      let that = this;
      this.getServerInfo();
      this.getUserInfo();
      // TODO: 改成從瀏覽器判斷語系
      this.getLang();
      if (!this.$cookies.isKey("language")) this.$cookies.set("language", constants.Lang.CHINESE);

      window.getWS = function() {
        return new Promise((resolve, reject) => {
          let retry = 0;
          let func = () => {
            if (!this.ws) this.ws = this.createWS();
            if (this.ws) {
              // TODO: 首頁會報錯
              if (this.ws.readyState === WebSocket.OPEN && this.ws.isRegistered) return resolve(this.ws);

              if (this.ws.readyState === WebSocket.CLOSED || this.ws.readyState === WebSocket.CLOSING) {
                this.ws.close();
                this.ws = null;
              }
              if (++retry >= 100) reject("Get WebSocket Failed");
              return setTimeout(func, 10);
            }
          };
          func();
        });
      };

      window.destroyWs = function() {
        this.ws.close();
        this.ws = null;
        clearInterval(window.checkInterval);
      };

      window.createWS = function() {
        console.log("createWS");
        try {
          let token = that.$cookies.get("token");
          let account = that.$cookies.get("user")?.account;
          if (!token || !account) return null;
          let url = `${that.$ws}/notify`;
          let ws = new WebSocket(url);
          window.checkInterval = setInterval(() => {
            if (account != that.$cookies.get("user")?.account) {
              clearInterval(window.checkInterval);
              if (this.ws) {
                this.ws.close();
                this.ws = null;
                this.location.reload();
              }
            }
          }, 100);

          ws.onopen = () => ws.sendMessage("Register", { token });
          ws.sendObj = (obj) => ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify(obj));

          ws.sendMessage = (type, payload) => ws.sendObj({ type, payload });
          ws.onError = (err) => console.log(err.toString());
          ws.onmessage = function(evt) {
            if (evt.data instanceof Blob) {
              let reader = new FileReader();
              reader.onload = () => this.handleMessage(reader.result);
              reader.readAsText(evt.data);
            } else this.handleMessage(evt.data);
          };
          ws.handleMessage = function(result) {
            try {
              let data = JSON.parse(result);
              let type = data.type;
              let payload = data.payload;
              console.log(`receive websocket message type: ${type}`);
              // return result message
              if (payload.result) {
                if (payload.result.Code == 4000) {
                  this.isRegistered = true;
                } else if (payload.result.Code < 0) console.log(payload.result.Message);
                return;
              }
              if (this[type]) this[type](payload);
              else console.log(JSON.stringify(data));
            } catch (e) {
              console.log(e);
              console.log(result);
            }
          };
          // ws["Notification"] = (payload) => {
          //   console.log("receive websocket notification");
          //   console.log(payload);
          //   that.handleNotification(payload);
          // };
          return ws;
        } catch (e) {
          console.log(e);
          return null;
        }
      };
      setInterval(() => {
        if (!that.$cookies.get("token")) return;
        window
          .getWS()
          .then((ws) => {
            if (!ws || ws["Notification"]) return;
            ws["Notification"] = (payload) => {
              console.log(payload);
              if (payload.reason == "3") {
                that.$alert("您撥打的對象無法作為分享端，通話已取消");
              }
              this.handleNotification(payload);
            };
          })
          .catch((e) => {
            console.log(e);
          });
      }, 500);
    },
    mounted() {
      window.test = this;
      // if (this.$cookies.get("deploy_type") == "digiwin") {
      //   this.$store.state.deployType = 2;
      //   document.title = "AR遠程協同";
      // } else {
      //   this.$store.state.deployType = 1;
      // document.title = "AR遠程協作";
      // }
      this.$changeTitle();
      this.initFCM();
      let that = this;

      this.$messaging.onMessage((payload) => {
        console.log(`receive notification`, payload);
        that.handleNotification(payload.data);

        // let notification = new Notification("call from " + (payload.data && payload.data.callName), {
        //   data: payload.data,
        //   body: payload.body,
        //   icon: payload.icon,
        // });
        // notification.onclick = function(e) {
        //   // 綁定點擊事件
        //   e.preventDefault(); // prevent the browser from focusing the Notification's tab
        //   // window.open(notifyMsg.click_action);
        //   that.handleNotification(payload.data);
        // };
      });
      this.initNotify();
    },
    methods: {
      getLang() {
        let userLang = (navigator.language || navigator.userLanguage).toLowerCase();
        if (userLang.indexOf("zh") != -1) {
          if (userLang.indexOf("tw") != -1) return 0;
          else return 2;
        } else return 1;
      },
      initNotify() {
        this.requestPermission()
          .then(() => {
            if (!this.$cookies.isKey("fcm_token")) this.$cookies.set("fcm_token", uuidv4());
            this.getToken();
          })
          .catch((e) => {
            console.log(e);
            this.$bvModal.show("notificationModal");
          });
      },
      close() {
        this.$bvModal.hide("notificationModal");
      },
      getChild(componentId) {
        let items = this.$children.find((e) => e.componentId === componentId);
        if (items && items.length === 1) return items[0];
        else return null;
      },
      jsonToQueryString(json) {
        return (
          "?" +
          Object.keys(json)
            .map(function(key) {
              return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
            })
            .join("&")
        );
      },
      getServerInfo() {
        this.apiGet(`info`)
          .then(({ data }) => {
            this.$config.iceServers = [];
            if (data.stun_url) this.$config.iceServers.push({ urls: data.stun_url });
            if (data.turn_url)
              this.$config.iceServers.push({
                urls: data.turn_url,
                username: data.turn_username,
                credential: data.turn_credential,
              });

            this.$config.env = data.env;
            this.$config.deployType = data.deploy_type;

            this.$cookies.set("deploy_type", data.deploy_type);

            // if (data.deploy_type == "digiwin") {
            //   this.$store.state.deployType = 2;
            //   document.title = "AR遠程協同";
            // } else {
            //   this.$store.state.deployType = 1;
            // document.title = "AR遠程協作";
            // }
            this.$changeTitle();
          })
          .catch((err) => {
            console.log(err);
          });
      },
      getUserInfo() {
        this.apiGet(`user/info`)
          .then(({ data }) => {
            this.$cookies.set("user", data.userinfo);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.ready = true;
          });
      },
      handleNotification(payload) {
        let isCall = this.$router.currentRoute.name == "RACall";
        let isRating = this.$router.currentRoute.name == "RARating";
        let route = this.$refs.route;

        if (payload.calleeStatus && (payload.calleeStatus == "decline" || payload.calleeStatus == "stop_call")) {
          if (isCall) return route.receiveDecline(payload);
        } else if (payload.callRoomUUID) {
          if (isCall) return route.receiveCall(payload);

          let params = {
            callName: payload.callName,
            callAccount: payload.callAccount,
            callRoomUUID: payload.callRoomUUID,
            showCallerScreen: payload.showCallerScreen,
            deviceType: payload.deviceType,
            isFromRating: isRating,
          };
          this.$router.push({ name: "RACall", params });
        } else {
          console.log("Not handle fcm message ", payload);
        }
      },
      callFromCapture(choice) {
        if (choice == "agree") {
          this.isAgree = "agree";
          if (this.agreeCallback) this.agreeCallback();
        } else {
          this.isAgree = "decline";
          if (this.agreeCallback) this.agreeCallback();
        }
      },
      // decline() {
      //   // 依然在call這頁，可以直接call closeCall function
      //   if (this.declineCallback) this.declineCallback();
      //   this.$bvModal.hide("modal");
      // },
    },
    watch: {
      $route(to, from) {
        let titleStr = `APP.TITLE.${to.name}`;
        let title = this.$t(titleStr);
        if (title === titleStr) this.$changeTitle();
        else this.$changeTitle(title);

        console.log(`from ${from.name} to ${to.name}`);

        // 如果router轉址的頁面需要驗證 requiresAuth: true
        if (to.matched.some((record) => record.meta.requiresAuth)) {
          let user = this.$cookies.get("user");
          // 如果沒有token則轉址到login page
          if (!user) {
            if (to.meta.type === 3) return this.$router.push({ name: "SILogin", params: { requiresAuth: true } });
            else return this.$router.push({ name: "Login", params: { requiresAuth: true } });
          } else {
            // 權限不對導頁
            if (to.meta.type === 2 && user.type != 2) {
              console.log(`user.type != 2`, user.type);
              if (user.type == 3) return this.$router.push({ name: "SILogin", params: { isNotPermitted: true } });
              else return this.$router.push({ name: "Login", params: { isNotPermitted: true } });
            }
            if (to.meta.type === 3 && user.type != 3) {
              console.log(`user.type != 3`, user.type);
              if (user.type == 3) return this.$router.push({ name: "SILogin", params: { isNotPermitted: true } });
              else return this.$router.push({ name: "Login", params: { isNotPermitted: true } });
            }
          }
        }
      },
    },
  };
</script>

<style lang="scss">
  @import "~@/assets/scss/_variables.scss";
  @import "~@/assets/scss/main.scss";

  body {
    background-color: #fafafa;
  }

  ::-webkit-scrollbar {
    height: 6px;
    width: 6px;
  }

  ::-webkit-scrollbar-thumb {
    // background-image: linear-gradient(180deg, #d0368a 0%, #708ad4 99%);
    background-image: linear-gradient(180deg, rgb(2, 55, 115) 0%, $blue 99%);
    // background-color: $blue;
    // box-shadow: inset 2px 2px 5px 0 rgba(#fff, 0.5);
    border-radius: 100px;
  }

  .no-network-background {
    z-index: 10000;
    margin: 40vh auto 0;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
  }
  .no-network-text {
    font-size: 20px;
  }
</style>
