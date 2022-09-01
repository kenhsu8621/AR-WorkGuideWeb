<template>
  <div class="searchbar-container">
    <div class="searchbar-component ra-form-group float-left my-4">
      <input
        type="text"
        v-model="keyword"
        placeholder="請輸入用戶名稱 / Email / 帳號搜尋"
        class="searchbar-input form-control"
      />
      <span v-if="keyword != ''" class="clear-icon" @click="clearKeyword" role="button">
        <font-awesome-icon icon="times" />
      </span>
      <span class="search-icon" @click="search" role="button">
        <font-awesome-icon icon="search" />
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Searchbar",
    data: () => ({
      type: 1,
      keyword: "",
    }),
    mounted() {
      window.addEventListener("keydown", (e) => {
        if (e.key == "Enter") {
          this.$emit("search", this.keyword);
        }
      });
    },
    methods: {
      search() {
        this.$emit("search", this.keyword);
      },
      clearKeyword() {
        this.keyword = "";
        this.$emit("search", null);
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .searchbar-container {
    padding-left: 100px;
    width: 100%;
    .searchbar-component {
      margin-left: 7vw;
      position: relative;
      .searchbar-input {
        background-color: #fff;
        height: 38px !important;
        border-radius: 22px;
        border: 1px solid #ccc;
      }
      .clear-icon {
        position: absolute;
        top: 9px;
        right: 41px;
        color: $placeholder;
        &:hover {
          color: $red;
        }
      }
      .search-icon {
        position: absolute;
        top: 6px;
        right: 14px;
        color: $placeholder;
        &:hover {
          color: $blue;
        }
      }
    }
  }
</style>
