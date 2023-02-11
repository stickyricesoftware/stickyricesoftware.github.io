var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    myFunction(this);
  }
};
xhttp.open(
  "GET",
  "http://gardenschool.thormobile3.net/SE0148.xml?ms=" + Date.now(),
  true
);
xhttp.send();

function myFunction(xml) {
  console.log(xml.responseXML.all);
  console.log(xml.responseXML.all[03].innerHTML); //School Name
  console.log(xml.responseXML.all[23].innerHTML); //ad
  console.log(xml.responseXML.all[24].innerHTML); //di
  console.log(xml.responseXML.all[25].innerHTML); //lhl
  console.log(xml.responseXML.all[26].innerHTML); //fcc
  console.log(xml.responseXML.all[36].innerHTML); //isDataOld
}
