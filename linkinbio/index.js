import data from "./data.json" assert { type: "json" };
console.log(data);

const randomProfile = [
  "/linkinbio/images/profile.jpg", "/linkinbio/images/profile1.jpg"
];

const randomPic = Math.floor(Math.random() * randomProfile.length)
document.getElementById("profile-pic").setAttribute('src', randomProfile[randomPic])


const randomDarkColour = [
  "#38002E",
  "#52093C",
  "#5E183A",
  "#692636",
  "#6B3938",
  "#54544A",
  "#46665B",
  "#275954",
  "#094D52",
  "#113A42",
];
const randomLightColour = [
  "#FFFD63",
  "#FFAC4A",
  "#07E7AE",
  "#7386FC",
  "#C7D0FF",
  "#BFF9EA",
  "#FFD8AA",
  "#FFD5D5"
];

function themeToggle() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}
const toggleSwitch = document.querySelector(
  '.theme-switch input[type="checkbox"]'
);

function switchTheme(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark"); //add this
    location.reload();
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light"); //add this
    location.reload();
  }
}

toggleSwitch.addEventListener("change", switchTheme, false);

const currentTheme = localStorage.getItem("theme")
  ? localStorage.getItem("theme")
  : null;

if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);

  if (currentTheme === "dark") {
    toggleSwitch.checked = true;
  }
}

function myProjects() {
  data.myProjects.forEach((e) => {
    const projects = document.getElementById("my-projects");
    const project = document.createElement("a");

    const randomDark = Math.floor(Math.random() * randomDarkColour.length);
    const randomLight = Math.floor(Math.random() * randomLightColour.length);

    if (currentTheme == "dark") {
      project.style.backgroundColor = randomDarkColour[randomDark];
    } else {
      project.style.backgroundColor = randomLightColour[randomLight];
    }
    project.setAttribute("class", "link");
    project.setAttribute("href", e.url);

    const projectName = document.createElement("p");
    projectName.innerHTML = e.name;
    projectName.setAttribute("id", "link-title-left");
    project.append(projectName);

    const projectDesc = document.createElement("p");
    projectDesc.innerHTML = e.description;
    projectDesc.setAttribute("id", "link-description");
    project.append(projectDesc);


    const imgSpan = document.createElement("span");
    imgSpan.setAttribute('id', "link-img-span")
    const projectImg = document.createElement("img");
    projectImg.setAttribute("class", 'link-image');    
    projectImg.setAttribute("src", e.img);
    imgSpan.append(projectImg)
    project.append(imgSpan);

    
    projects.append(project);
  });
}
myProjects();

function externalProjects() {
  data.externalProjects.forEach((e) => {
    const projects = document.getElementById("external-projects");
    const project = document.createElement("a");

    const randomDark = Math.floor(Math.random() * randomDarkColour.length);
    const randomLight = Math.floor(Math.random() * randomLightColour.length);

    if (currentTheme == "dark") {
      project.style.backgroundColor = randomDarkColour[randomDark];
    } else {
      project.style.backgroundColor = randomLightColour[randomLight];
    }
    project.setAttribute("class", "link");
    project.setAttribute("href", e.url);


    const projectName = document.createElement("p");
    projectName.innerHTML = e.name;
    projectName.setAttribute("id", "link-title-left");
    project.append(projectName);

    const projectDesc = document.createElement("p");
    projectDesc.innerHTML = e.description;
    projectDesc.setAttribute("id", "link-description");
    project.append(projectDesc);

    const imgSpan = document.createElement("span");
    imgSpan.setAttribute('id', "link-img-span")
    const projectImg = document.createElement("img");
    projectImg.setAttribute("class", 'link-image');    
    projectImg.setAttribute("src", e.img);
    imgSpan.append(projectImg)
    project.append(imgSpan);
    projects.append(project);
  });
}
externalProjects();

function websiteProjects() {
  data.websiteProjects.forEach((e) => {
    const projects = document.getElementById("website-projects");
    const project = document.createElement("a");

    const randomDark = Math.floor(Math.random() * randomDarkColour.length);
    const randomLight = Math.floor(Math.random() * randomLightColour.length);

    if (currentTheme == "dark") {
      project.style.backgroundColor = randomDarkColour[randomDark];
    } else {
      project.style.backgroundColor = randomLightColour[randomLight];
    }
    project.setAttribute("class", "link");
    project.setAttribute("href", e.url);


    const projectName = document.createElement("p");
    projectName.innerHTML = e.name;
    projectName.setAttribute("id", "link-title-left");
    project.append(projectName);

    const projectDesc = document.createElement("p");
    projectDesc.innerHTML = e.description;
    projectDesc.setAttribute("id", "link-description");
    project.append(projectDesc);

    const imgSpan = document.createElement("span");
    imgSpan.setAttribute('id', "link-img-span")
    const projectImg = document.createElement("img");
    projectImg.setAttribute("class", 'link-image');    
    projectImg.setAttribute("src", e.img);
    imgSpan.append(projectImg)
    project.append(imgSpan);
    projects.append(project);
  });
}
websiteProjects();

function links() {
  data.myLinks.forEach((e) => {
    const projects = document.getElementById("my-links");
    const project = document.createElement("a");

    const randomDark = Math.floor(Math.random() * randomDarkColour.length);
    const randomLight = Math.floor(Math.random() * randomLightColour.length);

    if (currentTheme == "dark") {
      project.style.backgroundColor = randomDarkColour[randomDark];
    } else {
      project.style.backgroundColor = randomLightColour[randomLight];
    }
    project.setAttribute("class", "my-link");
    project.setAttribute("href", e.url);


    const projectName = document.createElement("h6");
    projectName.innerHTML = e.name;
    projectName.setAttribute("id", "my-links-title");
    project.append(projectName);

    const projectDesc = document.createElement("p");
    projectDesc.innerHTML = e.description;
    projectDesc.setAttribute("id", "my-links-description");
    project.append(projectDesc);

    // const projectImg = document.createElement("img");
    // projectImg.setAttribute("src", e.img);
    // project.append(projectImg);
    projects.append(project);
  });
}
links();