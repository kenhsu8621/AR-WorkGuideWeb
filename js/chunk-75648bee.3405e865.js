(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-75648bee"],{"02a5":function(t,e,a){var o=a("e04d");o.__esModule&&(o=o.default),"string"===typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);var i=a("499e").default;i("f9b28100",o,!0,{sourceMap:!1,shadowMode:!1})},"0418":function(t,e,a){"use strict";var o=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"header row m-0"},[o("div",{staticClass:"col-9 header-title text-left"},[o("span",{attrs:{role:"button"},on:{click:function(e){return t.toPage("Home")}}},[o("img",{staticClass:"header-icon mr-2",attrs:{src:a("c4c2")}}),o("span",{staticClass:"header-main-title"},[t._v(t._s(t.$t("GENERAL.TITLE")))]),o("span",{staticClass:"header-sub-title ml-2"},[t._v(t._s(t.title))])])]),o("div",{staticClass:"col-3 login text-right"},[t.user.admin?o("router-link",{attrs:{to:{name:"RAContact"}}},[o("button",{staticClass:"btn call-btn mr-3"},[t._v(t._s(t.$t("HEADER.CALL")))])]):t._e(),o("img",{staticClass:"user-icon",attrs:{src:a("c9d8")}}),o("b-dropdown",{attrs:{text:t.getUserName,variant:"outline-none","border-transparent":""}},[o("b-dropdown-item",{on:{click:function(e){return t.toPage("Settings")}}},[t._v(t._s(t.$t("GENERAL.SETTINGS")))]),o("b-dropdown-item",{on:{click:function(e){return t.showModal("logout")}}},[o("span",[t._v(t._s(t.$t("HEADER.LOGOUT")))])])],1)],1),t.modalType.logout?o("Logout",{on:{cancel:function(e){return t.closeModal("logout",!1)}}}):t._e()],1)},i=[],n=a("6af0"),s={components:{Logout:n["a"]},props:{title:String,showCancelBtn:Boolean,pageUrl:Object,isCalling:Boolean,callName:String},data:function(){return{modalType:{logout:!1},user:{}}},created:function(){this.user=this.$cookies.get("user")||{}},methods:{toPage:function(t){this.$router.push({name:t})},showModal:function(t,e){e&&(this.selectedData=e),this.modalType[t]=!0},closeModal:function(t){this.modalType[t]=!1,this.selectedData=null}},computed:{getUserName:function(){return(this.$cookies.get("user")||{}).account}}},r=s,c=(a("23d1"),a("2877")),l=Object(c["a"])(r,o,i,!1,null,"2b3cbec8",null);e["a"]=l.exports},"23d1":function(t,e,a){"use strict";a("68fe")},4422:function(t,e,a){var o=a("24fb");e=o(!1),e.push([t.i,".blue[data-v-7a5ed428]{color:#2173c9}.blueHover[data-v-7a5ed428]{color:#185597}.darkBlue[data-v-7a5ed428]{color:#0a519c}.grey[data-v-7a5ed428]{color:#7b7b7b}.greyHover[data-v-7a5ed428]{color:#606060}.lightgrey[data-v-7a5ed428]{color:#d7d7d7}.green[data-v-7a5ed428]{color:#3fb182}.greenHover[data-v-7a5ed428]{color:#37926c}.red[data-v-7a5ed428]{color:#d44e4e}.redHover[data-v-7a5ed428]{color:#b44b4b}.placeholder[data-v-7a5ed428]{color:#aeaeae}.placeholderHover[data-v-7a5ed428]{color:#7b7b7b}.white[data-v-7a5ed428]{color:#fff}.custom-pagination[data-v-7a5ed428]{width:calc(100% - 60px)}.custom-pagination[data-v-7a5ed428] .pagination{float:right}.custom-pagination[data-v-7a5ed428] .VuePagination__pagination-item-next-chunk .page-link,.custom-pagination[data-v-7a5ed428] .VuePagination__pagination-item-prev-chunk .page-link{padding:7px}.custom-pagination[data-v-7a5ed428] .page-link{width:38px;height:38px;border-radius:19px;margin:0 2px;text-align:center;color:#2173c9;cursor:pointer}.custom-pagination[data-v-7a5ed428] .page-link.active{color:#fff;background-color:#2173c9;border-color:#2173c9}.m-modal-title[data-v-7a5ed428]{color:#212529;padding-bottom:15px;font-size:22px;font-weight:700;border-bottom:2px solid #e7e7e9}.form-group[data-v-7a5ed428]{position:relative;width:100%}.form-group[data-v-7a5ed428]:focus{border:2px solid #4b8bcf;box-shadow:none}.form-group .desc[data-v-7a5ed428]{font-size:16px;color:#7b7b7b}.form-group .btn-cancel[data-v-7a5ed428],.form-group .btn-ok[data-v-7a5ed428]{width:47%;height:38px;padding:0 12px;border-radius:10px;box-shadow:0 3px 3px 0 rgba(0,0,0,.15)}@media (max-width:1200px){.form-group .btn-cancel[data-v-7a5ed428],.form-group .btn-ok[data-v-7a5ed428]{width:100%;margin:5px 0}}.form-group .btn-cancel[data-v-7a5ed428]{color:#2173c9;background-color:#fff;border:1px solid #2173c9}.form-group .btn-ok[data-v-7a5ed428]{margin-left:6%;color:#fff;background-color:#2173c9;border:1px solid #2173c9}@media (max-width:1200px){.form-group .btn-ok[data-v-7a5ed428]{margin-left:0}}",""]),t.exports=e},"53e2":function(t,e,a){var o=a("6d25");o.__esModule&&(o=o.default),"string"===typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);var i=a("499e").default;i("6b53d3ae",o,!0,{sourceMap:!1,shadowMode:!1})},"5a03":function(t,e,a){"use strict";a("02a5")},"5c30":function(t,e,a){"use strict";a("80d2")},"68fe":function(t,e,a){var o=a("8afa");o.__esModule&&(o=o.default),"string"===typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);var i=a("499e").default;i("16cffe1c",o,!0,{sourceMap:!1,shadowMode:!1})},"6af0":function(t,e,a){"use strict";var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("TemplateModal",{scopedSlots:t._u([{key:"default",fn:function(){return[a("div",{staticClass:"m-modal-title"},[t._v(t._s(t.$t("MODAL.LOGOUT.TITLE")))]),a("div",{staticClass:"form-group row"},[a("div",{staticClass:"desc text-right"},[t._v(t._s(t.$t("MODAL.LOGOUT.DESC")))])]),a("div",{staticClass:"form-group row"},[a("b-button",{staticClass:"btn-cancel float-left",on:{click:t.cancel}},[t._v(t._s(t.$t("GENERAL.CANCEL")))]),a("b-button",{staticClass:"btn-ok float-right",on:{click:function(e){return t.$logout()}}},[t._v(t._s(t.$t("GENERAL.CONFIRM")))])],1)]},proxy:!0}])})},i=[],n=a("1b36"),s={components:{TemplateModal:n["a"]},props:{selectedData:Object},data:function(){return{}},methods:{cancel:function(){this.$emit("cancel")}}},r=s,c=(a("76de"),a("2877")),l=Object(c["a"])(r,o,i,!1,null,"87538b36",null);e["a"]=l.exports},"6d25":function(t,e,a){var o=a("24fb");e=o(!1),e.push([t.i,".blue[data-v-87538b36]{color:#2173c9}.blueHover[data-v-87538b36]{color:#185597}.darkBlue[data-v-87538b36]{color:#0a519c}.grey[data-v-87538b36]{color:#7b7b7b}.greyHover[data-v-87538b36]{color:#606060}.lightgrey[data-v-87538b36]{color:#d7d7d7}.green[data-v-87538b36]{color:#3fb182}.greenHover[data-v-87538b36]{color:#37926c}.red[data-v-87538b36]{color:#d44e4e}.redHover[data-v-87538b36]{color:#b44b4b}.placeholder[data-v-87538b36]{color:#aeaeae}.placeholderHover[data-v-87538b36]{color:#7b7b7b}.white[data-v-87538b36]{color:#fff}.custom-pagination[data-v-87538b36]{width:calc(100% - 60px)}.custom-pagination[data-v-87538b36] .pagination{float:right}.custom-pagination[data-v-87538b36] .VuePagination__pagination-item-next-chunk .page-link,.custom-pagination[data-v-87538b36] .VuePagination__pagination-item-prev-chunk .page-link{padding:7px}.custom-pagination[data-v-87538b36] .page-link{width:38px;height:38px;border-radius:19px;margin:0 2px;text-align:center;color:#2173c9;cursor:pointer}.custom-pagination[data-v-87538b36] .page-link.active{color:#fff;background-color:#2173c9;border-color:#2173c9}.m-modal-title[data-v-87538b36]{margin-bottom:30px;color:#212529;padding-bottom:15px;font-size:22px;font-weight:700;border-bottom:2px solid #e7e7e9}.form-group[data-v-87538b36]{position:relative;margin:20px auto;margin-bottom:30px;width:100%}.form-group[data-v-87538b36]:focus{border:2px solid #4b8bcf;box-shadow:none}.form-group .desc[data-v-87538b36]{font-size:16px;color:#7b7b7b}.form-group .m-text[data-v-87538b36]{color:#212529;width:100%;padding:12px;border:2px solid #e7e7e9;border-radius:10px;min-height:100px}.form-group .btn-cancel[data-v-87538b36],.form-group .btn-ok[data-v-87538b36]{width:47%;height:38px;padding:0 12px;border-radius:10px;box-shadow:0 3px 3px 0 rgba(0,0,0,.15)}@media (max-width:1200px){.form-group .btn-cancel[data-v-87538b36],.form-group .btn-ok[data-v-87538b36]{width:100%;margin:5px 0}}.form-group .btn-cancel[data-v-87538b36]{color:#2173c9;background-color:#fff;border:1px solid #2173c9}.form-group .btn-ok[data-v-87538b36]{margin-left:6%;color:#fff;background-color:#2173c9;border:1px solid #2173c9}@media (max-width:1200px){.form-group .btn-ok[data-v-87538b36]{margin-left:0}}",""]),t.exports=e},"76de":function(t,e,a){"use strict";a("53e2")},"80d2":function(t,e,a){var o=a("4422");o.__esModule&&(o=o.default),"string"===typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);var i=a("499e").default;i("1af4c26a",o,!0,{sourceMap:!1,shadowMode:!1})},"84cd":function(t,e,a){"use strict";a.r(e);var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"settings"},[a("Header",{attrs:{title:t.$t("SETTINGS.TITLE")}}),a("div",{staticClass:"main-content"},[a("div",{staticClass:"container mx-auto"},[a("div",{staticClass:"mt-5 mb-3 text-left"},[a("div",{staticClass:"title pb-2"},[a("b",[t._v(t._s(t.$t("SETTINGS.MY_ACCOUNT")))])])]),a("div",{staticClass:"row text-left my-3"},[a("div",{staticClass:"col-3 pl-4"},[a("b",[t._v(t._s(t.$t("SETTINGS.ACCOUNT")))])]),a("div",{staticClass:"col-7"},[t._v(t._s(t.userinfo.username))]),a("div",{staticClass:"col-2 pr-4"})]),a("div",{staticClass:"row text-left my-3"},[a("div",{staticClass:"col-3 pl-4"},[a("b",[t._v(t._s(t.$t("SETTINGS.ROLE")))])]),a("div",{staticClass:"col-7"},[t._v(t._s(t.userinfo.isAdmin?"Admin":"User"))]),a("div",{staticClass:"col-2 pr-4"})]),a("div",{staticClass:"row text-left my-3"},[a("div",{staticClass:"col-3 pl-4"},[a("b",[t._v(t._s(t.$t("SETTINGS.USERNAME")))])]),t.isEditing?t._e():a("div",{staticClass:"col-7"},[t._v(t._s(t.userinfo.username))])]),a("div",{staticClass:"row text-left my-3"},[a("div",{staticClass:"col-3 pl-4"},[a("b",[t._v(t._s(t.$t("SETTINGS.EMAIL")))])]),a("div",{staticClass:"col-7"},[t._v(t._s(t.userinfo.email))]),a("div",{staticClass:"col-2 pr-4"})]),a("div",{staticClass:"row text-left my-3"},[a("div",{staticClass:"col-3 pl-4"},[a("b",[t._v(t._s(t.$t("SETTINGS.PASSWORD")))])]),a("div",{staticClass:"col-7"},[t._v(t._s(t.userinfo.password))]),a("div",{staticClass:"col-2 pr-4"})]),a("div",{staticClass:"row text-left my-3"},[a("div",{staticClass:"col-3 pl-4"},[a("b",[t._v(t._s(t.$t("SETTINGS.SETTINGS.QRCODE")))])]),a("div",{staticClass:"col-7"}),a("div",{staticClass:"col-2"},[a("router-link",{attrs:{to:{name:"RAQRCode"}}},[a("div",{staticClass:"hidden-div"},[a("font-awesome-icon",{attrs:{icon:"qrcode"}})],1)])],1)]),a("div",{staticClass:"row text-left my-3"},[a("div",{staticClass:"col-3 pl-4"},[a("b",[t._v(t._s(t.$t("SETTINGS.ENTERPRISE_NAME")))])]),a("div",{staticClass:"col-7"},[t._v(t._s(t.userinfo.enterprise))]),a("div",{staticClass:"col-2 pr-4"})])]),a("div",{staticClass:"container mx-auto"},[a("div",{staticClass:"mt-4 mb-3 text-left"},[a("div",{staticClass:"title pb-2"},[a("b",[t._v(t._s(t.$t("SETTINGS.ABOUT")))])])]),a("div",{staticClass:"row text-left my-3"},[a("div",{staticClass:"col-3 pl-4"},[a("b",[t._v(t._s(t.$t("SETTINGS.SETTINGS.CONTACT_US")))])]),a("div",{staticClass:"col-7"}),a("div",{staticClass:"col-2"},[a("router-link",{attrs:{to:{name:"RAContactUs"}}},[a("div",{staticClass:"hidden-div"},[a("font-awesome-icon",{attrs:{icon:"angle-right"}})],1)])],1)]),a("div",{staticClass:"row text-left my-3"},[a("div",{staticClass:"col-3 pl-4"},[a("b",[t._v(t._s(t.$t("SETTINGS.SETTINGS.TERMS")))])]),a("div",{staticClass:"col-7"}),a("div",{staticClass:"col-2"},[a("router-link",{staticClass:"hidden-div",attrs:{to:{name:"RAServiceTerms"},target:"_blank"}},[a("font-awesome-icon",{attrs:{icon:"angle-right"}})],1)],1)]),a("div",{staticClass:"row text-left my-3"},[a("div",{staticClass:"col-3 pl-4"},[a("b",[t._v(t._s(t.$t("SETTINGS.SETTINGS.POLICY")))])]),a("div",{staticClass:"col-7"}),a("div",{staticClass:"col-2"},[a("router-link",{staticClass:"hidden-div",attrs:{to:{name:"RAPrivacyPolicy"},target:"_blank"}},[a("font-awesome-icon",{attrs:{icon:"angle-right"}})],1)],1)]),a("div",{staticClass:"row text-left my-3"},[a("div",{staticClass:"col-3 pl-4"},[a("b",[t._v(t._s(t.$t("SETTINGS.SETTINGS.MORE")))])]),a("div",{staticClass:"col-7"}),a("div",{staticClass:"col-2"},[a("a",{staticClass:"hidden-div",attrs:{href:"https://tw.fiimart.com/web/nextiiot/Toc/Prod/0003/0003-01/FM0005?culture=zh-Hant",target:"_blank"}},[a("font-awesome-icon",{attrs:{icon:"angle-right"}})],1)])]),a("div",{staticClass:"row text-left my-3"},[a("div",{staticClass:"col-3 pl-4"},[a("b",[t._v(t._s(t.$t("SETTINGS.SETTINGS.LANGUAGE")))])]),a("div",{staticClass:"col-7"},[t._v(t._s(t.langList[t.currentLang].text))]),a("div",{staticClass:"col-2"},[a("a",{staticClass:"hidden-div",on:{click:function(e){return t.showModal("changeLang")}}},[a("font-awesome-icon",{attrs:{icon:"angle-right"}})],1)])]),a("div",{staticClass:"row text-left my-3"},[a("div",{staticClass:"col-3 pl-4"},[a("b",[t._v(t._s(t.$t("SETTINGS.SETTINGS.VERSION")))])]),a("div",{staticClass:"col-7"},[t._v("v"+t._s(t.version))]),a("div",{staticClass:"col-2"})])]),a("div",{staticClass:"text-center"},[a("b-button",{staticClass:"logout-btn my-4 mx-auto",on:{click:function(e){return t.showModal("logout")}}},[t._v(t._s(t.$t("SETTINGS.SETTINGS.LOGOUT")))])],1)]),t.modalType.logout?a("Logout",{on:{cancel:function(e){return t.closeModal("logout",!1)}}}):t._e(),t.modalType.changeLang?a("ChangeLang",{on:{ok:function(e){return t.closeModal("changeLang",!0)},cancel:function(e){return t.closeModal("changeLang",!1)}}}):t._e()],1)},i=[],n=(a("b0c0"),a("0418")),s=a("6af0"),r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("TemplateModal",{scopedSlots:t._u([{key:"default",fn:function(){return[a("div",{staticClass:"m-modal-title"},[t._v(t._s(t.$t("SETTINGS.LANGUAGE")))]),a("div",{staticClass:"desc"},[a("b-form-group",{staticClass:"radio-group",scopedSlots:t._u([{key:"default",fn:function(e){var o=e.ariaDescribedby;return[a("b-form-radio",{staticClass:"my-3",attrs:{"aria-describedby":o,value:"0"},model:{value:t.lang,callback:function(e){t.lang=e},expression:"lang"}},[t._v("繁體中文 ")]),a("b-form-radio",{staticClass:"my-3",attrs:{"aria-describedby":o,value:"1"},model:{value:t.lang,callback:function(e){t.lang=e},expression:"lang"}},[t._v("简体中文 ")]),a("b-form-radio",{staticClass:"my-3",attrs:{"aria-describedby":o,value:"2"},model:{value:t.lang,callback:function(e){t.lang=e},expression:"lang"}},[t._v("English ")])]}}])})],1),a("div",{staticClass:"form-group row mx-0"},[a("b-button",{staticClass:"btn-cancel float-left",on:{click:t.cancel}},[t._v(t._s(t.$t("GENERAL.CANCEL")))]),a("b-button",{staticClass:"btn-ok float-right",on:{click:t.setActiveLang}},[t._v(t._s(t.$t("GENERAL.CONFIRM")))])],1)]},proxy:!0}])})},c=[],l=a("1b36"),d={components:{TemplateModal:l["a"]},props:{selectedData:Object},data:function(){return{lang:0}},mounted:function(){this.$cookies.get("language")&&(this.lang=this.$cookies.get("language"))},methods:{setActiveLang:function(){this.$cookies.set("language",this.lang),this.$emit("ok")},cancel:function(){this.$emit("cancel")}}},u=d,g=(a("5c30"),a("2877")),p=Object(g["a"])(u,r,c,!1,null,"7a5ed428",null),v=p.exports,b={components:{Header:n["a"],Logout:s["a"],ChangeLang:v},data:function(){return{modalType:{logout:!1,changeLang:!1},userinfo:{username:"",account:"",password:"********",email:"",enterprise:"",isAdmin:!1},langList:[{value:0,text:"繁體中文"},{value:1,text:"简体中文"},{value:2,text:"English"}],currentLang:0,dismissSecs:3,dismissCountDown:0,typeText:"",isEditing:!1,newUserName:"",version:"",selectedData:null}},mounted:function(){this.getUserInfo(),this.getVersion(),this.getCurrentLang()},computed:{username:function(){return this.$cookies.get("user").account}},methods:{getUserInfo:function(){var t=this;this.apiGet("user/info").then((function(e){var a=e.data;t.userinfo.username=a.userinfo.name,t.userinfo.account=a.userinfo.account,t.userinfo.email=a.userinfo.email,t.userinfo.enterprise=a.userinfo.enterprise.name,t.userinfo.isAdmin=a.userinfo.admin}))},getVersion:function(){var t=a("9224");this.version=t.version},getCurrentLang:function(){this.currentLang=this.$cookies.get("language")},editUserName:function(){this.newUserName=this.userinfo.username,this.isEditing=!0},cancelEditUserName:function(){this.isEditing=!1},showModal:function(t,e){e&&(this.selectedData=e),this.modalType[t]=!0},closeModal:function(t,e){if(e)return this.getCurrentLang(),history.go(0);this.modalType[t]=!1,this.selectedData=null}}},f=b,m=(a("5a03"),Object(g["a"])(f,o,i,!1,null,null,null));e["default"]=m.exports},"8afa":function(t,e,a){var o=a("24fb");e=o(!1),e.push([t.i,".header[data-v-2b3cbec8]{width:100%;position:fixed;top:0;z-index:99999;color:#fff;background:linear-gradient(60deg,#000,#2a3746 35%,#12274d 70%,#023773)}.header .header-title[data-v-2b3cbec8]{font-weight:700}.header .header-title .header-icon[data-v-2b3cbec8]{width:40px;margin-top:-10px}.header .header-title .header-main-title[data-v-2b3cbec8]{line-height:60px;font-size:24px;text-decoration:none}.header .header-title .header-sub-title[data-v-2b3cbec8]{color:#b3d5f4;line-height:60px;font-size:22px;text-decoration:none}.header .login[data-v-2b3cbec8]{height:62px;line-height:62px;font-size:18px}.header .login .user-icon[data-v-2b3cbec8]{margin-right:-5px;width:18px}.header .login .call-btn[data-v-2b3cbec8]{color:#fff}.header .login .call-btn[data-v-2b3cbec8]:hover{color:#ccc}.header .login[data-v-2b3cbec8] .btn-outline-none{color:#fff}.header .login[data-v-2b3cbec8] .btn:focus{box-shadow:none}.header .login[data-v-2b3cbec8] .dropdown-item{line-height:30px}",""]),t.exports=e},9224:function(t){t.exports=JSON.parse('{"name":"ar-work-guide-web","version":"1.2.5","private":true,"scripts":{"serve":"vue-cli-service serve","build":"vue-cli-service build","lint":"vue-cli-service lint"},"dependencies":{"@bachdgvn/vue-otp-input":"^1.0.8","@ffmpeg/core":"^0.9.0","@ffmpeg/ffmpeg":"^0.9.8","@fortawesome/fontawesome-svg-core":"^1.2.36","@fortawesome/free-brands-svg-icons":"^5.15.1","@fortawesome/free-regular-svg-icons":"^5.15.1","@fortawesome/free-solid-svg-icons":"^5.15.4","@fortawesome/vue-fontawesome":"^2.0.2","axios":"^0.23.0","bootstrap":"^4.5.3","bootstrap-vue":"^2.17.3","chart.js":"^2.9.4","core-js":"^3.6.5","d3":"^5.15.0","dayjs":"^1.10.2","file-saver":"^2.0.5","firebase":"^8.0.0","jquery":"^1.9.1","jszip":"^3.7.1","kurento-utils":"^6.16.0","qrcode":"^1.4.4","recordrtc":"^5.6.2","register-service-worker":"^1.7.1","three":"^0.136.0","ts-ebml":"^2.0.2","uuid":"^3.4.0","vue":"^2.6.14","vue-chartjs":"^3.5.1","vue-cookies":"^1.7.4","vue-cryptojs":"^2.1.6","vue-i18n":"^8.26.7","vue-infinite-loading":"^2.4.5","vue-js-toggle-button":"^1.3.3","vue-loading-overlay":"^3.4.2","vue-pagination-2":"^3.0.91","vue-qrcode":"^0.3.5","vue-rate":"^2.4.0","vue-router":"^3.2.0","vue-video-player":"^5.0.2","vue2-datepicker":"^3.10.2","vuedraggable":"^2.24.3","vuelidate":"^0.7.7","vuex":"^3.6.2"},"devDependencies":{"@vue/cli-plugin-babel":"~4.5.0","@vue/cli-plugin-eslint":"~4.5.0","@vue/cli-plugin-pwa":"~4.5.0","@vue/cli-plugin-router":"~4.5.0","@vue/cli-plugin-vuex":"~4.5.0","@vue/cli-service":"~4.5.0","@vue/eslint-config-prettier":"^6.0.0","babel-eslint":"^10.1.0","cz-conventional-changelog":"^3.1.0","eslint":"^6.7.2","eslint-plugin-prettier":"^3.1.3","eslint-plugin-vue":"^6.2.2","node-sass":"^4.14.1","prettier":"^1.19.1","sass-loader":"^8.0.2","vue-template-compiler":"^2.6.11","webpack":"^4.46.0"},"eslintConfig":{"root":true,"env":{"node":true},"extends":["plugin:vue/essential","eslint:recommended"],"rules":{"no-console":"off","no-unused-vars":"off"},"parserOptions":{"parser":"babel-eslint"}},"postcss":{"plugins":{"autoprefixer":{}}},"browserslist":["> 1%","last 2 versions","not ie <= 8"],"config":{"commitizen":{"path":"./node_modules/cz-conventional-changelog"}}}')},c4c2:function(t,e,a){t.exports=a.p+"img/wg-logo.31c776cb.png"},c9d8:function(t,e,a){t.exports=a.p+"img/user.b1a05003.svg"},e04d:function(t,e,a){var o=a("24fb");e=o(!1),e.push([t.i,".blue{color:#2173c9}.blueHover{color:#185597}.darkBlue{color:#0a519c}.grey{color:#7b7b7b}.greyHover{color:#606060}.lightgrey{color:#d7d7d7}.green{color:#3fb182}.greenHover{color:#37926c}.red{color:#d44e4e}.redHover{color:#b44b4b}.placeholder{color:#aeaeae}.placeholderHover{color:#7b7b7b}.white{color:#fff}.custom-pagination{width:calc(100% - 60px)}.custom-pagination /deep/ .pagination{float:right}.custom-pagination /deep/ .VuePagination__pagination-item-next-chunk .page-link,.custom-pagination /deep/ .VuePagination__pagination-item-prev-chunk .page-link{padding:7px}.custom-pagination /deep/ .page-link{width:38px;height:38px;border-radius:19px;margin:0 2px;text-align:center;color:#2173c9;cursor:pointer}.custom-pagination /deep/ .page-link.active{color:#fff;background-color:#2173c9;border-color:#2173c9}.settings{padding-top:60px}.settings .main-content .container{width:33vw}@media (max-width:1440px){.settings .main-content .container{width:40vw}}@media (max-width:992px){.settings .main-content .container{width:90vw}}.settings .main-content .container .title{width:100%;font-size:20px;color:#2173c9;border-bottom:1px solid #7b7b7b}.settings .main-content .container .row{color:#7b7b7b}.settings .main-content .container .row .col-7{color:#aeaeae}.settings .main-content .container .row .col-2>a,.settings .main-content .container .row svg{float:right;color:#7b7b7b;cursor:pointer}.settings .main-content .container .row .col-2>a:hover,.settings .main-content .container .row svg:hover{color:#2173c9}.settings .main-content .container .row .col-9 .form-control{font-size:14px;border:2px solid #e7e7e9;border-radius:10px;transition:all .3s ease-in-out}.settings .main-content .container .row .col-9 .form-control:focus{border:2px solid #4b8bcf;box-shadow:none}.settings .main-content .container .row .col-9 .col .btn-edit{height:35px;color:#2173c9;background-color:#fff;border:1px solid #2173c9}.settings .main-content .container .row .col-9 .col .btn-cancel{height:35px;color:#aeaeae;background-color:#fff;border:1px solid #7b7b7b}.settings .main-content .container .row .hidden-div{background-color:transparent;width:30px;height:30px}.settings .main-content .container .row .hidden-div svg{margin-top:5px;margin-right:15px;color:#7b7b7b}.settings .main-content .logout-btn{width:20vw;font-size:14px;height:38px;border:1px solid #2173c9;color:#2173c9;background-color:#f0f8ff;font-weight:700}@media (max-width:1440px){.settings .main-content .logout-btn{width:30vw}}",""]),t.exports=e}}]);
//# sourceMappingURL=chunk-75648bee.3405e865.js.map