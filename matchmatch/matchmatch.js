const section = document.querySelector("section");
const playerLivesCount = document.querySelector("#playerLivesCount");
let playerLives = 40;

playerLivesCount.textContent = playerLives;

let overlays = Array.from(document.getElementsByClassName("overlay-text"));

overlays.forEach((overlay) => {
  overlay.addEventListener("click", () => {
    overlay.classList.remove("visible");
  });
});

const getData = () => [
  // { imgSrc: "./images/122-200x200.jpg", name: "bridge" },
  // { imgSrc: "./images/261-200x200.jpg", name: "sand" },
  // { imgSrc: "./images/396-200x200.jpg", name: "escalator" },
  // { imgSrc: "./images/485-200x200.jpg", name: "beach" },
  // { imgSrc: "./images/492-200x200.jpg", name: "field" },
  // { imgSrc: "./images/515-200x200.jpg", name: "plane" },
  // { imgSrc: "./images/630-200x200.jpg", name: "forest" },
  // { imgSrc: "./images/678-200x200.jpg", name: "mountains" },
  // { imgSrc: "./images/737-200x200.jpg", name: "city" },
  // { imgSrc: "./images/818-200x200.jpg", name: "statue" },
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
const mergedData = () => {
  const array1 = getData();
  const array2 = getData();
  const array3 = array1.concat(array2);
  return array3;
  // const array4 = array3.concat(array3);
  // return array4;
};

const randomise = () => {
  const cardData = mergedData();
  cardData.sort(() => Math.random() - 0.5);
  return cardData;
};

const cardGenerator = () => {
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
  const toggleCard = document.querySelectorAll(".toggleCard");

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
    } else {
      flippedCards.forEach((card) => {
        card.classList.remove("flipped");
        setTimeout(() => card.classList.remove("toggleCard"), 1000);
      });
      playerLives--;

      playerLivesCount.textContent = playerLives;
      if (playerLives === 0) {
        document.getElementById("game-over-text").classList.add("visible");
        restart();
        //restart("Try again");
      }
    }
  }
  //Run check to see if game has been won
  if (toggleCard.length === 40) {
    setTimeout(() => {
      document.getElementById("victory-text").classList.add("visible");
      restart();
    }, 1000);

    //restart("You won!!");
  }
};

//Restart
const restart = () => {
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
  playerLives = 40;
  playerLivesCount.textContent = playerLives;
  //setTimeout(() => window.alert(text), 100);
};

cardGenerator();
//
