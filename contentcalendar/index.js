const quotes = [
  "Louis, I think this is the beginning of a beautiful content idea. - Casablanca (1942)",
  "Show me the content! - Jerry Maguire (1996)",
  "You're gonna need a bigger content idea. - Jaws (1948)",
  "Keep your friends close, but your content ideas closer. - The God Father Part II (1974)",
  "Say 'hello' to my little content idea! - Scarface (1983)",
  "A content idea. Shaken, not stirred. - Goldfinger (1964)",
  "I feel the need—the need for content! - Top Gun (1986)",
  "Nobody puts Content in a corner. - Dirty Dancing (1987)",
  "A boy's best friend is his content idea. - Psycho (1960)",
];

const q = document.getElementById("quote");
const randomQuote = document.createElement("p");
randomQuote.innerText = quotes[Math.floor(Math.random() * quotes.length)];

q.appendChild(randomQuote);

const events = [
  {
    id: 001,
    day: "01",
    month: "Jan",
    type: "d",
    name: "World Tapir Day",
    education:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
    promo:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
    entertainment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
  },
  {
    id: 002,
    day: "01",
    month: "Jan",
    type: "d",
    name: "Tell A Story Day",
    education:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
    promo:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
    entertainment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
  },
  {
    id: 003,
    day: "01",
    month: "Jan",
    type: "d",
    name: "Geologist Day",
    education:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
    promo:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
    entertainment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
  },
  {
    id: 004,
    day: "01",
    month: "Jan",
    type: "d",
    name: "National Tea Day",
    education:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
    promo:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
    entertainment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
  },
  {
    id: 005,
    day: "01",
    month: "Jan",
    type: "m",
    name: "Stress Awareness Month",
    education:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
    promo:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
    entertainment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
  },
  {
    id: 006,
    day: "01",
    month: "Jan",
    type: "w",
    name: "Go Diaper Free Week",
    education:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
    promo:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
    entertainment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
  },
  {
    id: 007,
    day: "01",
    month: "Jan",
    type: "w",
    name: "Coin Week",
    education:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
    promo:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
    entertainment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
  },
  {
    id: 008,
    day: "01",
    month: "Jan",
    type: "w",
    name: "National Stationery Week",
    education:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
    promo:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
    entertainment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
  },
  {
    id: 009,
    day: "01",
    month: "Jan",
    type: "m",
    name: "National Poetry Month",
    education:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
    promo:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
    entertainment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
  },
  {
    id: 010,
    day: "01",
    month: "Jan",
    type: "m",
    name: "National Jazz Appreciation Month",
    education:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
    promo:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
    entertainment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
  },
];

events.forEach((e) => {
  if (e.type === "d") {
    const days = document.getElementById("days");
    const card = document.createElement("div");
    card.innerText = e.name;
    card.setAttribute("id", e.id);
    card.className += "card";
    days.appendChild(card);
  }
});

events.forEach((e) => {
  if (e.type === "w") {
    const weeksmonths = document.getElementById("weeks");
    const card = document.createElement("div");
    card.innerText = e.name;
    card.setAttribute("id", e.id);
    card.className += "card";
    weeksmonths.appendChild(card);
  }
});

events.forEach((e) => {
  if (e.type === "m") {
    const weeksmonths = document.getElementById("months");
    const card = document.createElement("div");
    card.innerText = e.name;
    card.setAttribute("id", e.id);
    card.className += "card";
    weeksmonths.appendChild(card);
  }
});


document.querySelectorAll(".card").forEach(function (item) {
  item.addEventListener("click", function () {
    events.forEach((e) => {
      if (item.innerHTML === e.name) {
        console.log(e)
        const modal = document.getElementById("event-info")
        modal.innerHTML = ""
        modal.append(e.day + " " + e.month)
        modal.append("\n" + e.name)

        openModal();
      }
    });
  });
});

function openModal() {
  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  modal.style.display = "block";

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}
