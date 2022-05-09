//console.warn("BBC NEWS | Mundo");
var articleNumber = 0;
const counter = document.getElementById("counter");

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Host": "bbc-news-mundo.p.rapidapi.com",
    "X-RapidAPI-Key": "5326a3a741msh8a7fd584a716b8bp10e0cejsn223b2338e2fe",
  },
};
var data;
fetch("https://bbc-news-mundo.p.rapidapi.com/news", options)
  .then((response) => response.json())
  .then((response) => {
    loadArticle(response, articleNumber);
    data = response;
    gtag("event", "User", {
      "Loaded news articles:": data.length,
    });
    console.log(data);
    const loader = document.getElementById("loader");
    loader.remove();
  })
  .catch((err) => console.error(err));

function loadArticle(articles, number) {

  const articleEN = document.getElementById('articleEN')
  articleEN.classList.add('hide')

  const summary = document.getElementById("summary");
  summary.innerText = articles[number].summary;
  const summaryEN = document.getElementById("summaryEN");
  summaryEN.innerText = articles[number].summary;

  const headline = document.getElementById("headline");
  headline.innerText = articles[number].title;

  const headlineEN = document.getElementById("headlineEN");
  headlineEN.innerText = articles[number].title;

  const time = document.getElementById("time");
  time.innerText = articles[number].timeText;

  const link = document.getElementById("link");
  const url = articles[number].link;
  link.setAttribute("href", url);
  counter.innerHTML = articleNumber + 1 + "/" + articles.length;
}

let next = document.getElementById("next");
let previous = document.getElementById("previous");
let copyButton = document.getElementById("copy");

next.addEventListener("click", () => {
  if (articleNumber < data.length) {
    articleNumber++;
  }
  if (articleNumber == data.length) {
    articleNumber--;
  }
  loadArticle(data, articleNumber);
});

previous.addEventListener("click", () => {
  if (articleNumber > 0) {
    articleNumber--;
  }
  loadArticle(data, articleNumber);
});

setTimeout(() => {
  let test = document.querySelectorAll(".goog-logo-link");
  test[0].remove();
}, 1500);

function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: "es",
      includedLanguages: "en",
      layout: google.translate.TranslateElement.InlineLayout.VERTICAL,
    },
    "google_translate_element"
  );
}


let selectLanguage = document.getElementById("google_translate_element");
console.log(selectLanguage)
selectLanguage.addEventListener("click", () => {
  article = document.getElementById('articleEN')
  article.classList.remove('hide')
});