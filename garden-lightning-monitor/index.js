var xhttp = new XMLHttpRequest();
const URL = "https://custom-proxy.onrender.com/http://gardenschool.thormobile3.net/SE0148.xml?ms=" + Date.now()


xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    myFunction(this);
  }
};
xhttp.open(
  "GET",
  URL,
  true,

);
xhttp.send();


function myFunction(xml) {
  console.log(xml.responseXML.all);
  const school = xml.responseXML.all[03].innerHTML;
  const ad = xml.responseXML.all[23].innerHTML;
  const di = xml.responseXML.all[24].innerHTML;
  const lhl = xml.responseXML.all[25].innerHTML;
  const fcc = xml.responseXML.all[26].innerHTML;
  const isDataOld = xml.responseXML.all[36].innerHTML;  


  document.getElementById("school").innerHTML = school
  document.getElementById("lhl").innerHTML = lhl
  document.getElementById("di").innerHTML = di
  document.getElementById("ad").innerHTML = ad
  document.getElementById("fcc").innerHTML = fcc

  if (di < 0.1 ){ document.getElementById("card").style.backgroundColor = "7CEA9C";} //Green
  if (di > 0 && di < 2.4 ){ document.getElementById("card").style.backgroundColor = "797D81";} //Grey
  if (di > 2.3 && di < 3.0 ){ document.getElementById("card").style.backgroundColor = "CBA328";} //Yellow
  if (di > 2.9 ){ document.getElementById("card").style.backgroundColor = "red";} //Red

}





//https://coolors.co/b3001b-7cea9c-cba328-797d81-279af1
