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

let counter = 0;
function start() {
  var container = document.getElementById("animate");
  // var emoji = ['❤','🌞','🌽', '🍇', '🍌', '🍒', '🍕', '🍷', '🍭', '💖', '💩', '🐷', '🐸', '🐳', '🎃', '🎾', '🌈', '🍦', '💁', '🔥', '😁', '😱', '🌴', '👏', '💃'];
  var emoji = ["❤"];

  var circles = [];

  // for (var i = 0; i < 15; i++) {
  //   addCircle(i * 150, [10 + 0, 300], emoji[Math.floor(Math.random() * emoji.length)]);
  //   addCircle(i * 150, [10 + 0, -300], emoji[Math.floor(Math.random() * emoji.length)]);
  //   addCircle(i * 150, [10 - 200, -300], emoji[Math.floor(Math.random() * emoji.length)]);
  //   addCircle(i * 150, [10 + 200, 300], emoji[Math.floor(Math.random() * emoji.length)]);
  //   addCircle(i * 150, [10 - 400, -300], emoji[Math.floor(Math.random() * emoji.length)]);
  //   addCircle(i * 150, [10 + 400, 300], emoji[Math.floor(Math.random() * emoji.length)]);
  //   addCircle(i * 150, [10 - 600, -300], emoji[Math.floor(Math.random() * emoji.length)]);
  //   addCircle(i * 150, [10 + 600, 300], emoji[Math.floor(Math.random() * emoji.length)]);
  // }

  for (var i = 0; i < 15; i++) {
    addCircle(i * 150, [10 + 0, 300], emoji[0]);
    addCircle(i * 150, [10 + 0, -300], emoji[0]);
    addCircle(i * 150, [10 - 200, -300], emoji[0]);
    addCircle(i * 150, [10 + 200, 300], emoji[0]);
    addCircle(i * 150, [10 - 400, -300], emoji[0]);
    addCircle(i * 150, [10 + 400, 300], emoji[0]);
    addCircle(i * 150, [10 - 600, -300], emoji[0]);
    addCircle(i * 150, [10 + 600, 300], emoji[0]);
  }

  function addCircle(delay, range, color) {
    setTimeout(function () {
      var c = new Circle(
        range[0] + Math.random() * range[1],
        80 + Math.random() * 4,
        color,
        {
          x: -0.15 + Math.random() * 0.3,
          y: 1 + Math.random() * 1,
        },
        range
      );
      circles.push(c);
    }, delay);
  }

  function Circle(x, y, c, v, range) {
    var _this = this;
    this.x = x;
    this.y = y;
    this.color = c;
    this.v = v;
    this.range = range;
    this.element = document.createElement("span");
    /*this.element.style.display = 'block';*/
    this.element.style.opacity = 0;
    this.element.style.position = "absolute";
    this.element.style.fontSize = "26px";
    this.element.style.color =
      "hsl(" + ((Math.random() * 360) | 0) + ",80%,50%)";
    this.element.innerHTML = c;
    container.appendChild(this.element);

    this.update = function () {
      if (_this.y > 800) {
        _this.y = 80 + Math.random() * 4;
        _this.x = _this.range[0] + Math.random() * _this.range[1];
      }
      _this.y += _this.v.y;
      _this.x += _this.v.x;
      this.element.style.opacity = 1;
      this.element.style.transform =
        "translate3d(" + _this.x + "px, " + _this.y + "px, 0px)";
      this.element.style.webkitTransform =
        "translate3d(" + _this.x + "px, " + _this.y + "px, 0px)";
      this.element.style.mozTransform =
        "translate3d(" + _this.x + "px, " + _this.y + "px, 0px)";
    };
  }

  function animate() {
    for (var i in circles) {
      circles[i].update();
    }
    requestAnimationFrame(animate);
  }
  animate();
}

function makeItRain() {
  if (counter == 0) {
    if (document.getElementById("all")) {
      start();
    } else {
      const element = document.getElementById("container");
      const all = document.createElement("div");
      all.setAttribute("id", "all");
      const rainContainer = document.createElement("div");
      rainContainer.setAttribute("id", "rain-container");
      const animate = document.createElement("div");
      animate.setAttribute("id", "animate");
      rainContainer.append(animate);
      all.append(rainContainer);
      element.insertBefore(all, element.firstChild);
    }
    start();
    counter++;
    console.log(counter);
    // setTimeout(()=>{
    //   const element = document.getElementById("all");
    //   element.remove();
    //   counter--
    // }, 10000)
  } else {
    const element = document.getElementById("all");
    element.remove();
    counter--;
    console.log(counter);
  }
}

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
    // project.style.backgroundImage = "url('" + e.img + "')";
    // project.style.backgroundRepeat = "no-repeat";
    // project.style.backgroundSize = "auto";

    const projectName = document.createElement("p");
    projectName.innerHTML = e.name;
    projectName.setAttribute("id", "link-title-left");
    project.append(projectName);

    const projectDesc = document.createElement("p");
    projectDesc.innerHTML = e.description;
    projectDesc.setAttribute("id", "link-description");
    project.append(projectDesc);

    // const projectImg = document.createElement("img");
    // projectImg.setAttribute("src", e.img);
    // project.append(projectImg);
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
    // project.style.backgroundImage = "url('" + e.img + "')";
    // project.style.backgroundRepeat = "no-repeat";
    // project.style.backgroundSize = "auto";

    const projectName = document.createElement("p");
    projectName.innerHTML = e.name;
    projectName.setAttribute("id", "link-title-left");
    project.append(projectName);

    const projectDesc = document.createElement("p");
    projectDesc.innerHTML = e.description;
    projectDesc.setAttribute("id", "link-description");
    project.append(projectDesc);

    // const projectImg = document.createElement("img");
    // projectImg.setAttribute("src", e.img);
    // project.append(projectImg);
    projects.append(project);
  });
}
externalProjects();
