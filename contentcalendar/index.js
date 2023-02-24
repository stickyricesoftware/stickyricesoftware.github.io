const quotes = [
  "Louis, I think this is the beginning of a beautiful content idea. - Casablanca (1942)",
  "Show me the content! - Jerry Maguire (1996)",
  "You're gonna need a bigger content idea. - Jaws (1948)",
  "Keep your friends close, but your content ideas closer. - The God Father Part II (1974)",
  "Say 'hello' to my little content idea! - Scarface (1983)",
  "A content idea. Shaken, not stirred. - Goldfinger (1964)",
  "I feel the need—the need for content! - Top Gun (1986)",
  "Nobody puts Content in a corner. - Dirty Dancing (1987)",
  "A boy's best friend is his content calendar. - Psycho (1960)",
  "I'm going to make him a content idea he can't refuse. - The God Father (1972)",
  "Reach for the content calendar!. - Toy Story (1995)",
  "All we have to decide is what to do with the content idea that is given to us. - The Fellowship of the Ring (2001)",

];

const q = document.getElementById("quote");
const randomQuote = document.createElement("p");
randomQuote.innerText = quotes[Math.floor(Math.random() * quotes.length)];
q.appendChild(randomQuote);

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];


var optionsDay = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var today  = new Date();

const dateDiv = document.getElementById("date");
const dateNow = document.createElement("p");
dateNow.innerText = today.toLocaleDateString("en-US", optionsDay)

dateDiv.appendChild(dateNow);

var optionsMonth = { month: 'long',};
document.getElementById("display-month").innerHTML = today.toLocaleDateString("en-US", optionsMonth); 


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
  {
    id: 011,
    day: "01",
    month: "Jan",
    type: "d",
    name: "World Cat Day",
    education:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
    promo:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
    entertainment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate.",
  },
  {
    id: 012,
    day: "01",
    month: "Jan",
    type: "d",
    name: "World Dog Day",
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
    card.className += " day";

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
    card.className += " week";

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
    card.className += " month";
    weeksmonths.appendChild(card);
  }
});

document.querySelectorAll(".card").forEach(function (item) {

    //item.style.backgroundImage="url(https://picsum.photos/200/300)"; // specify the image path here
  item.addEventListener("click", function () {    
    events.forEach((e) => {
      if (item.innerHTML === e.name) {
        const eventInfo = document.getElementById("event-info");
        const eventDescription = document.getElementById("event-description");
        const eventTitle = document.getElementById("event-title");
        const eventIdeas = document.getElementById("event-ideas");
        const ideaOption = document.getElementById("idea-option");
        eventInfo.innerHTML = "";
        eventDescription.innerHTML = "";
        eventTitle.innerHTML = "";
        eventIdeas.innerHTML = "";
        ideaOption.innerHTML = "";
        const promoButton = document.createElement("button");
        // promoButton.setAttribute("class", "material-icons");
        const eduButton = document.createElement("button");
        // eduButton.setAttribute("class", "material-icons");
        const entertainmentButton = document.createElement("button");
        // entertainmentButton.setAttribute("class", "material-icons");

        // promoButton.innerHTML = "paid";
        // eduButton.innerHTML = "menu_book";
        // entertainmentButton.innerHTML = "movie";
        promoButton.innerHTML = "💵";
        eduButton.innerHTML = "📚";
        entertainmentButton.innerHTML = "🎥";

        promoButton.onclick = function () {
          eventIdeas.innerHTML = "Promotional Idea: " + e.promo
        };
        eduButton.onclick = function () {
          eventIdeas.innerHTML = "Educational Idea: " + e.education
        };
        entertainmentButton.onclick = function () {
          eventIdeas.innerHTML = "Entertainment: " + e.entertainment
        };
        ideaOption.append(promoButton);
        ideaOption.append(eduButton);
        ideaOption.append(entertainmentButton);

        eventInfo.append(e.day + " " + e.month);
        eventDescription.append(
          e.name +
            " is Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Fames ac turpis egestas integer eget aliquet nibh. Venenatis urna cursus eget nunc scelerisque. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Aliquam purus sit amet luctus venenatis lectus magna. Tristique senectus et netus et malesuada fames. Nunc congue nisi vitae suscipit tellus mauris a. In egestas erat imperdiet sed. Euismod lacinia at quis risus sed vulputate."
        );
        eventTitle.append(e.name);
        openModal();
      }
    });


  });
});

function openModal() {
  var modal = document.getElementById("myModal");
  var span = document.getElementsByClassName("close")[0];
  modal.style.display = "block";
  span.onclick = function () {
    modal.style.display = "none";
  };
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}
