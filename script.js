const jsonFields = [
  "connType",
  "packageName",
  "addOnStartTime",
  "addOnEndTime",
  "cYear",
  "cMonth",
  "uploadByte",
  "downloadByte",
  "totalByte",
  "Sub.SubscriberIdentity",
  "QoSProfile.Name",
  "CS.GatewayAddress",
  "CS.GatewayName",
  "CS.UserIdentity",
  "CS.SessionIPv4",
  "Sub.DataPackage",
  "CREATE_TIME",
  "LAST_UPDATE_TIME",
  "ACTIVE_PCC_RULE_NAMES",
  "CS.SessionID"
];

const statsDiv = document.getElementsByClassName("stats")[0];

const handleSubmit = () => {
  document.getElementById("loader").style.display = "block";
  document.getElementById("pie-chart").style.display = "none";
  loadChart(document.getElementById("subscriberCodeInput").value);
}

const convert = (netdata) => {
  return netdata / 1000 > 1000
    ? (netdata / 1000000).toFixed(2) + " TB"
    : (netdata / 1000).toFixed(2) + " GB";
}

const loadChart = (subscriberCode) => {
  fetch("fetcher.php?sid=" + subscriberCode)
    .then(response => {
      if (response.status !== 200) {
        console.log(
          "Looks like there was a problem. Status Code: " + response.status
        );
        return;
      }
      response.json().then(data => {
        switch (data[0].Msg) {
          case "SUCCESS":
            const usage = JSON.parse(data[0].usage);
            const downloaded = usage[0].curretUsage.downloadOctets;
            const uploaded = usage[0].curretUsage.uploadOctets;
            const left = usage[0].balance.totalOctets;
            const total = usage[0].HSQLimit.totalOctets;
            const packageName = data[0].packageName;

            if (pieChart != null) {
              pieChart.destroy();
            }
            // Chart.js render
            var pieChart = new Chart(document.getElementById("pie-chart"), {
              type: "doughnut",
              data: {
                labels: ["Left", "Downloaded", "Uploaded"],
                datasets: [
                  {
                    backgroundColor: ["#bc5090", "#ff6361", "#ffa600"],
                    data: [left, downloaded, uploaded]
                  }
                ]
              },
              options: {
                plugins: {
                  labels: {
                    render: "percentage",
                    fontColor: ["white", "white", "white"],
                    precision: 1
                  }
                },
                title: {
                  display: true,
                  text: "Asianet Broadband Usage (Current Month)"
                },
                responsive: true,
                tooltips: {
                  callbacks: {
                    label: function(tooltipItem, data) {
                      return (
                        " " +
                        data.labels[tooltipItem.index] +
                        ": " +
                        (
                          data.datasets[0].data[tooltipItem.index] / 1000
                        ).toFixed(1) +
                        " GB"
                      );
                    }
                  }
                }
              }
            });
            document.getElementById("loader").style.display = "none";
            document.getElementById("pie-chart").style.display = "block";
            statsDiv.innerHTML = "<table><tr><td align='right'>Downloaded : </td> <td><span class='bg-color'>"+convert(downloaded)+"</span></td></tr><tr><td align='right'>Uploaded : </td><td><span class='bg-color'>"+convert(uploaded)+"</span></td></tr><tr><td align='right'>Remaining : </td><td><span class='bg-color'>"+convert(left)+"</span></td></tr><tr><td align='right'>Total : </td><td><span class='bg-color'>" +convert(total)+"</span></td></tr><tr><td>Package Name :</td><td><span class='bg-color'>"+packageName+"</span></td></tr></table>";
            break;
          case "Invalid Subscriber Code":
            document.getElementById("loader").style.display = "none";
            alert("Invalid Subscriber Code.");
            break;
        }
      });
    })
    // Handle fetch error
    .catch(function(err) {
      console.log("Fetch Error :-S", err);
    });
}
