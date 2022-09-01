<script>
  import { Bar } from "vue-chartjs";

  export default {
    extends: Bar,
    data: () => ({
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                min: 0,
                callback: function(value) {
                  if (value % 1 === 0) {
                    return value;
                  }
                },
              },
            },
          ],
        },
      },
      labelList: [],
      // dataList_1: [],
      // dataList_2: [],
    }),
    created() {
      this.userinfo = this.$cookies.get("user") || {};
      this.userAccount = this.userinfo.account;
    },
    mounted() {
      this.render([]);
    },

    methods: {
      render(taskList) {
        let selfTasks = taskList.filter((t) => t.creator_account == this.userAccount);
        let selfFinishedTasks = selfTasks.filter((t) => t.finished_time);
        let allFinishedTasks = taskList.filter((t) => t.finished_time);

        let data1 = [selfTasks.length, taskList.length];
        let data2 = [selfFinishedTasks.length, allFinishedTasks.length];
        this.renderChart(
          {
            labels: [this.$t("TASK.YOUR_TASK"), this.$t("TASK.ALL_TASK")],
            datasets: [
              {
                label: this.$t("TASK.TASK_AMOUNT"),
                backgroundColor: "#2173c9",
                data: data1,
              },
              {
                label: this.$t("TASK.COMPLETED_AMOUNT"),
                backgroundColor: "#72b5e8",
                data: data2,
              },
            ],
          },
          this.options
        );
      },
    },
  };
</script>
