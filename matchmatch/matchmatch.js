//Get Game Section
const section = document.querySelector("section");
const gameTime = 5;
var matched = 0
var turns = 0;

//Get score indicator and set score to 0
const playerScoreCount = document.querySelector("#playerScore");
let playerScore = 0;
playerScoreCount.textContent = playerScore;

//Get countdown
const timeRemainingCounter = document.querySelector("#timeRemaining");
let timeRemaining = gameTime;
timeRemainingCounter.textContent = gameTime;

//Get start/win/lose overlays
let overlays = Array.from(document.getElementsByClassName("overlay-text"));
overlays.forEach((overlay) => {
  overlay.addEventListener("click", () => {
    overlay.classList.remove("visible");
    start();
  });
});

const initialiseCards = () => [
  { imgSrc: "./clubs/t1.svg", name: "MUN" },
  { imgSrc: "./clubs/t2.svg", name: "LEE" },
  { imgSrc: "./clubs/t3.svg", name: "ARS" },
  { imgSrc: "./clubs/t4.svg", name: "NEW" },
  { imgSrc: "./clubs/t6.svg", name: "TOT" },
  { imgSrc: "./clubs/t7.svg", name: "AVL" },
  { imgSrc: "./clubs/t8.svg", name: "CHE" },
  { imgSrc: "./clubs/t11.svg", name: "EVE" },
  { imgSrc: "./clubs/t13.svg", name: "LEI" },
  { imgSrc: "./clubs/t14.svg", name: "LIV" },
  { imgSrc: "./clubs/t20.svg", name: "SOU" },
  { imgSrc: "./clubs/t21.svg", name: "WHU" },
  { imgSrc: "./clubs/t31.svg", name: "CRY" },
  { imgSrc: "./clubs/t36.svg", name: "BHA" },
  { imgSrc: "./clubs/t39.svg", name: "WOL" },
  { imgSrc: "./clubs/t43.svg", name: "MCI" },
  { imgSrc: "./clubs/t45.svg", name: "NOR" },
  { imgSrc: "./clubs/t57.svg", name: "WAT" },
  { imgSrc: "./clubs/t90.svg", name: "BUR" },
  { imgSrc: "./clubs/t94.svg", name: "BRE" },
];
const createBoard = () => {
  //Get array and create matching pairs of each image
  const array1 = initialiseCards();
  const array2 = initialiseCards();
  const array3 = array1.concat(array2);
  return array3;
  // const array4 = array3.concat(array3);
  // return array4;
};

const randomise = () => {
  const cardData = createBoard();
  cardData.sort(() => Math.random() - 0.5);
  return cardData;
};

const cardGenerator = () => {
  //Randomise array
  const cardData = randomise();
  // Generate the HTML
  cardData.forEach((item) => {
    const card = document.createElement("div");
    const face = document.createElement("img");
    const back = document.createElement("div");
    card.classList = "card";
    face.classList = "face";
    back.classList = "back";
    //Attach info to the cards
    face.src = item.imgSrc;
    card.setAttribute("name", item.name);
    //Attach the cards to the section
    section.appendChild(card);
    card.appendChild(face);
    card.appendChild(back);

    card.addEventListener("click", (e) => {
      card.classList.toggle("toggleCard");
      checkCards(e);
    });
  });
};

//Check Cards
const checkCards = (e) => {
  const clickedCard = e.target;
  clickedCard.classList.add("flipped");
  const flippedCards = document.querySelectorAll(".flipped");
  turns++;
  //Logic
  if (flippedCards.length === 2) {
    if (
      flippedCards[0].getAttribute("name") ===
      flippedCards[1].getAttribute("name")
    ) {
      flippedCards.forEach((card) => {
        card.classList.remove("flipped");
        card.style.pointerEvents = "none";
      });
      playerScore++;
      playerScoreCount.textContent = playerScore;
    } else {
      flippedCards.forEach((card) => {
        card.classList.remove("flipped");
        setTimeout(() => card.classList.remove("toggleCard"), 1000);
      });
    }
  }
};

//Start
const start = () => { 
  turns = 0;
  timeRemainingCounter.textContent = gameTime;
  cardGenerator();
  var countdown = setInterval(function () {
    const toggleCard = document.querySelectorAll(".toggleCard");
    timeRemaining--;
    timeRemainingCounter.textContent = timeRemaining;
    if (timeRemaining <= 0) {
      clearInterval(countdown);
      setTimeout(() => {
        document.getElementById("game-over-text").classList.add("visible");
        shareScore();
        timeRemaining = gameTime;
      }, 1000);
    }
    //Run check to see if game has been won
    if (toggleCard.length === 40) {
      clearInterval(countdown);
      setTimeout(() => {
        document.getElementById("game-over-text").classList.add("visible");
        timeRemaining = gameTime;
        shareScore();
      }, 1000);
    }
  }, 1000);

  let cardData = randomise();
  let faces = document.querySelectorAll(".face");
  let cards = document.querySelectorAll(".card");
  section.style.pointerEvents = "none";
  cardData.forEach((item, index) => {
    cards[index].classList.remove("toggleCard");
    //Randomise
    setTimeout(() => {
      cards[index].style.pointerEvents = "all";
      faces[index].src = item.imgSrc;
      cards[index].setAttribute("name", item.name);
      section.style.pointerEvents = "all";
    }, 1000);
  });

  playerScore = 0;
  playerScoreCount.textContent = playerScore;
};

function shareScore() {
  var matched = 0;  
  document.getElementById("modal-text").innerHTML = ""
  const allCards = Array.from(document.getElementsByClassName("card"));
  let array = [];
  allCards.forEach((item) => {
    if (item.style.pointerEvents == "none") {
      array.push("🟩");
      matched++;
    } else {
      array.push("🟥");
    }
  });
  var a = array[0] + array[1] + array[2] + array[3] + array[4];
  var b = array[5] + array[6] + array[7] + array[8] + array[9];
  var c = array[10] + array[11] + array[12] + array[13] + array[14];
  var d = array[15] + array[16] + array[17] + array[18] + array[19];
  var e = array[20] + array[21] + array[22] + array[23] + array[24];
  var f = array[25] + array[26] + array[27] + array[28] + array[29];
  var g = array[30] + array[31] + array[32] + array[33] + array[34];
  var h = array[35] + array[36] + array[37] + array[38] + array[4];

  var show = a + "\n" + b + "\n" + c + "\n" + d + "\n" + e + "\n" + f + "\n" + g + "\n" + h;
  console.log("I got " + matched + "/" + allCards.length);
  console.log("Turns " + turns);
  console.log(show);

  // When the user clicks on the button, open the modal
  line1 = document.createElement('p')
  line1Squares = document.createTextNode(a)
  line1.appendChild(line1Squares);

  line2 = document.createElement('p')
  line2Squares = document.createTextNode(b)
  line2.appendChild(line2Squares);

  line3 = document.createElement('p')
  line3Squares = document.createTextNode(c)
  line3.appendChild(line3Squares);


  line4 = document.createElement('p')
  line4Squares = document.createTextNode(d)
  line4.appendChild(line4Squares);

  line5 = document.createElement('p')
  line5Squares = document.createTextNode(e)
  line5.appendChild(line5Squares);

  line6 = document.createElement('p')
  line6Squares = document.createTextNode(f)
  line6.appendChild(line6Squares);


  line7 = document.createElement('p')
  line7Squares = document.createTextNode(g)
  line7.appendChild(line7Squares);


  line8 = document.createElement('p') 
  line8Squares = document.createTextNode(h)
  line8.appendChild(line8Squares);
  


 
  
  

  // squares = document.createTextNode(show)

  
  text = document.createTextNode("I got " + matched + "/40 in " + turns + " taps") 
  // scoreDiv.appendChild(text);  
  
  document.getElementById("modal-text").appendChild(line1)
  document.getElementById("modal-text").appendChild(line2)
  document.getElementById("modal-text").appendChild(line3)
  document.getElementById("modal-text").appendChild(line4)
  document.getElementById("modal-text").appendChild(line5)
  document.getElementById("modal-text").appendChild(line6)
  document.getElementById("modal-text").appendChild(line7)
  document.getElementById("modal-text").appendChild(line8)
  document.getElementById("modal-text").appendChild(text)

  var x = document.createElement("BUTTON");
  x.classList.add("shareButton")
  var t = document.createTextNode("Share");
  x.appendChild(t);
  document.getElementById("modal-text").appendChild(x);
  
  
  // x.addEventListener("click", (e) => {
  //   console.log(navigator.canShare())
  //   console.log(e)
  //   alert('sharing...')
  // });

  document.querySelector(".shareButton").addEventListener("click", (event) => {
    // Fallback, Tries to use API only
    // if navigator.share function is
    // available
    if (navigator.share) {
      navigator
        .share({
          title: "Match Match",
          text: text,  
          url: 'https://bit.ly/39Bzg6x',
        })
        .then(() => {
          console.log("Thanks for sharing!");
          gtag('event', 'Player', {
            'Clicked:' : 'Share Button'
          });
        })
        .catch((err) => {
          // Handle errors, if occured
          console.log("Error while using Web share API:");
          console.log(err);
        });
    } else {
      // Alerts user if API not available
      alert("Browser doesn't support this API !");
    }
  });
  modal.style.display = "block";
    
}



  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");
  
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  
  
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }
  
