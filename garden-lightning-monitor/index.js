var xhttp = new XMLHttpRequest();
var xhttp1 = new XMLHttpRequest();
const URL =
  "https://custom-proxy.onrender.com/http://gardenschool.thormobile3.net/SE0148.xml?ms=" +
  Date.now();

  console.log(Date.now() + "    " + (Date.now()-300000))
//300000 = 5 minutes

xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    myFunction(this);
  }
};
xhttp.open("GET", URL, true);
xhttp.send();



function myFunction(xml) {
  console.log(xml.responseXML.all);
  const school = xml.responseXML.all[03].innerHTML;
  const ad = xml.responseXML.all[23].innerHTML;
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
    document.getElementById("tab-large").style.backgroundColor = "#7CEA9C";
    document.getElementById("status-text").innerHTML = "ALL CLEAR";
  } //Green
  if (di > 0 && di < 2.4) {
    document.getElementById("tab-large").style.backgroundColor = "#797D81";
    document.getElementById("status-text").innerHTML = "CAUTION";
  } //Grey
  if (di > 2.3 && di < 3.0) {
    document.getElementById("tab-large").style.backgroundColor = "#CBA328";
    document.getElementById("status-text").innerHTML = "WARNING";
  } //Yellow
  if (di > 2.9) {
    document.getElementById("tab-large").style.background = "#B3001B";
    document.getElementById("status-text").innerHTML = "RED ALERT";
  } //Red

  document.getElementById("bar-data").style.width = (ad*10) + "%"
  
}