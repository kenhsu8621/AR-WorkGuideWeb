<template>
  <div class="switch-button-component">
    <div class="switch-button outline" :class="isActive ? '' : 'inactive'" @click="toggleStatus">
      <span class="toggle-text" :class="isActive ? 'float-left' : 'float-right'">{{
        isActive ? $t("SWITCH.ACTIVATED") : $t("SWITCH.DEACTIVATED")
      }}</span>
      <div class="toggle-dot-right" :class="isActive ? 'activated' : 'deactivated'">
        <img src="~@/assets/images/check-icon.svg" />
      </div>
      <div class="toggle-dot-left" :class="isActive ? 'activated' : 'deactivated'">
        <img src="~@/assets/images/stop-icon.svg" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SwitchButton",
    props: {
      isActive: Boolean,
    },
    methods: {
      toggleStatus() {
        this.$emit("update", this.isActive);
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .switch-button-component {
    .outline {
      position: relative;
      padding: 0 6px;
      width: 84px;
      height: 30px;
      line-height: 28px;
      font-size: 14px;
      border-radius: 17px;
      color: #fff;
      background-color: $blue;
      border: 1px solid $blue;
      cursor: pointer;

      .toggle-text {
        transition: all 0.3s ease-in-out;
      }

      .toggle-dot-right {
        position: absolute;

        &.activated {
          top: 3px;
          right: 3px;
          transition: all 0.3s ease-in-out;
          opacity: 1;
        }

        &.deactivated {
          top: 3px;
          left: 3px;
          transform: translateX(-175%);
          opacity: 0;
        }

        img {
          width: 22px;
          margin-top: -10px;
        }
      }
      .toggle-dot-left {
        position: absolute;

        &.activated {
          top: 3px;
          right: 3px;
          transform: translateX(175%);
          opacity: 0;
        }

        &.deactivated {
          top: 3px;
          left: 3px;
          transition: all 0.3s ease-in-out;
          opacity: 1;
        }

        img {
          width: 22px;
          margin-top: -10px;
        }
      }
    }

    .inactive {
      color: #333;
      background-color: #fff;
      border: 1px solid #d0d0d0;
    }
  }
</style>
