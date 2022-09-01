<template>
  <div class="contact-us text-center">
    <RAHeader :title="$t('SETTINGS.CONTACT_US.TITLE')" />

    <div class="ra-main-content mx-auto text-left">
      <div class="ra-title pt-5 mb-4 font-weight-bold">
        {{ $t("SETTINGS.CONTACT_US.DESC_1") }}<br />{{ $t("SETTINGS.CONTACT_US.DESC_2") }}
      </div>
      <div class="ra-form-group row my-5">
        <div class="col-4 font-weight-bold mt-3">
          {{ $t("SETTINGS.CONTACT_US.FEEDBACK") }}
        </div>
        <div class="col-8">
          <textarea
            class="message grey"
            rows="5"
            v-model="message"
            maxlength="1000"
            @change="$v.message.$touch()"
            :class="{ 'is-invalid': $v.message.$error }"
          ></textarea>
          <small id="accountDesc" v-if="!$v.message.required" class="invalid-feedback">{{ $t("FORM.REQUIRED") }}</small>
        </div>
      </div>
      <div class="ra-form-group row my-5">
        <div class="col-4 mt-3">
          <div class="font-weight-bold">{{ $t("SETTINGS.CONTACT_US.CAPTURE") }}</div>
          <div class="desc">{{ $t("SETTINGS.CONTACT_US.CAPTURE_DESC") }}</div>
        </div>
        <div class="col-8 mt-3">
          <div class="col-4" v-for="(photo, index) in photos" v-bind:key="photo.name" style="display:inline-block;">
            <img v-bind:src="photo.src" alt="" style="width:inherit;" @click="deletePhoto(index)" />
          </div>
          <div class="col-4 m-0 p-0" style="display:inline-block" v-if="photos.length < 5">
            <b-button type="button" class="ra-confirm-btn-alt file-upload" @click="chooseFiles"
              >{{ $t("SETTINGS.CONTACT_US.CHOOSE_FILE") }}
            </b-button>
            <input
              type="file"
              id="file"
              ref="file"
              accept=".jpg, .png, .jpeg"
              @change="onChangeFileUpload()"
              hidden
              multiple
            />
          </div>
        </div>
      </div>
      <div class="ra-form-group row my-5">
        <div class="col-4 font-weight-bold mt-3">
          {{ $t("SETTINGS.CONTACT_US.EMAIL") }}
        </div>
        <div class="col-8">
          <input
            type="email"
            aria-describedby="emailDesc"
            class="form-control"
            v-model="email"
            @change="$v.email.$touch()"
            v-bind:placeholder="placeholder"
            :class="{ 'is-invalid': $v.email.$error }"
            disabled
          />

          <small id="emailDesc" v-if="!$v.email.required" class="invalid-feedback">{{ $t("FORM.REQUIRED") }}</small>
          <small id="emailDesc" v-if="!$v.email.email" class="invalid-feedback">{{ $t("FORM.EMAIL_ERR") }}</small>
        </div>
      </div>
      <b-button type="button" class="ra-confirm-btn-alt my-2 submit" @click="submit" :disabled="$v.$error">{{
        $t("FORM.SUBMIT")
      }}</b-button>
    </div>

    <Footer />
  </div>
</template>

<script>
  import RAHeader from "@/components/RAHeader.vue";
  import Footer from "@/components/Footer.vue";
  import { email, required } from "vuelidate/lib/validators";

  export default {
    name: "ContactUs",
    components: {
      RAHeader,
      Footer,
    },
    data: () => ({
      email: "",
      message: "",
      photos: [],
      placeholder: "",
      photoNumLimit: 5,
    }),
    created() {
      let user = this.$cookies.get("user") || {};
      console.log(this.$cookies.get("user"));
      this.email = user.email;
      this.placeholder = user.email;
    },
    validations: {
      email: { required, email },
      message: { required },
    },
    methods: {
      onChangeFileUpload(e) {
        let validExts = new Array(".jpg", ".jpeg", ".png");

        let files = this.$refs.file.files;
        for (let i = 0; i < files.length; i++) {
          let fileExt = files[i].name;
          fileExt = fileExt.substring(fileExt.lastIndexOf("."));
          if (validExts.indexOf(fileExt) < 0) {
            return this.$alert(this.$t("SETTINGS.CONTACT_US.INVALID_FORMAT"));
          } else if (files[i].size > 10 * 1024 * 1024) {
            return this.$alert(this.$t("SETTINGS.CONTACT_US.SIZE_LIMIT"));
          }
        }
        if (files.length + this.photos.length > this.photoNumLimit)
          return this.$alert(
            this.$t("SETTINGS.CONTACT_US.CAPTURE_LIMIT_1") +
              this.photoNumLimit +
              this.$t("SETTINGS.CONTACT_US.CAPTURE_LIMIT_2")
          );
        for (let file of files) {
          let reader = new FileReader();
          reader.onload = (event) => {
            this.photos.push({
              file: file,
              src: event.target.result,
            });
          };
          reader.readAsDataURL(file);
        }
      },
      chooseFiles() {
        this.$refs.file.click();
      },
      deletePhoto(index) {
        this.photos.splice(index, 1);
      },
      submit() {
        this.$v.$touch();
        if (this.$v.$invalid) return;

        const formData = new FormData();
        for (let photo of this.photos) formData.append("photos", photo.file);
        formData.append("email", this.email);
        formData.append("message", this.message);

        this.apiPost("general/contact_us", formData)
          .then(() => {
            this.$alert(this.$t("SETTINGS.CONTACT_US.SUBMIT_SUCCESS"));

            this.$router.push({ name: "Login" });
          })
          .catch(({ message }) => {
            // this.$alert(this.$t("SETTINGS.CONTACT_US.SUBMIT_FAIL"));
          });
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/main.scss";

  .contact-us {
    height: 100vh;
    font-size: 16px;

    .ra-main-content {
      width: 528px;
      .title {
        font-size: 16px;
        color: $grey;
      }
      .ra-confirm-btn-alt {
        width: 120px !important;
      }
      .ra-form-group {
        width: unset !important ;
        .desc {
          color: $placeholder;
        }
        .file-upload {
          width: 125px;
        }
        .message {
          width: -webkit-fill-available;
          padding: 13px 20px;
          background-color: #f0f0f0;
          border: none;
          border-radius: 5px;
          &:focus {
            outline: none;
            border-radius: 5px;
          }
        }
      }
      .submit {
        width: -webkit-fill-available !important;
      }
    }
  }
</style>
