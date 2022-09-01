<template>
  <div class="sidebar" :class="{ minified: isSidebarMinified }">
    <div class="tool-list text-center" v-for="tool in managementTools" v-bind:key="tool.id">
      <div
        class="tool-item"
        :class="{ active: tool.isActive }"
        @click="toPage(tool)"
        @mouseover="tool.isHovered = true"
        @mouseleave="tool.isHovered = false"
      >
        <div class="tool-name" v-if="!isSidebarMinified">
          <img :src="setImgSrc(tool.img_url, tool.isActive, tool.isHovered)" />
          <span class="ml-2">
            {{ $t(tool.name) }}
          </span>
        </div>

        <div class="tool-name" v-if="isSidebarMinified" v-b-tooltip.hover.right :title="$t(tool.name)">
          <img :src="setImgSrc(tool.img_url, tool.isActive)" />
        </div>

        <div class="sub-tool-list" v-for="sub_tool in tool.sub_tools" v-bind:key="sub_tool.id">
          <div v-if="tool.isActive">
            <div
              class="sub-tool-item mb-1"
              :class="{ 'sub-active': sub_tool.isActive }"
              v-if="!isSidebarMinified"
              @click.stop="toPage(sub_tool)"
            >
              - {{ $t(sub_tool.name) }}
            </div>

            <div
              class="sub-tool-item-minified"
              :class="{ active: sub_tool.isActive }"
              v-if="isSidebarMinified"
              @click.stop="toPage(sub_tool)"
            >
              {{ $t(sub_tool.name_mini) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      isSidebarMinified: Boolean,
    },
    data: () => ({
      managementTools: [
        {
          id: 0,
          name: "SIDEBAR.WORKFLOW",
          pathName: "WorkflowManagement",
          img_url: "workflow_management",
          isActive: true,
          isHovered: false,
          sub_tools: [],
        },
        {
          id: 1,
          name: "SIDEBAR.RECORD",
          pathName: "WorkflowRecord",
          img_url: "workflow_record",
          isActive: false,
          isHovered: false,
          sub_tools: [],
        },
        {
          id: 2,
          name: "SIDEBAR.EQUIPMENT",
          pathName: "EquipmentManagement",
          img_url: "equipment",
          isActive: false,
          isHovered: false,
          sub_tools: [
            {
              id: 0,
              name: "SIDEBAR.EQUIPMENT_M",
              name_mini: "SIDEBAR.EQUIPMENT_M_MINI",
              pathName: "EquipmentManagement",
              isActive: false,
            },
            {
              id: 1,
              name: "SIDEBAR.TYPE",
              name_mini: "SIDEBAR.TYPE_MINI",
              pathName: "TypeManagement",
              isActive: false,
            },
            {
              id: 2,
              name: "SIDEBAR.LOCATION",
              name_mini: "SIDEBAR.LOCATION_MINI",
              pathName: "LocationManagement",
              isActive: false,
            },
          ],
        },
        {
          id: 3,
          name: "SIDEBAR.FILE",
          pathName: "FileManagement",
          img_url: "file_management",
          isActive: false,
          isHovered: false,
          sub_tools: [],
        },
        {
          id: 4,
          name: "SIDEBAR.USER",
          pathName: "UserManagement",
          img_url: "user_management",
          isActive: false,
          isHovered: false,
          sub_tools: [],
        },
        {
          id: 5,
          name: "SIDEBAR.TASK",
          pathName: "TaskManagement",
          img_url: "task_management",
          isActive: false,
          isHovered: false,
          sub_tools: [],
        },
      ],
      currentPathName: "",
    }),
    mounted() {
      this.currentPathName = this.$router.currentRoute.name;
      this.setActive();
    },
    methods: {
      toPage(tool) {
        // 避免跳轉相同url時報錯
        if (tool.pathName == this.currentPathName) return;
        this.$router.push({ name: tool.pathName });
      },
      setActive() {
        for (let tool of this.managementTools) {
          tool.show_sub_tools = false;
          tool.isActive = false;
          if (tool.pathName == this.currentPathName) tool.isActive = true;

          for (let subTool of tool.sub_tools) {
            if (subTool.pathName == this.currentPathName) {
              tool.isActive = true;
              subTool.isActive = true;
            }
          }
        }
      },

      setImgSrc(imgUrl, isActive, isHovered) {
        if (imgUrl) {
          if (isActive || isHovered || this.isSidebarMinified) {
            return require(`@/assets/images/${imgUrl}_hover.svg`);
          } else {
            return require(`@/assets/images/${imgUrl}.svg`);
          }
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .sidebar {
    float: left;
    width: 15%;
    height: calc(100vh - 60px);
    color: #333;
    background-color: #f9f9f9;
    transition: all 0.2s ease-in-out;

    .tool-list {
      padding: 20px;
      font-size: 14px;

      .tool-item {
        line-height: 44px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease-in-out;

        &:hover {
          background-color: $darkBlue;
          color: #fff;
          box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
        }

        .tool-name {
          position: relative;
          font-size: 16px;
          font-weight: bold;

          img {
            width: 25px;
            margin-top: -5px;
          }

          .sub-tool-tip {
            position: absolute;
            right: 10px;

            svg {
              width: 10px;
            }
          }
        }

        .sub-tool-list {
          .sub-tool-item {
            border-radius: 8px;

            &:hover {
              color: #fff;
              background-color: $blue;
              box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
            }
          }

          .sub-tool-item-minified {
            top: 50px;
            left: 50px;
            background-color: $darkBlue;
            box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;

            &:hover {
              background-color: $blue;
              box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
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
      background-color: $darkBlue;
      color: #fff;
      box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    }
    .sub-active {
      background-color: $blue;
      color: #fff;
      border-top-left-radius: 0 !important;
      border-top-right-radius: 0 !important;
      box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    }
  }

  .minified {
    width: 4%;
    background-color: #b3d5f4;

    .tool-list {
      padding: 20px 0;
      transition: all 0.2s ease-in-out;

      &:hover {
        cursor: pointer;
      }

      .tool-item {
        border-radius: 0;
      }
    }
  }
</style>
