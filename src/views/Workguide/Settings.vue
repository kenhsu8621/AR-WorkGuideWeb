<template>
  <div class="settings">
    <Header :title="$t('SETTINGS.TITLE')" />
    <div class="main-content">
      <div class="container mx-auto">
        <div class="mt-5 mb-3 text-left">
          <div class="title pb-2">
            <b>{{ $t("SETTINGS.MY_ACCOUNT") }}</b>
          </div>
        </div>

        <div class="row text-left my-3">
          <div class="col-3 pl-4">
            <b>{{ $t("SETTINGS.ACCOUNT") }}</b>
          </div>
          <div class="col-7">{{ userinfo.username }}</div>
          <div class="col-2 pr-4"></div>
        </div>

        <div class="row text-left my-3">
          <div class="col-3 pl-4">
            <b>{{ $t("SETTINGS.ROLE") }}</b>
          </div>
          <div class="col-7">{{ userinfo.isAdmin ? "Admin" : "User" }}</div>
          <div class="col-2 pr-4"></div>
        </div>

        <div class="row text-left my-3">
          <div class="col-3 pl-4">
            <b>{{ $t("SETTINGS.USERNAME") }}</b>
          </div>
          <div v-if="!isEditing" class="col-7">{{ userinfo.username }}</div>
          <!-- <div v-if="!isEditing" class="col-2 pr-4">
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
              <b-button class="btn btn-edit" @click="updateUserName('update')">更新</b-button>
            </div>
            <div class="col p-0 text-right">
              <b-button class="btn btn-cancel" @click="cancelEditUserName">取消</b-button>
            </div>
          </div> -->
        </div>

        <div class="row text-left my-3">
          <div class="col-3 pl-4">
            <b>{{ $t("SETTINGS.EMAIL") }}</b>
          </div>
          <div class="col-7">{{ userinfo.email }}</div>
          <div class="col-2 pr-4">
            <!-- <router-link :to="{name:'RAChangeEmail'}">
              <font-awesome-icon icon="edit" />
            </router-link> -->
          </div>
        </div>

        <div class="row text-left my-3">
          <div class="col-3 pl-4">
            <b>{{ $t("SETTINGS.PASSWORD") }}</b>
          </div>
          <div class="col-7">{{ userinfo.password }}</div>
          <div class="col-2 pr-4">
            <!-- <router-link :to="{name:'RAChangePassword'}">
              <font-awesome-icon icon="edit" />
            </router-link> -->
          </div>
        </div>

        <div class="row text-left my-3">
          <div class="col-3 pl-4">
            <b>{{ $t("SETTINGS.SETTINGS.QRCODE") }}</b>
          </div>
          <div class="col-7"></div>
          <div class="col-2">
            <router-link :to="{ name: 'RAQRCode' }">
              <div class="hidden-div"><font-awesome-icon icon="qrcode" /></div>
            </router-link>
          </div>
        </div>

        <div class="row text-left my-3">
          <div class="col-3 pl-4">
            <b>{{ $t("SETTINGS.ENTERPRISE_NAME") }}</b>
          </div>
          <div class="col-7">{{ userinfo.enterprise }}</div>
          <div class="col-2 pr-4"></div>
        </div>
      </div>

      <div class="container mx-auto">
        <div class="mt-4 mb-3 text-left">
          <div class="title pb-2">
            <b>{{ $t("SETTINGS.ABOUT") }}</b>
          </div>
        </div>

        <div class="row text-left my-3">
          <div class="col-3 pl-4">
            <b>{{ $t("SETTINGS.SETTINGS.CONTACT_US") }}</b>
          </div>
          <div class="col-7"></div>
          <div class="col-2">
            <router-link :to="{ name: 'RAContactUs' }">
              <div class="hidden-div"><font-awesome-icon icon="angle-right" /></div>
            </router-link>
          </div>
        </div>

        <div class="row text-left my-3">
          <div class="col-3 pl-4">
            <b>{{ $t("SETTINGS.SETTINGS.TERMS") }}</b>
          </div>
          <div class="col-7"></div>
          <div class="col-2">
            <router-link :to="{ name: 'RAServiceTerms' }" target="_blank" class="hidden-div"
              ><font-awesome-icon icon="angle-right" />
            </router-link>
          </div>
        </div>

        <div class="row text-left my-3">
          <div class="col-3 pl-4">
            <b>{{ $t("SETTINGS.SETTINGS.POLICY") }}</b>
          </div>
          <div class="col-7"></div>
          <div class="col-2">
            <router-link :to="{ name: 'RAPrivacyPolicy' }" target="_blank" class="hidden-div"
              ><font-awesome-icon icon="angle-right" />
            </router-link>
          </div>
        </div>

        <div class="row text-left my-3">
          <div class="col-3 pl-4">
            <b>{{ $t("SETTINGS.SETTINGS.MORE") }}</b>
          </div>
          <div class="col-7"></div>
          <div class="col-2">
            <a
              href="https://tw.fiimart.com/web/nextiiot/Toc/Prod/0003/0003-01/FM0005?culture=zh-Hant"
              target="_blank"
              class="hidden-div"
              ><font-awesome-icon icon="angle-right"
            /></a>
          </div>
        </div>

        <div class="row text-left my-3">
          <div class="col-3 pl-4">
            <b>{{ $t("SETTINGS.SETTINGS.LANGUAGE") }}</b>
          </div>
          <div class="col-7">{{ langList[currentLang].text }}</div>
          <div class="col-2">
            <a class="hidden-div" @click="showModal('changeLang')"><font-awesome-icon icon="angle-right"/></a>
          </div>
        </div>

        <div class="row text-left my-3">
          <div class="col-3 pl-4">
            <b>{{ $t("SETTINGS.SETTINGS.VERSION") }}</b>
          </div>
          <div class="col-7">v{{ version }}</div>
          <div class="col-2"></div>
        </div>
      </div>
      <div class="text-center">
        <b-button class="logout-btn my-4 mx-auto" @click="showModal('logout')">{{
          $t("SETTINGS.SETTINGS.LOGOUT")
        }}</b-button>
      </div>
    </div>

    <Logout v-if="modalType.logout" @cancel="closeModal('logout', false)"></Logout>
    <ChangeLang
      v-if="modalType.changeLang"
      @ok="closeModal('changeLang', true)"
      @cancel="closeModal('changeLang', false)"
    ></ChangeLang>
  </div>
</template>

<script>
  import Header from "@/components/Header";
  import Logout from "@/components/modal/Logout";
  import ChangeLang from "@/components/modal/ChangeLang";

  export default {
    components: {
      Header,
      Logout,
      ChangeLang,
    },
    data: () => ({
      modalType: {
        logout: false,
        changeLang: false,
      },
      userinfo: {
        username: "",
        account: "",
        password: "********",
        email: "",
        enterprise: "",
        isAdmin: false,
      },
      langList: [
        { value: 0, text: "繁體中文" },
        { value: 1, text: "简体中文" },
        { value: 2, text: "English" },
      ],
      currentLang: 0,
      dismissSecs: 3,
      dismissCountDown: 0,
      typeText: "",
      isEditing: false,
      newUserName: "",
      version: "",
      selectedData: null,
    }),
    mounted() {
      this.getUserInfo();
      this.getVersion();
      this.getCurrentLang();
    },
    computed: {
      username() {
        return this.$cookies.get("user").account;
      },
    },
    methods: {
      getUserInfo() {
        this.apiGet("user/info").then(({ data }) => {
          this.userinfo.username = data.userinfo.name;
          this.userinfo.account = data.userinfo.account;
          this.userinfo.email = data.userinfo.email;
          this.userinfo.enterprise = data.userinfo.enterprise.name;
          this.userinfo.isAdmin = data.userinfo.admin;
        });
      },

      getVersion() {
        let pjson = require("../../../package.json");
        this.version = pjson.version;
      },

      getCurrentLang() {
        this.currentLang = this.$cookies.get("language");
      },

      editUserName() {
        this.newUserName = this.userinfo.username;
        this.isEditing = true;
      },

      cancelEditUserName() {
        this.isEditing = false;
      },
      showModal(type, data) {
        if (data) this.selectedData = data;
        this.modalType[type] = true;
      },

      closeModal(type, reload) {
        if (reload) {
          this.getCurrentLang();
          return history.go(0);
        }
        this.modalType[type] = false;
        this.selectedData = null;
      },
    },
  };
</script>

<style lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .settings {
    padding-top: 60px;

    .main-content {
      .container {
        width: 33vw;
        @media (max-width: 1440px) {
          width: 40vw;
        }
        @media (max-width: 992px) {
          width: 90vw;
        }

        .title {
          width: 100%;
          font-size: 20px;
          color: $blue;
          border-bottom: 1px solid $grey;
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
              color: $blue;
            }
          }
          .col-9 {
            .form-control {
              font-size: 14px;
              border: 2px solid #e7e7e9;
              border-radius: 10px;
              transition: all 0.3s ease-in-out;

              &:focus {
                border: 2px solid #4b8bcf;
                box-shadow: none;
              }
            }

            .col {
              .btn-edit {
                height: 35px;
                color: $blue;
                background-color: #fff;
                border: 1px solid $blue;
              }
              .btn-cancel {
                height: 35px;
                color: $placeholder;
                background-color: #fff;
                border: 1px solid $grey;
              }
            }
          }

          .hidden-div {
            background-color: transparent;
            width: 30px;
            height: 30px;

            svg {
              margin-top: 5px;
              margin-right: 15px;
              color: $grey;
            }
          }
        }
      }
      .logout-btn {
        width: 20vw;
        font-size: 14px;
        height: 38px;
        border: 1px solid $blue;
        color: $blue;
        background-color: aliceblue;
        font-weight: bold;

        @media (max-width: 1440px) {
          width: 30vw;
        }
      }
    }
  }
</style>
