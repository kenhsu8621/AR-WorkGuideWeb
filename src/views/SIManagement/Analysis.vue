<template>
  <div class="analysis">
    <div class="upper-section">
      <b-form-select
        v-model="selectedEnterprise"
        :options="enterpriseList"
        class="select-component ml-3 my-4"
        @change="getEnterprisePeriodCallRecord(selectedEnterprise)"
      ></b-form-select>
      <date-picker
        v-model="timeRange"
        range
        value-type="format"
        format="YYYY-MM-DD"
        :clearable="false"
        @change="updateRange(timeRange)"
        class="m-date-picker ml-3 my-4 float-left"
      ></date-picker>
      <div class="float-right mr-3 my-4">資料更新時間：2021/12/30 12:00</div>
    </div>
    <div class="lower-section">
      <LineChart :styles="myStyles" :analysisData="analysisData"></LineChart>
      <BarChart :styles="myStyles" :analysisData="analysisData"></BarChart>
    </div>
  </div>
</template>

<script>
  import LineChart from "./component/LineChart";
  import BarChart from "./component/BarChart";
  import DatePicker from "vue2-datepicker";
  import "vue2-datepicker/index.css";

  export default {
    components: {
      DatePicker,
      LineChart,
      BarChart,
    },
    data: () => ({
      enterpriseList: [{ value: 0, text: "所有企業" }],
      selectedEnterprise: 0,
      analysisData: [],
      timeRange: ["2021-01-01", "2021-09-01"],
      beginTime: null,
      endTime: null,
    }),
    mounted() {
      this.getEnterpriseList();
    },
    methods: {
      getEnterprisePeriodCallRecord(code) {
        let data = {
          code: code == 0 ? null : code,
          begin_time: this.beginTime,
          end_time: this.endTime,
        };
        this.apiGet("si/enterprise_period_call_record", data).then(({ data }) => {
          this.analysisData = data.list;
          console.log(this.analysisData);
        });
      },
      getEnterpriseList() {
        this.apiGet("si/enterprise_list").then(({ data }) => {
          for (let i = 0; i < data.length; i++) {
            this.enterpriseList.push({ value: data[i].code, text: data[i].name });
          }
        });
      },
      updateRange(timeRange) {
        this.beginTime = timeRange[0];
        this.endTime = timeRange[1];
      },
    },
    computed: {
      myStyles() {
        return {
          height: "300px",
          width: "40vw",
          position: "relative",
          margin: "75px 0 0 1rem",
          float: "left",
        };
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";
  .analysis {
    .upper-section {
      padding-left: 100px;
      .select-component {
        float: left;
        width: 300px;
        background-color: #fff;
        border: 1px solid #ccc;
        background-image: linear-gradient(45deg, transparent 50%, $grey 60%),
          linear-gradient(135deg, $grey 40%, transparent 50%) !important;
        background-position: calc(100% - 17px) 14px, calc(100% - 10px) 14px, 100% 0;
        background-size: 7px 7px, 7px 7px;
        background-repeat: no-repeat;
        -webkit-appearance: none;
        -moz-appearance: none;
        cursor: pointer;
        option {
          background-color: #fff;
          border: 1px solid #fff;
        }
      }
      .m-date-picker {
        width: 300px;
      }
    }
    .lower-section {
      position: absolute;
      top: 140px;
      left: 100px;
      width: 100%;
      padding: 0 30px;
    }
  }
  /deep/ input {
    height: 38px !important;
  }
</style>
