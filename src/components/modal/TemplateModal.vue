<template>
  <div class="backdrop" ref="backdrop" @click="onBackdrop" :style="{ 'z-index': z_index }">
    <div class="modal-container" :style="{ width: width + 'vw' }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      width: {
        type: Number,
        default: 25,
      },
      z_index: {
        type: Number,
        default: 999,
      },
    },
    methods: {
      onBackdrop(event) {
        // if (event.target === this.$refs.backdrop) {
        //   if (this.$parent) this.$parent.$emit("cancel");
        // }
      },
    },
  };
</script>

<style scoped lang="scss">
  .backdrop {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 20, 40, 0.3);
    .modal-container {
      position: relative;
      background-color: #fff;
      border-radius: 20px;
      // width: 25vw;
      margin: 15vh auto;
      padding: 30px 20px 5px 20px;
      font-size: 14px;
      box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
        rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
    }
  }
</style>
