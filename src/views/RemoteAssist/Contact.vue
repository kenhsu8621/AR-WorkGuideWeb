<template>
  <div class="contact text-center">
    <RAHeader v-if="this.$store.state.deployType == 1" :title="$t('CONTACT.WELCOME_1')" />
    <RAHeader v-if="this.$store.state.deployType == 2" :title="$t('CONTACT.WELCOME_2')" />
    <div class="ra-main-content" :class="{ 'height-unset': transitionComplete }">
      <div v-if="!loading && contactList.length == 0">
        <div>
          <div class="logo py-5">
            <img v-if="this.$store.state.deployType == 1" src="~@/assets/images/logo.png" />
            <img v-if="this.$store.state.deployType == 2" src="~@/assets/images/logo-digiwin.png" />
          </div>
          <h2 class="ra-title" v-if="this.$store.state.deployType == 1">{{ $t("CONTACT.WELCOME_1") }}</h2>
          <h2 class="ra-title" v-if="this.$store.state.deployType == 2">{{ $t("CONTACT.WELCOME_2") }}</h2>
          <h3 class="ra-sub-title my-4 mx-auto">
            {{ $t("CONTACT.WELCOME_DESC") }}
          </h3>
          <form @submit.prevent="addContact">
            <div class="ra-form-group mt-3 mb-2 mx-auto">
              <small id="accountDesc" v-if="submitted && !$v.account.required" class="alert-msg">{{
                $t("FORM.REQUIRED")
              }}</small>
              <small id="accountDesc" v-if="submitted && addContactAlertMsg" class="alert-msg">{{
                $t("CONTACT.NO_ACCOUNT")
              }}</small>
              <input
                type="text"
                v-model="account"
                id="account"
                aria-describedby="accountDesc"
                :placeholder="$t('CONTACT.CONTACT_PLACEHOLDER')"
                class="form-control mt-3"
                :class="{ 'is-invalid': submitted && $v.account.$error && !$v.account.$dirty }"
                @input="clearAlertMsg()"
              />
              <b-button type="submit" class="ra-confirm-btn mt-3" aria-label="Close" data-dismiss="modal">{{
                $t("GENERAL.ADD")
              }}</b-button>
              <div class="join-or-start pt-3">
                <div class="text-right" @click="open = !open">
                  {{ $t("CONTACT.JOIN_OR_START") }}
                </div>
                <div class="conference" v-if="open" ref="conference">
                  <div class="conference-btn" @click="startConference">{{ $t("CONTACT.START_CONFERENCE") }}</div>
                  <div class="conference-btn" @click="joinConference">{{ $t("CONTACT.JOIN_CONFERENCE") }}</div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div v-if="!loading && contactList.length > 0">
        <div class="edit-section my-4 mx-auto">
          <b-button class="add float-left px-3 mr-3" @click="showAddContactModal"
            ><font-awesome-icon icon="user-plus" class="mr-2" />{{ $t("CONTACT.ADD_CONTACT") }}</b-button
          >
          <div class="float-left">
            <b-button class="add px-3" @click="open = !open"
              ><font-awesome-icon icon="users" class="mr-2" />{{ $t("CONTACT.CONFERENCE") }}</b-button
            >
            <div class="conference" v-if="open" ref="conference">
              <div class="conference-btn" @click="startConference">{{ $t("CONTACT.START_CONFERENCE") }}</div>
              <div class="conference-btn" @click="joinConference">{{ $t("CONTACT.JOIN_CONFERENCE") }}</div>
            </div>
          </div>
          <b-button
            class="edit float-right px-4"
            v-if="!$store.state.isEditing"
            @click="$store.state.isEditing = !$store.state.isEditing"
            >{{ $t("CONTACT.EDIT") }}</b-button
          >
          <b-button
            class="edit float-right px-4"
            v-if="$store.state.isEditing"
            @click="$store.state.isEditing = !$store.state.isEditing"
            >{{ $t("GENERAL.COMPLETE") }}</b-button
          >
        </div>
        <Card
          v-for="item in contactList"
          v-bind:key="item.index"
          v-bind:prefix="item.prefix"
          v-bind:name="item.name"
          v-bind:account="item.account"
          v-bind:deleteContact="deleteContact"
          v-bind:callUser="callUser"
        />
        <div class="tips my-4">{{ $t("CONTACT.NOT_SUPPORTED") }}</div>
      </div>
    </div>

    <Footer />

    <b-modal ref="modal-add" :title="$t('CONTACT.ADD_CONTACT')" size="md" centered hide-footer>
      <form @submit.prevent="addContact">
        <div class="ra-form-group my-2 mx-auto text-center">
          <small id="accountDesc" v-if="submitted && !$v.account.required" class="alert-msg">{{
            $t("FORM.REQUIRED")
          }}</small>
          <small id="accountDesc" v-if="submitted && addContactAlertMsg" class="alert-msg">{{
            $t("CONTACT.NO_ACCOUNT")
          }}</small>
          <input
            type="text"
            v-model="account"
            id="account"
            aria-describedby="accountDesc"
            :placeholder="$t('CONTACT.CONTACT_PLACEHOLDER')"
            class="form-control mt-2"
            :class="{ 'is-invalid': submitted && $v.account.$error && !$v.account.$dirty }"
            @input="clearAlertMsg()"
          />
          <b-button type="submit" class="ra-confirm-btn mt-3" aria-label="Close" data-dismiss="modal">{{
            $t("GENERAL.ADD")
          }}</b-button>
        </div>
      </form>
      <!-- <div slot="modal-footer"></div> -->
    </b-modal>
  </div>
</template>

<script>
  import RAHeader from "@/components/RAHeader.vue";
  import Footer from "@/components/Footer.vue";
  import Card from "@/components/Card.vue";
  import { required } from "vuelidate/lib/validators";

  export default {
    name: "Contact",
    components: {
      RAHeader,
      Footer,
      Card,
    },
    data: () => ({
      contactList: [],
      addContactAlertMsg: null,
      account: "",
      submitted: false,
      loading: true,
      transitionComplete: false,
      open: false,
    }),
    validations: {
      account: {
        required,
      },
    },
    created() {
      this.$store.state.contact = true;
      this.$store.state.callHistory = false;
      this.$store.state.settings = false;
      window.addEventListener("keydown", (e) => {
        if (e.key == "Enter") {
          return e.preventDefault();
        }
      });
    },
    mounted() {
      this.getContacts();
      this.changeHeight();
    },
    methods: {
      callUser(acc, name) {
        this.$router.push({ name: "RACall", params: { callName: name, callAccount: acc } });
      },
      getContacts() {
        this.loading = true;
        this.apiGet("contact/list")
          .then(({ data }) => {
            this.contactList = data.contacts || [];
          })
          .finally(() => {
            this.loading = false;
          });
      },
      showAddContactModal() {
        this.$refs["modal-add"].show();
        this.account = "";
        this.submitted = false;
      },
      addContact() {
        this.submitted = true;
        this.$v.$touch();
        if (this.$v.$invalid) {
          return;
        }
        this.apiPost("contact/add", { account: this.account })
          .then(() => {
            this.$refs["modal-add"].hide();
            this.getContacts();
            this.account = "";
            this.submitted = false;
          })
          .catch(({ code, message }) => {
            this.$refs["modal-add"].hide();
            this.addContactAlertMsg = message;
          });
      },
      deleteContact(account, name) {
        if (!confirm(`${this.$t("CONTACT.DELETE_ALERT")} ${name}?`)) return;
        let data = { account };
        this.apiPost("contact/delete", data).then(() => {
          this.getContacts();
        });
      },
      clearAlertMsg() {
        this.addContactAlertMsg = "";
      },
      changeHeight() {
        setTimeout(() => {
          this.transitionComplete = true;
        }, 1000);
      },
      startConference() {
        this.$router.push({ name: "RAConference", params: { isCreate: true } });
      },
      joinConference() {
        this.$router.push({ name: "RAConference", params: { isCreate: false } });
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .contact {
    .ra-main-content {
      .join-or-start {
        cursor: pointer;
        &:hover {
          color: $blue;
        }
        .conference {
          position: absolute;
          left: 49vw;
          width: 198px;
          height: 100px;
          background-color: #fff;
          box-shadow: 0px 10px 10px #00000029;
          border-radius: 10px;
          z-index: 999;
          @media (max-width: 1440px) {
            left: 48vw;
          }
          .conference-btn {
            color: $grey;
            font-weight: bold;
            height: 50px;
            line-height: 50px;
            border-radius: 10px;
            cursor: pointer;
            &:hover {
              background-color: #eee;
            }
          }
        }
      }
      .edit-section {
        width: 33vw;
        height: 50px;

        @media (max-width: 1440px) {
          width: 40vw;
        }
        @media (max-width: 992px) {
          width: 90vw;
        }
        .add {
          height: 50px;
          border: 1px solid $blue;
          background-color: $blue;
          &:hover {
            border: 1px solid $blueHover;
            background-color: $blueHover;
          }
        }
        .conference {
          position: absolute;
          width: 198px;
          height: 100px;
          background-color: #fff;
          box-shadow: 0px 10px 10px #00000029;
          border-radius: 10px;
          z-index: 999;
          .conference-btn {
            font-weight: bold;
            height: 50px;
            line-height: 50px;
            border-radius: 10px;
            cursor: pointer;
            &:hover {
              background-color: #eee;
            }
          }
        }
        .edit {
          height: 50px;
          color: $blue;
          border: 1px solid $blue;
          background-color: #fff;
        }
      }
      .tips {
        color: $placeholder;
      }
    }
    .height-unset {
      height: unset;
    }
  }
</style>
