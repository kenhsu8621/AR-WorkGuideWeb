import { locale as cn } from "@/common/config/i18n/cn";
import { locale as en } from "@/common/config/i18n/en";
import { locale as tw } from "@/common/config/i18n/tw";
import Vue from "vue";
import VueI18n from "vue-i18n";
import VueCookies from "vue-cookies";
import constants from "../../constants.js";

Vue.use(VueI18n);
let messages = {};
messages = { ...messages, en, tw, cn };
const lang = parseInt(VueCookies.get("language")) || constants.Lang.CHINESE;
// const lang = parseInt(this.$cookies.get("language")) || constants.Lang.CHINESE;

const i18n = new VueI18n({
  locale: constants.Locale[lang],
  messages,
});
export default i18n;
