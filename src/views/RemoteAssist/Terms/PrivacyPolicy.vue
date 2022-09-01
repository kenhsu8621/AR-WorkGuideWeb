<template>
  <div class="privacyPolicy text-center">
    <RAHeader :title="this.$store.state.deployType == 1 ? $t('TERMS.TITLE_1') : $t('TERMS.TITLE_2')" />

    <div class="ra-main-content mx-auto text-left">
      <div class="row pb-5">
        <div class="col-md-3 col-1"></div>
        <div class="col-md-6 col-10" v-if="lang == 0">
          <div class="ra-title y-4">隱私權政策</div>
          <div class="content my-2">
            <p>生效日期：2021年2月1日</p>
            <p v-if="this.$store.state.deployType == 1">
              國基電子(上海)有限公司（以下簡稱“本公司”）營運AR遠程協作應用程式（以下簡稱“本服務”）。
            </p>
            <p v-if="this.$store.state.deployType == 2">
              國基電子(上海)有限公司（以下簡稱“本公司”）營運AR遠程協同應用程式（以下簡稱“本服務”）。
            </p>
            <p>本頁告知您在使用本公司服務時，有關收集、使用和披露個人資料的政策以及與該資料相關的選擇。</p>
            <p v-if="this.$store.state.deployType == 1">
              我們使用您的資料來提供和改善服務。使用AR遠程協作即表示您同意按照本政策收集和使用資料。除非本隱私政策中另有定義，否則本隱私政策中使用的術語與本公司的條款和條件具有相同的含義。
            </p>
            <p v-if="this.$store.state.deployType == 2">
              我們使用您的資料來提供和改善服務。使用AR遠程協同即表示您同意按照本政策收集和使用資料。除非本隱私政策中另有定義，否則本隱私政策中使用的術語與本公司的條款和條件具有相同的含義。
            </p>
          </div>
          <div class="ra-sub-title mt-4 mb-2">1. 資料蒐集</div>
          <div class="content my-2">
            <p>我們出於各種目的蒐集幾種不同類型的資料，以向您提供和改善本服務。</p>
            <p>搜集的資料類型</p>
            <p>(1)個人資料</p>
            <p>
              在使用本服務時，我們可能會要求您向我們提供某些可用於聯繫或識別您的個人身份資料（“個人資料”）。個人身份資料可能包括但不限於：
            </p>
            <p>- 電子郵件地址</p>
            <p>- 名和姓</p>
            <p>- Cookie和使用情況資料</p>
            <p>- 裝置型號和作業系統版本</p>
            <p>- IP地址</p>
            <p>(2)使用資料</p>
            <p>
              當您通過行動裝置訪問本服務時，我們可能會自動收集某些資料，包括但不限於您使用的行動裝置的類型，行動裝置的唯一ID，行動裝置的IP地址，操作系統，您使用的移動Internet瀏覽器的類型，唯一的裝置識別符號和其他診斷資料（“使用資料”）。
            </p>
            <p>(3)Cookie數據追蹤</p>
            <p>我們使用Cookie和類似的技術來追蹤我們服務上的活動並保存某些資料。</p>
            <p>Cookies從網站發送到您的瀏覽器並存儲在您的設備上，以收集和跟踪資料以及改善和分析本公司的服務。</p>
            <p>
              您可以指示瀏覽器拒絕所有cookie或指示何時發送cookie。但是，如果您不接受Cookie，則可能無法使用我們某些部分的服務。
            </p>
          </div>
          <div class="ra-sub-title mt-4 mb-2">2. 資料使用</div>
          <div class="content my-2">
            <p>我們將收集的數據用於各種目的：</p>
            <p>- 提供和維護服務</p>
            <p>- 通知您有關我們服務的更改</p>
            <p>- 為了使您能夠在選擇參與我們服務的互動功能時參與其中</p>
            <p>- 提供客戶服務和支持</p>
            <p>- 提供分析或有價值的資料，以便我們改善服務</p>
            <p>- 監視服務的使用情況</p>
            <p>- 檢測，預防和解決技術問題</p>
          </div>
          <div class="ra-sub-title mt-4 mb-2">3. 資料傳輸</div>
          <div class="content my-2">
            <p>
              您的資料（包括個人資料）可能會轉移到您所在的州，省，國家或其他政府轄區之外的伺服器上，並在這些伺服器上進行維護，在這些伺服器上，資料保護法可能不同於您所在轄區。
            </p>
            <p>
              本公司將採取合理必要的所有步驟，以確保按照本隱私政策安全地處理您的資料，除非有適當的控制措施，包括您的個人資料，否則不會將您的個人資料轉移到組織或國家。您的資料和其他個人資料的安全性。
            </p>
          </div>
          <div class="ra-sub-title mt-4 mb-2">4. 資料披露</div>
          <div class="content my-2">
            <p>法律要求</p>
            <p>您的個人資料可能出於以下目的而披露：</p>
            <p>- 遵守法律義務</p>
            <p>- 保護和捍衛本公司的權利或財產</p>
            <p>- 防止或調查與服務有關的可能的不當行為</p>
            <p>- 為了保護服務使用者或公眾的人身安全</p>
            <p>- 防止法律責任</p>
          </div>
          <div class="ra-sub-title mt-4 mb-2">5. 資訊安全</div>
          <div class="content my-2">
            <p>
              資訊的安全性對我們很重要，但請記住，網際網路上的傳輸方法或電子存儲方法都不是100％安全的。儘管我們努力使用商業上可接受的方式來保護您的個人資料，但我們不能保證其絕對安全。
            </p>
          </div>
          <div class="ra-sub-title mt-4 mb-2">6. 服務供應商</div>
          <div class="content my-2">
            <p>
              本公司可能會僱用第三方公司和個人來促進本服務（“服務提供者”），代表本公司提供服務，執行與服務相關的服務或協助本公司分析服務的使用方式。
            </p>
            <p>這些第三方僅能代表本公司執行這些任務而訪問您的個人資料，並且有義務不將其披露或用於任何其他目的。</p>
          </div>
          <div class="ra-sub-title mt-4 mb-2">7. 連結到其他網站</div>
          <div class="content my-2">
            <p>
              本服務可能包含指向其他非我們運營網站的鏈接。如果單擊第三方鏈接，您將被定向到該第三方的網站。我們強烈建議您查看您訪問的每個網站的隱私政策。
            </p>
            <p>本公司對任何第三方網站或服務的內容，隱私政策或做法概不負責，也不承擔任何責任。</p>
          </div>
          <div class="ra-sub-title mt-4 mb-2">8. 本隱私政策的變更</div>
          <div class="content my-2">
            <p>本公司可能會不時更新隱私政策。我們將通過在此頁面上發布新的隱私政策來通知您任何更改。</p>
            <p v-if="this.$store.state.deployType == 1">
              在更改生效之前，我們將通過電子郵件和/或AR遠程協作的推播通知告知您，並在本隱私政策的頂部更新“生效日期”。
            </p>
            <p v-if="this.$store.state.deployType == 2">
              在更改生效之前，我們將通過電子郵件和/或AR遠程協同的推播通知告知您，並在本隱私政策的頂部更新“生效日期”。
            </p>
            <p>建議您定期閱讀本隱私政策以進行任何更改。在本頁面上發布對本隱私政策的更改後，這些更改才生效。</p>
          </div>
          <div class="ra-sub-title mt-4 mb-2">9. 聯繫我們</div>
          <div class="content my-2">
            <p>如果您對本公司的隱私政策有任何疑問，請透過此連結與我們聯繫</p>
            <a href="https://ar-remoteassist.fiimart.com/web/nextiiot/Consult/Index" target="_blank"
              >https://ar-remoteassist.fiimart.com/web/nextiiot/Consult/Index</a
            >
          </div>
        </div>
        <div class="col-md-6 col-10" v-if="lang == 1">
          <div class="ra-title y-4">Privacy Policy</div>
          <div class="content my-2">
            <p>Effective date: February 1, 2021</p>
            <p>
              Ambit Microsystems (Shanghai) Ltd. (hereinafter referred to as the "Company") operates an AR remote
              collaboration application (hereinafter referred to as the "Service").
            </p>
            <p>
              This page informs you about the policies regarding the collection, use and disclosure of personal
              information and the choices related to that information when using the company's services.
            </p>
            <p>
              We use your information to provide and improve services. By using AR remote collaboration, you agree to
              the collection and use of data in accordance with this policy. Unless otherwise defined in this privacy
              policy, the terms used in this privacy policy have the same meaning as the company's terms and conditions.
            </p>
          </div>
          <div class="ra-sub-title mt-4 mb-2">1. Data Collection</div>
          <div class="content my-2">
            <p>
              We collect several different types of information for various purposes to provide you with and improve
              this service.
            </p>
            <p>Types of data collected</p>
            <p>(1) Personal information</p>
            <p>
              When using this service, we may ask you to provide us with certain personally identifiable information
              ("personal information") that can be used to contact or identify you. Personally identifiable information
              may include but is not limited to:
            </p>
            <p>- Email address</p>
            <p>- First name and last name</p>
            <p>- Cookies and usage data</p>
            <p>- Device model and operating system version</p>
            <p>- IP address</p>
            <p>(2) Data usage</p>
            <p>
              When you access this service through a mobile device, we may automatically collect certain information,
              including but not limited to the type of mobile device you use, the unique ID of the mobile device, the IP
              address of the mobile device, the operating system, and the mobile you use The type of Internet browser,
              unique device identification symbols and other diagnostic information ("Usage Information").
            </p>
            <p>(3) Cookie data tracking</p>
            <p>我們使用Cookie和類似的技術來追蹤我們服務上的活動並保存某些資料。</p>
            <p>Cookies從網站發送到您的瀏覽器並存儲在您的設備上，以收集和跟踪資料以及改善和分析本公司的服務。</p>
            <p>
              您可以指示瀏覽器拒絕所有cookie或指示何時發送cookie。但是，如果您不接受Cookie，則可能無法使用我們某些部分的服務。
            </p>
          </div>
          <div class="ra-sub-title mt-4 mb-2">2. Data Usage</div>
          <div class="content my-2">
            <p>We use the collected data for various purposes:</p>
            <p>- Provide and maintain services.</p>
            <p>- Notify you about changes to our services.</p>
            <p>- To enable you to participate when using the interactive features of our services.</p>
            <p>- Provide customer service and support.</p>
            <p>- Provide analysis or valuable information so that we can improve our services.</p>
            <p>- Monitor service usage</p>
            <p>- Detect, prevent and solve technical problems.</p>
          </div>
          <div class="ra-sub-title mt-4 mb-2">3. Data Transmission</div>
          <div class="content my-2">
            <p>
              Your data (including personal data) may be transferred to and maintained on servers outside of your state,
              province, country or other government jurisdiction. On these servers, data protection laws may Different
              from your jurisdiction.
            </p>
            <p>
              The company will take all steps reasonably necessary to ensure that your data is processed safely in
              accordance with this privacy policy. Unless there are appropriate control measures, including your
              personal data, it will not transfer your personal data to an organization or country. The security of your
              data and other personal data.
            </p>
          </div>
          <div class="ra-sub-title mt-4 mb-2">4. Information Disclosure</div>
          <div class="content my-2">
            <p>Legal requirements</p>
            <p>Your personal data may be disclosed for the following purposes:</p>
            <p>- ○ Comply with legal obligations.</p>
            <p>- ○ Protect and defend the rights or property of Ambit Microsystems (Shanghai) Ltd.</p>
            <p>- ○ Prevent or investigate possible misconduct related to the service.</p>
            <p>- ○ To protect the personal safety of service users or the public.</p>
            <p>- ○ Prevent legal liability.</p>
          </div>
          <div class="ra-sub-title mt-4 mb-2">5. Data Security</div>
          <div class="content my-2">
            <p>
              The security of information is very important to us, but please remember that neither the transmission
              method nor the electronic storage method on the Internet is 100% secure. Although we strive to use
              commercially acceptable methods to protect your personal data, we cannot guarantee its absolute security.
            </p>
          </div>
          <div class="ra-sub-title mt-4 mb-2">6. Service Providers</div>
          <div class="content my-2">
            <p>
              The company may hire third-party companies and individuals to promote this service ("service provider"),
              provide services on behalf of the company, perform service-related services, or assist the company in
              analyzing how the service is used.
            </p>
            <p>
              These third parties can only access your personal data by performing these tasks on behalf of the company,
              and they are obliged not to disclose or use it for any other purpose.
            </p>
          </div>
          <div class="ra-sub-title mt-4 mb-2">7. Link to other websites</div>
          <div class="content my-2">
            <p>
              This service may contain links to other websites not operated by us. If you click on a third party link,
              you will be directed to that third party's website. We strongly recommend that you review the privacy
              policy of each website you visit.
            </p>
            <p>
              The company is not responsible for the content, privacy policies or practices of any third-party websites
              or services, and does not assume any responsibility.
            </p>
          </div>
          <div class="ra-sub-title mt-4 mb-2">8. Changes to this privacy policy</div>
          <div class="content my-2">
            <p>
              The company may update the privacy policy from time to time. We will notify you of any changes by posting
              a new privacy policy on this page.
            </p>
            <p>
              Before the changes take effect, we will notify you via email and/or push notification of AR remote
              collaboration, and update the "effective date" at the top of this privacy policy.
            </p>
            <p>
              It is recommended that you read this privacy policy regularly to make any changes. Changes to this privacy
              policy will not take effect until they are posted on this page.
            </p>
          </div>
          <div class="ra-sub-title mt-4 mb-2">9. Contact Us</div>
          <div class="content my-2">
            <p>If you have any questions about our privacy policy, please contact us through this link.</p>
            <a href="https://ar-remoteassist.fiimart.com/web/nextiiot/Consult/Index" target="_blank"
              >https://ar-remoteassist.fiimart.com/web/nextiiot/Consult/Index</a
            >
          </div>
        </div>
        <div class="col-md-6 col-10" v-if="lang == 2">
          <div class="ra-title y-4">隐私权政策</div>
          <div class="content my-2">
            <p>生效日期：2021年2月1日</p>
            <p>国基电子(上海)有限公司（以下简称“本公司”）营运AR远程协作应用程式（以下简称“本服务”）。</p>
            <p>本页告知您在使用本公司服务时，有关收集、使用和披露个人资料的政策以及与该资料相关的选择。</p>
            <p>
              我们使用您的资料来提供和改善服务。使用AR远程协作即表示您同意按照本政策收集和使用资料。除非本隐私政策中另有定义，否则本隐私政策中使用的术语与本公司的条款和条件具有相同的含义。
            </p>
          </div>
          <div class="ra-sub-title mt-4 mb-2">1. 资料搜集</div>
          <div class="content my-2">
            <p>我们出于各种目的搜集几种不同类型的资料，以向您提供和改善本服务。</p>
            <p>搜集的资料类型</p>
            <p>(1)个人资料</p>
            <p>
              在使用本服务时，我们可能会要求您向我们提供某些可用于联系或识别您的个人身份资料（“个人资料”）。个人身份资料可能包括但不限于：
            </p>
            <p>- 电子邮件地址</p>
            <p>- 名和姓</p>
            <p>- Cookie和使用情况资料</p>
            <p>- 设备型号和作业系统版本</p>
            <p>- IP地址</p>
            <p>(2)使用资料</p>
            <p>
              当您通过行动设备访问本服务时，我们可能会自动收集某些资料，包括但不限于您使用的行动设备的类型，行动设备的唯一ID，行动设备的IP地址，操作系统，您使用的移动Internet浏览器的类型，唯一的设备识别符号和其他诊断资料（“使用资料”）。
            </p>
            <p>(3)Cookie数据追踪</p>
            <p>我们使用Cookie和类似的技术来追踪我们服务上的活动并保存某些资料。</p>
            <p>Cookies从网站发送到您的浏览器并存储在您的设备上，以收集和跟踪资料以及改善和分析本公司的服务。</p>
            <p>
              您可以指示浏览器拒绝所有cookie或指示何时发送cookie。但是，如果您不接受Cookie，则可能无法使用我们某些部分的服务。
            </p>
          </div>
          <div class="ra-sub-title mt-4 mb-2">2. 资料使用</div>
          <div class="content my-2">
            <p>我们将收集的数据用于各种目的：</p>
            <p>- 提供和维护服务</p>
            <p>- 通知您有关我们服务的更改</p>
            <p>- 为了使您能够在选择参与我们服务的互动功能时参与其中</p>
            <p>- 提供客户服务和支持</p>
            <p>- 提供分析或有价值的资料，以便我们改善服务</p>
            <p>- 监视服务的使用情况</p>
            <p>- 检测，预防和解决技术问题</p>
          </div>
          <div class="ra-sub-title mt-4 mb-2">3. 资料传输</div>
          <div class="content my-2">
            <p>
              您的资料（包括个人资料）可能会转移到您所在的州，省，国家或其他政府辖区之外的伺服器上，并在这些伺服器上进行维护，在这些伺服器上，资料保护法可能不同于您所在辖区。
            </p>
            <p>
              本公司将采取合理必要的所有步骤，以确保按照本隐私政策安全地处理您的资料，除非有适当的控制措施，包括您的个人资料，否则不会将您的个人资料转移到组织或国家。您的资料和其他个人资料的安全性。
            </p>
          </div>
          <div class="ra-sub-title mt-4 mb-2">4. 资料披露</div>
          <div class="content my-2">
            <p>法律要求</p>
            <p>您的个人资料可能出于以下目的而披露：</p>
            <p>- 遵守法律义务</p>
            <p>- 保护和捍卫本公司的权利或财产</p>
            <p>- 防止或调查与服务有关的可能的不当行为</p>
            <p>- 为了保护服务使用者或公众的人身安全</p>
            <p>- 防止法律责任</p>
          </div>
          <div class="ra-sub-title mt-4 mb-2">5. 信息安全</div>
          <div class="content my-2">
            <p>
              信息的安全性对我们很重要，但请记住，网际网络上的传输方法或电子存储方法都不是100％安全的。尽管我们努力使用商业上可接受的方式来保护您的个人资料，但我们不能保证其绝对安全。
            </p>
          </div>
          <div class="ra-sub-title mt-4 mb-2">6. 服务供应商</div>
          <div class="content my-2">
            <p>
              本公司可能会雇用第三方公司和个人来促进本服务（“服务提供者”），代表本公司提供服务，执行与服务相关的服务或协助本公司分析服务的使用方式。
            </p>
            <p>这些第三方仅能代表本公司执行这些任务而访问您的个人资料，并且有义务不将其披露或用于任何其他目的。</p>
          </div>
          <div class="ra-sub-title mt-4 mb-2">7. 连结到其他网站</div>
          <div class="content my-2">
            <p>
              本服务可能包含指向其他非我们运营网站的链接。如果单击第三方链接，您将被定向到该第三方的网站。我们强烈建议您查看您访问的每个网站的隐私政策。
            </p>
            <p>本公司对任何第三方网站或服务的内容，隐私政策或做法概不负责，也不承担任何责任。</p>
          </div>
          <div class="ra-sub-title mt-4 mb-2">8. 本隐私政策的变更</div>
          <div class="content my-2">
            <p>本公司可能会不时更新隐私政策。我们将通过在此页面上发布新的隐私政策来通知您任何更改。</p>
            <p>
              在更改生效之前，我们将通过电子邮件和/或AR远程协作的的推播通知告知您，并在本隐私政策的顶部更新“生效日期”。
            </p>
            <p>建议您定期阅读本隐私政策以进行任何更改。在本页面上发布对本隐私政策的更改后，这些更改才生效。</p>
          </div>
          <div class="ra-sub-title mt-4 mb-2">9. 联系我们</div>
          <div class="content my-2">
            <p>如果您对本公司的隐私政策有任何疑问，请透过此连结与我们联系</p>
            <a href="https://ar-remoteassist.fiimart.com/web/nextiiot/Consult/Index" target="_blank"
              >https://ar-remoteassist.fiimart.com/web/nextiiot/Consult/Index</a
            >
          </div>
        </div>
        <div class="col-md-3 col-1"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import RAHeader from "@/components/RAHeader.vue";
  import constants from "@/constants";

  export default {
    name: "privacyPolicy",
    data: () => ({
      lang: 0,
    }),
    components: {
      RAHeader,
    },
    mounted() {
      this.lang = parseInt(this.$cookies.get("language")) || constants.Lang.CHINESE;
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/main.scss";
  .ra-main-content {
    padding-top: 90px;
    padding-bottom: 290px;
    p {
      margin-bottom: 0;
      line-height: 25px;
    }
    .title {
      width: unset;
      color: $blue;
    }
    .ra-sub-title {
      width: unset;
      font-size: 20px;
      font-weight: bold;
      color: #2c3e50;
    }
    .content {
      font-size: 14px;
    }
  }
</style>
