<template>
  <div class="home">
    <Header :title="$t('HOME.TITLE')" />
    <div class="flexbox-container">
      <div
        class="flexbox-item management text-center"
        role="button"
        v-for="(m, name) in managementList"
        :key="name"
        :class="m.bg"
        @click="toPage(m.pathName)"
      >
        <div class="m-icon"><img :src="setImgSrc(m.img_url)" /></div>
        <div class="m-icon-hover"><img :src="setImgSrc(m.img_url_hover)" /></div>
        <div class="m-title">{{ $t(m.name) }}</div>
      </div>
    </div>

    <div class="flexbox-container">
      <div class="flexbox-item dashboard p-3" v-for="d in dashboardList" :key="d.index">
        <div class="d-icon"><img :src="setImgSrc(d.img_url)" /></div>
        <div class="d-title mt-3">{{ d.name }}</div>
        <div class="d-value">{{ d.value }}</div>
      </div>
    </div>

    <div class="footer text-center">
      <div class="footer-container d-none d-md-block">
        <div class="copyright float-left">
          <img class="logo mx-2" src="~@/assets/images/fii-vision-logo-b.svg" />
          <img class="logo-hover" src="~@/assets/images/fii-vision-logo-c.svg" />
          <span class="mx-2">Copyright © 2021 {{ $t("HOME.COPYRIGHT_1") }}</span>
          <span>{{ $t("HOME.COPYRIGHT_2") }}</span>
        </div>

        <div class="terms float-right">
          <router-link :to="{ name: 'RAPrivacyPolicy' }" target="_blank"
            ><span class="link mx-2" role="button">{{ $t("SETTINGS.POLICY") }} </span>
          </router-link>
          |
          <router-link :to="{ name: 'RAServiceTerms' }" target="_blank"
            ><span class="link mx-2" role="button">{{ $t("SETTINGS.TERMS") }} </span>
          </router-link>
        </div>
      </div>

      <div class="footer-container d-md-none p-0">
        <div class="copyright text-center m-0">
          <div>
            <img class="logo mb-2" src="~@/assets/images/fii-vision-logo-b.svg" />
          </div>
          <span class="mx-2">Copyright © 2021 {{ $t("HOME.COPYRIGHT_1") }}</span>
          <span>{{ $t("HOME.COPYRIGHT_2") }}</span>
        </div>
        <div class="terms text-center m-0">
          <span class="link mx-2" role="button">{{ $t("SETTINGS.POLICY") }} </span>|
          <span class="link mx-2" role="button">{{ $t("SETTINGS.TERMS") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from "@/components/Header";
  import { GetHmsByTotalSeconds } from "@/utils/date";

  export default {
    components: {
      Header,
    },
    data: () => ({
      managementList: [],
      dashboardList: [],
      user: {},
    }),
    mounted() {
      this.user = this.$cookies.get("user") || {};
      console.log(this.user);
      if (this.user.admin) {
        this.managementList = [
          {
            name: "HOME.WF_M",
            img_url: "workflow-b",
            img_url_hover: "workflow-c",
            bg: "bg-blue",
            pathName: "WorkflowManagement",
          },
          {
            name: "HOME.AR_REMOTE_M",
            img_url: "ar-b",
            img_url_hover: "ar-c",
            bg: "bg-purple",
            // pathName: "RAContact",
          },
          {
            name: "HOME.USER_M",
            img_url: "account-b",
            img_url_hover: "account-c",
            bg: "bg-green",
            pathName: "UserManagement",
          },
          {
            name: "HOME.TASK_M",
            img_url: "task-b",
            img_url_hover: "task-c",
            bg: "bg-yellow",
            pathName: "TaskManagement",
          },
          {
            name: "HOME.ENTERPRISE_M",
            img_url: "enterprise-b",
            img_url_hover: "enterprise-c",
            bg: "bg-red",
            pathName: "",
          },
        ];
      }

      if (!this.user.admin) {
        this.managementList = [
          {
            name: "HOME.AR_REMOTE_USER",
            img_url: "ar-b",
            img_url_hover: "ar-c",
            bg: "bg-purple",
            pathName: "RAContact",
          },
          {
            name: "HOME.TASK_M",
            img_url: "task-b",
            img_url_hover: "task-c",
            bg: "bg-yellow",
            pathName: "",
          },
        ];
      }

      if (this.user.admin) {
        this.dashboardList = [
          { name: "HOME.WF", img_url: "workflow-bg", value: "-" },
          { name: "HOME.TIME", img_url: "call-bg", value: "-" },
          { name: "HOME.ACTIVATED_ACCOUNTS", img_url: "account-bg", value: "-" },
          { name: "HOME.COMPLETED_TASKS", img_url: "task-bg", value: "-" },
        ];
        this.getDashboardInfo();
      }
      console.log(this.managementList);
    },
    methods: {
      GetHmsByTotalSeconds,
      setImgSrc(imgUrl) {
        return require(`@/assets/images/${imgUrl}.svg`);
      },

      getDashboardInfo() {
        this.apiGet("enterprise/dashboard_info").then(({ data }) => {
          this.dashboardList = [
            { name: this.$t("HOME.WF"), img_url: "workflow-bg", value: data.workflow_count },
            {
              name: this.$t("HOME.TIME"),
              img_url: "account-bg",
              value: this.GetHmsByTotalSeconds(data.total_call_seconds),
            },
            {
              name: this.$t("HOME.ACTIVATED_ACCOUNTS"),
              img_url: "call-bg",
              value: `${data.account_count_used}/${data.account_count}`,
            },
            {
              name: this.$t("HOME.COMPLETED_TASKS"),
              img_url: "task-bg",
              value: `${data.finished_task_count}/${data.total_task_count}`,
            },
          ];
        });
      },

      toPage(pathName) {
        if (pathName) this.$router.push({ name: pathName });
        else this.$alert("功能開發中，敬請期待！");
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";
  .home {
    padding-top: 60px;
    height: 100vh;
    background-color: #f6f6f6;

    .flexbox-container {
      display: flex;
      justify-content: center;
      align-items: center;

      .flexbox-item {
        width: 33%;
        background-color: #fff;
        box-shadow: rgba(0, 0, 0, 0.1) 0 25px 20px -20px;
      }

      .management {
        position: relative;
        margin: 8vh 2.5vw;
        width: 200px;
        height: 200px;
        padding-top: 50px;
        border-radius: 50%;
        transition: all 0.2s ease-in-out;

        .m-title {
          margin-top: 70px;
          font-size: 20px;
          line-height: 20px;
          font-weight: bold;
          letter-spacing: 2px;
          transition: all 0.2s ease-in-out;

          @media (max-width: 1200px) {
            margin-top: 40px;
            font-size: 18px;
            letter-spacing: 1.5px;
          }

          @media (max-width: 768px) {
            font-size: 14px;
            letter-spacing: 1px;
          }
        }

        .m-icon {
          opacity: 1;
          transition: all 0.2s ease-in-out;

          img {
            width: 100px;
            transition: all 0.2s ease-in-out;

            @media (max-width: 768px) {
              width: 50px;
            }
          }
        }

        .m-icon-hover {
          width: 100%;
          position: absolute;
          opacity: 0;
          transition: all 0.2s ease-in-out;
          text-align: center;

          img {
            width: 100px;
            margin-top: -128px;
            transition: all 0.2s ease-in-out;
          }

          @media (max-width: 768px) {
            img {
              width: 50px;
              margin-top: -78px;
            }
          }
        }

        &:hover {
          .m-title {
            letter-spacing: 3px;
            font-size: 22px;

            @media (max-width: 1200px) {
              font-size: 20px;
            }

            @media (max-width: 768px) {
              font-size: 16px;
            }
          }

          .m-icon {
            opacity: 0;
          }

          .m-icon-hover {
            opacity: 1;
          }
        }

        @media (max-width: 1200px) {
          margin: 0 1.5vw;
          width: 150px;
          height: 150px;
          padding-top: 25px;
        }

        @media (max-width: 768px) {
          width: 100px;
          height: 100px;
        }
      }

      .bg-blue {
        &:hover {
          background-color: #e8f7fe;
          box-shadow: rgba(144, 196, 255, 0.5) 0 25px 20px -20px;
        }
      }

      .bg-purple {
        &:hover {
          background-color: #eee6f4;
          box-shadow: rgba(203, 158, 255, 0.5) 0 25px 20px -20px;
        }
      }

      .bg-green {
        &:hover {
          background-color: #e6f6eb;
          box-shadow: rgba(159, 233, 181, 0.5) 0 25px 20px -20px;
        }
      }

      .bg-yellow {
        &:hover {
          background-color: #fcf9e8;
          box-shadow: rgba(255, 224, 156, 0.5) 0 25px 20px -20px;
        }
      }

      .bg-red {
        &:hover {
          background-color: #f9e8e9;
          box-shadow: rgba(255, 156, 165, 0.5) 0 25px 20px -20px;
        }
      }

      .dashboard {
        margin: 10vh 2.5vw;
        width: 250px;
        height: 150px;
        border-radius: 15px;
        transition: all 0.2s ease-in-out;

        &:hover {
          transform: translateY(-5px);
        }

        .d-title {
          color: $grey;
          font-size: 16px;
          font-weight: bold;

          @media (max-width: 1200px) {
            font-size: 12px;
          }
        }

        .d-value {
          color: #3c4044;
          font-size: 28px;
          font-weight: bold;

          @media (max-width: 1200px) {
            font-size: 20px;
          }
        }
      }

      @media (max-width: 1200px) {
        margin-top: 80px;
      }
    }

    .footer {
      padding: 0 5vw;
      position: fixed;
      width: 100%;
      bottom: 3vh;
      font-size: 14px;
      line-height: 20px;
      color: $grey;

      .footer-container {
        border-top: 1px solid #a9a9a9;
        padding-top: 20px;

        .copyright {
          position: relative;
          margin-left: 2vw;

          .logo {
            margin-top: -14px;
            width: 100px;
            opacity: 1;
            // transition: all 0.2s ease-in-out;

            &:hover {
              opacity: 0;
            }

            @media (max-width: 768px) {
              margin-top: 10px;

              &:hover {
                opacity: 1;
              }
            }
          }

          .logo-hover {
            width: 100px;
            position: absolute;
            top: -5.5px;
            left: 8px;
            opacity: 0;
            transition: all 0.2s ease-in-out;

            &:hover {
              opacity: 1;
            }
          }
        }

        .terms {
          margin-right: 2vw;

          .link {
            cursor: pointer;
            color: $grey;

            &:hover {
              color: $blue;
            }
          }
        }
      }

      @media (max-width: 768px) {
        font-size: 12px;
      }
    }
  }
</style>
