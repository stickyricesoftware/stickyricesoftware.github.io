const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {
  e.preventDefault();
  const username = loginForm.username.value;
  const password = loginForm.password.value;

  if (username === "user" && password === "password") {
    alert("You have successfully logged in.");
    location.replace(
      "https://stickyricesoftware.github.io/email-login-client/home.html"
    );
  } else {
    loginErrorMsg.style.opacity = 1;
  }
});


//EMAILS
function emailOne() {
  var modal = document.getElementById("email1");
  var span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    modal.style.display = "none";
  };
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
  modal.style.display = "block";
}

function emailTwo() {
  var modal = document.getElementById("email2");
  var span = document.getElementsByClassName("close")[1];
  span.onclick = function () {
    modal.style.display = "none";
  };
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
  modal.style.display = "block";
}
function emailThree() {
    var modal = document.getElementById("email3");
    var span = document.getElementsByClassName("close")[2];
    span.onclick = function () {
      modal.style.display = "none";
    };
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
    modal.style.display = "block";
}
function emailFour() {
    var modal = document.getElementById("email4");
    var span = document.getElementsByClassName("close")[3];
    span.onclick = function () {
      modal.style.display = "none";
    };
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
    modal.style.display = "block";
}


