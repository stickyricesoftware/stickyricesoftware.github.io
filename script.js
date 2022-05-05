BASE_URL = "https://stickyricesoftware.github.io/";
console.log("sticky rice for life");

projectsArray = [BASE_URL + "matchmatch", BASE_URL + "projectone"];

const projects = document.getElementById("projects");

projectsArray.forEach((item) => {
    const button = document.createElement("button");
    button.innerText = item.slice(37);
    projects.appendChild(button);
    button.addEventListener("click", () => {
      window.location.href = item
    });        
}) ;


