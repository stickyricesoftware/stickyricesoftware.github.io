var i = 0,
  minimizedWidth = new Array(),
  minimizedHeight = new Array(),
  windowTopPos = new Array(),
  windowLeftPos = new Array(),
  panel,
  id;

function adjustFullScreenSize() {
  $(".fullSizeWindow .wincontent").css("width", window.innerWidth - 32);
  $(".fullSizeWindow .wincontent").css("height", window.innerHeight - 98);
}

function makeWindowActive(thisid) {
  $(".window").each(function () {
    $(this).css("z-index", $(this).css("z-index") - 1);
  });
  $("#window" + thisid).css("z-index", 1000);
  $(".window").removeClass("activeWindow");
  $("#window" + thisid).addClass("activeWindow");
  $(".taskbarPanel").removeClass("activeTab");
  $("#minimPanel" + thisid).addClass("activeTab");
}

function minimizeWindow(id) {
  windowTopPos[id] = $("#window" + id).css("top");
  windowLeftPos[id] = $("#window" + id).css("left");
  $("#window" + id).animate(
    {
      top: 800,
      left: 0,
    },
    200,
    function () {
      //animation complete
      $("#window" + id).addClass("minimizedWindow");
      $("#minimPanel" + id).addClass("minimizedTab");
      $("#minimPanel" + id).removeClass("activeTab");
    }
  );
}

function openWindow(id) {
  if ($("#window" + id).hasClass("minimizedWindow")) {
    openMinimized(id);
  } else {
    makeWindowActive(id);
    $("#window" + id).removeClass("closed");
    $("#minimPanel" + id).removeClass("closed");
  }
}

function closeWindwow(id) {
  $("#window" + id).addClass("closed");
  $("#minimPanel" + id).addClass("closed");
}

function openMinimized(id) {
  $("#window" + id).removeClass("minimizedWindow");
  $("#minimPanel" + id).removeClass("minimizedTab");
  makeWindowActive(id);
  $("#window" + id).animate(
    {
      top: windowTopPos[id],
      left: windowLeftPos[id],
    },
    200,
    function () {}
  );
}
$(document).ready(function () {
  $(".window").each(function () {
    // window template
    $(this).css("z-index", 1000);
    $(this).attr("data-id", i);
    minimizedWidth[i] = $(this).width();
    minimizedHeight[i] = $(this).height();
    windowTopPos[i] = $(this).css("top");
    windowLeftPos[i] = $(this).css("left");
    $("#taskbar").append(
      '<div class="taskbarPanel" id="minimPanel' +
        i +
        '" data-id="' +
        i +
        '">' +
        $(this).attr("data-title") +
        "</div>"
    );
    if ($(this).hasClass("closed")) {
      $("#minimPanel" + i).addClass("closed");
    }
    $(this).attr("id", "window" + i++);
    $(this).wrapInner('<div class="wincontent"></div>');
    $(this).prepend(
      '<div class="windowHeader"><strong>' +
        $(this).attr("data-title") +
        '</strong><span title="Minimize" class="winminimize"><span></span></span><span title="Maximize" class="winmaximize"><span></span><span></span></span><span title="Close" class="winclose">x</span></div>'
    );
  });
  $("#minimPanel" + (i - 1)).addClass("activeTab");
  $("#window" + (i - 1)).addClass("activeWindow");
  $(".wincontent").resizable(); // resizable
  $(".window").draggable({
    cancel: ".wincontent",
  }); // draggable
  $(".window").mousedown(function () {
    // active window on top (z-index 1000)
    makeWindowActive($(this).attr("data-id"));
  });
  $(".winclose").click(function () {
    // close window
    closeWindwow($(this).parent().parent().attr("data-id"));
  });
  $(".winminimize").click(function () {
    // minimize window
    minimizeWindow($(this).parent().parent().attr("data-id"));
  });
  $(".taskbarPanel").click(function () {
    // taskbar click
    id = $(this).attr("data-id");
    if ($(this).hasClass("activeTab")) {
      // minimize if active
      minimizeWindow($(this).attr("data-id"));
    } else {
      if ($(this).hasClass("minimizedTab")) {
        // open if minimized
        openMinimized(id);
      } else {
        // activate if inactive
        makeWindowActive(id);
      }
    }
  });
  $(".openWindow").click(function () {
    // open closed window
    openWindow($(this).attr("data-id"));
  });
  $(".winmaximize").click(function () {
    if ($(this).parent().parent().hasClass("fullSizeWindow")) {
      // minimize
      $(this).parent().parent().removeClass("fullSizeWindow");
      $(this)
        .parent()
        .parent()
        .children(".wincontent")
        .height(minimizedHeight[$(this).parent().parent().attr("data-id")]);
      $(this)
        .parent()
        .parent()
        .children(".wincontent")
        .width(minimizedWidth[$(this).parent().parent().attr("data-id")]);
    } else {
      // maximize
      $(this).parent().parent().addClass("fullSizeWindow");
      minimizedHeight[$(this).parent().parent().attr("data-id")] = $(this)
        .parent()
        .parent()
        .children(".wincontent")
        .height();
      minimizedWidth[$(this).parent().parent().attr("data-id")] = $(this)
        .parent()
        .parent()
        .children(".wincontent")
        .width();
      adjustFullScreenSize();
    }
  });
  adjustFullScreenSize();
});

/* Close when someone log ins */
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {
  e.preventDefault();
  const username = loginForm.username.value;
  const password = loginForm.password.value;

  if (username === "wotton.t" && password === "5um4y4osoios") {
    alert("You have successfully logged in.");
    document.getElementById("myNav").style.width = "0%";
  } else {
    loginErrorMsg.style.opacity = 1;
  }
});


const privateFolder = document.getElementById("private-folder");
privateFolder.addEventListener("click", function () {
  // loop three times
  for (let i = 3; i > 0; i--) {
    let password = prompt("Please enter password:", "");
    // if it's the correct answer then alert and break the loop
    if (password == "TopDog") {
      alert("Access Granted!");
      openWindow(0);
      break;
      // if it's not, and the tries has elapsed, then alert and break the loop
    } else if (i == 1) {
      alert("You need to try harder!");
      openWindow(10);
      break;
      // if it's not but the tries have not elapsed, then loop again
    } else {
      alert("Try again - Attempts remaing: " + (i - 1));
    }
  }
});



const recordingsFolder = document.getElementById("recordings");
recordingsFolder.addEventListener("click", function () {
  // loop three times
  for (let i = 3; i > 0; i--) {
    let password = prompt("Please enter password:", "");
    // if it's the correct answer then alert and break the loop
    if (password == "Ransom") {
      alert("Access Granted!");
      openWindow(1);
      break;
      // if it's not, and the tries has elapsed, then alert and break the loop
    } else if (i == 1) {
      alert("You need to try harder!");
      openWindow(9);
      break;
      // if it's not but the tries have not elapsed, then loop again
    } else {
      alert("Try again - Attempts remaing: " + (i - 1));
    }
  }
});


document.addEventListener("DOMContentLoaded", () => {
  let but = document.getElementById("but");
  let video = document.getElementById("vid");
  let vidBox = document.getElementById("vid-box");
  let mediaDevices = navigator.mediaDevices;
  vid.muted = true;
  but.addEventListener("click", () => {
    vidBox.setAttribute("style", "display: block")
    setTimeout(function(){
      vidBox.setAttribute("style", "display: none")
      alert("FACE NOT RECOGNISED")
  }, 4000);
      // Accessing the user camera and video.
      mediaDevices
          .getUserMedia({
              video: true,
              audio: true,
          })
          .then((stream) => {
              // Changing the source of video to current stream.
              video.srcObject = stream;
              video.addEventListener("loadedmetadata", () => {
                  video.play();
              });
          })
          .catch(alert);
  });
});