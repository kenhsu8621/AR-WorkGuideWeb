(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5575bace"],{"0374":function(e,t,o){e.exports=o.p+"img/enterprise-c.de64537e.svg"},"0418":function(e,t,o){"use strict";var a=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"header row m-0"},[a("div",{staticClass:"col-9 header-title text-left"},[a("span",{attrs:{role:"button"},on:{click:function(t){return e.toPage("Home")}}},[a("img",{staticClass:"header-icon mr-2",attrs:{src:o("c4c2")}}),a("span",{staticClass:"header-main-title"},[e._v(e._s(e.$t("GENERAL.TITLE")))]),a("span",{staticClass:"header-sub-title ml-2"},[e._v(e._s(e.title))])])]),a("div",{staticClass:"col-3 login text-right"},[e.user.admin?a("router-link",{attrs:{to:{name:"RAContact"}}},[a("button",{staticClass:"btn call-btn mr-3"},[e._v(e._s(e.$t("HEADER.CALL")))])]):e._e(),a("img",{staticClass:"user-icon",attrs:{src:o("c9d8")}}),a("b-dropdown",{attrs:{text:e.getUserName,variant:"outline-none","border-transparent":""}},[a("b-dropdown-item",{on:{click:function(t){return e.toPage("Settings")}}},[e._v(e._s(e.$t("GENERAL.SETTINGS")))]),a("b-dropdown-item",{on:{click:function(t){return e.showModal("logout")}}},[a("span",[e._v(e._s(e.$t("HEADER.LOGOUT")))])])],1)],1),e.modalType.logout?a("Logout",{on:{cancel:function(t){return e.closeModal("logout",!1)}}}):e._e()],1)},i=[],n=o("6af0"),r={components:{Logout:n["a"]},props:{title:String,showCancelBtn:Boolean,pageUrl:Object,isCalling:Boolean,callName:String},data:function(){return{modalType:{logout:!1},user:{}}},created:function(){this.user=this.$cookies.get("user")||{}},methods:{toPage:function(e){this.$router.push({name:e})},showModal:function(e,t){t&&(this.selectedData=t),this.modalType[e]=!0},closeModal:function(e){this.modalType[e]=!1,this.selectedData=null}},computed:{getUserName:function(){return(this.$cookies.get("user")||{}).account}}},c=r,s=(o("23d1"),o("2877")),d=Object(s["a"])(c,a,i,!1,null,"2b3cbec8",null);t["a"]=d.exports},"0542":function(e,t,o){e.exports=o.p+"img/workflow_record.1b5ba576.svg"},"06c5":function(e,t,o){"use strict";o.d(t,"a",(function(){return i}));o("fb6a"),o("d3b7"),o("b0c0"),o("a630"),o("3ca3"),o("ac1f"),o("00b4");var a=o("6b75");function i(e,t){if(e){if("string"===typeof e)return Object(a["a"])(e,t);var o=Object.prototype.toString.call(e).slice(8,-1);return"Object"===o&&e.constructor&&(o=e.constructor.name),"Map"===o||"Set"===o?Array.from(e):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?Object(a["a"])(e,t):void 0}}},"06f1":function(e,t,o){var a={"./equipment_hover.svg":"6234","./file_management_hover.svg":"c003","./task_management_hover.svg":"26c7","./user_management_hover.svg":"26b4","./workflow_management_hover.svg":"2864","./workflow_record_hover.svg":"d228","./xxxx_management_hover.svg":"fc8e"};function i(e){var t=n(e);return o(t)}function n(e){if(!o.o(a,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return a[e]}i.keys=function(){return Object.keys(a)},i.resolve=n,e.exports=i,i.id="06f1"},"0922":function(e,t,o){e.exports=o.p+"img/task-c.bc1d15c5.svg"},"09e7":function(e,t,o){e.exports=o.p+"img/ar-b.f4e0fe77.svg"},"11de":function(e,t,o){e.exports=o.p+"img/fii-vision-logo-b.d70b533e.svg"},"138c":function(e,t,o){e.exports=o.p+"img/text.468d86f6.svg"},"1a26":function(e,t,o){e.exports=o.p+"img/fii-vision-logo-c.5dd316ba.svg"},"1a8b":function(e,t,o){e.exports=o.p+"img/account-bg.2818368a.svg"},"23d1":function(e,t,o){"use strict";o("68fe")},"26b4":function(e,t,o){e.exports=o.p+"img/user_management_hover.bbae7239.svg"},"26c7":function(e,t,o){e.exports=o.p+"img/task_management_hover.41ddd409.svg"},2864:function(e,t,o){e.exports=o.p+"img/workflow_management_hover.91c8752d.svg"},"28fe":function(e,t,o){e.exports=o.p+"img/enterprise-b.c5ec6e8c.svg"},"356e":function(e,t,o){e.exports=o.p+"img/maintenance.4130bd61.svg"},"35fe":function(e,t,o){e.exports=o.p+"img/next.df16435d.svg"},"40b2":function(e,t,o){e.exports=o.p+"img/user_management.13e795f3.svg"},"40e9":function(e,t,o){e.exports=o.p+"img/text+image.b1e67898.svg"},4206:function(e,t,o){e.exports=o.p+"img/xxxx_management.e26d48a2.svg"},"49de":function(e,t,o){e.exports=o.p+"img/comments-hover.cb4dcc54.svg"},"4df4":function(e,t,o){"use strict";var a=o("da84"),i=o("0366"),n=o("c65b"),r=o("7b0b"),c=o("9bdd"),s=o("e95a"),d=o("68ee"),g=o("07fa"),l=o("8418"),v=o("9a1f"),p=o("35a1"),m=a.Array;e.exports=function(e){var t=r(e),o=d(this),a=arguments.length,f=a>1?arguments[1]:void 0,u=void 0!==f;u&&(f=i(f,a>2?arguments[2]:void 0));var b,x,h,_,w,k,y=p(t),A=0;if(!y||this==m&&s(y))for(b=g(t),x=o?new this(b):m(b);b>A;A++)k=u?f(t[A],A):t[A],l(x,A,k);else for(_=v(t,y),w=_.next,x=o?new this:[];!(h=n(w,_)).done;A++)k=u?c(_,f,[h.value,A],!0):h.value,l(x,A,k);return x.length=A,x}},"4e0f":function(e,t,o){e.exports=o.p+"img/comments.8cf9e61a.svg"},"51c7":function(e,t,o){e.exports=o.p+"img/check.60e3edbe.svg"},"51ce":function(e,t,o){e.exports=o.p+"img/user-log-hover.e551dbb9.svg"},"53c4":function(e,t,o){e.exports=o.p+"img/stop-icon.7e154d6e.svg"},"53e2":function(e,t,o){var a=o("6d25");a.__esModule&&(a=a.default),"string"===typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);var i=o("499e").default;i("6b53d3ae",a,!0,{sourceMap:!1,shadowMode:!1})},"5926f":function(e,t,o){e.exports=o.p+"img/video-alt.c8b3b4a9.svg"},"5ea5":function(e,t,o){"use strict";var a=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"sidebar",class:{minified:e.isSidebarMinified}},e._l(e.managementTools,(function(t){return o("div",{key:t.id,staticClass:"tool-list text-center"},[o("div",{staticClass:"tool-item",class:{active:t.isActive},on:{click:function(o){return e.toPage(t)},mouseover:function(e){t.isHovered=!0},mouseleave:function(e){t.isHovered=!1}}},[e.isSidebarMinified?e._e():o("div",{staticClass:"tool-name"},[o("img",{attrs:{src:e.setImgSrc(t.img_url,t.isActive,t.isHovered)}}),o("span",{staticClass:"ml-2"},[e._v(" "+e._s(e.$t(t.name))+" ")])]),e.isSidebarMinified?o("div",{directives:[{name:"b-tooltip",rawName:"v-b-tooltip.hover.right",modifiers:{hover:!0,right:!0}}],staticClass:"tool-name",attrs:{title:e.$t(t.name)}},[o("img",{attrs:{src:e.setImgSrc(t.img_url,t.isActive)}})]):e._e(),e._l(t.sub_tools,(function(a){return o("div",{key:a.id,staticClass:"sub-tool-list"},[t.isActive?o("div",[e.isSidebarMinified?e._e():o("div",{staticClass:"sub-tool-item mb-1",class:{"sub-active":a.isActive},on:{click:function(t){return t.stopPropagation(),e.toPage(a)}}},[e._v(" - "+e._s(e.$t(a.name))+" ")]),e.isSidebarMinified?o("div",{staticClass:"sub-tool-item-minified",class:{active:a.isActive},on:{click:function(t){return t.stopPropagation(),e.toPage(a)}}},[e._v(" "+e._s(e.$t(a.name_mini))+" ")]):e._e()]):e._e()])}))],2)])})),0)},i=[],n=o("b85c"),r=(o("b0c0"),{props:{isSidebarMinified:Boolean},data:function(){return{managementTools:[{id:0,name:"SIDEBAR.WORKFLOW",pathName:"WorkflowManagement",img_url:"workflow_management",isActive:!0,isHovered:!1,sub_tools:[]},{id:1,name:"SIDEBAR.RECORD",pathName:"WorkflowRecord",img_url:"workflow_record",isActive:!1,isHovered:!1,sub_tools:[]},{id:2,name:"SIDEBAR.EQUIPMENT",pathName:"EquipmentManagement",img_url:"equipment",isActive:!1,isHovered:!1,sub_tools:[{id:0,name:"SIDEBAR.EQUIPMENT_M",name_mini:"SIDEBAR.EQUIPMENT_M_MINI",pathName:"EquipmentManagement",isActive:!1},{id:1,name:"SIDEBAR.TYPE",name_mini:"SIDEBAR.TYPE_MINI",pathName:"TypeManagement",isActive:!1},{id:2,name:"SIDEBAR.LOCATION",name_mini:"SIDEBAR.LOCATION_MINI",pathName:"LocationManagement",isActive:!1}]},{id:3,name:"SIDEBAR.FILE",pathName:"FileManagement",img_url:"file_management",isActive:!1,isHovered:!1,sub_tools:[]},{id:4,name:"SIDEBAR.USER",pathName:"UserManagement",img_url:"user_management",isActive:!1,isHovered:!1,sub_tools:[]},{id:5,name:"SIDEBAR.TASK",pathName:"TaskManagement",img_url:"task_management",isActive:!1,isHovered:!1,sub_tools:[]}],currentPathName:""}},mounted:function(){this.currentPathName=this.$router.currentRoute.name,this.setActive()},methods:{toPage:function(e){e.pathName!=this.currentPathName&&this.$router.push({name:e.pathName})},setActive:function(){var e,t=Object(n["a"])(this.managementTools);try{for(t.s();!(e=t.n()).done;){var o=e.value;o.show_sub_tools=!1,o.isActive=!1,o.pathName==this.currentPathName&&(o.isActive=!0);var a,i=Object(n["a"])(o.sub_tools);try{for(i.s();!(a=i.n()).done;){var r=a.value;r.pathName==this.currentPathName&&(o.isActive=!0,r.isActive=!0)}}catch(c){i.e(c)}finally{i.f()}}}catch(c){t.e(c)}finally{t.f()}},setImgSrc:function(e,t,a){if(e)return t||a||this.isSidebarMinified?o("06f1")("./".concat(e,"_hover.svg")):o("f57b")("./".concat(e,".svg"))}}}),c=r,s=(o("9d45"),o("2877")),d=Object(s["a"])(c,a,i,!1,null,"0cdd9c4a",null);t["a"]=d.exports},6234:function(e,t,o){e.exports=o.p+"img/equipment_hover.80ce442e.svg"},"65a7":function(e,t,o){e.exports=o.p+"img/text-alt.827e60e5.svg"},"68c9":function(e,t,o){e.exports=o.p+"img/task-b.4271c150.svg"},"68fe":function(e,t,o){var a=o("8afa");a.__esModule&&(a=a.default),"string"===typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);var i=o("499e").default;i("16cffe1c",a,!0,{sourceMap:!1,shadowMode:!1})},"69c7":function(e,t,o){e.exports=o.p+"img/model.c61ffcf4.svg"},"6af0":function(e,t,o){"use strict";var a=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("TemplateModal",{scopedSlots:e._u([{key:"default",fn:function(){return[o("div",{staticClass:"m-modal-title"},[e._v(e._s(e.$t("MODAL.LOGOUT.TITLE")))]),o("div",{staticClass:"form-group row"},[o("div",{staticClass:"desc text-right"},[e._v(e._s(e.$t("MODAL.LOGOUT.DESC")))])]),o("div",{staticClass:"form-group row"},[o("b-button",{staticClass:"btn-cancel float-left",on:{click:e.cancel}},[e._v(e._s(e.$t("GENERAL.CANCEL")))]),o("b-button",{staticClass:"btn-ok float-right",on:{click:function(t){return e.$logout()}}},[e._v(e._s(e.$t("GENERAL.CONFIRM")))])],1)]},proxy:!0}])})},i=[],n=o("1b36"),r={components:{TemplateModal:n["a"]},props:{selectedData:Object},data:function(){return{}},methods:{cancel:function(){this.$emit("cancel")}}},c=r,s=(o("76de"),o("2877")),d=Object(s["a"])(c,a,i,!1,null,"87538b36",null);t["a"]=d.exports},"6b75":function(e,t,o){"use strict";function a(e,t){(null==t||t>e.length)&&(t=e.length);for(var o=0,a=new Array(t);o<t;o++)a[o]=e[o];return a}o.d(t,"a",(function(){return a}))},"6d25":function(e,t,o){var a=o("24fb");t=a(!1),t.push([e.i,".blue[data-v-87538b36]{color:#2173c9}.blueHover[data-v-87538b36]{color:#185597}.darkBlue[data-v-87538b36]{color:#0a519c}.grey[data-v-87538b36]{color:#7b7b7b}.greyHover[data-v-87538b36]{color:#606060}.lightgrey[data-v-87538b36]{color:#d7d7d7}.green[data-v-87538b36]{color:#3fb182}.greenHover[data-v-87538b36]{color:#37926c}.red[data-v-87538b36]{color:#d44e4e}.redHover[data-v-87538b36]{color:#b44b4b}.placeholder[data-v-87538b36]{color:#aeaeae}.placeholderHover[data-v-87538b36]{color:#7b7b7b}.white[data-v-87538b36]{color:#fff}.custom-pagination[data-v-87538b36]{width:calc(100% - 60px)}.custom-pagination[data-v-87538b36] .pagination{float:right}.custom-pagination[data-v-87538b36] .VuePagination__pagination-item-next-chunk .page-link,.custom-pagination[data-v-87538b36] .VuePagination__pagination-item-prev-chunk .page-link{padding:7px}.custom-pagination[data-v-87538b36] .page-link{width:38px;height:38px;border-radius:19px;margin:0 2px;text-align:center;color:#2173c9;cursor:pointer}.custom-pagination[data-v-87538b36] .page-link.active{color:#fff;background-color:#2173c9;border-color:#2173c9}.m-modal-title[data-v-87538b36]{margin-bottom:30px;color:#212529;padding-bottom:15px;font-size:22px;font-weight:700;border-bottom:2px solid #e7e7e9}.form-group[data-v-87538b36]{position:relative;margin:20px auto;margin-bottom:30px;width:100%}.form-group[data-v-87538b36]:focus{border:2px solid #4b8bcf;box-shadow:none}.form-group .desc[data-v-87538b36]{font-size:16px;color:#7b7b7b}.form-group .m-text[data-v-87538b36]{color:#212529;width:100%;padding:12px;border:2px solid #e7e7e9;border-radius:10px;min-height:100px}.form-group .btn-cancel[data-v-87538b36],.form-group .btn-ok[data-v-87538b36]{width:47%;height:38px;padding:0 12px;border-radius:10px;box-shadow:0 3px 3px 0 rgba(0,0,0,.15)}@media (max-width:1200px){.form-group .btn-cancel[data-v-87538b36],.form-group .btn-ok[data-v-87538b36]{width:100%;margin:5px 0}}.form-group .btn-cancel[data-v-87538b36]{color:#2173c9;background-color:#fff;border:1px solid #2173c9}.form-group .btn-ok[data-v-87538b36]{margin-left:6%;color:#fff;background-color:#2173c9;border:1px solid #2173c9}@media (max-width:1200px){.form-group .btn-ok[data-v-87538b36]{margin-left:0}}",""]),e.exports=t},"6dcc":function(e,t,o){e.exports=o.p+"img/analysis.86e51ef7.svg"},"6ea7":function(e,t,o){e.exports=o.p+"img/list-alt.da02dba9.svg"},"6f49":function(e,t,o){e.exports=o.p+"img/equipment.1cb2f023.svg"},"6fbc":function(e,t,o){e.exports=o.p+"img/enterprise-hover.eb6908dd.svg"},"72af":function(e,t,o){e.exports=o.p+"img/stop-icon.7e154d6e.svg"},"76de":function(e,t,o){"use strict";o("53e2")},"79e2":function(e,t,o){e.exports=o.p+"img/analysis-hover.5a77f513.svg"},"7dae":function(e,t,o){e.exports=o.p+"img/workflow_management.1b5d8a0b.svg"},"83f9":function(e,t,o){e.exports=o.p+"img/workflow-b.2c231b72.svg"},"84ed":function(e,t,o){e.exports=o.p+"img/text+model.19935ee6.svg"},"8afa":function(e,t,o){var a=o("24fb");t=a(!1),t.push([e.i,".header[data-v-2b3cbec8]{width:100%;position:fixed;top:0;z-index:99999;color:#fff;background:linear-gradient(60deg,#000,#2a3746 35%,#12274d 70%,#023773)}.header .header-title[data-v-2b3cbec8]{font-weight:700}.header .header-title .header-icon[data-v-2b3cbec8]{width:40px;margin-top:-10px}.header .header-title .header-main-title[data-v-2b3cbec8]{line-height:60px;font-size:24px;text-decoration:none}.header .header-title .header-sub-title[data-v-2b3cbec8]{color:#b3d5f4;line-height:60px;font-size:22px;text-decoration:none}.header .login[data-v-2b3cbec8]{height:62px;line-height:62px;font-size:18px}.header .login .user-icon[data-v-2b3cbec8]{margin-right:-5px;width:18px}.header .login .call-btn[data-v-2b3cbec8]{color:#fff}.header .login .call-btn[data-v-2b3cbec8]:hover{color:#ccc}.header .login[data-v-2b3cbec8] .btn-outline-none{color:#fff}.header .login[data-v-2b3cbec8] .btn:focus{box-shadow:none}.header .login[data-v-2b3cbec8] .dropdown-item{line-height:30px}",""]),e.exports=t},"8d63":function(e,t,o){e.exports=o.p+"img/text+video.705f1046.svg"},"91a4":function(e,t,o){e.exports=o.p+"img/text+model-alt.b91244e3.svg"},"936d":function(e,t,o){e.exports=o.p+"img/account-b.3727d628.svg"},"95d8":function(e,t,o){e.exports=o.p+"img/workflow-c.b6a6f798.svg"},"95fd":function(e,t,o){var a=o("ed9c");a.__esModule&&(a=a.default),"string"===typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);var i=o("499e").default;i("2576da3c",a,!0,{sourceMap:!1,shadowMode:!1})},9767:function(e,t,o){e.exports=o.p+"img/check-icon.4dc20323.svg"},9949:function(e,t,o){e.exports=o.p+"img/skip.74cb762f.svg"},"9bba":function(e,t,o){e.exports=o.p+"img/recorded-video-hover.7da3ea9d.svg"},"9bdd":function(e,t,o){var a=o("825a"),i=o("2a62");e.exports=function(e,t,o,n){try{return n?t(a(o)[0],o[1]):t(o)}catch(r){i(e,"throw",r)}}},"9d45":function(e,t,o){"use strict";o("95fd")},a325:function(e,t,o){e.exports=o.p+"img/model-alt.b8578c02.svg"},a630:function(e,t,o){var a=o("23e7"),i=o("4df4"),n=o("1c7e"),r=!n((function(e){Array.from(e)}));a({target:"Array",stat:!0,forced:r},{from:i})},b174:function(e,t,o){e.exports=o.p+"img/account-c.5350679d.svg"},b2af:function(e,t,o){e.exports=o.p+"img/user-log.bb538035.svg"},b327:function(e,t,o){e.exports=o.p+"img/text+video-alt.e40e5e14.svg"},b3ba:function(e,t,o){e.exports=o.p+"img/call-bg.54e323dd.svg"},b53b:function(e,t,o){e.exports=o.p+"img/image-alt.12d79b55.svg"},b5ee:function(e,t,o){e.exports=o.p+"img/video.30071a07.svg"},b85c:function(e,t,o){"use strict";o.d(t,"a",(function(){return i}));o("a4d3"),o("e01a"),o("d3b7"),o("d28b"),o("3ca3"),o("ddb0"),o("d9e2");var a=o("06c5");function i(e,t){var o="undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!o){if(Array.isArray(e)||(o=Object(a["a"])(e))||t&&e&&"number"===typeof e.length){o&&(e=o);var i=0,n=function(){};return{s:n,n:function(){return i>=e.length?{done:!0}:{done:!1,value:e[i++]}},e:function(e){throw e},f:n}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var r,c=!0,s=!1;return{s:function(){o=o.call(e)},n:function(){var e=o.next();return c=e.done,e},e:function(e){s=!0,r=e},f:function(){try{c||null==o["return"]||o["return"]()}finally{if(s)throw r}}}}},c003:function(e,t,o){e.exports=o.p+"img/file_management_hover.e840f45c.svg"},c47f:function(e,t,o){e.exports=o.p+"img/fii-vision-logo.ec9f8f3c.svg"},c4c2:function(e,t,o){e.exports=o.p+"img/wg-logo.31c776cb.png"},c4d8:function(e,t,o){e.exports=o.p+"img/task-bg.58c6473b.svg"},c688:function(e,t,o){e.exports=o.p+"img/check-icon.84763275.svg"},c792:function(e,t,o){e.exports=o.p+"img/maintenance-hover.6a0c79b7.svg"},c9d8:function(e,t,o){e.exports=o.p+"img/user.b1a05003.svg"},d228:function(e,t,o){e.exports=o.p+"img/workflow_record_hover.720cb94f.svg"},d28b:function(e,t,o){var a=o("746f");a("iterator")},d511:function(e,t,o){e.exports=o.p+"img/feedback.acd11d09.svg"},da27:function(e,t,o){e.exports=o.p+"img/image.e5acd8c6.svg"},dd31:function(e,t,o){e.exports=o.p+"img/task_management.030841a2.svg"},e00c:function(e,t,o){e.exports=o.p+"img/recorded-video.c59bd707.svg"},e01a:function(e,t,o){"use strict";var a=o("23e7"),i=o("83ab"),n=o("da84"),r=o("e330"),c=o("1a2d"),s=o("1626"),d=o("3a9b"),g=o("577e"),l=o("9bf2").f,v=o("e893"),p=n.Symbol,m=p&&p.prototype;if(i&&s(p)&&(!("description"in m)||void 0!==p().description)){var f={},u=function(){var e=arguments.length<1||void 0===arguments[0]?void 0:g(arguments[0]),t=d(m,this)?new p(e):void 0===e?p():p(e);return""===e&&(f[t]=!0),t};v(u,p),u.prototype=m,m.constructor=u;var b="Symbol(test)"==String(p("test")),x=r(m.toString),h=r(m.valueOf),_=/^Symbol\((.*)\)[^)]+$/,w=r("".replace),k=r("".slice);l(m,"description",{configurable:!0,get:function(){var e=h(this),t=x(e);if(c(f,e))return"";var o=b?k(t,7,-1):w(t,_,"$1");return""===o?void 0:o}}),a({global:!0,forced:!0},{Symbol:u})}},e347:function(e,t,o){e.exports=o.p+"img/logo.ae2529b6.svg"},e406:function(e,t,o){e.exports=o.p+"img/image.7b82e85b.svg"},e86d:function(e,t,o){e.exports=o.p+"img/feedback-hover.33be6df5.svg"},ed9c:function(e,t,o){var a=o("24fb");t=a(!1),t.push([e.i,".blue[data-v-0cdd9c4a]{color:#2173c9}.blueHover[data-v-0cdd9c4a]{color:#185597}.darkBlue[data-v-0cdd9c4a]{color:#0a519c}.grey[data-v-0cdd9c4a]{color:#7b7b7b}.greyHover[data-v-0cdd9c4a]{color:#606060}.lightgrey[data-v-0cdd9c4a]{color:#d7d7d7}.green[data-v-0cdd9c4a]{color:#3fb182}.greenHover[data-v-0cdd9c4a]{color:#37926c}.red[data-v-0cdd9c4a]{color:#d44e4e}.redHover[data-v-0cdd9c4a]{color:#b44b4b}.placeholder[data-v-0cdd9c4a]{color:#aeaeae}.placeholderHover[data-v-0cdd9c4a]{color:#7b7b7b}.white[data-v-0cdd9c4a]{color:#fff}.custom-pagination[data-v-0cdd9c4a]{width:calc(100% - 60px)}.custom-pagination[data-v-0cdd9c4a] .pagination{float:right}.custom-pagination[data-v-0cdd9c4a] .VuePagination__pagination-item-next-chunk .page-link,.custom-pagination[data-v-0cdd9c4a] .VuePagination__pagination-item-prev-chunk .page-link{padding:7px}.custom-pagination[data-v-0cdd9c4a] .page-link{width:38px;height:38px;border-radius:19px;margin:0 2px;text-align:center;color:#2173c9;cursor:pointer}.custom-pagination[data-v-0cdd9c4a] .page-link.active{color:#fff;background-color:#2173c9;border-color:#2173c9}.sidebar[data-v-0cdd9c4a]{float:left;width:15%;height:calc(100vh - 60px);color:#333;background-color:#f9f9f9;transition:all .2s ease-in-out}.sidebar .tool-list[data-v-0cdd9c4a]{padding:20px;font-size:14px}.sidebar .tool-list .tool-item[data-v-0cdd9c4a]{line-height:44px;border-radius:8px;cursor:pointer;transition:all .2s ease-in-out}.sidebar .tool-list .tool-item[data-v-0cdd9c4a]:hover{background-color:#0a519c;color:#fff;box-shadow:0 13px 27px -5px rgba(50,50,93,.25),0 8px 16px -8px rgba(0,0,0,.3)}.sidebar .tool-list .tool-item .tool-name[data-v-0cdd9c4a]{position:relative;font-size:16px;font-weight:700}.sidebar .tool-list .tool-item .tool-name img[data-v-0cdd9c4a]{width:25px;margin-top:-5px}.sidebar .tool-list .tool-item .tool-name .sub-tool-tip[data-v-0cdd9c4a]{position:absolute;right:10px}.sidebar .tool-list .tool-item .tool-name .sub-tool-tip svg[data-v-0cdd9c4a]{width:10px}.sidebar .tool-list .tool-item .sub-tool-list .sub-tool-item[data-v-0cdd9c4a]{border-radius:8px}.sidebar .tool-list .tool-item .sub-tool-list .sub-tool-item[data-v-0cdd9c4a]:hover{color:#fff;background-color:#2173c9;box-shadow:0 13px 27px -5px rgba(50,50,93,.25),0 8px 16px -8px rgba(0,0,0,.3)}.sidebar .tool-list .tool-item .sub-tool-list .sub-tool-item-minified[data-v-0cdd9c4a]{top:50px;left:50px;background-color:#0a519c;box-shadow:0 13px 27px -5px rgba(50,50,93,.25),0 8px 16px -8px rgba(0,0,0,.3)}.sidebar .tool-list .tool-item .sub-tool-list .sub-tool-item-minified[data-v-0cdd9c4a]:hover{background-color:#2173c9;box-shadow:0 13px 27px -5px rgba(50,50,93,.25),0 8px 16px -8px rgba(0,0,0,.3)}.sidebar .tool-list a[data-v-0cdd9c4a]{color:unset;text-decoration:none}.sidebar .tool-list a[data-v-0cdd9c4a]:hover{text-decoration:none}.sidebar .active[data-v-0cdd9c4a]{background-color:#0a519c}.sidebar .active[data-v-0cdd9c4a],.sidebar .sub-active[data-v-0cdd9c4a]{color:#fff;box-shadow:0 13px 27px -5px rgba(50,50,93,.25),0 8px 16px -8px rgba(0,0,0,.3)}.sidebar .sub-active[data-v-0cdd9c4a]{background-color:#2173c9;border-top-left-radius:0!important;border-top-right-radius:0!important}.minified[data-v-0cdd9c4a]{width:4%;background-color:#b3d5f4}.minified .tool-list[data-v-0cdd9c4a]{padding:20px 0;transition:all .2s ease-in-out}.minified .tool-list[data-v-0cdd9c4a]:hover{cursor:pointer}.minified .tool-list .tool-item[data-v-0cdd9c4a]{border-radius:0}",""]),e.exports=t},f0e3:function(e,t,o){e.exports=o.p+"img/enterprise.5446c33a.svg"},f114:function(e,t,o){e.exports=o.p+"img/workflow-bg.dbcf4313.svg"},f49e:function(e,t,o){e.exports=o.p+"img/file_management.f03555ff.svg"},f57b:function(e,t,o){var a={"./account-b.svg":"936d","./account-bg.svg":"1a8b","./account-c.svg":"b174","./ar-b.svg":"09e7","./ar-c.svg":"fa80","./call-bg.svg":"b3ba","./check-icon.svg":"9767","./check.svg":"51c7","./enterprise-b.svg":"28fe","./enterprise-c.svg":"0374","./equipment.svg":"6f49","./equipment_hover.svg":"6234","./fii-vision-logo-b.svg":"11de","./fii-vision-logo-c.svg":"1a26","./fii-vision-logo.svg":"c47f","./file_management.svg":"f49e","./file_management_hover.svg":"c003","./image-alt.svg":"b53b","./image.svg":"da27","./list-alt.svg":"6ea7","./logo.svg":"e347","./management/analysis-hover.svg":"79e2","./management/analysis.svg":"6dcc","./management/check-icon.svg":"c688","./management/comments-hover.svg":"49de","./management/comments.svg":"4e0f","./management/enterprise-hover.svg":"6fbc","./management/enterprise.svg":"f0e3","./management/feedback-hover.svg":"e86d","./management/feedback.svg":"d511","./management/image.svg":"e406","./management/maintenance-hover.svg":"c792","./management/maintenance.svg":"356e","./management/recorded-video-hover.svg":"9bba","./management/recorded-video.svg":"e00c","./management/stop-icon.svg":"53c4","./management/user-log-hover.svg":"51ce","./management/user-log.svg":"b2af","./model-alt.svg":"a325","./model.svg":"69c7","./next.svg":"35fe","./skip.svg":"9949","./stop-icon.svg":"72af","./task-b.svg":"68c9","./task-bg.svg":"c4d8","./task-c.svg":"0922","./task_management.svg":"dd31","./task_management_hover.svg":"26c7","./text+image-alt.svg":"fd6c","./text+image.svg":"40e9","./text+model-alt.svg":"91a4","./text+model.svg":"84ed","./text+video-alt.svg":"b327","./text+video.svg":"8d63","./text-alt.svg":"65a7","./text.svg":"138c","./user.svg":"c9d8","./user_management.svg":"40b2","./user_management_hover.svg":"26b4","./video-alt.svg":"5926f","./video.svg":"b5ee","./workflow-b.svg":"83f9","./workflow-bg.svg":"f114","./workflow-c.svg":"95d8","./workflow_management.svg":"7dae","./workflow_management_hover.svg":"2864","./workflow_record.svg":"0542","./workflow_record_hover.svg":"d228","./xxxx_management.svg":"4206","./xxxx_management_hover.svg":"fc8e"};function i(e){var t=n(e);return o(t)}function n(e){if(!o.o(a,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return a[e]}i.keys=function(){return Object.keys(a)},i.resolve=n,e.exports=i,i.id="f57b"},fa80:function(e,t,o){e.exports=o.p+"img/ar-c.927e4be0.svg"},fc8e:function(e,t,o){e.exports=o.p+"img/xxxx_management_hover.38d47d23.svg"},fd6c:function(e,t,o){e.exports=o.p+"img/text+image-alt.bd511ca2.svg"}}]);
//# sourceMappingURL=chunk-5575bace.b9c22ad4.js.map