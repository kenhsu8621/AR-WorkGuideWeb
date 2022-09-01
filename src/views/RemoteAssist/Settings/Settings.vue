<template>
  <div class="settings text-center">
    <RAHeader :title="$t('SETTINGS.SETTINGS.TITLE')" />
    <div class="ra-main-content">
      <div class="container mx-auto">
        <div class="mt-5 mb-3 text-left">
          <div class="ra-title b-2">
            <b>{{ $t("SETTINGS.SETTINGS.MY_ACCOUNT") }}</b>
          </div>
        </div>

        <div class="row text-left my-4">
          <div class="col-3 pl-4">
            <b>{{ $t("FORM.ACCOUNT") }}</b>
          </div>
          <div class="col-7">{{ userinfo.account }}</div>
          <div class="col-2 pr-4"></div>
        </div>

        <div class="row text-left my-4">
          <div class="col-3 pl-4">
            <b>{{ $t("FORM.USERNAME") }}</b>
          </div>
          <div v-if="!isEditing" class="col-7">{{ userinfo.username }}</div>
          <div v-if="!isEditing" class="col-2 pr-4">
            <font-awesome-icon icon="edit" @click="editUserName" />
          </div>
          <div v-if="isEditing" class="col-9 row">
            <div class="col-8">
              <input
                type="text"
                :placeholder="[[userinfo.username]]"
                value="123"
                v-model="newUserName"
                class="form-control"
              />
            </div>
            <div class="col p-0 text-right">
              <b-button class="btn btn-edit" @click="updateUserName('update')">{{ $t("GENERAL.UPDATE") }}</b-button>
            </div>
            <div class="col p-0 text-right">
              <b-button class="btn btn-cancel" @click="cancelEditUserName">{{ $t("GENERAL.CANCEL") }}</b-button>
            </div>
          </div>
        </div>

        <div class="row text-left my-4">
          <div class="col-3 pl-4">
            <b>{{ $t("FORM.EMAIL") }}</b>
          </div>
          <div class="col-7">{{ userinfo.email }}</div>
          <div class="col-2 pr-4">
            <router-link :to="{ name: 'RAChangeEmail' }">
              <font-awesome-icon icon="edit" />
            </router-link>
          </div>
        </div>

        <div class="row text-left my-4">
          <div class="col-3 pl-4">
            <b>{{ $t("FORM.PW") }}</b>
          </div>
          <div class="col-7">{{ userinfo.password }}</div>
          <div class="col-2 pr-4">
            <router-link :to="{ name: 'RAChangePassword' }">
              <font-awesome-icon icon="edit" />
            </router-link>
          </div>
        </div>

        <div class="row text-left my-4">
          <div class="col-3 pl-4">
            <b>{{ $t("SETTINGS.SETTINGS.QRCODE") }}</b>
          </div>
          <div class="col-7"></div>
          <div class="col-2 pr-4 link">
            <font-awesome-icon icon="angle-right" />
            <router-link :to="{ name: 'RAQRCode' }">
              <div class="hidden-div"></div>
            </router-link>
          </div>
        </div>
      </div>
      <!-- 量測距離單位功能未開發 -->
      <!-- <div class="container mx-auto">
        <div class="mt-5 mb-3 text-left">
          <div class="ra-title b-2">
            <b>{{ $t("SETTINGS.SETTINGS.MEASUREMENT_UNIT") }}</b>
          </div>
        </div>
        <div class="row text-left my-4">
          <div class="col-3 pl-4">
            <b>{{ $t("SETTINGS.SETTINGS.PRIMARY_UNIT") }}</b>
          </div>
          <div class="col-9">
            <b-form-select
              v-model="selectedPrimary"
              :options="unitList"
              class="mb-3 unit-select"
              @change="showAlert('primary')"
            ></b-form-select>
          </div>
        </div>
        <div class="row text-left my-4">
          <div class="col-3 pl-4">
            <b>{{ $t("SETTINGS.SETTINGS.SECONDARY_UNIT") }}</b>
          </div>
          <div class="col-9">
            <b-form-select
              v-model="selectedSecondary"
              :options="unitList"
              class="mb-3 unit-select"
              @change="showAlert('secondary')"
            ></b-form-select>
          </div>
        </div>
      </div> -->
      <div class="container mx-auto">
        <div class="mt-5 mb-3 text-left">
          <div class="ra-title b-2">
            <b v-if="this.$store.state.deployType == 1">{{ $t("SETTINGS.SETTINGS.ABOUT_1") }}</b>
            <b v-if="this.$store.state.deployType == 2">{{ $t("SETTINGS.SETTINGS.ABOUT_2") }}</b>
          </div>
        </div>

        <div class="row text-left my-4">
          <div class="col-3 pl-4">
            <b>{{ $t("SETTINGS.SETTINGS.CONTACT_US") }}</b>
          </div>
          <div class="col-7"></div>
          <div class="col-2 pr-4 link">
            <font-awesome-icon icon="angle-right" />
            <router-link :to="{ name: 'RAContactUs' }">
              <div class="hidden-div"></div>
            </router-link>
          </div>
        </div>

        <div class="row text-left my-4">
          <div class="col-3 pl-4">
            <b>{{ $t("SETTINGS.SETTINGS.TERMS") }}</b>
          </div>
          <div class="col-7"></div>
          <div class="col-2 pr-4 link">
            <router-link :to="{ name: 'RAServiceTerms' }" target="_blank"
              ><font-awesome-icon icon="angle-right"
            /></router-link>
          </div>
        </div>

        <div class="row text-left my-4">
          <div class="col-3 pl-4">
            <b>{{ $t("SETTINGS.SETTINGS.POLICY") }}</b>
          </div>
          <div class="col-7"></div>
          <div class="col-2 pr-4 link">
            <router-link :to="{ name: 'RAPrivacyPolicy' }" target="_blank"
              ><font-awesome-icon icon="angle-right"
            /></router-link>
          </div>
        </div>

        <div class="row text-left my-4">
          <div class="col-3 pl-4">
            <b>{{ $t("SETTINGS.SETTINGS.MORE") }}</b>
          </div>
          <div class="col-7"></div>
          <div class="col-2 pr-4 link">
            <a href="https://tw.fiimart.com/web/nextiiot/Toc/Prod/0003/0003-01/FM0005?culture=zh-Hant" target="_blank"
              ><font-awesome-icon icon="angle-right"
            /></a>
          </div>
        </div>
        <div class="row text-left my-4">
          <div class="col-3 pl-4">
            <b>{{ $t("SETTINGS.SETTINGS.WG") }}</b>
          </div>
          <div class="col-7"></div>
          <div class="col-2 pr-4 link">
            <router-link :to="{ name: 'Home' }"><font-awesome-icon icon="angle-right"/></router-link>
          </div>
        </div>

        <div class="row text-left my-4">
          <div class="col-3 pl-4">
            <b>{{ $t("SETTINGS.SETTINGS.VERSION") }}</b>
          </div>
          <div class="col-7">v{{ version }}</div>
          <div class="col-2"></div>
        </div>

        <div class="row text-left my-4">
          <div class="col-3 pl-4">
            <b>{{ $t("SETTINGS.SETTINGS.LANGUAGE") }}</b>
          </div>
          <div class="col-9">
            <b-form-select
              v-model="lang"
              :options="langList"
              class="mb-3 unit-select"
              @change="setLang(lang)"
            ></b-form-select>
          </div>
        </div>
      </div>
      <b-button class="ra-confirm-btn-alt mt-4" v-b-modal.logoutModal>{{ $t("SETTINGS.SETTINGS.LOGOUT") }}</b-button>
      <b-alert
        :show="dismissCountDown"
        variant="dark"
        @dismissed="dismissCountDown = 0"
        @dismiss-count-down="countDownChanged"
        class="mx-auto"
      >
        <p>{{ typeText }}</p>
      </b-alert>
      <b-modal
        id="logoutModal"
        :title="
          this.$store.state.deployType == 1
            ? $t('SETTINGS.SETTINGS.LOGOUT_TITLE_1')
            : $t('SETTINGS.SETTINGS.LOGOUT_TITLE_2')
        "
        size="md"
        hide-footer
        centered
      >
        <div class="ra-form-group my-4 mx-auto text-center">
          <div>{{ $t("SETTINGS.SETTINGS.LOGOUT_DESC") }}</div>
          <b-button
            type="submit"
            class="ra-confirm-btn mt-4 mb-3 mx-auto"
            aria-label="Close"
            data-dismiss="modal"
            @click="$logout()"
            >{{ $t("GENERAL.OK") }}</b-button
          >
        </div>
      </b-modal>
    </div>
    <Footer />
  </div>
</template>

<script>
  import RAHeader from "@/components/RAHeader.vue";
  import Footer from "@/components/Footer.vue";
  import constants from "@/constants";

  export default {
    name: "Settings",
    components: {
      RAHeader,
      Footer,
    },
    data: () => ({
      userinfo: {
        username: "",
        account: "",
        password: "******",
        email: "",
      },
      unitList: [
        { value: "mm", text: "公釐" },
        { value: "cm", text: "公分" },
        { value: "meter", text: "公尺" },
        { value: "inch", text: "英吋" },
        { value: "foot", text: "英呎" },
        { value: "yard", text: "英碼" },
      ],

      // TODO: 改成優先從瀏覽器語系去判斷 (window.navigator.language)
      langList: [
        { value: constants.Lang.CHINESE, text: "繁體中文" },
        { value: constants.Lang.ENGLISH, text: "English" },
        { value: constants.Lang.SIMPLIFIED_CHINESE, text: "简体中文" },
      ],
      dismissSecs: 3,
      dismissCountDown: 0,
      typeText: "",
      isEditing: false,
      newUserName: "",
      selectedPrimary: "cm",
      selectedSecondary: "foot",
      lang: constants.Lang.CHINESE,
      version: "",
      companyName: "",
    }),
    created: function() {
      this.$store.state.contact = false;
      this.$store.state.callHistory = false;
      this.$store.state.settings = true;
    },
    mounted() {
      this.lang = parseInt(this.$cookies.get("language")) || constants.Lang.CHINESE;
      this.getUserInfo();
      this.getVersion();
      this.initLang();
    },
    methods: {
      editUserName() {
        this.newUserName = this.userinfo.username;
        this.isEditing = true;
      },
      cancelEditUserName() {
        this.isEditing = false;
      },
      countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown;
      },
      showAlert(type) {
        if (type == "primary") {
          this.typeText = this.$t("SETTINGS.SETTINGS.PRIMARY_UNIT_ALERT");
        } else if (type == "secondary") {
          this.typeText = this.$t("SETTINGS.SETTINGS.SECONDARY_UNIT_ALERT");
        } else if (type == "update") {
          this.typeText = this.$t("SETTINGS.SETTINGS.USERNAME_ALERT");
        } else this.typeText = type;
        this.dismissCountDown = this.dismissSecs;
      },
      getUserInfo() {
        this.apiGet("user/info").then(({ data }) => {
          this.userinfo.username = data.userinfo.name;
          this.userinfo.account = data.userinfo.account;
          this.userinfo.email = data.userinfo.email;
        });
      },
      updateUserName(type) {
        let data = { name: this.newUserName };
        this.apiPost("user/update_name", data)
          .then(() => {
            this.getUserInfo();
            this.isEditing = false;
            this.showAlert(type);
          })
          .catch(({ message }) => {
            this.showAlert(message);
          });
      },
      getVersion() {
        // let pjson = require("../../../../package.json");
        // this.version = pjson.version;
        this.apiGet("info").then(({ data }) => {
          this.version = data.version;
          this.companyName = data.company_name;
        });
      },
      setActiveLanguage(lang) {
        this.$cookies.set("language", lang);
      },
      setLang(lang) {
        this.setActiveLanguage(lang);
        return history.go(0);
      },
      initLang() {
        if (this.lang == constants.Lang.ENGLISH) {
          //更改量測距離單位
          for (let i = 0; i < this.unitList.length; i++) {
            this.unitList[i].text = this.unitList[i].value;
          }
        }
      },
    },
  };
</script>

<style lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .settings {
    .ra-main-content {
      .container {
        width: 33vw;
        @media (max-width: 1440px) {
          width: 50vw;
        }
        @media (max-width: 992px) {
          width: 90vw;
        }
        .title {
          width: 100%;
          border-bottom: 1px solid $placeholder;
        }
        .row {
          color: $grey;
          .col-7 {
            color: $placeholder;
          }
          .col-2 > a,
          svg {
            float: right;
            color: $grey;
            cursor: pointer;
            &:hover {
              color: $greyHover;
            }
          }
          .col-9 {
            .form-control {
              font-size: 14px;
              background-color: #f0f0f0;
              border: 1px solid #f0f0f0;
            }
            .col {
              .btn-edit {
                color: $blue;
                background-color: #fff;
                border: 1px solid $blue;
              }
              .btn-cancel {
                color: $placeholder;
                background-color: #fff;
                border: 1px solid $placeholder;
              }
            }
            .unit-select {
              width: 250px;
              background-color: #f0f0f0;
              border: 1px solid #f0f0f0;
              //更改select icon樣式
              background-image: linear-gradient(45deg, transparent 50%, $grey 60%),
                linear-gradient(135deg, $grey 40%, transparent 50%) !important;
              background-position: calc(100% - 17px) 14px, calc(100% - 10px) 14px, 100% 0;
              background-size: 7px 7px, 7px 7px;
              background-repeat: no-repeat;
              -webkit-appearance: none;
              -moz-appearance: none;
              cursor: pointer;
              option {
                background-color: #fff;
                border: 1px solid #fff;
              }
            }
          }
          .link {
            padding-top: 5px;
            padding-right: 30px !important;
            .hidden-div {
              background-color: transparent;
              width: 30px;
              height: 30px;
              position: absolute;
              top: -5px;
              right: 20px;
            }
          }
        }
      }
      .ra-confirm-btn-alt {
        width: 30vw !important;
        @media (max-width: 1440px) {
          width: 40vw !important;
        }
      }
    }
    .alert {
      width: 440px;
      height: 50px;
      margin-top: 50px;
      border-radius: 25px;
      color: #fff;
      background-color: #4c4c4c;
    }
    .close {
      &:hover {
        color: #fff;
      }
    }
  }
</style>
