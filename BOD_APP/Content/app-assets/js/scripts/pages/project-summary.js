/*=========================================================================================
    File Name: project-summary.js
    Description: Project Summary Page JS
    ----------------------------------------------------------------------------------------
    Item Name: Modern Admin - Clean Bootstrap 4 Dashboard HTML Template
    Author: PIXINVENT
    Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

var $primary = "#666ee8",
  $secondary = "#6B6F82",
  $success = "#1C9066",
  $info = "#1E9FF2",
  $warning = "#FF9149",
  $danger = "#FF4961";

var $themeColor = [$primary, $success, $info, $warning, $danger, $secondary,$primary, $success, $info, $warning, $danger, $secondary];

$(document).ready(function() {
  var pieSimpleChart = {
    chart: {
      height: 350,
      type: "pie"
    },
    labels: ["Jan", "Feb", "Mar", "Apr", "May","June", "July","Aug", "Sept", "Oct", "Nov", "Dec"],
    series: [44, 55, 13, 43, 22,44, 55, 13, 43, 22,14,50],
    responsive: [
      {
        breakpoint: 1200,
        options: {
          chart: {
            width: 300
          },
          legend: {
            position: "bottom"
          }
        }
      },
      {
        breakpoint: 768,
        options: {
          chart: {
            width: 520
          },
          legend: {
            position: "bottom"
          }
        }
      },
      {
        breakpoint: 620,
        options: {
          chart: {
            width: 450
          },
          legend: {
            position: "bottom"
          }
        }
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 250
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ],
    fill: {
      colors: $themeColor
    }
  };
  // Initializing Pie Simple Chart
  var pie_simple_chart = new ApexCharts(
    document.querySelector("#task-pie-chart1"),
    pieSimpleChart
  );
  pie_simple_chart.render();


 var pieSimpleChart2 = {
    chart: {
      height: 350,
      type: "pie"
    },
    labels: ["Grant", "Matched", "Other","Loan", "InKind", "Interest","Other"],
    series: [44, 55, 13, 43, 22,44, 55 ],
    responsive: [
      {
        breakpoint: 1200,
        options: {
          chart: {
            width: 300
          },
          legend: {
            position: "bottom"
          }
        }
      },
      {
        breakpoint: 768,
        options: {
          chart: {
            width: 520
          },
          legend: {
            position: "bottom"
          }
        }
      },
      {
        breakpoint: 620,
        options: {
          chart: {
            width: 450
          },
          legend: {
            position: "bottom"
          }
        }
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 250
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ],
    fill: {
      colors: $themeColor
    }
  };
  // Initializing Pie Simple Chart
  var pie_simple_chart2 = new ApexCharts(
    document.querySelector("#task-pie-chart2"),
    pieSimpleChart2
  );
  pie_simple_chart2.render();
});
