(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-ff45ff1e"],{"07f1":function(e,t,a){"use strict";a("bc64")},1545:function(e,t,a){var o=a("6ce6");o.__esModule&&(o=o.default),"string"===typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);var i=a("499e").default;i("016c2f77",o,!0,{sourceMap:!1,shadowMode:!1})},"1c38":function(e,t,a){"use strict";a("1545")},"235f":function(e,t,a){"use strict";var o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"header text-center",class:{"height-unset":e.isCalling}},[a("transition",{attrs:{name:"top-fade",mode:"out-in"}},[e.isCalling?a("div",{staticClass:"row calling"},[a("div",{staticClass:"col-3 caller"},[a("div",{staticClass:"prefix float-left ml-5 mr-3",attrs:{role:"button"}},[a("div",{staticClass:"prefix-text"},[e._v(e._s(e.callName.slice(0,1)))])]),a("div",{staticClass:"float-left text-left"},[a("div",{staticClass:"call-name"},[e._v(e._s(e.callName))]),a("div",[e._v("邀請通話")])])]),a("span",{staticClass:"col-6"},[e._v("提醒您，若您在完成儲存截圖前接通新的來電，本次截圖將無法再次儲存！")]),a("div",{staticClass:"col-3"},[a("div",{staticClass:"accept float-right mr-5",attrs:{role:"button"}},[a("font-awesome-icon",{attrs:{icon:"phone",size:"2x",transform:{rotate:90}},on:{click:e.accept}})],1),a("div",{staticClass:"decline float-right mx-3",attrs:{role:"button"}},[a("font-awesome-icon",{attrs:{icon:"phone",size:"2x",transform:{rotate:225}},on:{click:e.decline}})],1)])]):e._e()]),a("div",{staticClass:"header-title"},[e._v(e._s(e.title))]),e.showCancelBtn&&!e.isCalling?a("div",{staticClass:"cancel mx-auto text-right"},[a("router-link",{attrs:{to:e.pageUrl}},[a("font-awesome-icon",{attrs:{icon:"times",size:"2x"}})],1)],1):e._e()],1)},i=[],r={name:"RAHeader",props:{title:String,showCancelBtn:Boolean,pageUrl:Object,isCalling:Boolean,callName:String},methods:{accept:function(){this.$emit("accept",!0)},decline:function(){this.$emit("accept",!1)}}},n=r,s=(a("1c38"),a("2877")),c=Object(s["a"])(n,o,i,!1,null,"daf7b164",null);t["a"]=c.exports},"6ce6":function(e,t,a){var o=a("24fb");t=o(!1),t.push([e.i,".blue[data-v-daf7b164]{color:#2173c9}.blueHover[data-v-daf7b164]{color:#185597}.darkBlue[data-v-daf7b164]{color:#0a519c}.grey[data-v-daf7b164]{color:#7b7b7b}.greyHover[data-v-daf7b164]{color:#606060}.lightgrey[data-v-daf7b164]{color:#d7d7d7}.green[data-v-daf7b164]{color:#3fb182}.greenHover[data-v-daf7b164]{color:#37926c}.red[data-v-daf7b164]{color:#d44e4e}.redHover[data-v-daf7b164]{color:#b44b4b}.placeholder[data-v-daf7b164]{color:#aeaeae}.placeholderHover[data-v-daf7b164]{color:#7b7b7b}.white[data-v-daf7b164]{color:#fff}.custom-pagination[data-v-daf7b164]{width:calc(100% - 60px)}.custom-pagination[data-v-daf7b164] .pagination{float:right}.custom-pagination[data-v-daf7b164] .VuePagination__pagination-item-next-chunk .page-link,.custom-pagination[data-v-daf7b164] .VuePagination__pagination-item-prev-chunk .page-link{padding:7px}.custom-pagination[data-v-daf7b164] .page-link{width:38px;height:38px;border-radius:19px;margin:0 2px;text-align:center;color:#2173c9;cursor:pointer}.custom-pagination[data-v-daf7b164] .page-link.active{color:#fff;background-color:#2173c9;border-color:#2173c9}.header[data-v-daf7b164]{width:100%;height:60px;position:fixed;top:0;z-index:900;color:#fff}.header .calling[data-v-daf7b164]{height:110px;line-height:110px;background-color:#313131;box-shadow:0 3px 5px rgba(0,0,0,.5019607843137255);border-bottom:2px solid #1f1f1f}.header .calling .accept[data-v-daf7b164],.header .calling .decline[data-v-daf7b164],.header .calling .prefix[data-v-daf7b164]{margin-top:15px;width:75px;height:75px;line-height:85px;border-radius:50%}.header .calling .prefix[data-v-daf7b164]{background-color:#b7b7b7}.header .calling .prefix .prefix-text[data-v-daf7b164]{font-size:30px;margin-top:-5px}.header .calling .decline[data-v-daf7b164]{background-color:#d44e4e}.header .calling .accept[data-v-daf7b164]{background-color:#3fb182}.header .calling .call-name[data-v-daf7b164]{margin-top:-12px;height:24px;font-size:24px}.header .header-title[data-v-daf7b164]{height:60px;line-height:60px;font-size:24px;background-color:#313131}.header .cancel[data-v-daf7b164]{width:600px;margin-top:-45px}.header .cancel a[data-v-daf7b164]{color:#fff}.header .cancel a[data-v-daf7b164]:hover{color:#ddd}.height-unset[data-v-daf7b164]{height:unset}",""]),e.exports=t},"7f52":function(e,t,a){"use strict";a.r(t);var o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"serviceTerms text-center"},[a("RAHeader",{attrs:{title:1==this.$store.state.deployType?e.$t("TERMS.TITLE_1"):e.$t("TERMS.TITLE_2")}}),a("div",{staticClass:"ra-main-content mx-auto text-left"},[a("div",{staticClass:"row pb-5"},[a("div",{staticClass:"col-md-3 col-1"}),0==e.lang?a("div",{staticClass:"col-md-6 col-10"},[a("div",{staticClass:"ra-title y-4"},[e._v("服務條款")]),a("div",{staticClass:"content my-2"},[1==this.$store.state.deployType?a("p",[e._v(" 國基電子(上海)有限公司（以下簡稱“本公司”）提供AR遠程協作應用程式（以下簡稱“本服務”）並負責管理並運作此一服務。本服務是完全免費提供給使用者的服務，僅須經過線上註冊手續，即可使用。而其中部分加值服務必須向本公司付費才能使用。透過本服務，您可以註冊為用戶，透過網頁瀏覽器、iOS/Android手機或智能眼鏡與其他用戶以語音、視訊方式溝通，並且在通話時對影像進行標註。您可在本服務中以完整帳號名稱搜尋其他使用者，將他們加入您的聯絡人名單，並發送通話邀請。 ")]):e._e(),2==this.$store.state.deployType?a("p",[e._v(" 國基電子(上海)有限公司（以下簡稱“本公司”）提供AR遠程協同應用程式（以下簡稱“本服務”）並負責管理並運作此一服務。本服務是完全免費提供給使用者的服務，僅須經過線上註冊手續，即可使用。而其中部分加值服務必須向本公司付費才能使用。透過本服務，您可以註冊為用戶，透過網頁瀏覽器、iOS/Android手機或智能眼鏡與其他用戶以語音、視訊方式溝通，並且在通話時對影像進行標註。您可在本服務中以完整帳號名稱搜尋其他使用者，將他們加入您的聯絡人名單，並發送通話邀請。 ")]):e._e()]),a("div",{staticClass:"ra-sub-title mt-4 mb-2"},[e._v("1. 協議–條款")]),e._m(0),a("div",{staticClass:"ra-sub-title mt-4 mb-2"},[e._v("2. 本服務提供")]),e._m(1),a("div",{staticClass:"ra-sub-title mt-4 mb-2"},[e._v("3. 安全性")]),e._m(2),a("div",{staticClass:"ra-sub-title mt-4 mb-2"},[e._v("4. 從本服務到其他網站的超連結")]),e._m(3),a("div",{staticClass:"ra-sub-title mt-4 mb-2"},[e._v("5. 從其他網站到本服務的超連結")]),e._m(4),a("div",{staticClass:"ra-sub-title mt-4 mb-2"},[e._v("6. 知識產權")]),e._m(5),a("div",{staticClass:"ra-sub-title mt-4 mb-2"},[e._v("7. 聲明與保證的免責聲明")]),e._m(6),a("div",{staticClass:"ra-sub-title mt-4 mb-2"},[e._v("8. 責任限制")]),e._m(7),a("div",{staticClass:"ra-sub-title mt-4 mb-2"},[e._v("9. 遵守當地法律")]),e._m(8)]):e._e(),1==e.lang?a("div",{staticClass:"col-md-6 col-10"},[a("div",{staticClass:"ra-title y-4"},[e._v("Terms of Service")]),e._m(9),a("div",{staticClass:"ra-sub-title mt-4 mb-2"},[e._v("1. Agreement-Terms")]),e._m(10),a("div",{staticClass:"ra-sub-title mt-4 mb-2"},[e._v("2. This service provides")]),e._m(11),a("div",{staticClass:"ra-sub-title mt-4 mb-2"},[e._v("3. Security")]),e._m(12),a("div",{staticClass:"ra-sub-title mt-4 mb-2"},[e._v("4. Hyperlinks from this service to other websites")]),e._m(13),a("div",{staticClass:"ra-sub-title mt-4 mb-2"},[e._v("5. Hyperlinks from other websites to this service")]),e._m(14),a("div",{staticClass:"ra-sub-title mt-4 mb-2"},[e._v("6. Intellectual Property")]),e._m(15),a("div",{staticClass:"ra-sub-title mt-4 mb-2"},[e._v("7. Disclaimer of declarations and guarantees")]),e._m(16),a("div",{staticClass:"ra-sub-title mt-4 mb-2"},[e._v("8. Limitation of Liability")]),e._m(17),a("div",{staticClass:"ra-sub-title mt-4 mb-2"},[e._v("9. Compliance with local laws")]),e._m(18)]):e._e(),2==e.lang?a("div",{staticClass:"col-md-6 col-10"},[a("div",{staticClass:"ra-title y-4"},[e._v("服务条款")]),e._m(19),a("div",{staticClass:"ra-sub-title mt-4 mb-2"},[e._v("1. 协议–条款")]),e._m(20),a("div",{staticClass:"ra-sub-title mt-4 mb-2"},[e._v("2. 本服务提供")]),e._m(21),a("div",{staticClass:"ra-sub-title mt-4 mb-2"},[e._v("3. 安全性")]),e._m(22),a("div",{staticClass:"ra-sub-title mt-4 mb-2"},[e._v("4. 从本服务到其他网站的超连结")]),e._m(23),a("div",{staticClass:"ra-sub-title mt-4 mb-2"},[e._v("5. 从其他网站到本服务的超连结")]),e._m(24),a("div",{staticClass:"ra-sub-title mt-4 mb-2"},[e._v("6. 知识产权")]),e._m(25),a("div",{staticClass:"ra-sub-title mt-4 mb-2"},[e._v("7. 声明与保证的免责声明")]),e._m(26),a("div",{staticClass:"ra-sub-title mt-4 mb-2"},[e._v("8. 责任限制")]),e._m(27),a("div",{staticClass:"ra-sub-title mt-4 mb-2"},[e._v("9. 遵守当地法律")]),e._m(28)]):e._e(),a("div",{staticClass:"col-md-3 col-1"})])])],1)},i=[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v("使用本服務的所有使用者視為同意以下條款約束。若您不接受條款內容，請立即終止使用，")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v(" 根據本協議的條款與條件及本公司的其他政策與程序，本公司將盡商業上的合理努力使本服務維持每天二十四 (24) 小時、每週七 (7) 天的運作。您知悉並同意，本服務偶爾會基於任何理由無法供存取或無法運作，這些原因包括但不限於設備故障、定期維護、修復或更換、超出本公司合理控制能力或無法合理預見的原因，包括但不限於電訊或數位傳輸連結中斷或故障、惡意網路攻擊、網路擁塞或其他造成故障的原因。您知悉並同意，本公司無法保證本服務與服務能夠完全不間斷運作，而且對於此等情況本公司對您或任何其他方概不負責。 ")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v(" 在適當的情況下，本公司使用可用的技術來保護通過網站進行的通信的安全性。但是，對於通過本服務進行的任何交易和其他通訊的安全性，真實性，完整性或機密性，本公司不承擔任何責任。網際網路通信可能會受到第三方的干擾或攔截。儘管本公司已盡最大努力，但本公司不保證本服務不受電腦惡意病毒或其他未經授權的軟體感染。您應該採取適當的步驟來保護您的資料，軟體和設備的安全。這包括在使用網站上的任何服務之前和之後清除Internet瀏覽器cookie和快取。您應該對密碼保密。 ")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v(" 該網站包含超連結，部分連結指向非本公司維護的網站。本公司對這些網站的內容概不負責，也不對由於訪問這些網站而造成的任何損害或損失負責。使用超連結和訪問此類網站的風險由您自行完全承擔。 ")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v(" 本公司保留禁用任何未經授權的連結或框架的權利，並對本服務或任何內容的連結所到達之任何其他網站上的可用內容不承擔任何責任。 ")]),a("p",[e._v(" 本公司保留更改網站URL的權利。 ")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v(" 網站上的材料，包括原始碼，頁面，文件和圖形，語音和影片，均受法律保護。材料中的知識產權歸本公司版權所有或許可。除出於法律允許的目的外，未經本公司事先許可，不得將本服務的任何部分複製或重新用於任何商業目的。 ")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v(" 您明確知悉並同意自行承擔使用本服務之風險，且本服務為「依原樣」、「依可提供性」及「不保證無瑕疵」的方式提供。本公司、其主管、董事、員工、代理商以及全部第三方服務供應商不提供任何明示或暗示之法定保證，包括但不限於所有權、適售性、適合某特定用途或非侵權之任何默示保證。本公司、其主管、董事、員工及代理商不為 (I) 本服務的準確性、完整性或內容，(II) 透過超連結、橫幅廣告或其他方式與本服務連結的任何網站之準確性、完整性或內容，及/或 (III) 本服務或任何 (透過超連結、橫幅廣告或其他方式) 與本服務連結之任何網站中建立的服務，提供任何聲明或保證，且 本公司概不為同樣事項負責。 ")]),a("p",[e._v(" 此外，您明確知悉並同意，由本公司、其主管、董事、員工或代理商 (包括但不限於其電話中心或客戶服務代表) 以及第三方服務提供商所提供或建議之口頭或書面資訊，一概不 (I) 構成法律或財務建議，或是 (II) 形成有關本服務或本服務中建立之服務的任何類型保證，且使用者不應依賴任何此類資訊或建議。 ")]),a("p",[e._v(" 前述聲明與保證的免責聲明得適用於法律允許的最大範圍，並且在本協議或本服務中建立的服務使用終止或到期之後仍然有效。 ")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v(" 在任何情況下，本公司、其主管、董事、員工、代理商及第三方服務提供商，對於您或任何其他個人或實體，因任何直接、間接、偶然、特殊、懲罰性或必然性的損害，一律不負任何責任，包括任何以下原因導致的損害：(I) 本服務的準確性、完整性或內容，(II) 透過超連結、橫幅廣告或其他方式與本服務連結的任何網站之準確性、完整性或內容，(III) 本服務或任何 (透過超連結、橫幅廣告或其他方式) 與本服務連結之任何網站中建立的服務，(IV) 任何性質的人身傷害或財產損失，(V) 第三方任何性質的行為，(VI) 對於本公司之服務及儲存在當中的全部內容、個人資訊、財務資訊或其他資訊與資料，任何未經授權之存取或使用，(VII) 對於為本服務或 (透過超連結、橫幅廣告或其他方式) 與本服務連結之任何網站所提供或其提供的服務，所進行的任何干擾或中斷行為，(VIII) 可能傳送往返本服務或 (透過超連結、橫幅廣告或其他方式) 與本服務連結之任何網站的任何病毒、蠕蟲、漏洞、木馬或類似威脅，(IX) 對於未成年或受保護族群構成誹謗、騷擾、辱罵、傷害，或是色情、「限制級」、猥褻或其他令人反感的任何使用者內容或內容，及 (X) 由您使用本服務或本服務中建立之服務所導致的任何類型損失或損害，不論是基於保證、合約、侵權，或任何其他法律或衡平理論，亦不論本公司是否有被告知可能發生此等損害。 ")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v(" 本公司不聲明或保證本服務或本服務中建立的服務所提供之內容皆適合每個國家、地區或司法管轄區 (在這些地方可能為違法或禁止)。選擇存取本服務或本服務中建立之服務的使用者必須負責遵守當地法律、規則與法規。 ")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v(' Ambit Microsystems (Shanghai) Ltd. (hereinafter referred to as the "Company") provides AR remote collaboration applications (hereinafter referred to as the "Service") and is responsible for the management and operation of this service. This service is provided to users completely free of charge, and only needs to go through the online registration procedure to use it. And some of the value-added services must be paid to the company before they can be used. Through this service, you can register as a user, communicate with other users by voice or video through a web browser, iOS/Android mobile phone or smart glasses, and annotate images during the call. You can search for other users with their full account names in this service, add them to your contact list, and send call invitations. ')])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v(" All users who use this service are deemed to agree to the following terms and conditions. If you do not accept the terms and conditions, please terminate the use immediately. ")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v(" In accordance with the terms and conditions of this agreement and other company policies and procedures, the company will use commercially reasonable efforts to maintain this service twenty-four (24) hours a day, seven (7) days a week. You understand and agree that the service will occasionally become unavailable or inoperable for any reason, including but not limited to equipment failure, regular maintenance, repair or replacement, reasons beyond the reasonable control of the company or reasons that cannot be reasonably foreseen, including But it is not limited to the interruption or failure of telecommunications or digital transmission links, malicious network attacks, network congestion or other causes of failure. You understand and agree that the company cannot guarantee that the services and services can operate completely uninterrupted, and the company is not responsible for you or any other party for such situations. ")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v(" Where appropriate, the company uses available technologies to protect the security of communications through the website. However, the company does not assume any responsibility for the security, authenticity, integrity or confidentiality of any transactions and other communications conducted through this service. Internet communications may be interfered or intercepted by third parties. Despite our best efforts, our company does not guarantee that this service will not be infected by computer malicious viruses or other unauthorized software. You should take appropriate steps to protect the security of your data, software and equipment. This includes clearing Internet browser cookies and cache before and after using any services on the website. You should keep your password secret. ")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v(" This website contains hyperlinks, some of which point to websites not maintained by our company. The company is not responsible for the content of these websites, nor is it responsible for any damage or loss caused by visiting these websites. The use of hyperlinks and access to such sites are at your own risk. ")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v(" The company reserves the right to disable any unauthorized links or frameworks, and is not responsible for the content available on any other websites reached by the service or any content links. ")]),a("p",[e._v(" The company reserves the right to change the website URL. ")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v(" The materials on the website, including source code, pages, files and graphics, voices and videos, are protected by law. The intellectual property rights in the materials are copyrighted or licensed by our company. Except for the purposes permitted by law, no part of this service may be copied or reused for any commercial purpose without the prior permission of the company. ")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v(' You clearly understand and agree to bear the risk of using this service yourself, and this service is provided in a manner "as is", "availability" and "non-defective". The company, its officers, directors, employees, agents and all third-party service providers do not provide any express or implied statutory guarantees, including but not limited to ownership, marketability, suitability for a specific purpose or non- Any implied warranty of infringement. The company, its officers, directors, employees, and agents are not responsible for (I) the accuracy, completeness or content of this service, (II) links to this service through hyperlinks, banner advertisements or other means The accuracy, completeness or content of any website, and/or (III) the service or any service established in any website linked to the service (through hyperlinks, banner advertisements or other means), provide any statement or guarantee, and the company is not responsible for the same matters. ')]),a("p",[e._v(" In addition, you clearly know and agree that the company, its supervisors, directors, employees or agents (including but not limited to its call center or customer service representatives) and third-party service providers provide or suggest oral Or written information does not (I) constitute legal or financial advice, or (II) form any type of guarantee regarding this service or the services established in this service, and users should not rely on any such information or advice. ")]),a("p",[e._v(" The foregoing statement and the disclaimer of guarantee shall be applicable to the maximum extent permitted by law, and shall remain effective after the termination or expiration of the use of the service established in this agreement or this service. ")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v(' In any case, the company, its directors, directors, employees, agents and third-party service providers, to you or any other individual or entity, due to any direct, indirect, incidental, special, punitive or necessary damage, We will not be liable for any damage caused by any of the following reasons: (I) the accuracy, completeness or content of this service, (II) the accuracy of any website linked to this service through hyperlinks, banner advertisements or other means , Completeness or content, (III) this service or any service established in any website linked to this service (through hyperlinks, banner advertisements or other means), (IV) personal injury or property damage of any nature, (V ) Any behavior of a third party, (VI) any unauthorized access or use of the company’s services and all content, personal information, financial information or other information and data stored in it, (VII) for This service or (through hyperlinks, banner advertisements or other means) and any website linked to this service provide or provide services, any interference or interruption, (VIII) may be transmitted to and from this service or (through super Link, banner advertisement or other means) any virus, worm, loophole, Trojan horse or similar threat on any website linked to this service, (IX) constitutes defamation, harassment, abuse, harm to minors or protected ethnic groups, or Any user content or content that is pornographic, "restricted", obscene or other offensive, and (X) any type of loss or damage caused by your use of this service or services established in this service, whether based on warranty , Contract, tort, or any other law or theory of equity, regardless of whether the company has been notified that such damage may occur. ')])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v(" The company does not represent or guarantee that the content provided by this service or the services established in this service are suitable for each country, region or jurisdiction (which may be illegal or prohibited in these places). Users who choose to access this service or services established in this service must be responsible for complying with local laws, rules and regulations. ")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v(" 国基电子(上海)有限公司（以下简称“本公司”）提供AR远程协作应用程式（以下简称“本服务”）并负责管理并运作此一服务。本服务是完全免费提供给使用者的服务，仅须经过线上注册手续，即可使用。而其中部分加值服务必须向本公司付费才能使用。透过本服务，您可以注册为用户，透过网页浏览器、iOS/Android手机或智能眼镜与其他用户以语音、视频方式沟通，并且在通话时对影像进行标记。您可在本服务中以完整帐号名称搜寻其他使用者，将他们加入您的联系人名单，并发送通话邀请。 ")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v("使用本服务的所有使用者视为同意以下条款约束。若您不接受条款内容，请立即终止使用，")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v(" 根据本协议的条款与条件及本公司的其他政策与程序，本公司将尽商业上的合理努力使本服务维持每天二十四 (24) 小时、每周七 (7) 天的运作。您知悉并同意，本服务偶尔会基于任何理由无法供存取或无法运作，这些原因包括但不限于设备故障、定期维护、修复或更换、超出本公司合理控制能力或无法合理预见的原因，包括但不限于电讯或数位传输连结中断或故障、恶意网络攻击、网络拥塞或其他造成故障的原因。您知悉并同意，本公司无法保证本服务与服务能够完全不间断运作，而且对于此等情况本公司对您或任何其他方概不负责。 ")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v(" 在适当的情况下，本公司使用可用的技术来保护通过网站进行的通信的安全性。但是，对于通过本服务进行的任何交易和其他通讯的安全性，真实性，完整性或机密性，本公司不承担任何责任。网际网络通信可能会受到第三方的干扰或拦截。尽管本公司已尽最大努力，但本公司不保证本服务不受电脑恶意病毒或其他未经授权的软体感染。您应该采取适当的步骤来保护您的资料，软体和设备的安全。这包括在使用网站上的任何服务之前和之后清除Internet浏览器cookie和快取。您应该对密码保密。 ")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v(" 该网站包含超连结，部分连结指向非本公司维护的网站。本公司对这些网站的内容概不负责，也不对由于访问这些网站而造成的任何损害或损失负责。使用超连结和访问此类网站的风险由您自行完全承担。 ")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v(" 本公司保留禁用任何未经授权的连结或框架的权利，并对本服务或任何内容的连结所到达之任何其他网站上的可用内容不承担任何责任。 ")]),a("p",[e._v(" 本公司保留更改网站URL的权利。 ")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v(" 网站上的材料，包括原始码，页面，文件和图形，语音和影片，均受法律保护。材料中的知识产权归本公司版权所有或许可。除出于法律允许的目的外，未经本公司事先许可，不得将本服务的任何部分复制或重新用于任何商业目的。 ")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v(" 您明确知悉并同意自行承担使用本服务之风险，且本服务为「依原样」、「依可提供性」及「不保证无瑕疵」的方式提供。本公司、其主管、董事、员工、代理商以及全部第三方服务供应商不提供任何明示或暗示之法定保证，包括但不限于所有权、适售性、适合某特定用途或非侵权之任何默示保证。本公司、其主管、董事、员工及代理商不为 (I) 本服务的准确性、完整性或内容，(II) 透过超连结、横幅广告或其他方式与本服务连结的任何网站之准确性、完整性或内容，及/或 (III) 本服务或任何 (透过超连结、横幅广告或其他方式) 与本服务连结之任何网站中建立的服务，提供任何声明或保证，且 本公司概不为同样事项负责。 ")]),a("p",[e._v(" 此外，您明确知悉并同意，由本公司、其主管、董事、员工或代理商 (包括但不限于其电话中心或客户服务代表) 以及第三方服务提供商所提供或建议之口头或书面信息，一概不 (I) 构成法律或财务建议，或是 (II) 形成有关本服务或本服务中建立之服务的任何类型保证，且使用者不应依赖任何此类信息或建议。 ")]),a("p",[e._v(" 前述声明与保证的免责声明得适用于法律允许的最大范围，并且在本协议或本服务中建立的服务使用终止或到期之后仍然有效。 ")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v(" 在任何情况下，本公司、其主管、董事、员工、代理商及第三方服务提供商，对于您或任何其他个人或实体，因任何直接、间接、偶然、特殊、惩罚性或必然性的损害，一律不负任何责任，包括任何以下原因导致的损害：(I) 本服务的准确性、完整性或内容，(II) 透过超连结、横幅广告或其他方式与本服务连结的任何网站之准确性、完整性或内容，(III) 本服务或任何 (透过超连结、横幅广告或其他方式) 与本服务连结之任何网站中建立的服务，(IV) 任何性质的人身伤害或财产损失，(V) 第三方任何性质的行为，(VI) 对于本公司之服务及保存在当中的全部内容、个人信息、财务信息或其他信息与资料，任何未经授权之存取或使用，(VII) 对于为本服务或 (透过超连结、横幅广告或其他方式) 与本服务连结之任何网站所提供或其提供的服务，所进行的任何干扰或中断行为，(VIII) 可能传送往返本服务或 (透过超连结、横幅广告或其他方式) 与本服务连结之任何网站的任何病毒、蠕虫、漏洞、木马或类似威胁，(IX) 对于未成年或受保护族群构成诽谤、骚扰、辱骂、伤害，或是色情、「限制级」、猥亵或其他令人反感的任何使用者内容或内容，及 (X) 由您使用本服务或本服务中建立之服务所导致的任何类型损失或损害，不论是基于保证、合约、侵权，或任何其他法律或衡平理论，亦不论本公司是否有被告知可能发生此等损害。 ")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content my-2"},[a("p",[e._v(" 本公司不声明或保证本服务或本服务中建立的服务所提供之内容皆适合每个国家、地区或司法管辖区 (在这些地方可能为违法或禁止)。选择存取本服务或本服务中建立之服务的使用者必须负责遵守当地法律、规则与法规。 ")])])}],r=a("235f"),n=a("5fb0"),s={name:"serviceTerms",data:function(){return{lang:0}},components:{RAHeader:r["a"]},mounted:function(){this.lang=parseInt(this.$cookies.get("language"))||n["a"].Lang.CHINESE}},c=s,l=(a("07f1"),a("2877")),d=Object(l["a"])(c,o,i,!1,null,null,null);t["default"]=d.exports},bc64:function(e,t,a){var o=a("dfa6");o.__esModule&&(o=o.default),"string"===typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);var i=a("499e").default;i("add016c6",o,!0,{sourceMap:!1,shadowMode:!1})},dfa6:function(e,t,a){var o=a("24fb"),i=a("1de5"),r=a("191c");t=o(!1);var n=i(r);t.push([e.i,".blue{color:#2173c9}.blueHover{color:#185597}.darkBlue{color:#0a519c}.grey{color:#7b7b7b}.greyHover{color:#606060}.lightgrey{color:#d7d7d7}.green{color:#3fb182}.greenHover{color:#37926c}.red{color:#d44e4e}.redHover{color:#b44b4b}.placeholder{color:#aeaeae}.placeholderHover{color:#7b7b7b}.white{color:#fff}.custom-pagination{width:calc(100% - 60px)}.custom-pagination /deep/ .pagination{float:right}.custom-pagination /deep/ .VuePagination__pagination-item-next-chunk .page-link,.custom-pagination /deep/ .VuePagination__pagination-item-prev-chunk .page-link{padding:7px}.custom-pagination /deep/ .page-link{width:38px;height:38px;border-radius:19px;margin:0 2px;text-align:center;color:#2173c9;cursor:pointer}.custom-pagination /deep/ .page-link.active{color:#fff;background-color:#2173c9;border-color:#2173c9}@font-face{font-family:Noto Sans TC;font-weight:lighter;font-style:lighter;src:url("+n+")}body{overflow-y:scroll;-ms-overflow-style:none;scrollbar-width:none}body::-webkit-scrollbar{display:none}#app{font-family:Noto Sans TC,Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#2c3e50}.ra-main-content{padding-bottom:90px}.ra-confirm-btn{width:300px!important;height:50px!important;font-size:14px!important;border:1px solid #2173c9!important;background-color:#2173c9!important}.ra-confirm-btn:hover{background-color:#185597!important;border:1px solid #185597!important}.ra-confirm-btn-alt{width:300px!important;height:50px!important;font-size:14px!important}.ra-confirm-btn-alt,.ra-confirm-btn-alt:hover{color:#2173c9!important;border:1px solid #2173c9!important;background-color:#fff!important}.ra-form-group{width:300px!important;color:#7b7b7b}.ra-form-group label{font-weight:700}.ra-form-group .form-control{font-size:14px!important;height:50px!important;background-color:#f0f0f0;border:1px solid #f0f0f0}.ra-form-group .form-control::placeholder{color:#aeaeae}.ra-form-group .form-control.is-invalid{border-color:#dc3545}.ra-title{font-size:24px;font-weight:700}.ra-sub-title{width:300px;font-size:18px;color:#aeaeae;letter-spacing:1px}.slide-fade-enter,.slide-fade-leave-to{opacity:0!important}.slide-fade-enter-active,.slide-fade-leave-to-active{transition:all .2s ease!important}.fade-enter,.fade-leave-to{opacity:0!important}.fade-enter-active,.fade-leave-active{transition:all .5s ease!important}.left-fade-enter,.left-fade-leave-to{opacity:0!important}.left-fade-enter-active,.left-fade-leave-active{transition:all .5s ease!important}.top-fade-enter,.top-fade-leave-to{opacity:0!important}.top-fade-enter-active,.top-fade-leave-active{transition:all .5s ease!important}.alert-msg{color:#d44e4e}.timer{color:#aeaeae}.modal-content{border-radius:1.5rem}.modal-content .modal-header{padding:40px 60px 0 60px;border-bottom:none}.modal-content .modal-header .modal-title{font-weight:700}.modal-content .modal-body .check{color:#82c168}.modal-content .modal-body .title{font-weight:700}.modal-content .modal-body .sub-title{color:#7b7b7b;width:unset}.modal-content .modal-body form .form-group,.modal-content .modal-body form .form-group .confirm-btn{width:380px!important}.modal-content .modal-footer{border-top:none}.modal-content .modal-footer button{margin:0 30px 60px 30px;width:414px;color:#fff;background-color:#2173c9;border-color:#2173c9}.modal-content .modal-footer button:hover{background-color:#185597;border-color:#185597}@media (max-width:576px){.modal-content .modal-footer button{margin:0 0 60px 0;width:100%}}.modal-content button.close:hover{color:#d44e4e}.b-overlay{color:#2e83df}.b-overlay,.b-overlay .position-absolute{position:fixed!important}.ra-main-content{padding-top:90px;padding-bottom:290px}.ra-main-content p{margin-bottom:0;line-height:25px}.ra-main-content .title{width:unset;color:#2173c9}.ra-main-content .ra-sub-title{width:unset;font-size:20px;font-weight:700;color:#2c3e50}.ra-main-content .content{font-size:14px}",""]),e.exports=t}}]);
//# sourceMappingURL=chunk-ff45ff1e.a0ee67bb.js.map