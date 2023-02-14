const d = new Date();
let day = d.getDay();

//Only run on Fridays
if (day == 5) {
  var xhttp = new XMLHttpRequest();
  const URL =
    "https://custom-proxy.onrender.com/http://gardenschool.thormobile3.net/SE0148.xml?ms=" +
    Date.now();
  //600000 = 10 minutes
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      displayData(this);
    }
  };
  xhttp.open("GET", URL, true);
  xhttp.send();
  function displayData(xml) {
    console.log(xml.responseXML.all);
    const school = xml.responseXML.all[03].innerHTML;
    const ad = xml.responseXML.all[23].innerHTML;
    //const ad = 1

    const di = xml.responseXML.all[24].innerHTML;
    const lhl = xml.responseXML.all[25].innerHTML;
    const fcc = xml.responseXML.all[26].innerHTML;
    const isDataOld = xml.responseXML.all[36].innerHTML;
    document.getElementById("school").innerText = school;
    document.getElementById("lhl").innerText = lhl;
    document.getElementById("di").innerText = di;
    document.getElementById("ad").innerText = ad;
    document.getElementById("fcc").innerText = fcc;

    if (di < 0.1) {
      //document.getElementById("status-tab").style.background = "#7CEA9C";
      document.getElementById("status-tab").style.backgroundImage =
        "linear-gradient(to right, #5da92f, #9bd46a)";
      document.getElementById("status-text").innerHTML = "ALL CLEAR";
    } //Green
    if (di > 0 && di < 2.4) {
      //document.getElementById("status-tab").style.background = "#797D81";
      document.getElementById("status-tab").style.backgroundImage =
        "linear-gradient(to right, #000000, #797D81)";
      document.getElementById("status-text").innerHTML = "CAUTION";
    } //Grey
    if (di > 2.3 && di < 3.0) {
      //document.getElementById("status-tab").style.background = "#CBA328";
      document.getElementById("status-tab").style.backgroundImage =
        "linear-gradient(to right, #ec8235, #f4d941)";

      document.getElementById("status-text").innerHTML = "WARNING";
    } //Yellow
    if (di > 2.9) {
      //document.getElementById("status-tab").style.background = "#B3001B";
      document.getElementById("status-tab").style.backgroundImage =
        "linear-gradient(to right, #943c22, #e01f2d)";

      document.getElementById("status-text").innerHTML = "RED ALERT";
    } //Red
    if (ad == 0) {
    }

    document.getElementById("bar-data").style.width = 100 - ad * 10 + "%";
    document.getElementById("bar-text").innerHTML =
      'When the bar is completely green, an "All Clear" status will be signaled';

    document.getElementById("lhl-info").addEventListener("click", function () {
      alert(
        "Percentage chance of lightning/amount of energy within your outer range (12 mile default)"
      );
    });
    document.getElementById("di-info").addEventListener("click", function () {
      alert(
        "Percentage chance of lightning/amount of energy within your inner range (2 mile default)"
      );
    });
    document.getElementById("ad-info").addEventListener("click", function () {
      alert(
        "Time since last discharge/lightning strike. Will count down from 10. At zero, an 'All Clear' will be signaled"
      );
    });
    document.getElementById("fcc-info").addEventListener("click", function () {
      alert(
        "This represents the number of discharges within outer range (12 mile default)"
      );
    });
    document
      .getElementById("status-tab")
      .addEventListener("click", function () {
        alert(
          "You are viewing Thor Guard Lightning Prediction data remotely. The Thor Guard Lightning Prediction data represented is meant only for a specific range. Do not interpret this data as life saving or life threatening since your location relative to the specified Thor Guard range is unknown to this program"
        );
      });
  }
} else {
  document.getElementById("progress").remove();
  document.getElementById("data-section").remove();

  document.getElementById("status-text").innerHTML = '<a href="http://gardenschool.thormobile3.net/thormap/">This only works on Fridays!</a>'

    
    

}
