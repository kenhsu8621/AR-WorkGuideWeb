<script>
  import { Bar } from "vue-chartjs";

  export default {
    extends: Bar,
    props: {
      analysisData: Array,
    },
    data: () => ({
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
      labelList: [],
      dataList: [],
    }),
    mounted() {
      this.getDataSets();
      this.render();
    },

    methods: {
      render() {
        this.renderChart(
          {
            labels: this.labelList,
            datasets: [
              {
                label: "Dataset2",
                backgroundColor: "#ffb1c1",
                data: this.dataList,
              },
            ],
          },
          this.options
        );
      },
      getDataSets() {
        for (let i = 0; i < this.analysisData.length; i++) {
          this.labelList.push(this.analysisData[i].uuid);
          let value = Date.parse(this.analysisData[i].closed_time) - Date.parse(this.analysisData[i].created_time);

          //結束時間-開始時間的分鐘數 (取到整數)
          this.dataList.push(Math.floor(value / 1000 / 60));
        }
      },
    },
  };
</script>
