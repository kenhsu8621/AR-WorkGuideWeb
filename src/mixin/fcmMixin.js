import Vue from "vue";
import apiMixin from "./apiMixin";

export const fcmMixin = Vue.util.mergeOptions(apiMixin, {
  methods: {
    initFCM() {
      console.log("initFCM");
      this.$messaging.onTokenRefresh(() => {
        this.$messaging.getToken().then((refreshedToken) => {
          console.log("refreshedToken: " + refreshedToken);
          this.$cookies.set("fcm_token", refreshedToken);
        });
      });
    },
    requestPermission() {
      return this.$messaging.requestPermission();
    },
    getToken() {
      this.$messaging
        .getToken()
        .then((currentToken) => {
          console.log("currentToken: " + currentToken);
          if (currentToken) {
            this.$cookies.set("fcm_token", currentToken);
          }
        })
        .catch((err) => {
          console.log("An error occurred while retrieving token. ", err);
        });
    },
    sendTokenToServer(fcm_token) {
      if (!this.$cookies.isKey("fcm_token")) this.$cookies.set("fcm_token", fcm_token);
      if (!this.$cookies.get("token")) {
        this.$cookies.set("fcm_token", fcm_token);
        return;
      }
      let data = {
        device_id: fcm_token,
        fcm_token: fcm_token,
      };
      this.apiPost("device/upsert", data);
    },
  },
});
