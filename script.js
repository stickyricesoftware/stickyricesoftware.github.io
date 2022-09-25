BASE_URL = "https://stickyricesoftware.github.io/";
console.log("sticky rice for life");

projectsArray = [BASE_URL + "matchmatch", BASE_URL + "bbcmundo", BASE_URL + "skr-collection/skr/skr-home", BASE_URL + "skr-collection/skr1/skr1-home", BASE_URL + "skr-collection/skr2/skr2-home",];

const projects = document.getElementById("projects");

projectsArray.forEach((item) => {
    const button = document.createElement("button");
    button.innerText = item.slice(37);
    projects.appendChild(button);
    button.addEventListener("click", () => {
      window.location.href = item
    });        
}) ;


