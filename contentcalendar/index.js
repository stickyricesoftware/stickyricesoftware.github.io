function myFunction1() {
    const s1 = document.getElementById("s");
    const k1 = document.getElementById("k");
    const r1 = document.getElementById("r");
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    s1.style.borderBottom = "80px solid " + "#" + randomColor;
    k1.style.borderBottom = "80px solid " + "#" + randomColor;
    r1.style.borderBottom = "80px solid " + "#" + randomColor;
    console.log(randomColor);
  }
  function myFunction2() {
    const s1 = document.getElementById("s");
    const k1 = document.getElementById("k");
    const r1 = document.getElementById("r");
    s1.classList.add("rotate");
    k1.classList.add("rotate");
    r1.classList.add("rotate");
    setTimeout(()=> {
      s1.classList.remove("rotate");
      k1.classList.remove("rotate");
      r1.classList.remove("rotate");
    }, 5000);
  }
  function myFunction3() {
    const d = document.getElementById("box");
    const s1 = document.getElementById("letters");
    const k1 = document.getElementById("letterk");
    const r1 = document.getElementById("letterr");
    if (d.style.backgroundColor == "black") {
      d.style.backgroundColor = "whiteSmoke";
      s1.style.color = "whiteSmoke"  
      k1.style.color = "whiteSmoke" 
      r1.style.color = "whiteSmoke"         
    } else {
      d.style.backgroundColor = "black";
      s1.style.color = "black"  
      k1.style.color = "black" 
      r1.style.color = "black"  
    }
  }
  function myFunction4() {
    const response = [
      "Who pressed that? Was it you, K?",
      "I know it was you, R!",
      "The button literally says 'Do Not Press'",
      "Absolutely shameless",
      "Back to work please",
      "Seriously? Again?",
    ];
    alert(response[Math.floor(Math.random() * 5)]);
  }