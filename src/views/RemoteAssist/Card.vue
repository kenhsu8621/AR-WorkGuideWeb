<template>
  <div class="card-component mx-auto row text-center">
    <div class="col left">
      <div class="icon">{{ prefix }}</div>
    </div>
    <div class="col-7 middle text-left pl-3 pt-4">
      <div class="user-name">{{ name }}</div>
      <div class="account">{{ account }}</div>
    </div>
    <div class="col right phone d-none" v-if="!isEditingStatus" @click="callUser(account, name)">
      <font-awesome-icon icon="phone"/>
    </div>
    <div class="col right delete" v-if="isEditingStatus" @click="deleteContact(account, name)">
      <font-awesome-icon icon="trash" />
    </div>
  </div>
</template>

<script>
  export default {
    name: "Card",
    props: {
      name: String,
      account: String,
      deleteContact: Function,
      callUser: Function,
    },
    computed: {
      // 取使用者名稱字首作為大頭貼
      prefix: function() {
        return this.name.slice(0, 1);
      },
      isEditingStatus() {
        return this.$store.state.isEditing;
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .card-component {
    width: 33vw;
    height: 100px;
    background-color: #fff;
    border: 1px solid #fff;
    border-bottom: 1px solid $lightgrey;
    border-radius: 0;
    @media (max-width: 1440px) {
      width: 40vw;
    }
    @media (max-width: 992px) {
      width: 90vw;
    }
    .left,
    .right {
      line-height: 100px;
    }
    .middle {
      .user-name {
        font-weight: bold;
        color: #5f5f5f;
      }
      .account {
        color: $placeholder;
      }
    }
    .right {
      font-size: 20px;
      color: $grey;
      cursor: pointer;
    }
    .phone {
      a {
        color: $grey;

        &:hover {
          color: $green;
        }
      }
    }
    .delete {
      &:hover {
        color: $red;
      }
    }
    .icon {
      position: absolute;
      top: 25%;
      left: 25%;
      height: 55px;
      line-height: 55px;
      width: 55px;
      color: #fff;
      background-color: lightgrey;
      font-size: 20px;
      border-radius: 50%;
    }
  }
</style>
