(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-82cf8b20"],{"1ef2":function(t,a,e){"use strict";e.r(a);var c=function(){var t=this,a=t.$createElement,c=t._self._c||a;return c("div",{staticClass:"feedback-contact-us"},[c("Searchbar",{on:{search:t.searchContactUsList}}),c("div",{staticClass:"filter-section"},[c("b-form-select",{staticClass:"select-component ml-3 my-4",attrs:{options:t.enterpriseList},on:{change:function(a){return t.getContactUsList(t.selectedEnterprise)}},model:{value:t.selectedEnterprise,callback:function(a){t.selectedEnterprise=a},expression:"selectedEnterprise"}})],1),c("div",{staticClass:"m-table-container"},[c("table",{staticClass:"m-table mx-auto"},[t._m(0),c("tbody",t._l(t.contactUsList,(function(a,s){return c("tr",{key:s,staticClass:"m-tr tr-list"},[c("td",{staticClass:"m-td"},[c("span",{staticClass:"m-value"},[t._v(" "+t._s(a.enterprise)+" ")])]),c("td",{staticClass:"m-td"},[c("span",{staticClass:"m-value"},[t._v(t._s(a.account))])]),c("td",{staticClass:"m-td"},[c("span",{staticClass:"m-value"},[t._v(t._s(a.name))])]),c("td",{staticClass:"m-td"},[c("span",{staticClass:"m-value"},[t._v(t._s(a.email))])]),c("td",{staticClass:"m-td"},[c("div",{staticClass:"float-left"},[t._v(t._s(a.message?a.message:"尚未有紀錄"))]),a.photos.length>0?c("img",{staticClass:"mx-1 photo-img float-left",attrs:{src:e("e406")}}):t._e(),a.responsed_time?c("div",{staticClass:"user-log float-left",attrs:{role:"button"},on:{click:function(e){return t.showModal("comment",a)}}}):t._e()]),c("td",{staticClass:"m-td"},[c("span",{staticClass:"m-value"},[t._v(t._s(t.GetDatetimeString(a.created_time)))])]),c("td",{staticClass:"m-td"},[c("div",{staticClass:"comments",attrs:{role:"button"},on:{click:function(e){return t.showModal("reply",a)}}})]),c("td",{staticClass:"m-td"},[c("div",{staticClass:"float-left"},[t._v(" "+t._s(a.responsed_time?t.GetDatetimeString(a.responsed_time):"尚未有紀錄")+" ")]),a.responsed_time?c("div",{staticClass:"user-log float-left",attrs:{role:"button"},on:{click:function(e){return t.showModal("replyList",a)}}}):t._e()])])})),0)])]),t.modalType.comment?c("Comment",{attrs:{selectedData:t.selectedData},on:{cancel:function(a){return t.closeModal("comment",!1)},showReplyModal:t.showReplyModal}}):t._e(),t.modalType.reply?c("Reply",{attrs:{selectedData:t.selectedData},on:{ok:function(a){return t.closeModal("reply",!0)},cancel:function(a){return t.closeModal("reply",!1)}}}):t._e(),t.modalType.replyList?c("ReplyList",{attrs:{selectedData:t.selectedData},on:{cancel:function(a){return t.closeModal("replyList",!1)}}}):t._e()],1)},s=[function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("thead",[e("tr",{staticClass:"m-tr tr-item"},[e("th",{staticClass:"m-th"},[e("div",{staticClass:"m-th-content"},[e("span",[t._v("企業")])])]),e("th",{staticClass:"m-th"},[e("div",{staticClass:"m-th-content"},[e("span",[t._v("帳號")])])]),e("th",{staticClass:"m-th"},[e("div",{staticClass:"m-th-content"},[e("span",[t._v("用戶名稱")])])]),e("th",{staticClass:"m-th"},[e("div",{staticClass:"m-th-content"},[e("span",[t._v("Email")])])]),e("th",{staticClass:"m-th"},[e("div",{staticClass:"m-th-content"},[e("span",[t._v("其他意見")])])]),e("th",{staticClass:"m-th"},[e("div",{staticClass:"m-th-content"},[e("span",[t._v("聯繫時間")])])]),e("th",{staticClass:"m-th"},[e("div",{staticClass:"m-th-content"},[e("span",[t._v("回覆用戶")])])]),e("th",{staticClass:"m-th"},[e("div",{staticClass:"m-th-content"},[e("span",[t._v("回覆紀錄")])])])])])}],o=e("b85c"),n=(e("b0c0"),e("a052")),i=e("410a"),l=e("7d39"),r=e("4bfe"),d=e("c466"),m={components:{Searchbar:n["a"],Comment:i["a"],Reply:l["a"],ReplyList:r["a"]},data:function(){return{modalType:{comment:!1,reply:!1,replyList:!1},selectedData:null,contactUsList:[],enterpriseList:[{value:0,text:"所有企業"}],selectedEnterprise:0}},mounted:function(){this.getContactUsList(),this.getEnterpriseList()},methods:{GetDatetimeString:d["b"],getContactUsList:function(t){var a=this,e={code:0==t?null:t};this.apiGet("si/contact_us_list",e).then((function(t){var e=t.data;a.contactUsList=e.list}))},searchContactUsList:function(t){var a=this,e={code:0==this.selectedEnterprise?null:this.selectedEnterprise,keyword:t};this.apiGet("si/contact_us_list",e).then((function(t){var e=t.data;a.contactUsList=e.list}))},getEnterpriseList:function(){var t=this;this.apiGet("si/enterprise_list").then((function(a){var e,c=a.data,s=Object(o["a"])(c.list);try{for(s.s();!(e=s.n()).done;){var n=e.value;t.enterpriseList.push({value:n.code,text:n.name})}}catch(i){s.e(i)}finally{s.f()}}))},showModal:function(t,a){a&&(this.selectedData=a),this.modalType[t]=!0},showReplyModal:function(){this.modalType.comment=!1,this.modalType.reply=!0},closeModal:function(t,a){a&&this.getContactUsList(),this.modalType[t]=!1,this.selectedData=null}}},b=m,p=(e("837d"),e("2877")),f=Object(p["a"])(b,c,s,!1,null,"353f0cb8",null);a["default"]=f.exports},"837d":function(t,a,e){"use strict";e("e3e0")},e3e0:function(t,a,e){var c=e("fbe5");c.__esModule&&(c=c.default),"string"===typeof c&&(c=[[t.i,c,""]]),c.locals&&(t.exports=c.locals);var s=e("499e").default;s("410835b7",c,!0,{sourceMap:!1,shadowMode:!1})},e406:function(t,a,e){t.exports=e.p+"img/image.7b82e85b.svg"},fbe5:function(t,a,e){var c=e("24fb"),s=e("1de5"),o=e("b2af"),n=e("51ce"),i=e("4e0f"),l=e("49de");a=c(!1);var r=s(o),d=s(n),m=s(i),b=s(l);a.push([t.i,".blue[data-v-353f0cb8]{color:#2173c9}.blueHover[data-v-353f0cb8]{color:#185597}.darkBlue[data-v-353f0cb8]{color:#0a519c}.grey[data-v-353f0cb8]{color:#7b7b7b}.greyHover[data-v-353f0cb8]{color:#606060}.lightgrey[data-v-353f0cb8]{color:#d7d7d7}.green[data-v-353f0cb8]{color:#3fb182}.greenHover[data-v-353f0cb8]{color:#37926c}.red[data-v-353f0cb8]{color:#d44e4e}.redHover[data-v-353f0cb8]{color:#b44b4b}.placeholder[data-v-353f0cb8]{color:#aeaeae}.placeholderHover[data-v-353f0cb8]{color:#7b7b7b}.white[data-v-353f0cb8]{color:#fff}.custom-pagination[data-v-353f0cb8]{width:calc(100% - 60px)}.custom-pagination[data-v-353f0cb8] .pagination{float:right}.custom-pagination[data-v-353f0cb8] .VuePagination__pagination-item-next-chunk .page-link,.custom-pagination[data-v-353f0cb8] .VuePagination__pagination-item-prev-chunk .page-link{padding:7px}.custom-pagination[data-v-353f0cb8] .page-link{width:38px;height:38px;border-radius:19px;margin:0 2px;text-align:center;color:#2173c9;cursor:pointer}.custom-pagination[data-v-353f0cb8] .page-link.active{color:#fff;background-color:#2173c9;border-color:#2173c9}.feedback-contact-us .filter-section[data-v-353f0cb8]{margin-right:7vw;margin-top:2px}.feedback-contact-us .filter-section .select-component[data-v-353f0cb8]{float:left;width:300px;background-color:#fff;border:1px solid #ccc;background-image:linear-gradient(45deg,transparent 50%,#7b7b7b 60%),linear-gradient(135deg,#7b7b7b 40%,transparent 50%)!important;background-position:calc(100% - 17px) 14px,calc(100% - 10px) 14px,100% 0;background-size:7px 7px,7px 7px;background-repeat:no-repeat;-webkit-appearance:none;-moz-appearance:none;cursor:pointer}.feedback-contact-us .filter-section .select-component option[data-v-353f0cb8]{background-color:#fff;border:1px solid #fff}.feedback-contact-us .filter-section .add-btn[data-v-353f0cb8]{float:right;background-color:#2173c9;border:1px solid #2173c9;height:40px}.feedback-contact-us .m-table-container[data-v-353f0cb8]{padding-left:100px;font-size:14px}.feedback-contact-us .m-table-container .m-table[data-v-353f0cb8]{box-sizing:border-box;border:1px solid #d0d0d0;border-radius:5px;width:80vw}.feedback-contact-us .m-table-container .m-table .m-th[data-v-353f0cb8]{background-color:#eaeaea;text-align:left;padding-left:15px}.feedback-contact-us .m-table-container .m-table .m-th .m-th-content[data-v-353f0cb8]{font-size:14px;font-weight:700}.feedback-contact-us .m-table-container .m-table .m-th .m-th-content .m-th-sort[data-v-353f0cb8]{position:relative;float:right;margin-left:-10px;margin-top:10px}.feedback-contact-us .m-table-container .m-table .m-th .m-th-content .m-th-sort .icon-up[data-v-353f0cb8]{position:absolute}.feedback-contact-us .m-table-container .m-table .m-th .m-th-content .m-th-sort .icon-down[data-v-353f0cb8]{position:absolute;top:7px}.feedback-contact-us .m-table-container .m-table .m-tr[data-v-353f0cb8]{border:1px solid #ccc}.feedback-contact-us .m-table-container .m-table .m-tr[data-v-353f0cb8]:hover{background-color:#f6f6f6}.feedback-contact-us .m-table-container .m-table .tr-item[data-v-353f0cb8]{height:60px;line-height:60px}.feedback-contact-us .m-table-container .m-table .tr-list[data-v-353f0cb8]{height:40px;line-height:40px}.feedback-contact-us .m-table-container .m-table .m-td[data-v-353f0cb8]{text-align:left;padding-left:15px;height:45px}.feedback-contact-us .m-table-container .m-table .m-td .edit-img[data-v-353f0cb8]{font-size:20px;color:#7f7f7f}.feedback-contact-us .m-table-container .m-table .m-td .edit-img[data-v-353f0cb8]:hover{color:#2173c9}.feedback-contact-us .m-table-container .m-table .m-td .photo-img[data-v-353f0cb8]{margin-top:13px}.feedback-contact-us .m-table-container .m-table .m-td .user-log[data-v-353f0cb8]{width:25px;height:25px;margin-top:5px;background-image:url("+r+");background-repeat:no-repeat;transform:rotate(180deg)}.feedback-contact-us .m-table-container .m-table .m-td .user-log[data-v-353f0cb8]:hover{background-image:url("+d+")}.feedback-contact-us .m-table-container .m-table .m-td .comments[data-v-353f0cb8]{width:25px;height:25px;margin-top:5px;background-image:url("+m+");background-repeat:no-repeat}.feedback-contact-us .m-table-container .m-table .m-td .comments[data-v-353f0cb8]:hover{background-image:url("+b+")}",""]),t.exports=a}}]);
//# sourceMappingURL=chunk-82cf8b20.a2650926.js.map