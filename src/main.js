import apiMixin from "@/mixin/apiMixin";
import OtpInput from "@bachdgvn/vue-otp-input";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleDoubleUp,
  faAngleDown,
  faAngleRight,
  faArrowDown,
  faArrowLeft,
  faBars,
  faCamera,
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faCaretUp,
  faCheck,
  faCheckCircle,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faClock,
  faClone,
  faCloudUploadAlt,
  faCog,
  faComments,
  faCompressArrowsAlt,
  faCopy,
  faCut,
  faDoorOpen,
  faEdit,
  faEllipsisH,
  faEnvelopeOpenText,
  faExpandArrowsAlt,
  faEye,
  faEyeSlash,
  faFile,
  faFileDownload,
  faFileExport,
  faFlag,
  faForward,
  faGlobe,
  faGripVertical,
  faHourglassEnd,
  faImage,
  faLaptop,
  faLightbulb,
  faListAlt,
  faMicrophone,
  faMicrophoneSlash,
  faMinus,
  faPaintBrush,
  faPause,
  faPencilAlt,
  faPhone,
  faPhoneAlt,
  faPhoneVolume,
  faPlay,
  faPlayCircle,
  faPlus,
  faProjectDiagram,
  faQrcode,
  faSave,
  faSearch,
  faSignOutAlt,
  faStop,
  faStore,
  faStoreSlash,
  faThList,
  faTimes,
  faTrash,
  faTrashAlt,
  faUndo,
  faUserFriends,
  faUserLock,
  faUserPlus,
  faUsers,
  faVideo,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "bootstrap/dist/css/bootstrap.css";
import firebase from "firebase/app";
import Vue from "vue";
import VueCookies from "vue-cookies";
import VueCryptojs from "vue-cryptojs";
import ToggleButton from "vue-js-toggle-button";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import Pagination from "vue-pagination-2";
import rate from "vue-rate";
import "vue-rate/dist/vue-rate.css";
import Vuelidate from "vuelidate";
import App from "./App";
import i18n from "./common/plugins/vue-i18n";
import config from "./config";
import alertModal from "./plugin/Alert";
import confirmModal from "./plugin/Confirm";
import router from "./router";
import store from "./store";

library.add(
  faAngleDoubleUp,
  faAngleDown,
  faAngleRight,
  faArrowDown,
  faArrowLeft,
  faBars,
  faCamera,
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faCaretUp,
  faCheck,
  faCheckCircle,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faClock,
  faClone,
  faCloudUploadAlt,
  faCog,
  faComments,
  faCompressArrowsAlt,
  faCopy,
  faCut,
  faDoorOpen,
  faEdit,
  faEllipsisH,
  faEnvelopeOpenText,
  faExpandArrowsAlt,
  faEye,
  faEyeSlash,
  faFile,
  faFileDownload,
  faFileExport,
  faFlag,
  faForward,
  faGlobe,
  faGripVertical,
  faHourglassEnd,
  faImage,
  faLaptop,
  faLightbulb,
  faListAlt,
  faMicrophone,
  faMicrophoneSlash,
  faMinus,
  faPaintBrush,
  faPause,
  faPencilAlt,
  faPhone,
  faPhoneAlt,
  faPhoneVolume,
  faPlay,
  faPlayCircle,
  faPlus,
  faProjectDiagram,
  faQrcode,
  faSave,
  faSearch,
  faSignOutAlt,
  faStop,
  faStore,
  faStoreSlash,
  faThList,
  faTimes,
  faTrash,
  faTrashAlt,
  faUndo,
  faUserFriends,
  faUserLock,
  faUserPlus,
  faUsers,
  faVideo,
  faVideoSlash
);

Vue.mixin(apiMixin);

Vue.use(VueCookies);
Vue.$cookies.config("1y");

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueCryptojs);
Vue.use(ToggleButton);
Vue.use(Loading);
Vue.use(Vuelidate);
Vue.use(rate);
Vue.use(config);
Vue.use(alertModal);
Vue.use(confirmModal);

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("pagination", Pagination);
Vue.component("v-otp-input", OtpInput);

Vue.config.productionTip = false;

window.logs = [];
window.isLocalhost = window.location.href.indexOf("localhost") != -1;
// 開發用自動開console

const log = console.log;
const warn = console.warn;
const error = console.error;
var backgroundLog = function() {
  window.logs.push(...arguments);
}; // background function

window.toggleLog = (flag) => {
  if (flag) {
    console.log = log;
    console.warn = warn;
    console.error = error;
  } else {
    console.log = backgroundLog;
    console.warn = backgroundLog;
    console.error = backgroundLog;
  }
};
window.toggleLog(window.location.href.indexOf("dev") != -1 || window.isLocalhost);

if (window.location.host.indexOf("localhost") === -1) {
  Vue.prototype.$host = window.location.host;
  Vue.prototype.$origin = window.location.origin;
  Vue.prototype.$ws = `wss://${window.location.host}`;
} else {
  if (process.env.VUE_APP_SERVER_URL.indexOf("localhost") !== -1) {
    Vue.prototype.$host = window.location.host;
    Vue.prototype.$origin = `http://${process.env.VUE_APP_SERVER_URL}`;
    Vue.prototype.$ws = `ws://${process.env.VUE_APP_SERVER_URL}`;
  } else {
    Vue.prototype.$host = window.location.host;
    Vue.prototype.$origin = `https://${process.env.VUE_APP_SERVER_URL}`;
    Vue.prototype.$ws = `wss://${process.env.VUE_APP_SERVER_URL}`;
  }
}

const FCMconfig = {
  apiKey: "AIzaSyDtVBDL69QRPyXXWS06Xa0LWF9PHr_j1GU",
  authDomain: "ar-remoteassist.firebaseapp.com",
  databaseURL: "https://ar-remoteassist.firebaseio.com",
  projectId: "ar-remoteassist",
  storageBucket: "ar-remoteassist.appspot.com",
  messagingSenderId: "755753050872",
  appId: "1:755753050872:web:9876491e1995d92ce9910d",
  measurementId: "G-XJBZLQMLEF",
};

// firebase.initializeApp(FCMconfig)
if (!window.crossOriginIsolated) {
  window.SharedArrayBuffer = window.ArrayBuffer;
}

Vue.prototype.$messaging = null;
Vue.prototype.$logout = function() {
  console.log(this);
  let userinfo = this.$cookies.get("user");
  if (!userinfo) return;
  console.log(userinfo);
  this.apiPost("auth/logout").then(() => {
    this.$cookies.remove("token");
    this.$cookies.remove("user");
    if (window.ws) {
      window.ws.close();
      window.ws = null;
    }
    if (userinfo.type == 3) this.$router.push({ name: "SILogin" });
    else this.$router.push({ name: "Login" });
  });
};

if (firebase.messaging.isSupported()) {
  console.log("fcm is supported");
  firebase.initializeApp(FCMconfig);
  // Retrieve Firebase Messaging object, assign to Vue Object
  Vue.prototype.$messaging = firebase.messaging();
  // Add the public key generated from the Firebase console
  Vue.prototype.$messaging.usePublicVapidKey(process.env.VUE_APP_VAPID_KEY);
} else console.log("fcm is not supported");

// Change server-worker.js register path
navigator.serviceWorker
  .register("/firebase-messaging-sw.js")
  .then((registration) => {
    console.log("is registration");
    registration.update();
    Vue.prototype.$swRegistration = registration;
    Vue.prototype.$messaging.useServiceWorker(registration);
  })
  .catch((err) => {
    console.log("not registration");
    console.log(err);
  });
let _origin_toString = Date.prototype.toString;
Date.prototype.toString = function(is_origin) {
  if (is_origin) return _origin_toString.apply(this);

  return (
    this.getFullYear() +
    "/" +
    ("0" + (this.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + this.getDate()).slice(-2) +
    " " +
    ("0" + this.getHours()).slice(-2) +
    ":" +
    ("0" + this.getMinutes()).slice(-2) +
    ":" +
    ("0" + this.getSeconds()).slice(-2)
  );
};
let vue = new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
});

Vue.prototype.$changeTitle = function(title) {
  if (typeof title !== "undefined") document.title = title;
  else if (this.$cookies.get("deploy_type") === "digiwin") document.title = this.$t("APP.TITLE.DEFAULT");
  else document.title = this.$t("APP.TITLE.DEFAULT");
};

vue.$mount("#app");
