const clubs = [
  { name: "6i", type: "iron", carry: 145, rollout: 159 },
  { name: "7i", type: "iron", carry: 139, rollout: 148 },
  { name: "8i", type: "iron", carry: 127, rollout: 138 },
  { name: "9i", type: "iron", carry: 117, rollout: 126 },
  { name: "PW", type: "wedge", carry: 108, rollout: 116 },
  { name: "GW", type: "wedge", carry: 88, rollout: 98 },
  { name: "SW", type: "wedge", carry: 78, rollout: 86 },
  { name: "PW", type: "mp-wedge", carry: 75, rollout: 84 },
  { name: "PW", type: "sp-wedge", carry: 67, rollout: 79 },
  { name: "GW", type: "mp-wedge", carry: 64, rollout: 75 },
  { name: "GW", type: "sp-wedge", carry: 61, rollout: 74 },
  { name: "SW", type: "mp-wedge", carry: 62, rollout: 72 },
  { name: "SW", type: "sp-wedge", carry: 58, rollout: 67 },
  { name: "LW", type: "mp-wedge", carry: 52, rollout: 61 },
  { name: "LW", type: "sp-wedge", carry: 48, rollout: 57 },
];

const wordsOfEncouragement = [
  `“Success in this game depends less on strength of body than strength of mind and character.” -Arnold Palmer`,
  `“I get to play golf for a living. What more can you ask for, getting paid for doing what you love.” -Tiger Woods`,
  `“Stay true to yourself and listen to your inner voice. It will lead you to your dream.” -James Ross`,
  `“If you worry about making bogeys, it makes the game that much more difficult. You put more pressure on yourself without even noticing it. It makes a difference to take it easy when things aren’t going right.” -Sergio Garcia`,
  `“Golf… is the infallible test. The man who can go into a patch of rough alone, with the knowledge that only God is watching him, and play his ball where it lies, is the man who will serve you faithfully and well.” -P.G. Wodehouse`,
  `“The value of routine; trusting your swing.” -Lorii Myers`,
  `“A good golfer has the determination to win and the patience to wait for the breaks.” -Gary Player`,
  `“Arnold’s place in history will be as the man who took golf from being a game for the few to a sport for the masses. He was the catalyst who made that happen.” -Jack Nicklaus`,
  `“Golf is about how well you accept, respond to, and score with your misses much more so than it is a game of your perfect shots.” -Dr Bob Rotella`,
  `“I have to believe in myself. I know what I can do, what I can achieve.” -Sergio Garcia`,
  `“Golf is a compromise between what your ego wants you to do, what experience tells you to do, and what your nerves let you do.” -Bruce Crampton`,
  `“Achievements on the golf course are not what matters, decency and honesty are what matter.” -Tiger Woods`,
  `“The more I work and practice, the luckier I seem to get.” -Gary Player`,
  `“One reason golf is such an exasperating game is that a thing we learned is so easily forgotten, and we find ourselves struggling year after year with faults we had discovered and corrected time and again.” -Bobby Jones`,
  `“A routine is not a routine if you have to think about it.” -Davis Love Jr.`,
  `“I think it’s more than whether or not you win or lose. It’s having that opportunity on that final round, final nine, to come down the stretch with a chance to win.” -Phil Mickelson`,
  `“It’s about hitting the ball in the center of the club face and hitting it hard.” -Bubba Watson`,
  `“When one is down, simply buy golf accessories from Lazada” -Anonymous `,
];

const ironButtons = document.getElementById("ironButtons");
const wedgeButtons = document.getElementById("wedgeButtons");
const mediumPartialButtons = document.getElementById("mediumPartialButtons");
const smallPartialButtons = document.getElementById("smallPartialButtons");

let useYards = true;

// Reset class 'active' only on relevant group
function clearActiveButtons() {
  document
    .querySelectorAll(".buttons button")
    .forEach((b) => b.classList.remove("active"));
} // Reset class 'active' only on relevant group
function clearActiveButtons() {
  document
    .querySelectorAll(".buttons button")
    .forEach((b) => b.classList.remove("active"));
}

const carryEl = document.getElementById("carryValue");
const rolloutEl = document.getElementById("rolloutValue");
const toggle = document.getElementById("unitToggle");
const buttonContainer = document.getElementById("clubButtons");

function metresToYards(m) {
  return Math.round(m * 1.09361);
}

function displayDistance(club) {
  const carry = useYards ? metresToYards(club.carry) : club.carry;
  const rollout = useYards ? metresToYards(club.rollout) : club.rollout;

  carryEl.innerHTML =
    carry + (useYards ? " <br><span>yd</span>" : " <br><span>m</span>");
  rolloutEl.innerHTML =
    rollout + (useYards ? " <br><span>yd</span>" : " <br><span>m</span>");
}

clubs.forEach((club) => {
  const btn = document.createElement("button");
  btn.textContent = club.name;
  btn.addEventListener("click", () => {
    clearActiveButtons();
    btn.classList.add("active");
    const quote =
      wordsOfEncouragement[
        Math.floor(Math.random() * wordsOfEncouragement.length)
      ];
    showToast(quote);
    fetch('https://ntfy.sunny.bz/stus-golf-app', {
  method: 'POST', // PUT works too
  body: 'Distance Checked for ' + club.name
})
    displayDistance(club);
  });

  if (club.type === "iron") {
    ironButtons.appendChild(btn);
  } else if (club.type === "wedge") {
    wedgeButtons.appendChild(btn);
  } else if (club.type === "mp-wedge") {
    mediumPartialButtons.appendChild(btn);
  } else if (club.type === "sp-wedge") {
    smallPartialButtons.appendChild(btn);
  }
});

toggle.addEventListener("change", () => {
  useYards = toggle.checked;
  const selected = document.querySelector(".buttons button.active");
  if (selected) {
    const clubName = selected.textContent;
    const club = clubs.find((c) => c.name === clubName);
    displayDistance(club);
  }
});

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast-popup";

  const text = document.createElement("span");
  text.textContent = message;

  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "&times;";
  closeBtn.className = "toast-close";
  closeBtn.addEventListener("click", () => toast.remove());

  toast.appendChild(text);
  toast.appendChild(closeBtn);
  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => toast.classList.add("show"), 100);
}


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(() => {
    console.log("Service Worker registered");
  });
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing
  e.preventDefault();
  deferredPrompt = e;

  // Show a custom button to the user
  const installBtn = document.createElement('button');
  installBtn.textContent = "Install as app";
  installBtn.className = "install-button";
  document.body.appendChild(installBtn);

  installBtn.addEventListener('click', () => {
    installBtn.remove();
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
    });
  });
});
