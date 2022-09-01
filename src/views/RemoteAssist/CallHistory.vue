<template>
  <div class="call-history text-center">
    <RAHeader :title="$t('CALL_HISTORY.TITLE')" />
    <div class="ra-main-content">
      <div v-if="recordList.length == 0">
        <div class="logo mb-5">
          <font-awesome-icon icon="phone-volume" size="10x" class="phone-icon" />
        </div>
        <h2 class="ra-title b-4">{{ $t("CALL_HISTORY.EMPTY_RECORD") }}</h2>
        <h3 class="ra-sub-title my-2 mx-auto">{{ $t("CALL_HISTORY.ADD_CONTACT_1") }}</h3>
        <h3 class="ra-sub-title my-2 mx-auto">{{ $t("CALL_HISTORY.ADD_CONTACT_2") }}</h3>
        <router-link :to="{ name: 'RAContact' }">
          <b-button type="submit" class="ra-confirm-btn my-4">{{ $t("CALL_HISTORY.TO_CONTACT") }}</b-button>
        </router-link>
      </div>
      <div class="my-4">
        <div v-if="recordList.length > 0" class="my-4">
          <NameCard
            v-for="item in recordList"
            v-bind:key="item.index"
            v-bind:prefix="item.prefix"
            v-bind:account="item.target_account"
            v-bind:name="item.target_name"
            v-bind:target_name="item.target_name"
            v-bind:is_host="item.is_host"
            v-bind:is_share="item.is_share"
            v-bind:is_read="item.is_read"
            v-bind:room_created_at="item.room_created_at"
            v-bind:room_uuid="item.room_uuid"
            v-bind:callModal="callModal"
            v-bind:fileModal="fileModal"
            v-bind:type="item.type"
          />
          <infinite-loading @infinite="infiniteHandler" spinner="spiral">
            <div class="no-more" slot="no-more">{{ $t("CALL_HISTORY.LAST_RECORD") }}</div>
            <div class="no-more" slot="no-results">{{ $t("CALL_HISTORY.LAST_RECORD") }}</div>
          </infinite-loading>
        </div>
      </div>
    </div>
    <Footer />

    <b-modal id="modal-call" :title="$t('CALL_HISTORY.START_CALL')" size="md" centered ref="modal-add">
      <div class="text-center">
        <p class="ra-sub-title my-3">
          {{ $t("CALL_HISTORY.INVITE_1") }} {{ selectedUser.name }} {{ $t("CALL_HISTORY.INVITE_2") }}
        </p>
        <b-button type="submit" class="ra-confirm-btn mt-3 mb-0" @click="callUser">{{
          $t("CALL_HISTORY.CALL")
        }}</b-button>
      </div>
      <div slot="modal-footer"></div>
    </b-modal>
    <b-modal
      id="modal-file"
      :title="$t('CALL_HISTORY.CONFERENCE_VIDEO')"
      size="md"
      ref="modal-add"
      centered
      no-close-on-backdrop
    >
      <div class="text-center file-slider" v-if="!conferenceVideoToken">
        <div class="result-list py-1" v-for="(file, index) of files" :key="index" role="button">
          <button @click="conferenceVideoToken = file.token">
            <video width="300" height="150">
              <source :src="GetFileUrl(file.token) + '#t=0.1'" type="video/mp4" />
            </video>
          </button>
        </div>
        <span v-if="!files.length">{{ $t("CALL_HISTORY.NO_CONFERENCE_VIDEO") }}</span>
      </div>

      <div v-if="conferenceVideoToken" class="conference-vid">
        <video class="vid" :src="GetFileUrl(conferenceVideoToken)" controls autoplay="true" />
        <span class="close-button" role="button" @click="conferenceVideoToken = null"
          >關閉影片 <font-awesome-icon icon="times" size="1x"
        /></span>
      </div>
      <div slot="modal-footer"></div>
    </b-modal>
  </div>
</template>

<script>
  import RAHeader from "@/components/RAHeader.vue";
  import Footer from "@/components/Footer.vue";
  import NameCard from "@/components/NameCard.vue";
  import InfiniteLoading from "vue-infinite-loading";

  export default {
    name: "CallHistory",
    components: {
      RAHeader,
      Footer,
      NameCard,
      InfiniteLoading,
    },
    data: () => ({
      recordList: [],
      latestRoomUuid: "",
      page: 1,
      per_page: 30,
      selectedUser: "",
      files: [],
      conferenceVideoToken: null,
    }),
    mounted() {
      this.updateUuid();
      this.infiniteHandler();
    },
    created: function() {
      this.$store.state.contact = false;
      this.$store.state.callHistory = true;
      this.$store.state.settings = false;
    },
    methods: {
      GetFileUrl: function(token) {
        return `https://${process.env.VUE_APP_STORAGE_URL}/file/${token}`;
      },
      updateUuid() {
        this.apiGet("call/record_list").then(({ data }) => {
          this.latestRoomUuid = data.records[0].room_uuid;
          this.apiPost("call/read", { call_room_uuid: this.latestRoomUuid });
        });
      },
      infiniteHandler($state) {
        let data = {
          sort: 1,
          // is_host: 0,
          page: this.page,
          per_page: this.per_page,
        };
        this.apiGet("call/record_list", data).then(({ data }) => {
          if (data.records.length) {
            this.page += 1;
            this.recordList.push(...data.records);
            this.latestRoomUuid = data.records[0].room_uuid;
            if ($state) {
              $state.loaded();
            }
          } else {
            if ($state) {
              $state.complete();
            }
          }
        });
      },
      callModal(acc, name) {
        this.selectedUser = { acc: acc, name: name };
        this.$bvModal.show("modal-call");
      },
      fileModal(room_uuid) {
        console.log(room_uuid);
        let data = { call_room_uuid: room_uuid };

        this.apiPost("call/get_conference_videos", data).then(({ data }) => {
          this.files = data.tokens;
          this.conferenceVideoToken = null;
          this.$bvModal.show("modal-file");
        });
      },
      callUser() {
        this.$router.push({
          name: "Call",
          params: { callName: this.selectedUser.name, callAccount: this.selectedUser.acc },
        });
      },
      removeConferenceVideo(e) {
        if (e.target.tagName.toLowerCase() !== "video") {
          this.conferenceVideoToken = null;
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";
  .call-history {
    .ra-main-content {
      .phone-icon {
        margin-top: 150px;
        color: $placeholder;
      }
    }
    .no-more {
      margin-top: 20px;
    }
  }
  .ra-confirm-btn {
    width: 380px !important;
  }
  #modal-file {
    .conference-vid {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      bottom: 0px;

      video {
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        max-width: 80vw;
        max-height: 80vh;
        display: block;
        margin: auto;
        min-width: 40vw;
      }

      .close-button {
        z-index: 9999999;
        position: absolute;
        top: 60px;
        right: 30px;
        font-size: 20px;
        color: #fff;
      }
    }
    .file-slider {
      max-height: 50vh;
      overflow: auto;
    }
  }
</style>
