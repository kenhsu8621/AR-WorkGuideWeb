<template>
  <div class="management">
    <Header :title="$t('TERMS.TITLE_1')" />
    <Sidebar />
    <router-view></router-view>
  </div>
</template>

<script>
  import Header from "./component/Header";
  import Sidebar from "./component/Sidebar";

  export default {
    components: {
      Header,
      Sidebar,
    },
  };
</script>

<style scoped lang="scss">
  .management {
    padding-top: 75px;
  }
</style>
