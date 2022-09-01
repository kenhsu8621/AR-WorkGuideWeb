<template>
  <div class="sidebar-container">
    <div class="tool-list text-center" v-for="tool in managementTools" v-bind:key="tool.id">
      <div
        class="tool-item pt-4 mb-1"
        :class="tool.isActive ? 'active' : ''"
        @click="toPage(tool.id)"
        @mouseover="tool.show_sub_tools = true"
        @mouseleave="tool.show_sub_tools = false"
      >
        <img :src="setImgSrc(tool.img_url, tool.isActive, tool.show_sub_tools)" />
        <div class="tool-name mt-2 pb-4">{{ tool.name }}</div>
        <div class="sub-tool-list" v-for="sub_tool in tool.sub_tools" v-bind:key="sub_tool.id">
          <div
            class="sub-tool-item"
            :class="sub_tool.isActive ? 'active' : ''"
            v-if="tool.show_sub_tools || tool.isActive"
            @click="toSubPage(tool.id, sub_tool.id)"
          >
            • {{ sub_tool.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data: () => ({
      managementTools: [
        {
          id: 0,
          name: "運維管理",
          img_url: "maintenance",
          path: { name: "SIMaintenance" },
          sub_tools: [],
          isActive: false,
          show_sub_tools: false,
        },
        {
          id: 1,
          name: "企業管理",
          img_url: "enterprise",
          path: "enterprise",
          sub_tools: [
            { id: 0, name: "企業設定", path: { name: "SIEnterpriseSetting" }, isActive: false },
            { id: 1, name: "企業用戶", path: { name: "SIEnterpriseAccount" }, isActive: false },
          ],
          isActive: false,
          show_sub_tools: false,
        },
        {
          id: 2,
          name: "使用分析",
          img_url: "analysis",
          path: { name: "SIAnalysis" },
          sub_tools: [],
          isActive: false,
          show_sub_tools: false,
        },
        {
          id: 3,
          name: "用戶回饋",
          img_url: "feedback",
          path: { name: "SIFeedbackRating" },
          sub_tools: [
            { id: 0, name: "通話評分", path: { name: "SIFeedbackRating" }, isActive: false },
            { id: 1, name: "聯繫我們", path: { name: "SIFeedbackContactUs" }, isActive: false },
          ],
          isActive: false,
          show_sub_tools: false,
        },
        {
          id: 4,
          name: "錄製檔案管理",
          img_url: "recorded-video",
          path: { name: "SIRecordedVideo" },
          sub_tools: [],
          isActive: false,
          show_sub_tools: false,
        },
      ],
      currentPath: "",
    }),
    mounted() {
      this.currentPath = this.$router.currentRoute.name;
      this.setActive();
    },
    methods: {
      toPage(id) {
        // 沒有子頁面的情況下return
        if (this.managementTools[id].sub_tools.length > 0) return;
        else this.$router.push(this.managementTools[id].path);
        // 避免跳轉相同url時報錯
        if (this.managementTools[id].path.name == this.currentPath) return;
      },
      toSubPage(id, sub_id) {
        // 避免跳轉相同url時報錯
        if (this.managementTools[id].sub_tools[sub_id].path.name == this.currentPath) return;
        this.$router.push(this.managementTools[id].sub_tools[sub_id].path);
      },
      setActive() {
        for (let i = 0; i < this.managementTools.length; i++) {
          this.managementTools[i].isActive = false;
          this.managementTools[i].show_sub_tools = false;
          // 有子頁面的情況下
          if (this.managementTools[i].sub_tools.length > 0) {
            for (let j = 0; j < this.managementTools[i].sub_tools.length; j++) {
              if (this.managementTools[i].sub_tools[j].path.name == this.currentPath) {
                this.managementTools[i].isActive = true;
                this.managementTools[i].sub_tools[j].isActive = true;
              }
            }
          } else {
            // 沒有子頁面的情況下
            if (this.managementTools[i].path.name == this.currentPath) {
              this.managementTools[i].isActive = true;
            }
          }
        }
      },
      setImgSrc(imgSrc, isActive, showSubTools) {
        if (isActive || showSubTools) {
          return require(`@/assets/images/management/${imgSrc}-hover.svg`);
        } else {
          return require(`@/assets/images/management/${imgSrc}.svg`);
        }
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .sidebar-container {
    position: absolute;
    width: 100px;
    height: 100vh;
    color: #333;
    background-color: #f2f2f2;
    .tool-list {
      font-size: 14px;
      .tool-item {
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          color: #fff;
          background-color: $blue;
        }
        .tool-name {
        }
        .sub-tool-list {
          .sub-tool-item {
            height: 40px;
            line-height: 40px;
            color: #333;
            background-color: #f2f2f2;
            &:hover {
              color: #fff;
              background-color: $blue;
            }
          }
        }
      }
      a {
        color: unset;
        text-decoration: none;
        &:hover {
          text-decoration: none;
        }
      }
    }
    .active {
      color: #fff !important;
      background-color: $blue !important;
      transition: all 0.2s;
    }
  }
</style>
