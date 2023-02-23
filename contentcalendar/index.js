const quotes = [
  "Louis, I think this is the beginning of a beautiful content idea. - Casablanca (1942)",
  "Show me the content idea! - Jerry Maguire (1996)",
  "You're gonna need a bigger content idea. - Jaws (1948)",
  "Keep your friends close, but your content ideas closer. - The God Father Part II (1974)",
  "Say 'hello' to my little IG post! - Scarface (1983)",
  "A content idea. Shaken, not stirred. - Goldfinger (1964)",
  "I feel the need—the need for content! - Top Gun (1986)",
  "Nobody puts Content in a corner. - Dirty Dancing (1987)",
  "A boy's best friend is his content idea. - Psycho (1960)"
]

const q = document.getElementById("quote")
const randomQuote = document.createElement("p");
randomQuote.innerText = quotes[Math.floor(Math.random()*quotes.length)];

q.appendChild(randomQuote);


const events = [
  {
    "day": "01",
    "month": "Jan",
    "type": "d",
    "name": "pancake day",
    "education": "blah blah edu",
    "promo": "blah blah promo",
    "entertainment": "blah blah entertain",
  },
  {
    "day": "01",
    "month": "Jan",
    "type": "d",
    "name": "bob day",
    "education": "blah blah edu",
    "promo": "blah blah promo",
    "entertainment": "blah blah entertain",
  },
  {
    "day": "01",
    "month": "Jan",
    "type": "d",
    "name": "skr day",
    "education": "blah blah edu",
    "promo": "blah blah promo",
    "entertainment": "blah blah entertain",
  },
  {
    "day": "01",
    "month": "Jan",
    "type": "d",
    "name": "ken day",
    "education": "blah blah edu",
    "promo": "blah blah promo",
    "entertainment": "blah blah entertain",
  },
  {
    "day": "01",
    "month": "Jan",
    "type": "m",
    "name": "haribo month",
    "education": "blah blah edu",
    "promo": "blah blah promo",
    "entertainment": "blah blah entertain",
  },
  {
    "day": "01",
    "month": "Jan",
    "type": "d",
    "name": "raquel day",
    "education": "blah blah edu",
    "promo": "blah blah promo",
    "entertainment": "blah blah entertain",
  },
  {
    "day": "01",
    "month": "Jan",
    "type": "m",
    "name": "chocoloate month",
    "education": "blah blah edu",
    "promo": "blah blah promo",
    "entertainment": "blah blah entertain",
  },
  {
    "day": "01",
    "month": "Jan",
    "type": "w",
    "name": "cat week",
    "education": "blah blah edu",
    "promo": "blah blah promo",
    "entertainment": "blah blah entertain",
  },
]


events.forEach(e => {
  if(e.type === "d"){
const days = document.getElementById("days")
const card = document.createElement("div");
card.innerText = e.name;
card.className += "card";
days.appendChild(card);


  }

  
});

events.forEach(e => {
if(e.type === "w"){
const weeksmonths = document.getElementById("weeks")
const card = document.createElement("div");
card.innerText = e.name;
card.className += "card";
weeksmonths.appendChild(card);


  }

  
});

events.forEach(e => {
  if(e.type === "m"){
  const weeksmonths = document.getElementById("months")
  const card = document.createElement("div");
  card.innerText = e.name;
  card.className += "card";
  weeksmonths.appendChild(card);
  
  
    }
  
    
  });
