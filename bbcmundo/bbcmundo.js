console.warn("BBC NEWS | Mundo");
const div = document.createElement("div");
div.setAttribute("id","loader");
div.innerText = "Loading...";
document.body.appendChild(div);
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Host": "bbc-news-mundo.p.rapidapi.com",
    "X-RapidAPI-Key": "5326a3a741msh8a7fd584a716b8bp10e0cejsn223b2338e2fe",
  },
};

fetch("https://bbc-news-mundo.p.rapidapi.com/news", options)
  .then((response) => response.json())
  .then((response) => loadNews(response))
  .catch((err) => console.error(err));

function loadNews(articles) {
  articles.forEach((element) => {
    if (1 == 1) {
      const div = document.createElement("div");
      div.classList.add("article");
      const summary = document.createElement("p");
      summary.innerText = element.summary;
      summary.classList.add("summary");
      const a = document.createElement("a");
      const linkText = document.createTextNode(element.title);
      a.classList.add("headline");
      a.appendChild(linkText);
      a.href = element.link;
      div.appendChild(a);
      div.appendChild(summary);
      document.body.appendChild(div);
    }
  });
  const element = document.getElementById('loader');
  element.remove();
}
