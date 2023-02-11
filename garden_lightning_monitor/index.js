var xhttp = new XMLHttpRequest();
const URL = "http://gardenschool.thormobile3.net/SE0148.xml?ms=" + Date.now()



xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    myFunction(this);
  }
};
xhttp.open(
  "GET",
  URL,
  true
);
xhttp.send();

//


function myFunction(xml) {
  console.log(xml.responseXML.all);
  const school = xml.responseXML.all[03].innerHTML;
  const ad = xml.responseXML.all[23].innerHTML;
  const di = xml.responseXML.all[24].innerHTML;
  const lhl = xml.responseXML.all[25].innerHTML;
  const fcc = xml.responseXML.all[26].innerHTML;
  const isDataOld = xml.responseXML.all[36].innerHTML;


  const para = document.createElement("p");
  para.innerText = `Name: ${school}
  Lhl: ${lhl}
  Di: ${di}
  Ad: ${ad}
  Fcc: ${fcc}
  ${URL}
  `;
  document.getElementById("card").appendChild(para);


  if (di == 0 ){ document.getElementById("card").style.backgroundColor = "";}
  if (di > 0 && di < 2.4 ){ document.getElementById("card").style.backgroundColor = "grey";}
  if (di > 2.3 && di < 3.0 ){ document.getElementById("card").style.backgroundColor = "yellow";}
  if (di > 2.9 ){ document.getElementById("card").style.backgroundColor = "red";}

}






