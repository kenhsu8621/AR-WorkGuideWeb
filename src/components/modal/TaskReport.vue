<template>
  <TemplateModal :width="40">
    <template v-slot:default>
      <div class="m-modal-title">{{ $t("TASK.TASK_REPORT") }}</div>
      <div class="m-modal-body my-3">
        <div class="switch">
          <button class="left" :class="{ 'btn-active': isCurrent }" @click="getTaskList(true)">
            {{ $t("TASK.THIS_MONTH") }}
          </button>
          <button class="right" :class="{ 'btn-active': !isCurrent }" @click="getTaskList(false)">
            {{ $t("TASK.CUSTOMIZED") }}
          </button>
          <date-picker
            v-model="timeRange"
            class="date-picker-style ml-3"
            v-if="!isCurrent"
            range
            value-type="format"
            format="YYYY/MM/DD"
            :clearable="false"
            @change="updateRange(timeRange)"
          ></date-picker>
        </div>

        <BarChart ref="chart" :style="chartStyles"></BarChart>
      </div>
      <div class="m-modal-footer text-center">
        <b-button class="btn-cancel" @click="cancel">{{ $t("GENERAL.CLOSE") }}</b-button>
      </div>
    </template>
  </TemplateModal>
</template>
<script>
  import TemplateModal from "@/components/modal/TemplateModal";
  import BarChart from "@/components/BarChart";
  import DatePicker from "vue2-datepicker";
  import "vue2-datepicker/index.css";
  import { GetDateString } from "@/utils/date";

  export default {
    components: {
      TemplateModal,
      BarChart,
      DatePicker,
    },
    props: {
      selectedData: Object,
    },
    data: () => ({
      timeRange: [],
      beginTime: null,
      endTime: null,
      isCurrent: true,
    }),
    created() {
      let now = new Date();
      this.beginTime = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
      this.endTime = new Date(now.getFullYear(), now.getMonth() + 1, 0, 0, 0, 0);
      this.timeRange = [GetDateString(this.beginTime), GetDateString(this.endTime)];
      this.getTaskList(true);
    },
    methods: {
      ok() {
        this.$emit("ok");
      },

      cancel() {
        this.$emit("cancel");
      },

      updateRange(timeRange) {
        this.beginTime = timeRange[0];
        this.endTime = timeRange[1];
        this.getTaskList(false);
      },

      getTaskList(isCurrent) {
        let data = {};
        if (isCurrent) {
          data.start_time = this.beginTime.getTime();
          // 後一天00:00:00 -1
          data.end_time = this.endTime.getTime() + 24 * 60 * 60 * 1000 - 1;
        } else {
          let arr1 = this.timeRange[0].split("/").map((i) => parseInt(i));
          let arr2 = this.timeRange[1].split("/").map((i) => parseInt(i));
          // 第一天00:00:00
          let startTime = new Date(arr1[0], arr1[1] - 1, arr1[2], 0, 0, 0);
          // 後一天00:00:00 -1
          let endTime = new Date(arr2[0], arr2[1] - 1, arr2[2] + 1, 0, 0, 0);
          data.start_time = startTime.getTime();
          data.end_time = endTime.getTime() - 1;
        }

        this.apiGet("workflow/task_list", data).then(({ data }) => {
          this.isCurrent = isCurrent;
          this.$refs.chart.render(data.tasks);
        });
      },
    },
    computed: {
      chartStyles() {
        return {
          height: "30vh",
          width: "30vw",
          position: "relative",
          margin: "5vh 0 0 3vw",
          float: "left",
        };
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";
  .m-modal-title {
    color: #212529;
    font-size: 22px;
    font-weight: bold;
  }
  .m-modal-body {
    height: 40vh;

    .switch {
      .left,
      .right {
        width: 100px;
        height: 38px;
        background-color: #fff;
        border: 1px solid #ccc;
        transition: all 0.2s ease-in-out;
      }

      .left {
        border-top-left-radius: 19px;
        border-bottom-left-radius: 19px;
      }

      .right {
        border-top-right-radius: 19px;
        border-bottom-right-radius: 19px;
      }

      .btn-active {
        color: #fff;
        background-color: $blue;
        border: 1px solid $blue;
      }
    }

    /deep/ .date-picker-style {
      input {
        height: 38px;
        border-radius: 19px;
      }
    }
  }
  .m-modal-footer {
    height: 32px;
    padding: 0 20%;
    margin: 20px 0;

    @media (max-width: 1200px) {
      height: 60px;
      margin: 30px 0;
    }

    .btn-cancel {
      width: 50%;
      height: 32px;
      padding: 0 12px;
      border-radius: 16px;
      color: $blue;
      background-color: #fff;
      border: 1px solid $blue;
      box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;

      @media (max-width: 1200px) {
        width: 100%;
        margin: 5px 0;
      }
    }
  }
</style>
