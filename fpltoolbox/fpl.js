const BASE_URL =
  "https://proxy.fpltoolbox.com/http://fantasy.premierleague.com/api/";
//  const BASE_URL =
//  "http://fantasy.premierleague.com/api/";

import eventStatusTest from "./testData/eventStatusTest.js";
import bootstrapTest from "./testData/bootsatrapTest.js";
import superLeagueTest from "./testData/superLeagueTest.js";
import superLeagueManagerDataTest from "./testData/superLeagueManagerDataTest.js";
import superLeagueGameweekDataTest from "./testData/superLeagueGameweekDataTest.js";
import superLeagueDetailedGameweekDataTest from "./testData/superLeagueDetailedGameweekDataTest.js";
import superLeagueAddWeeklyPicksTest from "./testData/superLeagueAddWeeklyPicksTest.js"


let testMode = true; // Set to true to use test data
window.FPLToolboxLeagueDataReady = false;
window.FPLToolboxProLeagueDataReady = false;
window.FPLToolboxMaxLeagueDataReady = false;

window.FPLToolboxLeagueData = {
  leagueName: null,
  standings: [],
  lastUpdated: null,
  type: null,
};

let bootstrap = {};
let currentGw;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
document.addEventListener("DOMContentLoaded", injectUI());

async function getEventStatus() {
  try {
    if (testMode) {
      console.log(
        "%c TEST MODE - NO API CALL MADE - Event Status",
        "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: green; ",

        eventStatusTest
      );
      return eventStatusTest;
    }
    const res = await fetch(BASE_URL + "event-status/");
    const data = await res.json();
    let eventStatus = data;
    console.log(
      "%c API CALL MADE - Event Status",
      "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: red; ",
      eventStatus
    );
    return eventStatus;
  } catch (error) {
    console.error("Something went wrong... ", error);
  }
}
getEventStatus();

async function getBootstrap() {
  try {
    if (testMode) {
      bootstrap = bootstrapTest;

      console.log(
        "%c TEST MODE - NO API CALL MADE - Bootstrap Data",
        "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: green; ",
        bootstrap
      );

      return bootstrap;
    }

    const res = await fetch(BASE_URL + "bootstrap-static/");
    const data = await res.json();
    bootstrap = data;
    console.log(
      "%c API CALL MADE - Bootstrap Data",
      "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: red; ",
      bootstrap
    );
    // Set current and next game week
    bootstrap.events.forEach((event) => {
      if (event.is_current) currentGw = event.id;
      if (event.is_next) nextGw = event.id;
    });
    // Sort players by `transfers_in` in descending order
    bootstrap.elements.sort((a, b) => b.transfers_in - a.transfers_in);

    // Get the top 5 most transferred-in players
    // top5TransferredIn = bootstrap.elements.slice(0, 10);
  } catch (error) {
    console.error("Something went wrong... ", error);
  }
}
getBootstrap();

function injectUI() {
  const app = document.getElementById("app-screen");
  app.innerHTML = ""; // Clear previous content
  app.className = "d-flex flex-column h-100";
  const mainContainer = document.createElement("div");
  mainContainer.className = "d-flex flex-column h-100";

  const screenWrapper = document.createElement("div");
  screenWrapper.id = "screen-wrapper";
  screenWrapper.className = "flex-grow-1 overflow-auto";
  createScreens(screenWrapper);

  const nav = createNav();

  mainContainer.appendChild(screenWrapper);
  mainContainer.appendChild(nav);
  app.appendChild(mainContainer);

  injectDynamicStyles();
  setupTabListeners();
}
document.getElementById("nav-container").addEventListener("click", (e) => {
  const tab = e.target.closest(".nav-tab");
  if (!tab) return;

  // Clear 'active' class
  document
    .querySelectorAll(".nav-tab")
    .forEach((t) => t.classList.remove("active"));

  // Activate current tab
  tab.classList.add("active");

  // Handle navigation
  if (tab.dataset.external) {
    window.location.href = tab.dataset.external;
    return;
  }
  if (tab.dataset.target === "tools") {
    renderToolsScreenWithLeague();
  } else if (tab.dataset.target === "settings") {
    settingsScreen(); // your logic here
  }
});

function createScreens(wrapper) {
  const screenIds = ["tools", "settings"];
  screenIds.forEach((id) => {
    const screen = document.createElement("div");
    screen.id = `screen-${id}`;
    screen.className = `app-screen ${id === "home" ? "" : "d-none"}`;
    screen.style.overflowY = "auto";
    screen.style.flexGrow = "1";
    screen.style.paddingBottom = "80px"; // enough space for nav
    wrapper.appendChild(screen);
  });
}

function createNav() {
  const nav = document.createElement("div");
  nav.className = "d-flex justify-content-around border-top bg-light";
  nav.id = "nav-container";

  const tabs = [
    { icon: "tools", label: "Tools", target: "tools" },
    { icon: "globe2", label: "Website", external: "https://fpltoolbox.com" },
    { icon: "gear", label: "Settings", target: "settings" },
  ];

  tabs.forEach((tab) => {
    const div = document.createElement("div");
    div.className = "nav-tab text-center flex-fill py-2";
    if (tab.target) div.dataset.target = tab.target;
    if (tab.external) div.dataset.external = tab.external;
    if (tab.target === "tools") div.classList.add("active");

    div.innerHTML = `<i class="bi bi-${tab.icon}"></i><br><small>${tab.label}</small>`;
    nav.appendChild(div);
  });

  return nav;
}

function setupTabListeners() {
  const tabs = document.querySelectorAll(".nav-tab");
  const screens = document.querySelectorAll(".app-screen");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const externalUrl = tab.dataset.external;
      if (externalUrl) {
        window.open(externalUrl, "_blank");
        return;
      }

      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const targetId = `screen-${tab.dataset.target}`;
      screens.forEach((screen) => screen.classList.add("d-none"));
      document.getElementById(targetId).classList.remove("d-none");
    });
  });
}

function toolsScreen() {
  const homeScreen = document.getElementById("screen-tools");
  homeScreen.innerHTML = "";

  const container = document.createElement("div");
  container.className = "container text-center py-3";

  const row = document.createElement("div");
  row.className = "row g-3";

  const features = [
    {
      icon: "bi-person-badge",
      label: "My Team",
      action: renderMyTeamScreen,
      tier: "free",
      requiresData: true,
    },
    {
      icon: "bi-sliders",
      label: "Planner",
      action: testFunction,
      tier: "max",
      requiresData: true,
    },
    {
      icon: "bi-sliders",
      label: "Test 2",
      action: testFunction2,
      tier: "max",
      requiresData: true,
    },
    {
      icon: "bi-emoji-smile",
      label: "GW Memes",
      action: handleStatsClick,
      tier: "free",
      requiresData: true,
    },
    {
      icon: "bi-bar-chart",
      label: "GW Stats",
      action: handleStatsClick,
      tier: "free",
      requiresData: true,
    },
    {
      icon: "bi-graph-up-arrow",
      label: "Season Stats",
      action: handleStatsClick,
      tier: "pro",
      requiresData: true,
    },
    {
      icon: "bi-people",
      label: "Benched Points League",
      action: showBenchedPointsLeague,
      tier: "pro",
      requiresData: true,
    },
    {
      icon: "bi-cash-coin",
      label: "Rich List League",
      action: richListNew,
      tier: "pro",
      requiresData: true,
    },
    {
      icon: "bi-exclamation-triangle",
      label: "The Dirty League",
      action: handleStatsClick,
      tier: "pro",
      requiresData: true,
    },
    {
      icon: "bi-trophy",
      label: "Captaincy Points League",
      action: showCaptaincyPointsLeague,
      tier: "pro",
      requiresData: true,
    },
    {
      icon: "bi-shield-check",
      label: "Golden Boot League",
      action: handleStatsClick,
      tier: "pro",
      requiresData: true,
    },
    {
      icon: "bi-person-check",
      label: "Catch A Copycat",
      action: handleStatsClick,
      tier: "pro",
      requiresData: true,
    },
    {
      icon: "bi-arrow-repeat",
      label: "GW Transfer Summaries",
      action: handleStatsClick,
      tier: "free",
      requiresData: true,
    },
    {
      icon: "bi-boxes",
      label: "Chip Usage",
      action: handleStatsClick,
      tier: "free",
      requiresData: true,
    },
    {
      icon: "bi-compass",
      label: "Captain Picks",
      action: handleStatsClick,
      tier: "free",
      requiresData: true,
    },
    {
      icon: "bi-binoculars",
      label: "Rival Comparison",
      action: handleStatsClick,
      tier: "free",
      requiresData: true,
    },
    {
      icon: "bi-award",
      label: "Season Summary",
      action: handleStatsClick,
      tier: "free",
      requiresData: true,
    },
    {
      icon: "bi-speedometer2",
      label: "Max Dashboard",
      action: handleStatsClick,
      tier: "max",
      requiresData: true,
    },
    {
      icon: "bi-calculator",
      label: "Rivals Transfer Calculator",
      action: handleStatsClick,
      tier: "pro",
      requiresData: true,
    },
  ];

features.forEach(({ icon, label, action, tier, requiresData = false }, i) => {
  const featureId = `feature-btn-${i}`;
  const col = document.createElement("div");
  col.className = "col-4 p-2";

  const button = document.createElement("div");
  button.id = featureId;
  button.className =
    "btn btn-light w-100 feature-icon d-flex flex-column align-items-center justify-content-center text-center position-relative";
  button.style.height = "120px";

  // Determine data readiness based on tier
  let dataReady = true;

  if (requiresData) {
    switch (tier) {
      case "free":
        dataReady = !!window.FPLToolboxLeagueDataReady;
        break;
      case "pro":
        dataReady = !!window.FPLToolboxProLeagueDataReady;
        break;
      case "max":
        dataReady = !!window.FPLToolboxMaxLeagueDataReady;
        break;
    }
  }

  if (!dataReady) {
    button.innerHTML = `
      <div class="spinner-border text-secondary mb-2" role="status" style="width: 1.5rem; height: 1.5rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
      <small>${label}</small>
    `;
    button.classList.add("disabled");
    button.style.opacity = "0.5";
  } else {
    button.innerHTML = `
      <i class="bi ${icon} fs-2 mb-1"></i>
      <small>${label}</small>
    `;
    button.addEventListener("click", action);
  }

  // Tier badge
  const badge = document.createElement("span");
  badge.className = "badge position-absolute top-0 end-0 m-1";
  badge.style.fontSize = "0.6rem";
  badge.style.padding = "0.25em 0.5em";
  badge.textContent = tier.toUpperCase();

  switch (tier) {
    case "free":
      badge.classList.add("bg-success", "text-light");
      break;
    case "pro":
      badge.classList.add("bg-warning", "text-dark");
      break;
    case "max":
      badge.classList.add("bg-danger", "text-light");
      break;
  }

  button.appendChild(badge);
  col.appendChild(button);
  row.appendChild(col);
});


  container.appendChild(row);
  homeScreen.appendChild(container);

  // 🔁 Check for league data and re-render individual buttons
  const pendingButtons = features
    .map((f, i) => ({ ...f, index: i }))
    .filter((f) => f.requiresData);
}

function injectDynamicStyles() {
  const darkMode = localStorage.getItem("darkMode") === "true";

  const body = document.body;
  body.classList.toggle("bg-dark", darkMode);
  body.classList.toggle("text-light", darkMode);

  const navTabs = document.querySelectorAll(".nav-tab");
  navTabs.forEach((tab) => {
    tab.classList.toggle("bg-dark", darkMode);
    tab.classList.toggle("text-light", darkMode);
    tab.classList.toggle("border-top", true);
  });

  const buttons = document.querySelectorAll(".feature-icon");
  buttons.forEach((btn) => {
    btn.classList.toggle("btn-dark", darkMode);
    btn.classList.toggle("btn-light", !darkMode);
  });

  // Update table theme
  const tables = document.querySelectorAll("table");
  tables.forEach((table) => {
    table.classList.remove("table-dark", "table-light");
    table.classList.add(darkMode ? "table-dark" : "table-light");
  });
}

function settingsScreen() {
  const settingsContainer = document.getElementById("screen-settings");

  settingsContainer.innerHTML = `
    <h2>Settings</h2>
    <div class="form-check form-switch p-3">
      <input class="form-check-input" type="checkbox" id="darkModeToggle">
      <label class="form-check-label" for="darkModeToggle">Dark Mode</label>
    </div>
  `;

  const darkModeToggle = document.getElementById("darkModeToggle");
  darkModeToggle.checked = localStorage.getItem("darkMode") === "true";

  darkModeToggle.addEventListener("change", () => {
    localStorage.setItem("darkMode", darkModeToggle.checked);
    injectDynamicStyles(); // just applies styles
  });

  injectDynamicStyles(); // apply on load too
}

// Map level IDs to tier names
function getTierName(levelId) {
  switch (levelId) {
    case 1:
      return "free";
    case 10:
      return "pro";
    case 12:
      return "max";
    default:
      return "free";
  }
}
function userHasAccess(allowedLevels) {
  const level = Number(theUser?.username?.data?.membership_level?.ID || 0);

  if (Array.isArray(allowedLevels)) {
    return allowedLevels.includes(level);
  }

  return level >= allowedLevels;
}

function handleStatsClick() {
  if (!userHasAccess([3])) {
    showModal({
      title: "Pro Feature",
      body: "This feature is only available to <strong>Pro members</strong>. <br><br>Upgrade to unlock Copycat mode!",
      confirmText: "Upgrade Now",
      onConfirm: () => {
        window.location.href = "/subscribe";
      },
    });
    return;
  }
  console.log("Stats clicked");
  // Add logic here
}

function showModal({ title, body, confirmText = null, onConfirm = null }) {
  const modal = document.getElementById("modal-popup");
  const titleEl = modal.querySelector(".modal-title");
  const bodyEl = modal.querySelector(".modal-body-content");
  const closeBtn = modal.querySelector(".modal-close");
  const confirmBtn = modal.querySelector(".modal-confirm-btn");

  if (!modal || !titleEl || !bodyEl || !closeBtn || !confirmBtn) {
    console.error("[showModal] ⚠️ Could not find modal or required elements.");
    return;
  }

  // Populate content
  titleEl.textContent = title;
  bodyEl.innerHTML = body;

  // Confirm button logic
  if (confirmText && typeof onConfirm === "function") {
    confirmBtn.textContent = confirmText;
    confirmBtn.classList.remove("hidden");
    confirmBtn.onclick = () => {
      onConfirm();
      closeModal();
    };
  } else {
    confirmBtn.classList.add("hidden");
    confirmBtn.onclick = null;
  }

  // Close behavior
  closeBtn.onclick = closeModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
  document.addEventListener("keydown", handleEsc);

  // Apply dark/light styling
  applyModalTheme(modal);

  // Show it
  modal.classList.add("open");

  function closeModal() {
    modal.classList.remove("open");
    document.removeEventListener("keydown", handleEsc);
  }

  function handleEsc(e) {
    if (e.key === "Escape") closeModal();
  }
}
function createBackButton() {
  const btn = document.createElement("button");
  btn.className = "btn btn-secondary mb-3";
  btn.textContent = "X";
  btn.addEventListener("click", toolsScreen);
  return btn;
}
function applyModalTheme() {
  const dark = localStorage.getItem("darkMode") === "true";
  const root = document.documentElement;
  if (dark) {
    root.style.setProperty("--modal-bg", "#222");
    root.style.setProperty("--modal-text", "#eee");
  } else {
    root.style.setProperty("--modal-bg", "#fff");
    root.style.setProperty("--modal-text", "#000");
  }
}

// Returns the max allowed pages for the user based on membership level.
// Levels: 1 = Free, 10 = Pro, 12 = Max

function getMaxPagesForUser() {
  // console.log(theUser);
  const level = parseInt(theUser.username.data.membership_level?.ID, 10);

  switch (level) {
    case 1: // Free
      return 1;
    case 10: // Pro
      return 1;
    case 12: // Max
      return 2;
    default:
      console.warn("[getMaxPagesForUser] Unknown membership level:", level);
      return 1;
  }
}


function sliceStandingsForUser(standings) {
  if (userHasAccess([12])) {
    return standings; // Max access: full list
  } else if (userHasAccess([10])) {
    return standings.slice(0, 20); // Pro access
  } else {
    return standings.slice(0, 10); // Free access
  }
}

async function createSelectedLeague(leagueID, onStatusUpdate = () => {}) {
  onStatusUpdate("started");

  try {
    if (testMode) {
    console.log("simulating delay")
    await sleep(1000);
      onStatusUpdate("fetching test data");

      return {
        type: superLeagueTest.type,
        leagueName: superLeagueTest.leagueName,
        standings: sliceStandingsForUser(superLeagueTest.standings),
      };
    }

    let maxPages = getMaxPagesForUser();
    onStatusUpdate("maxPages", maxPages);

    let standings = [];
    let leagueName = "";

    for (let i = 1; i <= maxPages; i++) {
      onStatusUpdate("fetching", i);

      const res = await fetch(
        `${BASE_URL}leagues-classic/${leagueID}/standings?page_standings=${i}`
      );
      const data = await res.json();
      
      if (i === 1) leagueName = data.league.name;
      standings.push(...(data.standings?.results ?? []));

      if (!data.standings?.has_next) break;
      if (i < maxPages) await sleep(250);

    }

    onStatusUpdate("fetched", standings.length);

    return {
      leagueName,
      standings: sliceStandingsForUser(standings),
      type: "Live League",
    };
    
  } catch (err) {
    onStatusUpdate("error", err);
    throw err;
  }
}

function handleLeagueCreation(result) {
  window.FPLToolboxLeagueData = {
    leagueName: result.leagueName,
    standings: result.standings,
    lastUpdated: Date.now(),
  };
}



async function processLeague(standings) {
  // Free Tier
  if (userHasAccess([1, 10, 12])) {
    await addManagerDetailsToLeague(standings, null);
    await addGameweeksToLeague(standings, null);
    window.FPLToolboxLeagueDataReady = true;
    toolsScreen(); // Re-render for free features
  }

  // Pro Tier
  if (userHasAccess([10, 12])) {
    await addDetailedGameweeksToLeague(standings, null);
    window.FPLToolboxProLeagueDataReady = true;
    toolsScreen(); // Re-render for pro features
  }

  // Max Tier (only user 12)
  if (userHasAccess([12])) {
    await weeklyPicksForSuperLeague(standings, null);
    window.FPLToolboxMaxLeagueDataReady = true;
    toolsScreen(); // Re-render for max features
  }
}


async function fetchAndProcessLeague(leagueId, onStatusUpdate = () => {}) {
  try {
    const result = await createSelectedLeague(leagueId, onStatusUpdate);
    handleLeagueCreation(result);
    await processLeague(result.standings);

    onStatusUpdate("complete", result); // Only mark complete after all done
  } catch (err) {
    onStatusUpdate("error", err);
    console.error("❌ Failed to fetch and process league:", err);
  }
}

async function renderToolsScreenWithLeague(leagueId = theUser.info.league_id) {
  // Step 1: Show initial screen (spinners if needed)
  toolsScreen();

  const hasStandings = window.FPLToolboxLeagueData?.standings?.length;
  const needsPro = userHasAccess([10]);
  const needsMax = userHasAccess([12]);

  const proReady = window.FPLToolboxProLeagueDataReady;
  const maxReady = window.FPLToolboxMaxLeagueDataReady;

  // Step 2: Skip fetch if all required data is already ready
  if (
    hasStandings &&
    (!needsPro || proReady) &&
    (!needsMax || maxReady)
  ) {
    return;
  }

  // Step 3: Fetch league and process it
  await fetchAndProcessLeague(leagueId, (status) => {
    if (status === "complete") {
      toolsScreen(); // Re-render after final data load
    }
  });
}


async function addManagerDetailsToLeague(standings, div) {
  const startTime = Date.now(); // Start the timer
  if (testMode) {
    console.log(
      "%c TEST MODE - NO API CALL MADE - Adding Manager Details",
      "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: green; ",
      "Old Data",
      window.FPLToolboxLeagueData.standings
    );

    window.FPLToolboxLeagueData.standings =
      sliceStandingsForUser(superLeagueManagerDataTest.standings)
    console.log(
      "%c TEST MODE - NO API CALL MADE - Adding Manager Details",
      "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: green; ",
      "New Data",
      window.FPLToolboxLeagueData.standings
    );
    console.log("simulating delay")
    await sleep(3000);

    return; // Skip live fetching
  }
  const gwFetches = standings.map(async (team) => {
    try {
      const res = await fetch(BASE_URL + "/entry/" + team.entry + "/");
      const data = await res.json();
      //console.log(data)
      team.managerDetails = data;

      await sleep(1000);
      console.log("delay here");
      //div.innerText = `Adding Manager details for ${team.entry_name}`;
      //console.log(`Adding Manager details for ${team.entry_name}`);
    } catch (error) {
      console.error(`Error fetching data for team ${team.entry}: `, error);
    }
  });

  await Promise.all(gwFetches);
  const endTime = Date.now(); // End the timer
  console.log(
    `Manager details added to league ${(endTime - startTime) / 1000} seconds.`
  );
  console.log(
    "%c API CALL MADE - Adding Manager Details",
    "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: red; ",
    standings
  );

}
async function addGameweeksToLeague(standings, div) {
  const startTime = Date.now(); // Start the timer
  if (testMode) {
    console.log(
      "%c TEST MODE - NO API CALL MADE - Adding Gameweek Details",
      "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: green; ",
      "Old Data",
      window.FPLToolboxLeagueData.standings
    );

    window.FPLToolboxLeagueData.standings =
      sliceStandingsForUser(superLeagueGameweekDataTest.standings);
    console.log(
      "%c TEST MODE - NO API CALL MADE - Adding Gameweek Details",
      "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: green; ",
      "New Data",
      window.FPLToolboxLeagueData.standings
    );
    console.log("simulating delay")
    await sleep(3000);
    return; // Skip live fetching
  }
  const gwFetches = standings.map(async (team) => {
    try {
      const response = await fetch(`${BASE_URL}entry/${team.entry}/history/`);
      const teamData = await response.json();
      //console.log(teamData)
      // Add all gameweeks data to a new array
      team.everyGw = teamData.current.map((week) => ({
        percentile_rank: week.percentile_rank,
        bank: week.bank,
        gameweek: week.event,
        points: week.points,
        rank: week.rank,
        overall_rank: week.overall_rank,
        value: week.value,
        transfers: week.event_transfers,
        transfers_cost: week.event_transfers_cost,
        bench_points: week.points_on_bench,
      }));

      // Helper function to calculate a total for a specific field
      const calculateTotal = (field) =>
        teamData.current.reduce((sum, week) => sum + week[field], 0);

      // Calculate totals
      team.totalTransfers = calculateTotal("event_transfers");
      team.totalMinusPoints = calculateTotal("event_transfers_cost");
      team.totalPointsOnBench = calculateTotal("points_on_bench");

      // Helper function to find best and worst weeks by a specified field
      const findBestWorstWeek = (field) =>
        teamData.current.reduce(
          (result, week) => {
            if (week[field] > result.best[field]) result.best = week;
            if (week[field] < result.worst[field]) result.worst = week;
            return result;
          },
          { best: teamData.current[0], worst: teamData.current[0] }
        );

      // Set best and worst week by points and overall rank
      const { best: bestWeek, worst: worstWeek } = findBestWorstWeek("points");
      team.bestWeek = bestWeek;
      team.worstWeek = worstWeek;

      const { best: bestOverallRankWeek, worst: worstOverallRankWeek } =
        findBestWorstWeek("overall_rank");
      team.bestOverallRankWeek = bestOverallRankWeek;
      team.worstOverallRankWeek = worstOverallRankWeek;

      // Find the highest team value week
      team.highestValueWeek = teamData.current.reduce(
        (highest, week) => (week.value > highest.value ? week : highest),
        teamData.current[0]
      );

      // Add chips data (limited to 6 chips)
      //console.log(teamData)
      team.chips = teamData.chips.slice(0, 6).map((chip) => ({
        name: chip.name,
        time: chip.time,
        gw: chip.event,
      }));

      team.past = teamData.past;

      // Other team data
      team.seasons = teamData.past.length;
      team.seasons_managed = teamData.past[0]?.season_name || "NEW";
      team.previousRank =
        teamData.current[teamData.current.length - 2]?.overall_rank || "";
      // Add a small delay between requests (e.g., 500ms)
      await sleep(1000);
      //div.innerText = `Adding general gameweek stats for ${team.entry_name}`;
      console.log("delay here");
    } catch (error) {
      console.error(`Error fetching data for team ${team.entry}: `, error);
    }
  });

  await Promise.all(gwFetches);
  const endTime = Date.now(); // End the timer
  console.log(
    `All weeks data for all teams added in ${
      (endTime - startTime) / 1000
    } seconds.`
  );
  console.log(
    "%c API CALL MADE - Adding Gameweek Details",
    "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: red; ",
    standings
  );

  return standings;
}

async function addDetailedGameweeksToLeague(standings, div) {
  const startTime = Date.now(); // Start the timer
  console.log(`Searching database for Detailed Gameweek stats`);
  if (testMode) {
    console.log(
      "%c TEST MODE - NO API CALL MADE - Adding Detailed Gameweek Details",
      "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: green; ",
      "Old Data",
      window.FPLToolboxLeagueData.standings
    );

    window.FPLToolboxLeagueData.standings =
      sliceStandingsForUser(superLeagueDetailedGameweekDataTest.standings);
    console.log(
      "%c TEST MODE - NO API CALL MADE - Adding Detailed Gameweek Details",
      "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: green; ",
      "New Data",
      window.FPLToolboxLeagueData.standings
    );
    console.log("simulating delay")
    await sleep(3000);
    return; // Skip live fetching
  }
  const allGwFetches = standings.map(async (team) => {
    try {
      const allGwPromises = [];

      // Fetch picks data for each gameweek from 1 to currentGw
      for (let gw = 1; gw <= currentGw; gw++) {
        allGwPromises.push(
          fetch(`${BASE_URL}entry/${team.entry}/event/${gw}/picks/`)
            .then((response) => response.json())
            .then((data) => ({
              gameweek: gw,
              picks: data.picks || [],
              active_chip: data.active_chip || null,
            }))
        );
        await sleep(1000); // Add small delay between requests
        console.log(
          `Calculating detailed stats about FPL Gameweek ${gw} for your league`
        );
      }

      // Wait for all gameweek data to resolve
      const allGwData = await Promise.all(allGwPromises);

      // Add all gameweek picks data to the new array
      team.everyGwPicks = allGwData;

      // Add current week data
      const currentWeekData = allGwData.find(
        (gwData) => gwData.gameweek === currentGw
      );
      team.currentWeek = currentWeekData ? [currentWeekData] : [];

      // Create an array for weekly captain picks
      team.weeklyCaptainPicks = allGwData.map((gwData) => {
        const captainPick = gwData.picks.find((pick) => pick.is_captain);
        return {
          gameweek: gwData.gameweek,
          captain: captainPick || null,
          captainName: captainPick
            ? getPlayerWebName(captainPick.element)
            : null,
        };
      });

      // Count played stats per gameweek
      team.playedCount = allGwData.map((gwData) => {
        const playedCount = gwData.picks.filter(
          (pick) =>
            pick.multiplier === 1 ||
            pick.multiplier === 2 ||
            pick.multiplier === 3
        ).length;

        const noPlayedCount = gwData.picks.filter(
          (pick) => pick.multiplier === 0
        ).length;

        return {
          gameweek: gwData.gameweek,
          playedCount,
          noPlayedCount,
        };
      });

      // Total across all weeks
      team.totalPlayedStats = team.playedCount.reduce(
        (totals, gwStats) => {
          totals.totalPlayed += gwStats.playedCount;
          totals.totalNotPlayed += gwStats.noPlayedCount;
          return totals;
        },
        { totalPlayed: 0, totalNotPlayed: 0 }
      );

      // Track frequency of each element across all gameweeks
      const elementFrequencyMap = {};
      allGwData.forEach((gwData) => {
        gwData.picks.forEach((pick) => {
          if (!elementFrequencyMap[pick.element]) {
            elementFrequencyMap[pick.element] = 0;
          }
          elementFrequencyMap[pick.element]++;
        });
      });

      // Convert to readable player names and sort by count descending
      const sortedFrequency = Object.entries(elementFrequencyMap)
        .map(([elementId, count]) => ({
          playerName: getPlayerWebName(Number(elementId)),
          count,
        }))
        .sort((a, b) => b.count - a.count);

      team.pickElementFrequency = sortedFrequency;

      await sleep(1000); // Small delay before moving to next team
      console.log("delay here");
      console.log(`Adding detailed gameweek stats for ${team.entry_name}`);
    } catch (error) {
      console.error(
        `Error fetching all gameweeks picks for team ${team.entry}: `,
        error
      );
    }
  });

  await Promise.all(allGwFetches);

  const endTime = Date.now(); // End the timer
  console.log(
    `All current weeks data added in ${(endTime - startTime) / 1000} seconds.`
  );
    console.log(
    "%c API CALL MADE - Adding Detailed Gameweek Details",
    "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: red; ",
    standings
  );
}
async function weeklyPicksForSuperLeague(standings, div) {
  console.time("Weekly Picks Fetch");
    if (testMode) {
    console.log(
      "%c TEST MODE - NO API CALL MADE - Adding Weekly Picks",
      "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: green; ",
      "Old Data",
      window.FPLToolboxLeagueData.standings
    );

    window.FPLToolboxLeagueData.standings =
      sliceStandingsForUser(superLeagueAddWeeklyPicksTest.standings);
    console.log(
      "%c TEST MODE - NO API CALL MADE - Adding Weekly Picks",
      "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: green; ",
      "New Data",
      window.FPLToolboxLeagueData.standings
    );
    console.log("simulating longer delay")
    await sleep(5000);
    return; // Skip live fetching
  }
  const cache = new Map();

  for (let i = 0; i < standings.length; i++) {
    console.log(`Looking for red cards, yellow cards, own goals etc`);
    const team = standings[i];

    if (!team.everyGwPicks || team.everyGwPicks.length === 0) {
      console.warn(`No weekly data available for team ${team.entry}`);
      continue;
    }

    // Initialize stats
    team.total_goals_scored = 0;
    team.total_red_cards = 0;
    team.total_yellow_cards = 0;
    team.total_cards = 0;
    team.total_minutes = 0;
    team.total_assists = 0;
    team.total_clean_sheets = 0;
    team.total_goals_conceded = 0;
    team.total_own_goals = 0;
    team.total_penalties_missed = 0;
    team.total_home_games = 0;
    team.total_away_games = 0;
    team.total_captaincy_points = 0;
    team.allCaptains = [];
    team.total_saves = 0;

    const apiRequests = new Map();

    for (const gameweek of team.everyGwPicks) {
      console.log(`Fetching player stats for ${team.entry_name}.`);
      for (const pick of gameweek.picks) {
        if (pick.position >= 1 && pick.position <= 11) {
          const playerId = pick.element;
          if (cache.has(playerId)) continue;

          const apiUrl = `${BASE_URL}/element-summary/${playerId}/`;
          apiRequests.set(
            playerId,
            fetch(apiUrl).then((res) => res.json())
          );
        }
        console.log(
          `Gathering detailed gameweek starting 11 for ${team.entry_name}.`
        );
      }
    }

    const responses = await Promise.allSettled(apiRequests.values());

    let index = 0;
    for (const [playerId] of apiRequests) {
      const result = responses[index++];
      if (result.status === "fulfilled") {
        cache.set(playerId, result.value);
      } else {
        console.error(`Failed to fetch data for player ${playerId}`);
      }
    }

    for (const gameweek of team.everyGwPicks) {
      for (const pick of gameweek.picks) {
        if (pick.position >= 1 && pick.position <= 11) {
          const playerData = cache.get(pick.element);
          if (!playerData) continue;

          const matchingHistories = playerData.history.filter(
            (entry) => entry.round === gameweek.gameweek
          );

          if (matchingHistories.length === 0) continue;

          // Aggregate stats across all matching histories
          const combined = matchingHistories.reduce(
            (acc, curr) => {
              acc.goals_scored += curr.goals_scored;
              acc.red_cards += curr.red_cards;
              acc.yellow_cards += curr.yellow_cards;
              acc.minutes += curr.minutes;
              acc.assists += curr.assists;
              acc.clean_sheets += curr.clean_sheets;
              acc.goals_conceded += curr.goals_conceded;
              acc.own_goals += curr.own_goals;
              acc.penalties_missed += curr.penalties_missed;
              acc.total_points += curr.total_points;
              acc.saves += curr.saves;

              // Count home/away games
              if (curr.was_home) {
                acc.home_games += 1;
              } else {
                acc.away_games += 1;
              }

              return acc;
            },
            {
              goals_scored: 0,
              red_cards: 0,
              yellow_cards: 0,
              minutes: 0,
              assists: 0,
              clean_sheets: 0,
              goals_conceded: 0,
              own_goals: 0,
              penalties_missed: 0,
              total_points: 0,
              saves: 0,
              home_games: 0,
              away_games: 0,
            }
          );

          team.total_goals_scored += combined.goals_scored;
          team.total_red_cards += combined.red_cards;
          team.total_yellow_cards += combined.yellow_cards;
          team.total_cards += combined.yellow_cards + combined.red_cards;
          team.total_minutes += combined.minutes;
          team.total_assists += combined.assists;
          team.total_clean_sheets += combined.clean_sheets;
          team.total_goals_conceded += combined.goals_conceded;
          team.total_own_goals += combined.own_goals;
          team.total_penalties_missed += combined.penalties_missed;
          team.total_saves += combined.saves;
          team.total_home_games += combined.home_games;
          team.total_away_games += combined.away_games;

          if (pick.is_captain) {
            //console.log("GW" + gameweek.gameweek, getPlayerWebName(pick.element), combined.total_points);
            team.total_captaincy_points +=
              combined.total_points * pick.multiplier;
          }
        }
      }
    }

    //Weekly Scoresheets
    team.gwScoreSheet = [];
    team.gwBenchSheet = [];

    for (const gameweek of team.everyGwPicks) {
      const starters = [];
      const bench = [];

      const gameweekNumber = gameweek.gameweek;

      for (let i = 0; i < gameweek.picks.length; i++) {
        const pick = gameweek.picks[i];
        const playerData = cache.get(pick.element);

        let points = 0;
        if (playerData) {
          const history = playerData.history.find(
            (entry) => entry.round === gameweekNumber
          );
          points = history ? history.total_points * pick.multiplier : 0;
        }

        const pickObj = {
          playerId: pick.element,
          name: getPlayerWebName(pick.element),
          points,
        };

        if (i < 11) {
          starters.push(pickObj);
        } else {
          bench.push(pickObj);
        }
      }

      team.gwScoreSheet.push({
        gameweek: gameweekNumber,
        starters,
      });

      team.gwBenchSheet.push({
        gameweek: gameweekNumber,
        bench,
      });
      console.log(`Calculating bench scores for ${team.entry_name}.`);
    }

    console.log(`Add all gameweek picks for ${team.entry_name}.`);
  }
    console.log(
    "%c API CALL MADE - Weekly Picks Added",
    "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: red; ",
    standings
  );
  console.timeEnd("Weekly Picks Fetch");
}

async function testFunction() {
  alert("working");
  console.log(window.FPLToolboxLeagueData)
}
async function richListNew() {
  console.log(theUser);
  if (!userHasAccess([12])) {
    showModal({
      title: "Pro Feature",
      body: "This feature is only available to <strong>Pro members</strong>. <br><br>Upgrade to unlock!",
      confirmText: "Upgrade Now",
      onConfirm: () => {
        window.location.href = "/subscribe";
      },
    });
    return;
  }
}
function renderMyTeamScreen() {
  const container = document.getElementById("screen-tools");
  container.innerHTML = ""; // clear previous content

  // Add back button
  const backBtn = createBackButton();
  container.appendChild(backBtn);

  const title = document.createElement("h2");
  title.textContent = "My Team";
  container.appendChild(title);

  const table = document.createElement("table");
  table.className = "table";

  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>Player</th>
      <th>Position</th>
      <th>Price</th>
    </tr>`;
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  const exampleTeam = [
    { player: "Erling Haaland", position: "Forward", price: "£12.0m" },
    { player: "Trent Alexander-Arnold", position: "Defender", price: "£7.5m" },
    { player: "Declan Rice", position: "Midfielder", price: "£6.0m" },
    { player: "Ivan Toney", position: "Forward", price: "£8.0m" },
    { player: "Nick Pope", position: "Goalkeeper", price: "£5.0m" },
  ];

  exampleTeam.forEach(({ player, position, price }) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${player}</td>
      <td>${position}</td>
      <td>${price}</td>
    `;
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

async function testFunction2() {
  if (!userHasAccess([12])) {
    showModal({
      title: "Pro Feature",
      body: "This feature is only available to <strong>Pro members</strong>. <br><br>Upgrade to unlock!",
      confirmText: "Upgrade Now",
      onConfirm: () => {
        window.location.href = "/subscribe";
      },
    });
    return;
  }

  if (window.FPLToolboxLeagueData?.standings?.length) {
    console.log(window.FPLToolboxLeagueData);
  }
}

async function showCaptaincyPointsLeague() {
  const container = document.getElementById("screen-tools");
  container.innerHTML = "";

  // Add back button (styled with Bootstrap)
  const backBtn = createBackButton();
  backBtn.classList.add("btn", "btn-secondary", "mb-3");
  container.appendChild(backBtn);

  console.log(FPLToolboxLeagueData);

  const leagueTable = document.createElement("div");
  leagueTable.setAttribute("id", "league-table");
  container.appendChild(leagueTable);

  // Header
  const tableDescription = document.createElement("h6");
  tableDescription.innerText = `${FPLToolboxLeagueData.leagueName} \n Captaincy Points Leaderboard`;
  tableDescription.classList.add("text-center", "mb-3");
  leagueTable.appendChild(tableDescription);

  // Create table with Bootstrap classes
  const table = document.createElement("table");
  table.classList.add(
    "table",
    "table-striped",
    "table-hover",
    "table-bordered"
  );

  // Detect dark mode if applicable
  const darkMode = localStorage.getItem("darkMode") === "true";
  table.classList.add(darkMode ? "table-dark" : "table-light");

  // Table header
  const tableHeader = document.createElement("thead");
  const tableHeaderRow = document.createElement("tr");

  const headers = ["#", "Team Name", "TOT"];
  headers.forEach((headerText, index) => {
    const th = document.createElement("th");
    th.innerText = headerText;

    if (headerText === "TOT") {
      th.innerHTML = `TOT <span id="sort-indicator">▼</span>`;
      th.classList.add("text-end");
      th.style.cursor = "pointer";
    }

    tableHeaderRow.appendChild(th);
  });

  tableHeader.appendChild(tableHeaderRow);
  table.appendChild(tableHeader);

  const tableBody = document.createElement("tbody");

  FPLToolboxLeagueData.standings.forEach((team, index) => {
    const row = document.createElement("tr");

    const rowNumberCell = document.createElement("td");
    rowNumberCell.innerText = index + 1;
    row.appendChild(rowNumberCell);

    const teamNameCell = document.createElement("td");
    teamNameCell.innerHTML = `<strong>${team.entry_name}</strong><br><small>${team.player_name}</small>`;
    row.appendChild(teamNameCell);

    const captaincyPointsCell = document.createElement("td");
    captaincyPointsCell.innerText = team.total_captaincy_points || 0;
    captaincyPointsCell.classList.add("text-end");
    row.appendChild(captaincyPointsCell);

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  leagueTable.appendChild(table);

  // Sort logic
  const sortTable = (ascending = false) => {
    const rows = Array.from(tableBody.querySelectorAll("tr"));
    rows.sort((rowA, rowB) => {
      const pointsA = parseFloat(rowA.cells[2].innerText);
      const pointsB = parseFloat(rowB.cells[2].innerText);
      return ascending ? pointsA - pointsB : pointsB - pointsA;
    });

    rows.forEach((row, index) => {
      row.cells[0].innerText = index + 1;
      tableBody.appendChild(row);
    });

    const sortIndicator = document.getElementById("sort-indicator");
    sortIndicator.innerText = ascending ? "▲" : "▼";
  };

  // Initial sort
  sortTable(false);

  // Toggle sort on header click
  tableHeaderRow.children[2].addEventListener("click", () => {
    const isAscending = tableHeaderRow.children[2].dataset.sorted === "asc";
    tableHeaderRow.children[2].dataset.sorted = isAscending ? "desc" : "asc";
    sortTable(!isAscending);
  });

  // Share Button
  const shareButton = document.createElement("button");
  shareButton.innerText = "Share League";
  shareButton.classList.add("btn", "btn-primary", "mt-3");
  shareButton.onclick = shareLeague;
  leagueTable.appendChild(shareButton);

  function shareLeague() {
    const rows = Array.from(tableBody.querySelectorAll("tr"));
    let shareMessage = `${FPLToolboxLeagueData.leagueName}\nCaptaincy Points Leaderboard:\n`;
    rows.forEach((row, index) => {
      const teamName = row.cells[1].innerText.split("\n")[0];
      const captaincyPoints = row.cells[2].innerText;
      shareMessage += `${
        index + 1
      }. ${teamName} - Captaincy Points: ${captaincyPoints}\n`;
    });

    shareMessage += `\nView your own league right here:\n https://fpltoolbox.com/fpl-toolbox-pro`;

    if (navigator.share) {
      navigator
        .share({
          title: "Share League",
          text: shareMessage,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      alert("Sharing is not supported in this browser.");
    }
  }
}
async function showBenchedPointsLeague() {
  const container = document.getElementById("screen-tools");
  container.innerHTML = "";

  // Add back button (styled with Bootstrap)
  const backBtn = createBackButton();
  backBtn.classList.add("btn", "btn-secondary", "mb-3");
  container.appendChild(backBtn);

  console.log(FPLToolboxLeagueData);

  const leagueTable = document.createElement("div");
  leagueTable.setAttribute("id", "league-table");
  container.appendChild(leagueTable);

  // Header
  const tableDescription = document.createElement("h6");
  tableDescription.innerText = `${FPLToolboxLeagueData.leagueName} \n Benched Points Leaderboard`;
  tableDescription.classList.add("text-center", "mb-3");
  leagueTable.appendChild(tableDescription);

  // Create table with Bootstrap classes
  const table = document.createElement("table");
  table.classList.add("table", "table-striped", "table-hover", "table-bordered");

  // Detect dark mode if applicable
  const darkMode = localStorage.getItem("darkMode") === "true";
  table.classList.add(darkMode ? "table-dark" : "table-light");

  // Table header
  const tableHeader = document.createElement("thead");
  const tableHeaderRow = document.createElement("tr");

  const headers = ["#", "Team Name", "TOT"];
  headers.forEach((headerText, index) => {
    const th = document.createElement("th");
    th.innerText = headerText;

    if (headerText === "TOT") {
      th.innerHTML = `TOT <span id="sort-indicator">▼</span>`;
      th.classList.add("text-end");
      th.style.cursor = "pointer";
    }

    tableHeaderRow.appendChild(th);
  });

  tableHeader.appendChild(tableHeaderRow);
  table.appendChild(tableHeader);

  const tableBody = document.createElement("tbody");

  FPLToolboxLeagueData.standings.forEach((team, index) => {
    const row = document.createElement("tr");

    const rowNumberCell = document.createElement("td");
    rowNumberCell.innerText = index + 1;
    row.appendChild(rowNumberCell);

    const teamNameCell = document.createElement("td");
    teamNameCell.innerHTML = `<strong>${team.entry_name}</strong><br><small>${team.player_name}</small>`;
    row.appendChild(teamNameCell);

    const benchedPointsCell = document.createElement("td");
    benchedPointsCell.innerText = team.totalPointsOnBench || 0;
    benchedPointsCell.classList.add("text-end");
    row.appendChild(benchedPointsCell);

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  leagueTable.appendChild(table);

  // Sort logic
  const sortTable = (ascending = false) => {
    const rows = Array.from(tableBody.querySelectorAll("tr"));
    rows.sort((rowA, rowB) => {
      const pointsA = parseFloat(rowA.cells[2].innerText);
      const pointsB = parseFloat(rowB.cells[2].innerText);
      return ascending ? pointsA - pointsB : pointsB - pointsA;
    });

    rows.forEach((row, index) => {
      row.cells[0].innerText = index + 1;
      tableBody.appendChild(row);
    });

    const sortIndicator = document.getElementById("sort-indicator");
    sortIndicator.innerText = ascending ? "▲" : "▼";
  };

  // Initial sort
  sortTable(false);

  // Toggle sort on header click
  tableHeaderRow.children[2].addEventListener("click", () => {
    const isAscending = tableHeaderRow.children[2].dataset.sorted === "asc";
    tableHeaderRow.children[2].dataset.sorted = isAscending ? "desc" : "asc";
    sortTable(!isAscending);
  });

  // Share Button
  const shareButton = document.createElement("button");
  shareButton.innerText = "Share League";
  shareButton.classList.add("btn", "btn-primary", "mt-3");
  shareButton.onclick = shareLeague;
  leagueTable.appendChild(shareButton);

  function shareLeague() {
    const rows = Array.from(tableBody.querySelectorAll("tr"));
    let shareMessage = `${FPLToolboxLeagueData.leagueName}\nBenched Points Leaderboard:\n`;
    rows.forEach((row, index) => {
      const teamName = row.cells[1].innerText.split("\n")[0];
      const benchedPoints = row.cells[2].innerText;
      shareMessage += `${index + 1}. ${teamName} - Benched Points: ${benchedPoints}\n`;
    });

    shareMessage += `\nView your own league right here:\n https://fpltoolbox.com/fpl-toolbox-pro`;

    if (navigator.share) {
      navigator
        .share({
          title: "Share League",
          text: shareMessage,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      alert("Sharing is not supported in this browser.");
    }
  }
}






//HELPERS
// Convert FPL chip name to user-friendly chip names
function convertChipName(chip) {
  const chipMap = {
    wildcard: "WC",
    freehit: "FH",
    bboost: "BB",
    manager: "AM",
    "3xc": "TC",
    "": "",
  };
  return chipMap[chip] || chip;
}

// Make getFootballerObject return a Promise
function getFootballerObject(playerId) {
  return new Promise((resolve, reject) => {
    const player = bootstrap.elements.find(el => el.id == playerId);

    if (!player) {
      reject(`Player with ID ${playerId} not found.`);
      return;
    }

    const team = bootstrap.teams.find(t => t.id == player.team);

    const footballer = {
      web_name: player.web_name,
      first_name: player.first_name,
      second_name: player.second_name,
      event_points: player.event_points,
      dreamteam: player.in_dreamteam,
      points_per_game: player.points_per_game,
      transfers_in: player.transfers_in,
      transfers_in_event: player.transfers_in_event,
      transfers_out: player.transfers_out,
      transfers_out_event: player.transfers_out_event,
      price_change: player.cost_change_event,
      news: player.news,
      team_code: player.team_code,
      element_type: player.element_type,
      ep_this: player.ep_this,
      ep_next: player.ep_next,
      photo: player.photo,
      total_points: player.total_points,
      goals_scored: player.goals_scored,
      assists: player.assists,
      type: player.element_type,
      team: team ? team.name : "Unknown",
    };

    resolve(footballer);
  });
}


// Make getPlayerWebName async
async function getPlayerWebName(playerId) {
  const footballer = await getFootballerObject(playerId); // Store the returned object
  return footballer.web_name;
}


function getTeamName(teamCode) {
  for (var i = 0; i < bootstrap.teams.length; i++) {
    if (bootstrap.teams[i].id == teamCode) {
      return bootstrap.teams[i].name;
    }
  }
}

function getTeamShortName(teamCode) {
  for (var i = 0; i < bootstrap.teams.length; i++) {
    if (bootstrap.teams[i].id == teamCode) {
      return bootstrap.teams[i].short_name;
    }
  }
}

function getPlayerScore(playerId) {
  getFootballerObject(playerId);
  return footballer.event_points;
}
function getPlayerAssists(playerId) {
  getFootballerObject(playerId);
  return footballer.assists;
}
function getPlayerGoals(playerId) {
  getFootballerObject(playerId);
  return footballer.goals_scored;
}

function getPlayerTeam(playerId) {
  getFootballerObject(playerId);
  return footballer.team;
}
function getPlayerTeamCode(playerId) {
  getFootballerObject(playerId);
  return footballer.team_code;
}
function getPlayerEP(playerId) {
  getFootballerObject(playerId);
  return footballer.ep_this;
}

function getPlayerTotalPoints(playerId) {
  getFootballerObject(playerId);
  return footballer.total_points;
}

function getPlayerType(playerId) {
  getFootballerObject(playerId);
  return footballer.element_type;
}

function getPlayerPhoto(playerId) {
  getFootballerObject(playerId);
  return footballer.photo;
}


// function compareObjects(obj1, obj2) {
//   const keys1 = Object.keys(obj1);
//   const keys2 = Object.keys(obj2);

//   const allKeys = new Set([...keys1, ...keys2]);
//   let hasDifferences = false;

//   allKeys.forEach((key) => {
//     if (!(key in obj1)) {
//       console.log(`❌ Key "${key}" is missing in the first object`);
//       hasDifferences = true;
//     } else if (!(key in obj2)) {
//       console.log(`❌ Key "${key}" is missing in the second object`);
//       hasDifferences = true;
//     } else if (obj1[key] !== obj2[key]) {
//       console.log(`❌ Value mismatch for key "${key}": ${obj1[key]} !== ${obj2[key]}`);
//       hasDifferences = true;
//     }
//   });

//   if (!hasDifferences) {
//     console.log("✅ Objects are the same");
//   }
// }

// const object1 = {
//     "id": 1450135,
//     "event_total": 62,
//     "player_name": "Lovro Budišin",
//     "rank": 1,
//     "last_rank": 1,
//     "rank_sort": 1,
//     "total": 2810,
//     "entry": 235307,
//     "entry_name": "Aina Krafth Bree*",
//     "has_played": true,
//     "managerDetails": {
//         "id": 235307,
//         "joined_time": "2024-07-17T14:46:58.321789Z",
//         "started_event": 1,
//         "favourite_team": null,
//         "player_first_name": "Lovro",
//         "player_last_name": "Budišin",
//         "player_region_id": 97,
//         "player_region_name": "Croatia",
//         "player_region_iso_code_short": "HR",
//         "player_region_iso_code_long": "HRV",
//         "years_active": 5,
//         "summary_overall_points": 2810,
//         "summary_overall_rank": 1,
//         "summary_event_points": 62,
//         "summary_event_rank": 1551968,
//         "current_event": 38,
//         "leagues": {
//             "classic": [
//                 {
//                     "id": 117,
//                     "name": "Croatia",
//                     "short_name": "region-97",
//                     "created": "2024-07-17T11:51:47.131578Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "s",
//                     "scoring": "c",
//                     "admin_entry": null,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2513318,
//                     "cup_qualified": true,
//                     "rank_count": 29689,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 117,
//                             "rank_count": 29689,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 301,
//                             "last_rank": 215,
//                             "rank_sort": 301,
//                             "total": 254,
//                             "league_id": 117,
//                             "rank_count": 29689,
//                             "entry_percentile_rank": 5
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 276,
//                     "name": "Gameweek 1",
//                     "short_name": "event-1",
//                     "created": "2024-07-17T11:51:48.316462Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "s",
//                     "scoring": "c",
//                     "admin_entry": null,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": false,
//                     "cup_league": null,
//                     "cup_qualified": null,
//                     "rank_count": 8569336,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 276,
//                             "rank_count": 8569336,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 68319,
//                             "last_rank": 40767,
//                             "rank_sort": 68398,
//                             "total": 254,
//                             "league_id": 276,
//                             "rank_count": 8569236,
//                             "entry_percentile_rank": 1
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 314,
//                     "name": "Overall",
//                     "short_name": "overall",
//                     "created": "2024-07-17T11:51:48.594925Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "s",
//                     "scoring": "c",
//                     "admin_entry": null,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2421396,
//                     "cup_qualified": true,
//                     "rank_count": 11433197,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 314,
//                             "rank_count": 11433197,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 71744,
//                             "last_rank": 43296,
//                             "rank_sort": 71823,
//                             "total": 254,
//                             "league_id": 314,
//                             "rank_count": 11433093,
//                             "entry_percentile_rank": 1
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 319,
//                     "name": "Arena Sport League",
//                     "short_name": "brd-arenasport",
//                     "created": "2024-07-17T11:51:48.631418Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "s",
//                     "scoring": "c",
//                     "admin_entry": null,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2484678,
//                     "cup_qualified": true,
//                     "rank_count": 138790,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 319,
//                             "rank_count": 138790,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 1328,
//                             "last_rank": 950,
//                             "rank_sort": 1328,
//                             "total": 254,
//                             "league_id": 319,
//                             "rank_count": 138789,
//                             "entry_percentile_rank": 1
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 321,
//                     "name": "Second Chance",
//                     "short_name": "sc",
//                     "created": "2024-07-17T11:51:48.646333Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "s",
//                     "scoring": "c",
//                     "admin_entry": null,
//                     "start_event": 21,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": false,
//                     "cup_league": null,
//                     "cup_qualified": null,
//                     "rank_count": 11433186,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 105,
//                             "last_rank": 80,
//                             "rank_sort": 105,
//                             "total": 1373,
//                             "league_id": 321,
//                             "rank_count": 11433186,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 71744,
//                             "last_rank": 43296,
//                             "rank_sort": 71823,
//                             "total": 254,
//                             "league_id": 321,
//                             "rank_count": 11433089,
//                             "entry_percentile_rank": 1
//                         }
//                     ],
//                     "entry_rank": 105,
//                     "entry_last_rank": 80
//                 },
//                 {
//                     "id": 1194,
//                     "name": "youtube.com/letstalkfpl 📽️",
//                     "short_name": null,
//                     "created": "2024-07-17T13:32:58.932145Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 24,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2498395,
//                     "cup_qualified": true,
//                     "rank_count": 127321,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 1194,
//                             "rank_count": 127321,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 4261,
//                             "last_rank": 2560,
//                             "rank_sort": 4278,
//                             "total": 254,
//                             "league_id": 1194,
//                             "rank_count": 127321,
//                             "entry_percentile_rank": 5
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 5020,
//                     "name": "youtube.com/FPLRaptor",
//                     "short_name": null,
//                     "created": "2024-07-17T13:38:25.352331Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 746,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2505430,
//                     "cup_qualified": true,
//                     "rank_count": 51201,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 5020,
//                             "rank_count": 51201,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 2054,
//                             "last_rank": 1199,
//                             "rank_sort": 2066,
//                             "total": 254,
//                             "league_id": 5020,
//                             "rank_count": 51201,
//                             "entry_percentile_rank": 5
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 8719,
//                     "name": "FPL Caffe",
//                     "short_name": null,
//                     "created": "2024-07-17T13:43:26.210823Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 44153,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2538948,
//                     "cup_qualified": true,
//                     "rank_count": 1490,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 8719,
//                             "rank_count": 1490,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 49,
//                             "last_rank": 34,
//                             "rank_sort": 49,
//                             "total": 254,
//                             "league_id": 8719,
//                             "rank_count": 1490,
//                             "entry_percentile_rank": 5
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 31758,
//                     "name": "youtube.com/FPLMate 🏆",
//                     "short_name": null,
//                     "created": "2024-07-17T14:19:36.491790Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 96,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2505436,
//                     "cup_qualified": true,
//                     "rank_count": 64404,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 31758,
//                             "rank_count": 64404,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 2003,
//                             "last_rank": 1166,
//                             "rank_sort": 2008,
//                             "total": 254,
//                             "league_id": 31758,
//                             "rank_count": 64404,
//                             "entry_percentile_rank": 5
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 50794,
//                     "name": "Tribina.hr",
//                     "short_name": null,
//                     "created": "2024-07-17T15:09:52.467119Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 263845,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2539005,
//                     "cup_qualified": true,
//                     "rank_count": 1242,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 50794,
//                             "rank_count": 1242,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 22,
//                             "last_rank": 25,
//                             "rank_sort": 22,
//                             "total": 254,
//                             "league_id": 50794,
//                             "rank_count": 1242,
//                             "entry_percentile_rank": 5
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 59293,
//                     "name": "FPLXperti - FREE LIGA ⚽️💥",
//                     "short_name": null,
//                     "created": "2024-07-17T15:40:31.154182Z",
//                     "closed": true,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 103992,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2539016,
//                     "cup_qualified": true,
//                     "rank_count": 1804,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 59293,
//                             "rank_count": 1804,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 49,
//                             "last_rank": 33,
//                             "rank_sort": 49,
//                             "total": 254,
//                             "league_id": 59293,
//                             "rank_count": 1804,
//                             "entry_percentile_rank": 5
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 63048,
//                     "name": "YouTube.com/FPLFocal",
//                     "short_name": null,
//                     "created": "2024-07-17T15:55:12.068915Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 1301,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2505440,
//                     "cup_qualified": true,
//                     "rank_count": 55824,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 63048,
//                             "rank_count": 55824,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 2006,
//                             "last_rank": 1100,
//                             "rank_sort": 2011,
//                             "total": 254,
//                             "league_id": 63048,
//                             "rank_count": 55824,
//                             "entry_percentile_rank": 5
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 81846,
//                     "name": "Hrvatski Fantazisti",
//                     "short_name": null,
//                     "created": "2024-07-17T17:15:13.588900Z",
//                     "closed": true,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 6793,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2534880,
//                     "cup_qualified": true,
//                     "rank_count": 2454,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 81846,
//                             "rank_count": 2454,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 65,
//                             "last_rank": 53,
//                             "rank_sort": 65,
//                             "total": 254,
//                             "league_id": 81846,
//                             "rank_count": 2454,
//                             "entry_percentile_rank": 5
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 155246,
//                     "name": "Strajina liga",
//                     "short_name": null,
//                     "created": "2024-07-18T09:14:11.496849Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 849613,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2513365,
//                     "cup_qualified": true,
//                     "rank_count": 19278,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 155246,
//                             "rank_count": 19278,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 299,
//                             "last_rank": 206,
//                             "rank_sort": 299,
//                             "total": 254,
//                             "league_id": 155246,
//                             "rank_count": 19278,
//                             "entry_percentile_rank": 5
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 409645,
//                     "name": "Amigo",
//                     "short_name": null,
//                     "created": "2024-07-24T16:35:02.354058Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 130607,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 3274335,
//                     "cup_qualified": true,
//                     "rank_count": 6,
//                     "entry_percentile_rank": 20,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 409645,
//                             "rank_count": 6,
//                             "entry_percentile_rank": 20
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 254,
//                             "league_id": 409645,
//                             "rank_count": 6,
//                             "entry_percentile_rank": 20
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 438288,
//                     "name": "Dama pije sama",
//                     "short_name": null,
//                     "created": "2024-07-25T17:21:02.662656Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 2283701,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 3297087,
//                     "cup_qualified": true,
//                     "rank_count": 6,
//                     "entry_percentile_rank": 20,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 438288,
//                             "rank_count": 6,
//                             "entry_percentile_rank": 20
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 254,
//                             "league_id": 438288,
//                             "rank_count": 6,
//                             "entry_percentile_rank": 20
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 461668,
//                     "name": "Liga Ikona - Poklon Studio",
//                     "short_name": null,
//                     "created": "2024-07-26T17:15:54.440777Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 2092534,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2530757,
//                     "cup_qualified": true,
//                     "rank_count": 5246,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 461668,
//                             "rank_count": 5246,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 97,
//                             "last_rank": 72,
//                             "rank_sort": 97,
//                             "total": 254,
//                             "league_id": 461668,
//                             "rank_count": 5246,
//                             "entry_percentile_rank": 5
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 905297,
//                     "name": "the OFFSIDE",
//                     "short_name": null,
//                     "created": "2024-08-10T09:46:00.685493Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 4236582,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2535128,
//                     "cup_qualified": true,
//                     "rank_count": 3698,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 905297,
//                             "rank_count": 3698,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 52,
//                             "last_rank": 39,
//                             "rank_sort": 52,
//                             "total": 254,
//                             "league_id": 905297,
//                             "rank_count": 3698,
//                             "entry_percentile_rank": 5
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 1169492,
//                     "name": "KLC fantaziranje",
//                     "short_name": null,
//                     "created": "2024-08-13T11:30:05.783847Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 5308147,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 3798207,
//                     "cup_qualified": true,
//                     "rank_count": 4,
//                     "entry_percentile_rank": 25,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 1169492,
//                             "rank_count": 4,
//                             "entry_percentile_rank": 25
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 254,
//                             "league_id": 1169492,
//                             "rank_count": 4,
//                             "entry_percentile_rank": 25
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 1289672,
//                     "name": "Behzinga Championship",
//                     "short_name": null,
//                     "created": "2024-08-14T10:10:53.245175Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 1215424,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2505455,
//                     "cup_qualified": true,
//                     "rank_count": 42731,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 1289672,
//                             "rank_count": 42731,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 391,
//                             "last_rank": 227,
//                             "rank_sort": 391,
//                             "total": 254,
//                             "league_id": 1289672,
//                             "rank_count": 42730,
//                             "entry_percentile_rank": 1
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 1768929,
//                     "name": "THE PRIME FPL CHAMPIONSHIP",
//                     "short_name": null,
//                     "created": "2024-08-16T12:46:28.310161Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 141594,
//                     "start_event": 1,
//                     "entry_can_leave": true,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2484684,
//                     "cup_qualified": false,
//                     "rank_count": 144611,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 1768929,
//                             "rank_count": 144611,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 2055,
//                             "last_rank": 1195,
//                             "rank_sort": 2062,
//                             "total": 254,
//                             "league_id": 1768929,
//                             "rank_count": 144610,
//                             "entry_percentile_rank": 5
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 }
//             ],
//             "h2h": [],
//             "cup": {
//                 "matches": [],
//                 "status": {
//                     "qualification_event": null,
//                     "qualification_numbers": null,
//                     "qualification_rank": null,
//                     "qualification_state": null
//                 },
//                 "cup_league": null
//             },
//             "cup_matches": [
//                 {
//                     "id": 112394128,
//                     "entry_1_entry": 1242386,
//                     "entry_1_name": "MyBoys",
//                     "entry_1_player_name": "Tyson Webster",
//                     "entry_1_points": 135,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 235307,
//                     "entry_2_name": "Aina Krafth Bree*",
//                     "entry_2_player_name": "Lovro Budišin",
//                     "entry_2_points": 134,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2498395,
//                     "winner": 1242386,
//                     "seed_value": null,
//                     "event": 24,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 32768"
//                 },
//                 {
//                     "id": 114552940,
//                     "entry_1_entry": 4738591,
//                     "entry_1_name": "Khaled",
//                     "entry_1_player_name": "Khaled Ammar",
//                     "entry_1_points": 97,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 235307,
//                     "entry_2_name": "Aina Krafth Bree*",
//                     "entry_2_player_name": "Lovro Budišin",
//                     "entry_2_points": 86,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2421396,
//                     "winner": 4738591,
//                     "seed_value": null,
//                     "event": 25,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 16384"
//                 },
//                 {
//                     "id": 115132012,
//                     "entry_1_entry": 235307,
//                     "entry_1_name": "Aina Krafth Bree*",
//                     "entry_1_player_name": "Lovro Budišin",
//                     "entry_1_points": 86,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 6308696,
//                     "entry_2_name": "ZVIBABA FC",
//                     "entry_2_player_name": "Tendai Nigel",
//                     "entry_2_points": 95,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2505430,
//                     "winner": 6308696,
//                     "seed_value": null,
//                     "event": 25,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 16384"
//                 },
//                 {
//                     "id": 115465544,
//                     "entry_1_entry": 235307,
//                     "entry_1_name": "Aina Krafth Bree*",
//                     "entry_1_player_name": "Lovro Budišin",
//                     "entry_1_points": 86,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 4309825,
//                     "entry_2_name": "Chewrassic Park",
//                     "entry_2_player_name": "Brandon Chew",
//                     "entry_2_points": 115,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2505440,
//                     "winner": 4309825,
//                     "seed_value": null,
//                     "event": 25,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 16384"
//                 },
//                 {
//                     "id": 115486068,
//                     "entry_1_entry": 9931521,
//                     "entry_1_name": "Okocha",
//                     "entry_1_player_name": "Marin Jovanović",
//                     "entry_1_points": 94,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 235307,
//                     "entry_2_name": "Aina Krafth Bree*",
//                     "entry_2_player_name": "Lovro Budišin",
//                     "entry_2_points": 86,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2513318,
//                     "winner": 9931521,
//                     "seed_value": null,
//                     "event": 25,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 16384"
//                 },
//                 {
//                     "id": 120214541,
//                     "entry_1_entry": 7340261,
//                     "entry_1_name": "TmPA",
//                     "entry_1_player_name": "Tor Mahtte Anti",
//                     "entry_1_points": 53,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 235307,
//                     "entry_2_name": "Aina Krafth Bree*",
//                     "entry_2_player_name": "Lovro Budišin",
//                     "entry_2_points": 49,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2505455,
//                     "winner": 7340261,
//                     "seed_value": null,
//                     "event": 27,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 4096"
//                 },
//                 {
//                     "id": 120235302,
//                     "entry_1_entry": 5691853,
//                     "entry_1_name": "Kolibri United",
//                     "entry_1_player_name": "Miloš Dragutinović",
//                     "entry_1_points": 61,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 235307,
//                     "entry_2_name": "Aina Krafth Bree*",
//                     "entry_2_player_name": "Lovro Budišin",
//                     "entry_2_points": 49,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2484678,
//                     "winner": 5691853,
//                     "seed_value": null,
//                     "event": 27,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 4096"
//                 },
//                 {
//                     "id": 120291620,
//                     "entry_1_entry": 235307,
//                     "entry_1_name": "Aina Krafth Bree*",
//                     "entry_1_player_name": "Lovro Budišin",
//                     "entry_1_points": 49,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 866887,
//                     "entry_2_name": "Kudos to you",
//                     "entry_2_player_name": "Callum Laver",
//                     "entry_2_points": 67,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2505436,
//                     "winner": 866887,
//                     "seed_value": null,
//                     "event": 27,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 4096"
//                 },
//                 {
//                     "id": 120461457,
//                     "entry_1_entry": 3688328,
//                     "entry_1_name": "Montana Junior",
//                     "entry_1_player_name": "Nikola Nanusevski",
//                     "entry_1_points": 54,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 235307,
//                     "entry_2_name": "Aina Krafth Bree*",
//                     "entry_2_player_name": "Lovro Budišin",
//                     "entry_2_points": 49,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2513365,
//                     "winner": 3688328,
//                     "seed_value": null,
//                     "event": 27,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 4096"
//                 },
//                 {
//                     "id": 121035664,
//                     "entry_1_entry": 235307,
//                     "entry_1_name": "Aina Krafth Bree*",
//                     "entry_1_player_name": "Lovro Budišin",
//                     "entry_1_points": 49,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 2568167,
//                     "entry_2_name": "Marojko_Herc",
//                     "entry_2_player_name": "Tony Glibo",
//                     "entry_2_points": 57,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2530757,
//                     "winner": 2568167,
//                     "seed_value": null,
//                     "event": 27,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 4096"
//                 },
//                 {
//                     "id": 123139843,
//                     "entry_1_entry": 235307,
//                     "entry_1_name": "Aina Krafth Bree*",
//                     "entry_1_player_name": "Lovro Budišin",
//                     "entry_1_points": 62,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 6421114,
//                     "entry_2_name": "Proud to be Croat",
//                     "entry_2_player_name": "Toni Celic",
//                     "entry_2_points": 69,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2534880,
//                     "winner": 6421114,
//                     "seed_value": null,
//                     "event": 28,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 2048"
//                 },
//                 {
//                     "id": 123328143,
//                     "entry_1_entry": 5842040,
//                     "entry_1_name": "Pickle's Team",
//                     "entry_1_player_name": "Pavle Vuković",
//                     "entry_1_points": 63,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 235307,
//                     "entry_2_name": "Aina Krafth Bree*",
//                     "entry_2_player_name": "Lovro Budišin",
//                     "entry_2_points": 62,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2535128,
//                     "winner": 5842040,
//                     "seed_value": null,
//                     "event": 28,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 2048"
//                 },
//                 {
//                     "id": 123388162,
//                     "entry_1_entry": 235307,
//                     "entry_1_name": "Aina Krafth Bree*",
//                     "entry_1_player_name": "Lovro Budišin",
//                     "entry_1_points": 62,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 6457163,
//                     "entry_2_name": "Debeli Ronaldo",
//                     "entry_2_player_name": "Čedomir Došenović",
//                     "entry_2_points": 75,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2538948,
//                     "winner": 6457163,
//                     "seed_value": null,
//                     "event": 28,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 2048"
//                 },
//                 {
//                     "id": 123525557,
//                     "entry_1_entry": 320728,
//                     "entry_1_name": "Konavljanin",
//                     "entry_1_player_name": "Ante Bezelj",
//                     "entry_1_points": 74,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 235307,
//                     "entry_2_name": "Aina Krafth Bree*",
//                     "entry_2_player_name": "Lovro Budišin",
//                     "entry_2_points": 62,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2539005,
//                     "winner": 320728,
//                     "seed_value": null,
//                     "event": 28,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 2048"
//                 },
//                 {
//                     "id": 132149865,
//                     "entry_1_entry": 3541225,
//                     "entry_1_name": "Kalimanova Glava",
//                     "entry_1_player_name": "Dimitar Rashko",
//                     "entry_1_points": 92,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 235307,
//                     "entry_2_name": "Aina Krafth Bree*",
//                     "entry_2_player_name": "Lovro Budišin",
//                     "entry_2_points": 86,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2539016,
//                     "winner": 3541225,
//                     "seed_value": null,
//                     "event": 34,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 32"
//                 },
//                 {
//                     "id": 148321444,
//                     "entry_1_entry": 2334463,
//                     "entry_1_name": "N.T",
//                     "entry_1_player_name": "Niko Tomašević",
//                     "entry_1_points": 51,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 235307,
//                     "entry_2_name": "Aina Krafth Bree*",
//                     "entry_2_player_name": "Lovro Budišin",
//                     "entry_2_points": 58,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 3297087,
//                     "winner": 235307,
//                     "seed_value": null,
//                     "event": 38,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Final"
//                 },
//                 {
//                     "id": 148362900,
//                     "entry_1_entry": 130607,
//                     "entry_1_name": "Žamal",
//                     "entry_1_player_name": "Marko Matijašić",
//                     "entry_1_points": 34,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 235307,
//                     "entry_2_name": "Aina Krafth Bree*",
//                     "entry_2_player_name": "Lovro Budišin",
//                     "entry_2_points": 58,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 3274335,
//                     "winner": 235307,
//                     "seed_value": null,
//                     "event": 38,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Final"
//                 },
//                 {
//                     "id": 148834447,
//                     "entry_1_entry": 4235387,
//                     "entry_1_name": "Kičma noge ruke noge",
//                     "entry_1_player_name": "Gordan Manojlovic",
//                     "entry_1_points": 33,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 235307,
//                     "entry_2_name": "Aina Krafth Bree*",
//                     "entry_2_player_name": "Lovro Budišin",
//                     "entry_2_points": 58,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 3798207,
//                     "winner": 235307,
//                     "seed_value": null,
//                     "event": 38,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Final"
//                 }
//             ]
//         },
//         "name": "Aina Krafth Bree*",
//         "name_change_blocked": false,
//         "entered_events": [
//             1,
//             2,
//             3,
//             4,
//             5,
//             6,
//             7,
//             8,
//             9,
//             10,
//             11,
//             12,
//             13,
//             14,
//             15,
//             16,
//             17,
//             18,
//             19,
//             20,
//             21,
//             22,
//             23,
//             24,
//             25,
//             26,
//             27,
//             28,
//             29,
//             30,
//             31,
//             32,
//             33,
//             34,
//             35,
//             36,
//             37,
//             38
//         ],
//         "kit": "{\"kit_shirt_type\":\"plain\",\"kit_shirt_base\":\"#E1E1E1\",\"kit_shirt_sleeves\":\"#E1E1E1\",\"kit_shirt_secondary\":\"#E1E1E1\",\"kit_shirt_logo\":\"none\",\"kit_shorts\":\"#E1E1E1\",\"kit_socks_type\":\"plain\",\"kit_socks_base\":\"#E1E1E1\",\"kit_socks_secondary\":\"#E1E1E1\"}",
//         "last_deadline_bank": 11,
//         "last_deadline_value": 1061,
//         "last_deadline_total_transfers": 37
//     },
//     "everyGw": [
//         {
//             "percentile_rank": 5,
//             "bank": 10,
//             "gameweek": 1,
//             "points": 80,
//             "rank": 321537,
//             "overall_rank": 321537,
//             "value": 1000,
//             "transfers": 0,
//             "transfers_cost": 0,
//             "bench_points": 3
//         },
//         {
//             "percentile_rank": 35,
//             "bank": 10,
//             "gameweek": 2,
//             "points": 77,
//             "rank": 2985611,
//             "overall_rank": 483707,
//             "value": 1002,
//             "transfers": 0,
//             "transfers_cost": 0,
//             "bench_points": 5
//         },
//         {
//             "percentile_rank": 25,
//             "bank": 24,
//             "gameweek": 3,
//             "points": 78,
//             "rank": 2046702,
//             "overall_rank": 492850,
//             "value": 1003,
//             "transfers": 2,
//             "transfers_cost": 0,
//             "bench_points": 5
//         },
//         {
//             "percentile_rank": 100,
//             "bank": 24,
//             "gameweek": 4,
//             "points": 23,
//             "rank": 10068255,
//             "overall_rank": 2882863,
//             "value": 1004,
//             "transfers": 0,
//             "transfers_cost": 0,
//             "bench_points": 10
//         },
//         {
//             "percentile_rank": 15,
//             "bank": 18,
//             "gameweek": 5,
//             "points": 73,
//             "rank": 1311833,
//             "overall_rank": 1907804,
//             "value": 1005,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 1
//         },
//         {
//             "percentile_rank": 20,
//             "bank": 4,
//             "gameweek": 6,
//             "points": 67,
//             "rank": 1765717,
//             "overall_rank": 1020101,
//             "value": 1010,
//             "transfers": 2,
//             "transfers_cost": 0,
//             "bench_points": 7
//         },
//         {
//             "percentile_rank": 10,
//             "bank": 11,
//             "gameweek": 7,
//             "points": 65,
//             "rank": 766193,
//             "overall_rank": 407232,
//             "value": 1010,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 9
//         },
//         {
//             "percentile_rank": 1,
//             "bank": 15,
//             "gameweek": 8,
//             "points": 65,
//             "rank": 97946,
//             "overall_rank": 78101,
//             "value": 1010,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 0
//         },
//         {
//             "percentile_rank": 1,
//             "bank": 16,
//             "gameweek": 9,
//             "points": 87,
//             "rank": 34799,
//             "overall_rank": 15218,
//             "value": 1012,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 3
//         },
//         {
//             "percentile_rank": 5,
//             "bank": 12,
//             "gameweek": 10,
//             "points": 59,
//             "rank": 512148,
//             "overall_rank": 7256,
//             "value": 1016,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 26
//         },
//         {
//             "percentile_rank": 10,
//             "bank": 33,
//             "gameweek": 11,
//             "points": 71,
//             "rank": 741530,
//             "overall_rank": 4622,
//             "value": 1021,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 3
//         },
//         {
//             "percentile_rank": 5,
//             "bank": 6,
//             "gameweek": 12,
//             "points": 83,
//             "rank": 149885,
//             "overall_rank": 886,
//             "value": 1020,
//             "transfers": 0,
//             "transfers_cost": 0,
//             "bench_points": 8
//         },
//         {
//             "percentile_rank": 5,
//             "bank": 6,
//             "gameweek": 13,
//             "points": 91,
//             "rank": 363738,
//             "overall_rank": 436,
//             "value": 1028,
//             "transfers": 0,
//             "transfers_cost": 0,
//             "bench_points": 3
//         },
//         {
//             "percentile_rank": 40,
//             "bank": 16,
//             "gameweek": 14,
//             "points": 64,
//             "rank": 3895677,
//             "overall_rank": 593,
//             "value": 1034,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 8
//         },
//         {
//             "percentile_rank": 10,
//             "bank": 11,
//             "gameweek": 15,
//             "points": 73,
//             "rank": 687542,
//             "overall_rank": 226,
//             "value": 1036,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 3
//         },
//         {
//             "percentile_rank": 5,
//             "bank": 11,
//             "gameweek": 16,
//             "points": 68,
//             "rank": 451060,
//             "overall_rank": 84,
//             "value": 1041,
//             "transfers": 0,
//             "transfers_cost": 0,
//             "bench_points": 5
//         },
//         {
//             "percentile_rank": 1,
//             "bank": 9,
//             "gameweek": 17,
//             "points": 106,
//             "rank": 73186,
//             "overall_rank": 23,
//             "value": 1041,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 19
//         },
//         {
//             "percentile_rank": 5,
//             "bank": 9,
//             "gameweek": 18,
//             "points": 80,
//             "rank": 151494,
//             "overall_rank": 8,
//             "value": 1044,
//             "transfers": 2,
//             "transfers_cost": 0,
//             "bench_points": 7
//         },
//         {
//             "percentile_rank": 50,
//             "bank": 13,
//             "gameweek": 19,
//             "points": 69,
//             "rank": 5036747,
//             "overall_rank": 21,
//             "value": 1049,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 24
//         },
//         {
//             "percentile_rank": 60,
//             "bank": 16,
//             "gameweek": 20,
//             "points": 58,
//             "rank": 6199029,
//             "overall_rank": 66,
//             "value": 1050,
//             "transfers": 2,
//             "transfers_cost": 0,
//             "bench_points": 1
//         },
//         {
//             "percentile_rank": 5,
//             "bank": 7,
//             "gameweek": 21,
//             "points": 93,
//             "rank": 207110,
//             "overall_rank": 17,
//             "value": 1053,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 7
//         },
//         {
//             "percentile_rank": 5,
//             "bank": 7,
//             "gameweek": 22,
//             "points": 69,
//             "rank": 361033,
//             "overall_rank": 4,
//             "value": 1058,
//             "transfers": 0,
//             "transfers_cost": 0,
//             "bench_points": 7
//         },
//         {
//             "percentile_rank": 15,
//             "bank": 0,
//             "gameweek": 23,
//             "points": 73,
//             "rank": 1304008,
//             "overall_rank": 4,
//             "value": 1063,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 4
//         },
//         {
//             "percentile_rank": 10,
//             "bank": 1,
//             "gameweek": 24,
//             "points": 134,
//             "rank": 937768,
//             "overall_rank": 5,
//             "value": 1057,
//             "transfers": 2,
//             "transfers_cost": 0,
//             "bench_points": 5
//         },
//         {
//             "percentile_rank": 35,
//             "bank": 1,
//             "gameweek": 25,
//             "points": 86,
//             "rank": 3550057,
//             "overall_rank": 10,
//             "value": 1056,
//             "transfers": 0,
//             "transfers_cost": 0,
//             "bench_points": 4
//         },
//         {
//             "percentile_rank": 1,
//             "bank": 39,
//             "gameweek": 26,
//             "points": 108,
//             "rank": 31401,
//             "overall_rank": 3,
//             "value": 1056,
//             "transfers": 2,
//             "transfers_cost": 0,
//             "bench_points": 2
//         },
//         {
//             "percentile_rank": 70,
//             "bank": 19,
//             "gameweek": 27,
//             "points": 49,
//             "rank": 7780909,
//             "overall_rank": 6,
//             "value": 1055,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 6
//         },
//         {
//             "percentile_rank": 30,
//             "bank": 19,
//             "gameweek": 28,
//             "points": 62,
//             "rank": 3120804,
//             "overall_rank": 8,
//             "value": 1058,
//             "transfers": 0,
//             "transfers_cost": 0,
//             "bench_points": 3
//         },
//         {
//             "percentile_rank": 10,
//             "bank": 19,
//             "gameweek": 29,
//             "points": 71,
//             "rank": 601987,
//             "overall_rank": 2,
//             "value": 1053,
//             "transfers": 3,
//             "transfers_cost": 4,
//             "bench_points": 0
//         },
//         {
//             "percentile_rank": 50,
//             "bank": 4,
//             "gameweek": 30,
//             "points": 45,
//             "rank": 5555363,
//             "overall_rank": 2,
//             "value": 1047,
//             "transfers": 0,
//             "transfers_cost": 0,
//             "bench_points": 15
//         },
//         {
//             "percentile_rank": 1,
//             "bank": 4,
//             "gameweek": 31,
//             "points": 70,
//             "rank": 49309,
//             "overall_rank": 1,
//             "value": 1053,
//             "transfers": 0,
//             "transfers_cost": 0,
//             "bench_points": 12
//         },
//         {
//             "percentile_rank": 10,
//             "bank": 4,
//             "gameweek": 32,
//             "points": 87,
//             "rank": 765727,
//             "overall_rank": 1,
//             "value": 1056,
//             "transfers": 0,
//             "transfers_cost": 0,
//             "bench_points": 11
//         },
//         {
//             "percentile_rank": 5,
//             "bank": 13,
//             "gameweek": 33,
//             "points": 90,
//             "rank": 293208,
//             "overall_rank": 1,
//             "value": 1058,
//             "transfers": 3,
//             "transfers_cost": 0,
//             "bench_points": 0
//         },
//         {
//             "percentile_rank": 5,
//             "bank": 13,
//             "gameweek": 34,
//             "points": 86,
//             "rank": 369923,
//             "overall_rank": 1,
//             "value": 1061,
//             "transfers": 0,
//             "transfers_cost": 0,
//             "bench_points": 11
//         },
//         {
//             "percentile_rank": 15,
//             "bank": 36,
//             "gameweek": 35,
//             "points": 56,
//             "rank": 1147275,
//             "overall_rank": 1,
//             "value": 1058,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 12
//         },
//         {
//             "percentile_rank": 1,
//             "bank": 0,
//             "gameweek": 36,
//             "points": 83,
//             "rank": 30479,
//             "overall_rank": 1,
//             "value": 1056,
//             "transfers": 2,
//             "transfers_cost": 4,
//             "bench_points": 9
//         },
//         {
//             "percentile_rank": 10,
//             "bank": 4,
//             "gameweek": 37,
//             "points": 61,
//             "rank": 695743,
//             "overall_rank": 1,
//             "value": 1057,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 12
//         },
//         {
//             "percentile_rank": 15,
//             "bank": 11,
//             "gameweek": 38,
//             "points": 62,
//             "rank": 1551968,
//             "overall_rank": 1,
//             "value": 1061,
//             "transfers": 2,
//             "transfers_cost": 4,
//             "bench_points": 6
//         }
//     ],
//     "totalTransfers": 37,
//     "totalMinusPoints": 12,
//     "totalPointsOnBench": 276,
//     "bestWeek": {
//         "event": 24,
//         "points": 134,
//         "total_points": 1806,
//         "rank": 937768,
//         "rank_sort": 938907,
//         "overall_rank": 5,
//         "percentile_rank": 10,
//         "bank": 1,
//         "value": 1057,
//         "event_transfers": 2,
//         "event_transfers_cost": 0,
//         "points_on_bench": 5
//     },
//     "worstWeek": {
//         "event": 4,
//         "points": 23,
//         "total_points": 258,
//         "rank": 10068255,
//         "rank_sort": 10068566,
//         "overall_rank": 2882863,
//         "percentile_rank": 100,
//         "bank": 24,
//         "value": 1004,
//         "event_transfers": 0,
//         "event_transfers_cost": 0,
//         "points_on_bench": 10
//     },
//     "bestOverallRankWeek": {
//         "event": 4,
//         "points": 23,
//         "total_points": 258,
//         "rank": 10068255,
//         "rank_sort": 10068566,
//         "overall_rank": 2882863,
//         "percentile_rank": 100,
//         "bank": 24,
//         "value": 1004,
//         "event_transfers": 0,
//         "event_transfers_cost": 0,
//         "points_on_bench": 10
//     },
//     "worstOverallRankWeek": {
//         "event": 31,
//         "points": 70,
//         "total_points": 2293,
//         "rank": 49309,
//         "rank_sort": 49792,
//         "overall_rank": 1,
//         "percentile_rank": 1,
//         "bank": 4,
//         "value": 1053,
//         "event_transfers": 0,
//         "event_transfers_cost": 0,
//         "points_on_bench": 12
//     },
//     "highestValueWeek": {
//         "event": 23,
//         "points": 73,
//         "total_points": 1672,
//         "rank": 1304008,
//         "rank_sort": 1305722,
//         "overall_rank": 4,
//         "percentile_rank": 15,
//         "bank": 0,
//         "value": 1063,
//         "event_transfers": 1,
//         "event_transfers_cost": 0,
//         "points_on_bench": 4
//     },
//     "chips": [
//         {
//             "name": "wildcard",
//             "time": "2024-11-21T10:15:44.506529Z",
//             "gw": 12
//         },
//         {
//             "name": "manager",
//             "time": "2025-02-01T10:01:33.909883Z",
//             "gw": 24
//         },
//         {
//             "name": "wildcard",
//             "time": "2025-04-01T15:09:46.880868Z",
//             "gw": 30
//         },
//         {
//             "name": "3xc",
//             "time": "2025-04-12T09:53:15.401294Z",
//             "gw": 32
//         },
//         {
//             "name": "bboost",
//             "time": "2025-04-19T11:50:01.936765Z",
//             "gw": 33
//         },
//         {
//             "name": "freehit",
//             "time": "2025-04-20T08:19:43.399373Z",
//             "gw": 34
//         }
//     ],
//     "past": [
//         {
//             "season_name": "2020/21",
//             "total_points": 1830,
//             "rank": 4231523
//         },
//         {
//             "season_name": "2021/22",
//             "total_points": 1434,
//             "rank": 7769696
//         },
//         {
//             "season_name": "2022/23",
//             "total_points": 2306,
//             "rank": 1466498
//         },
//         {
//             "season_name": "2023/24",
//             "total_points": 2371,
//             "rank": 508866
//         },
//         {
//             "season_name": "2024/25",
//             "total_points": 2810,
//             "rank": 1
//         }
//     ],
//     "seasons": 5,
//     "seasons_managed": "2020/21",
//     "previousRank": 1
// }


// const object2 = {
//     "id": 1450135,
//     "event_total": 62,
//     "player_name": "Lovro Budišin",
//     "rank": 1,
//     "last_rank": 1,
//     "rank_sort": 1,
//     "total": 2810,
//     "entry": 235307,
//     "entry_name": "Aina Krafth Bree*",
//     "has_played": true,
//     "managerDetails": {
//         "id": 235307,
//         "joined_time": "2024-07-17T14:46:58.321789Z",
//         "started_event": 1,
//         "favourite_team": null,
//         "player_first_name": "Lovro",
//         "player_last_name": "Budišin",
//         "player_region_id": 97,
//         "player_region_name": "Croatia",
//         "player_region_iso_code_short": "HR",
//         "player_region_iso_code_long": "HRV",
//         "years_active": 5,
//         "summary_overall_points": 2810,
//         "summary_overall_rank": 1,
//         "summary_event_points": 62,
//         "summary_event_rank": 1551968,
//         "current_event": 38,
//         "leagues": {
//             "classic": [
//                 {
//                     "id": 117,
//                     "name": "Croatia",
//                     "short_name": "region-97",
//                     "created": "2024-07-17T11:51:47.131578Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "s",
//                     "scoring": "c",
//                     "admin_entry": null,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2513318,
//                     "cup_qualified": true,
//                     "rank_count": 29689,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 117,
//                             "rank_count": 29689,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 301,
//                             "last_rank": 215,
//                             "rank_sort": 301,
//                             "total": 254,
//                             "league_id": 117,
//                             "rank_count": 29689,
//                             "entry_percentile_rank": 5
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 276,
//                     "name": "Gameweek 1",
//                     "short_name": "event-1",
//                     "created": "2024-07-17T11:51:48.316462Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "s",
//                     "scoring": "c",
//                     "admin_entry": null,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": false,
//                     "cup_league": null,
//                     "cup_qualified": null,
//                     "rank_count": 8569336,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 276,
//                             "rank_count": 8569336,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 68319,
//                             "last_rank": 40767,
//                             "rank_sort": 68398,
//                             "total": 254,
//                             "league_id": 276,
//                             "rank_count": 8569236,
//                             "entry_percentile_rank": 1
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 314,
//                     "name": "Overall",
//                     "short_name": "overall",
//                     "created": "2024-07-17T11:51:48.594925Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "s",
//                     "scoring": "c",
//                     "admin_entry": null,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2421396,
//                     "cup_qualified": true,
//                     "rank_count": 11433197,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 314,
//                             "rank_count": 11433197,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 71744,
//                             "last_rank": 43296,
//                             "rank_sort": 71823,
//                             "total": 254,
//                             "league_id": 314,
//                             "rank_count": 11433093,
//                             "entry_percentile_rank": 1
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 319,
//                     "name": "Arena Sport League",
//                     "short_name": "brd-arenasport",
//                     "created": "2024-07-17T11:51:48.631418Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "s",
//                     "scoring": "c",
//                     "admin_entry": null,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2484678,
//                     "cup_qualified": true,
//                     "rank_count": 138790,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 319,
//                             "rank_count": 138790,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 1328,
//                             "last_rank": 950,
//                             "rank_sort": 1328,
//                             "total": 254,
//                             "league_id": 319,
//                             "rank_count": 138789,
//                             "entry_percentile_rank": 1
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 321,
//                     "name": "Second Chance",
//                     "short_name": "sc",
//                     "created": "2024-07-17T11:51:48.646333Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "s",
//                     "scoring": "c",
//                     "admin_entry": null,
//                     "start_event": 21,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": false,
//                     "cup_league": null,
//                     "cup_qualified": null,
//                     "rank_count": 11433186,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 105,
//                             "last_rank": 80,
//                             "rank_sort": 105,
//                             "total": 1373,
//                             "league_id": 321,
//                             "rank_count": 11433186,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 71744,
//                             "last_rank": 43296,
//                             "rank_sort": 71823,
//                             "total": 254,
//                             "league_id": 321,
//                             "rank_count": 11433089,
//                             "entry_percentile_rank": 1
//                         }
//                     ],
//                     "entry_rank": 105,
//                     "entry_last_rank": 80
//                 },
//                 {
//                     "id": 1194,
//                     "name": "youtube.com/letstalkfpl 📽️",
//                     "short_name": null,
//                     "created": "2024-07-17T13:32:58.932145Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 24,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2498395,
//                     "cup_qualified": true,
//                     "rank_count": 127321,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 1194,
//                             "rank_count": 127321,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 4261,
//                             "last_rank": 2560,
//                             "rank_sort": 4278,
//                             "total": 254,
//                             "league_id": 1194,
//                             "rank_count": 127321,
//                             "entry_percentile_rank": 5
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 5020,
//                     "name": "youtube.com/FPLRaptor",
//                     "short_name": null,
//                     "created": "2024-07-17T13:38:25.352331Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 746,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2505430,
//                     "cup_qualified": true,
//                     "rank_count": 51201,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 5020,
//                             "rank_count": 51201,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 2054,
//                             "last_rank": 1199,
//                             "rank_sort": 2066,
//                             "total": 254,
//                             "league_id": 5020,
//                             "rank_count": 51201,
//                             "entry_percentile_rank": 5
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 8719,
//                     "name": "FPL Caffe",
//                     "short_name": null,
//                     "created": "2024-07-17T13:43:26.210823Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 44153,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2538948,
//                     "cup_qualified": true,
//                     "rank_count": 1490,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 8719,
//                             "rank_count": 1490,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 49,
//                             "last_rank": 34,
//                             "rank_sort": 49,
//                             "total": 254,
//                             "league_id": 8719,
//                             "rank_count": 1490,
//                             "entry_percentile_rank": 5
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 31758,
//                     "name": "youtube.com/FPLMate 🏆",
//                     "short_name": null,
//                     "created": "2024-07-17T14:19:36.491790Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 96,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2505436,
//                     "cup_qualified": true,
//                     "rank_count": 64404,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 31758,
//                             "rank_count": 64404,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 2003,
//                             "last_rank": 1166,
//                             "rank_sort": 2008,
//                             "total": 254,
//                             "league_id": 31758,
//                             "rank_count": 64404,
//                             "entry_percentile_rank": 5
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 50794,
//                     "name": "Tribina.hr",
//                     "short_name": null,
//                     "created": "2024-07-17T15:09:52.467119Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 263845,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2539005,
//                     "cup_qualified": true,
//                     "rank_count": 1242,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 50794,
//                             "rank_count": 1242,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 22,
//                             "last_rank": 25,
//                             "rank_sort": 22,
//                             "total": 254,
//                             "league_id": 50794,
//                             "rank_count": 1242,
//                             "entry_percentile_rank": 5
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 59293,
//                     "name": "FPLXperti - FREE LIGA ⚽️💥",
//                     "short_name": null,
//                     "created": "2024-07-17T15:40:31.154182Z",
//                     "closed": true,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 103992,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2539016,
//                     "cup_qualified": true,
//                     "rank_count": 1804,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 59293,
//                             "rank_count": 1804,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 49,
//                             "last_rank": 33,
//                             "rank_sort": 49,
//                             "total": 254,
//                             "league_id": 59293,
//                             "rank_count": 1804,
//                             "entry_percentile_rank": 5
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 63048,
//                     "name": "YouTube.com/FPLFocal",
//                     "short_name": null,
//                     "created": "2024-07-17T15:55:12.068915Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 1301,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2505440,
//                     "cup_qualified": true,
//                     "rank_count": 55824,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 63048,
//                             "rank_count": 55824,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 2006,
//                             "last_rank": 1100,
//                             "rank_sort": 2011,
//                             "total": 254,
//                             "league_id": 63048,
//                             "rank_count": 55824,
//                             "entry_percentile_rank": 5
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 81846,
//                     "name": "Hrvatski Fantazisti",
//                     "short_name": null,
//                     "created": "2024-07-17T17:15:13.588900Z",
//                     "closed": true,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 6793,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2534880,
//                     "cup_qualified": true,
//                     "rank_count": 2454,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 81846,
//                             "rank_count": 2454,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 65,
//                             "last_rank": 53,
//                             "rank_sort": 65,
//                             "total": 254,
//                             "league_id": 81846,
//                             "rank_count": 2454,
//                             "entry_percentile_rank": 5
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 155246,
//                     "name": "Strajina liga",
//                     "short_name": null,
//                     "created": "2024-07-18T09:14:11.496849Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 849613,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2513365,
//                     "cup_qualified": true,
//                     "rank_count": 19278,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 155246,
//                             "rank_count": 19278,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 299,
//                             "last_rank": 206,
//                             "rank_sort": 299,
//                             "total": 254,
//                             "league_id": 155246,
//                             "rank_count": 19278,
//                             "entry_percentile_rank": 5
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 409645,
//                     "name": "Amigo",
//                     "short_name": null,
//                     "created": "2024-07-24T16:35:02.354058Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 130607,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 3274335,
//                     "cup_qualified": true,
//                     "rank_count": 6,
//                     "entry_percentile_rank": 20,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 409645,
//                             "rank_count": 6,
//                             "entry_percentile_rank": 20
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 254,
//                             "league_id": 409645,
//                             "rank_count": 6,
//                             "entry_percentile_rank": 20
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 438288,
//                     "name": "Dama pije sama",
//                     "short_name": null,
//                     "created": "2024-07-25T17:21:02.662656Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 2283701,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 3297087,
//                     "cup_qualified": true,
//                     "rank_count": 6,
//                     "entry_percentile_rank": 20,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 438288,
//                             "rank_count": 6,
//                             "entry_percentile_rank": 20
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 254,
//                             "league_id": 438288,
//                             "rank_count": 6,
//                             "entry_percentile_rank": 20
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 461668,
//                     "name": "Liga Ikona - Poklon Studio",
//                     "short_name": null,
//                     "created": "2024-07-26T17:15:54.440777Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 2092534,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2530757,
//                     "cup_qualified": true,
//                     "rank_count": 5246,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 461668,
//                             "rank_count": 5246,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 97,
//                             "last_rank": 72,
//                             "rank_sort": 97,
//                             "total": 254,
//                             "league_id": 461668,
//                             "rank_count": 5246,
//                             "entry_percentile_rank": 5
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 905297,
//                     "name": "the OFFSIDE",
//                     "short_name": null,
//                     "created": "2024-08-10T09:46:00.685493Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 4236582,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2535128,
//                     "cup_qualified": true,
//                     "rank_count": 3698,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 905297,
//                             "rank_count": 3698,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 52,
//                             "last_rank": 39,
//                             "rank_sort": 52,
//                             "total": 254,
//                             "league_id": 905297,
//                             "rank_count": 3698,
//                             "entry_percentile_rank": 5
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 1169492,
//                     "name": "KLC fantaziranje",
//                     "short_name": null,
//                     "created": "2024-08-13T11:30:05.783847Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 5308147,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 3798207,
//                     "cup_qualified": true,
//                     "rank_count": 4,
//                     "entry_percentile_rank": 25,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 1169492,
//                             "rank_count": 4,
//                             "entry_percentile_rank": 25
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 254,
//                             "league_id": 1169492,
//                             "rank_count": 4,
//                             "entry_percentile_rank": 25
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 1289672,
//                     "name": "Behzinga Championship",
//                     "short_name": null,
//                     "created": "2024-08-14T10:10:53.245175Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 1215424,
//                     "start_event": 1,
//                     "entry_can_leave": false,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2505455,
//                     "cup_qualified": true,
//                     "rank_count": 42731,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 1289672,
//                             "rank_count": 42731,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 391,
//                             "last_rank": 227,
//                             "rank_sort": 391,
//                             "total": 254,
//                             "league_id": 1289672,
//                             "rank_count": 42730,
//                             "entry_percentile_rank": 1
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 },
//                 {
//                     "id": 1768929,
//                     "name": "THE PRIME FPL CHAMPIONSHIP",
//                     "short_name": null,
//                     "created": "2024-08-16T12:46:28.310161Z",
//                     "closed": false,
//                     "rank": null,
//                     "max_entries": null,
//                     "league_type": "x",
//                     "scoring": "c",
//                     "admin_entry": 141594,
//                     "start_event": 1,
//                     "entry_can_leave": true,
//                     "entry_can_admin": false,
//                     "entry_can_invite": false,
//                     "has_cup": true,
//                     "cup_league": 2484684,
//                     "cup_qualified": false,
//                     "rank_count": 144611,
//                     "entry_percentile_rank": 1,
//                     "active_phases": [
//                         {
//                             "phase": 1,
//                             "rank": 1,
//                             "last_rank": 1,
//                             "rank_sort": 1,
//                             "total": 2810,
//                             "league_id": 1768929,
//                             "rank_count": 144611,
//                             "entry_percentile_rank": 1
//                         },
//                         {
//                             "phase": 11,
//                             "rank": 2055,
//                             "last_rank": 1195,
//                             "rank_sort": 2062,
//                             "total": 254,
//                             "league_id": 1768929,
//                             "rank_count": 144610,
//                             "entry_percentile_rank": 5
//                         }
//                     ],
//                     "entry_rank": 1,
//                     "entry_last_rank": 1
//                 }
//             ],
//             "h2h": [],
//             "cup": {
//                 "matches": [],
//                 "status": {
//                     "qualification_event": null,
//                     "qualification_numbers": null,
//                     "qualification_rank": null,
//                     "qualification_state": null
//                 },
//                 "cup_league": null
//             },
//             "cup_matches": [
//                 {
//                     "id": 112394128,
//                     "entry_1_entry": 1242386,
//                     "entry_1_name": "MyBoys",
//                     "entry_1_player_name": "Tyson Webster",
//                     "entry_1_points": 135,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 235307,
//                     "entry_2_name": "Aina Krafth Bree*",
//                     "entry_2_player_name": "Lovro Budišin",
//                     "entry_2_points": 134,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2498395,
//                     "winner": 1242386,
//                     "seed_value": null,
//                     "event": 24,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 32768"
//                 },
//                 {
//                     "id": 114552940,
//                     "entry_1_entry": 4738591,
//                     "entry_1_name": "Khaled",
//                     "entry_1_player_name": "Khaled Ammar",
//                     "entry_1_points": 97,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 235307,
//                     "entry_2_name": "Aina Krafth Bree*",
//                     "entry_2_player_name": "Lovro Budišin",
//                     "entry_2_points": 86,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2421396,
//                     "winner": 4738591,
//                     "seed_value": null,
//                     "event": 25,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 16384"
//                 },
//                 {
//                     "id": 115132012,
//                     "entry_1_entry": 235307,
//                     "entry_1_name": "Aina Krafth Bree*",
//                     "entry_1_player_name": "Lovro Budišin",
//                     "entry_1_points": 86,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 6308696,
//                     "entry_2_name": "ZVIBABA FC",
//                     "entry_2_player_name": "Tendai Nigel",
//                     "entry_2_points": 95,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2505430,
//                     "winner": 6308696,
//                     "seed_value": null,
//                     "event": 25,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 16384"
//                 },
//                 {
//                     "id": 115465544,
//                     "entry_1_entry": 235307,
//                     "entry_1_name": "Aina Krafth Bree*",
//                     "entry_1_player_name": "Lovro Budišin",
//                     "entry_1_points": 86,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 4309825,
//                     "entry_2_name": "Chewrassic Park",
//                     "entry_2_player_name": "Brandon Chew",
//                     "entry_2_points": 115,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2505440,
//                     "winner": 4309825,
//                     "seed_value": null,
//                     "event": 25,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 16384"
//                 },
//                 {
//                     "id": 115486068,
//                     "entry_1_entry": 9931521,
//                     "entry_1_name": "Okocha",
//                     "entry_1_player_name": "Marin Jovanović",
//                     "entry_1_points": 94,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 235307,
//                     "entry_2_name": "Aina Krafth Bree*",
//                     "entry_2_player_name": "Lovro Budišin",
//                     "entry_2_points": 86,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2513318,
//                     "winner": 9931521,
//                     "seed_value": null,
//                     "event": 25,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 16384"
//                 },
//                 {
//                     "id": 120214541,
//                     "entry_1_entry": 7340261,
//                     "entry_1_name": "TmPA",
//                     "entry_1_player_name": "Tor Mahtte Anti",
//                     "entry_1_points": 53,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 235307,
//                     "entry_2_name": "Aina Krafth Bree*",
//                     "entry_2_player_name": "Lovro Budišin",
//                     "entry_2_points": 49,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2505455,
//                     "winner": 7340261,
//                     "seed_value": null,
//                     "event": 27,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 4096"
//                 },
//                 {
//                     "id": 120235302,
//                     "entry_1_entry": 5691853,
//                     "entry_1_name": "Kolibri United",
//                     "entry_1_player_name": "Miloš Dragutinović",
//                     "entry_1_points": 61,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 235307,
//                     "entry_2_name": "Aina Krafth Bree*",
//                     "entry_2_player_name": "Lovro Budišin",
//                     "entry_2_points": 49,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2484678,
//                     "winner": 5691853,
//                     "seed_value": null,
//                     "event": 27,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 4096"
//                 },
//                 {
//                     "id": 120291620,
//                     "entry_1_entry": 235307,
//                     "entry_1_name": "Aina Krafth Bree*",
//                     "entry_1_player_name": "Lovro Budišin",
//                     "entry_1_points": 49,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 866887,
//                     "entry_2_name": "Kudos to you",
//                     "entry_2_player_name": "Callum Laver",
//                     "entry_2_points": 67,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2505436,
//                     "winner": 866887,
//                     "seed_value": null,
//                     "event": 27,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 4096"
//                 },
//                 {
//                     "id": 120461457,
//                     "entry_1_entry": 3688328,
//                     "entry_1_name": "Montana Junior",
//                     "entry_1_player_name": "Nikola Nanusevski",
//                     "entry_1_points": 54,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 235307,
//                     "entry_2_name": "Aina Krafth Bree*",
//                     "entry_2_player_name": "Lovro Budišin",
//                     "entry_2_points": 49,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2513365,
//                     "winner": 3688328,
//                     "seed_value": null,
//                     "event": 27,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 4096"
//                 },
//                 {
//                     "id": 121035664,
//                     "entry_1_entry": 235307,
//                     "entry_1_name": "Aina Krafth Bree*",
//                     "entry_1_player_name": "Lovro Budišin",
//                     "entry_1_points": 49,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 2568167,
//                     "entry_2_name": "Marojko_Herc",
//                     "entry_2_player_name": "Tony Glibo",
//                     "entry_2_points": 57,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2530757,
//                     "winner": 2568167,
//                     "seed_value": null,
//                     "event": 27,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 4096"
//                 },
//                 {
//                     "id": 123139843,
//                     "entry_1_entry": 235307,
//                     "entry_1_name": "Aina Krafth Bree*",
//                     "entry_1_player_name": "Lovro Budišin",
//                     "entry_1_points": 62,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 6421114,
//                     "entry_2_name": "Proud to be Croat",
//                     "entry_2_player_name": "Toni Celic",
//                     "entry_2_points": 69,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2534880,
//                     "winner": 6421114,
//                     "seed_value": null,
//                     "event": 28,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 2048"
//                 },
//                 {
//                     "id": 123328143,
//                     "entry_1_entry": 5842040,
//                     "entry_1_name": "Pickle's Team",
//                     "entry_1_player_name": "Pavle Vuković",
//                     "entry_1_points": 63,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 235307,
//                     "entry_2_name": "Aina Krafth Bree*",
//                     "entry_2_player_name": "Lovro Budišin",
//                     "entry_2_points": 62,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2535128,
//                     "winner": 5842040,
//                     "seed_value": null,
//                     "event": 28,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 2048"
//                 },
//                 {
//                     "id": 123388162,
//                     "entry_1_entry": 235307,
//                     "entry_1_name": "Aina Krafth Bree*",
//                     "entry_1_player_name": "Lovro Budišin",
//                     "entry_1_points": 62,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 6457163,
//                     "entry_2_name": "Debeli Ronaldo",
//                     "entry_2_player_name": "Čedomir Došenović",
//                     "entry_2_points": 75,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2538948,
//                     "winner": 6457163,
//                     "seed_value": null,
//                     "event": 28,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 2048"
//                 },
//                 {
//                     "id": 123525557,
//                     "entry_1_entry": 320728,
//                     "entry_1_name": "Konavljanin",
//                     "entry_1_player_name": "Ante Bezelj",
//                     "entry_1_points": 74,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 235307,
//                     "entry_2_name": "Aina Krafth Bree*",
//                     "entry_2_player_name": "Lovro Budišin",
//                     "entry_2_points": 62,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2539005,
//                     "winner": 320728,
//                     "seed_value": null,
//                     "event": 28,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 2048"
//                 },
//                 {
//                     "id": 132149865,
//                     "entry_1_entry": 3541225,
//                     "entry_1_name": "Kalimanova Glava",
//                     "entry_1_player_name": "Dimitar Rashko",
//                     "entry_1_points": 92,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 235307,
//                     "entry_2_name": "Aina Krafth Bree*",
//                     "entry_2_player_name": "Lovro Budišin",
//                     "entry_2_points": 86,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 2539016,
//                     "winner": 3541225,
//                     "seed_value": null,
//                     "event": 34,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Round of 32"
//                 },
//                 {
//                     "id": 148321444,
//                     "entry_1_entry": 2334463,
//                     "entry_1_name": "N.T",
//                     "entry_1_player_name": "Niko Tomašević",
//                     "entry_1_points": 51,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 235307,
//                     "entry_2_name": "Aina Krafth Bree*",
//                     "entry_2_player_name": "Lovro Budišin",
//                     "entry_2_points": 58,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 3297087,
//                     "winner": 235307,
//                     "seed_value": null,
//                     "event": 38,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Final"
//                 },
//                 {
//                     "id": 148362900,
//                     "entry_1_entry": 130607,
//                     "entry_1_name": "Žamal",
//                     "entry_1_player_name": "Marko Matijašić",
//                     "entry_1_points": 34,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 235307,
//                     "entry_2_name": "Aina Krafth Bree*",
//                     "entry_2_player_name": "Lovro Budišin",
//                     "entry_2_points": 58,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 3274335,
//                     "winner": 235307,
//                     "seed_value": null,
//                     "event": 38,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Final"
//                 },
//                 {
//                     "id": 148834447,
//                     "entry_1_entry": 4235387,
//                     "entry_1_name": "Kičma noge ruke noge",
//                     "entry_1_player_name": "Gordan Manojlovic",
//                     "entry_1_points": 33,
//                     "entry_1_win": 0,
//                     "entry_1_draw": 0,
//                     "entry_1_loss": 0,
//                     "entry_1_total": 0,
//                     "entry_2_entry": 235307,
//                     "entry_2_name": "Aina Krafth Bree*",
//                     "entry_2_player_name": "Lovro Budišin",
//                     "entry_2_points": 58,
//                     "entry_2_win": 0,
//                     "entry_2_draw": 0,
//                     "entry_2_loss": 0,
//                     "entry_2_total": 0,
//                     "is_knockout": true,
//                     "league": 3798207,
//                     "winner": 235307,
//                     "seed_value": null,
//                     "event": 38,
//                     "tiebreak": null,
//                     "is_bye": false,
//                     "knockout_name": "Final"
//                 }
//             ]
//         },
//         "name": "Aina Krafth Bree*",
//         "name_change_blocked": false,
//         "entered_events": [
//             1,
//             2,
//             3,
//             4,
//             5,
//             6,
//             7,
//             8,
//             9,
//             10,
//             11,
//             12,
//             13,
//             14,
//             15,
//             16,
//             17,
//             18,
//             19,
//             20,
//             21,
//             22,
//             23,
//             24,
//             25,
//             26,
//             27,
//             28,
//             29,
//             30,
//             31,
//             32,
//             33,
//             34,
//             35,
//             36,
//             37,
//             38
//         ],
//         "kit": "{\"kit_shirt_type\":\"plain\",\"kit_shirt_base\":\"#E1E1E1\",\"kit_shirt_sleeves\":\"#E1E1E1\",\"kit_shirt_secondary\":\"#E1E1E1\",\"kit_shirt_logo\":\"none\",\"kit_shorts\":\"#E1E1E1\",\"kit_socks_type\":\"plain\",\"kit_socks_base\":\"#E1E1E1\",\"kit_socks_secondary\":\"#E1E1E1\"}",
//         "last_deadline_bank": 11,
//         "last_deadline_value": 1061,
//         "last_deadline_total_transfers": 37
//     },
//     "everyGw": [
//         {
//             "percentile_rank": 5,
//             "bank": 10,
//             "gameweek": 1,
//             "points": 80,
//             "rank": 321537,
//             "overall_rank": 321537,
//             "value": 1000,
//             "transfers": 0,
//             "transfers_cost": 0,
//             "bench_points": 3
//         },
//         {
//             "percentile_rank": 35,
//             "bank": 10,
//             "gameweek": 2,
//             "points": 77,
//             "rank": 2985611,
//             "overall_rank": 483707,
//             "value": 1002,
//             "transfers": 0,
//             "transfers_cost": 0,
//             "bench_points": 5
//         },
//         {
//             "percentile_rank": 25,
//             "bank": 24,
//             "gameweek": 3,
//             "points": 78,
//             "rank": 2046702,
//             "overall_rank": 492850,
//             "value": 1003,
//             "transfers": 2,
//             "transfers_cost": 0,
//             "bench_points": 5
//         },
//         {
//             "percentile_rank": 100,
//             "bank": 24,
//             "gameweek": 4,
//             "points": 23,
//             "rank": 10068255,
//             "overall_rank": 2882863,
//             "value": 1004,
//             "transfers": 0,
//             "transfers_cost": 0,
//             "bench_points": 10
//         },
//         {
//             "percentile_rank": 15,
//             "bank": 18,
//             "gameweek": 5,
//             "points": 73,
//             "rank": 1311833,
//             "overall_rank": 1907804,
//             "value": 1005,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 1
//         },
//         {
//             "percentile_rank": 20,
//             "bank": 4,
//             "gameweek": 6,
//             "points": 67,
//             "rank": 1765717,
//             "overall_rank": 1020101,
//             "value": 1010,
//             "transfers": 2,
//             "transfers_cost": 0,
//             "bench_points": 7
//         },
//         {
//             "percentile_rank": 10,
//             "bank": 11,
//             "gameweek": 7,
//             "points": 65,
//             "rank": 766193,
//             "overall_rank": 407232,
//             "value": 1010,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 9
//         },
//         {
//             "percentile_rank": 1,
//             "bank": 15,
//             "gameweek": 8,
//             "points": 65,
//             "rank": 97946,
//             "overall_rank": 78101,
//             "value": 1010,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 0
//         },
//         {
//             "percentile_rank": 1,
//             "bank": 16,
//             "gameweek": 9,
//             "points": 87,
//             "rank": 34799,
//             "overall_rank": 15218,
//             "value": 1012,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 3
//         },
//         {
//             "percentile_rank": 5,
//             "bank": 12,
//             "gameweek": 10,
//             "points": 59,
//             "rank": 512148,
//             "overall_rank": 7256,
//             "value": 1016,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 26
//         },
//         {
//             "percentile_rank": 10,
//             "bank": 33,
//             "gameweek": 11,
//             "points": 71,
//             "rank": 741530,
//             "overall_rank": 4622,
//             "value": 1021,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 3
//         },
//         {
//             "percentile_rank": 5,
//             "bank": 6,
//             "gameweek": 12,
//             "points": 83,
//             "rank": 149885,
//             "overall_rank": 886,
//             "value": 1020,
//             "transfers": 0,
//             "transfers_cost": 0,
//             "bench_points": 8
//         },
//         {
//             "percentile_rank": 5,
//             "bank": 6,
//             "gameweek": 13,
//             "points": 91,
//             "rank": 363738,
//             "overall_rank": 436,
//             "value": 1028,
//             "transfers": 0,
//             "transfers_cost": 0,
//             "bench_points": 3
//         },
//         {
//             "percentile_rank": 40,
//             "bank": 16,
//             "gameweek": 14,
//             "points": 64,
//             "rank": 3895677,
//             "overall_rank": 593,
//             "value": 1034,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 8
//         },
//         {
//             "percentile_rank": 10,
//             "bank": 11,
//             "gameweek": 15,
//             "points": 73,
//             "rank": 687542,
//             "overall_rank": 226,
//             "value": 1036,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 3
//         },
//         {
//             "percentile_rank": 5,
//             "bank": 11,
//             "gameweek": 16,
//             "points": 68,
//             "rank": 451060,
//             "overall_rank": 84,
//             "value": 1041,
//             "transfers": 0,
//             "transfers_cost": 0,
//             "bench_points": 5
//         },
//         {
//             "percentile_rank": 1,
//             "bank": 9,
//             "gameweek": 17,
//             "points": 106,
//             "rank": 73186,
//             "overall_rank": 23,
//             "value": 1041,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 19
//         },
//         {
//             "percentile_rank": 5,
//             "bank": 9,
//             "gameweek": 18,
//             "points": 80,
//             "rank": 151494,
//             "overall_rank": 8,
//             "value": 1044,
//             "transfers": 2,
//             "transfers_cost": 0,
//             "bench_points": 7
//         },
//         {
//             "percentile_rank": 50,
//             "bank": 13,
//             "gameweek": 19,
//             "points": 69,
//             "rank": 5036747,
//             "overall_rank": 21,
//             "value": 1049,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 24
//         },
//         {
//             "percentile_rank": 60,
//             "bank": 16,
//             "gameweek": 20,
//             "points": 58,
//             "rank": 6199029,
//             "overall_rank": 66,
//             "value": 1050,
//             "transfers": 2,
//             "transfers_cost": 0,
//             "bench_points": 1
//         },
//         {
//             "percentile_rank": 5,
//             "bank": 7,
//             "gameweek": 21,
//             "points": 93,
//             "rank": 207110,
//             "overall_rank": 17,
//             "value": 1053,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 7
//         },
//         {
//             "percentile_rank": 5,
//             "bank": 7,
//             "gameweek": 22,
//             "points": 69,
//             "rank": 361033,
//             "overall_rank": 4,
//             "value": 1058,
//             "transfers": 0,
//             "transfers_cost": 0,
//             "bench_points": 7
//         },
//         {
//             "percentile_rank": 15,
//             "bank": 0,
//             "gameweek": 23,
//             "points": 73,
//             "rank": 1304008,
//             "overall_rank": 4,
//             "value": 1063,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 4
//         },
//         {
//             "percentile_rank": 10,
//             "bank": 1,
//             "gameweek": 24,
//             "points": 134,
//             "rank": 937768,
//             "overall_rank": 5,
//             "value": 1057,
//             "transfers": 2,
//             "transfers_cost": 0,
//             "bench_points": 5
//         },
//         {
//             "percentile_rank": 35,
//             "bank": 1,
//             "gameweek": 25,
//             "points": 86,
//             "rank": 3550057,
//             "overall_rank": 10,
//             "value": 1056,
//             "transfers": 0,
//             "transfers_cost": 0,
//             "bench_points": 4
//         },
//         {
//             "percentile_rank": 1,
//             "bank": 39,
//             "gameweek": 26,
//             "points": 108,
//             "rank": 31401,
//             "overall_rank": 3,
//             "value": 1056,
//             "transfers": 2,
//             "transfers_cost": 0,
//             "bench_points": 2
//         },
//         {
//             "percentile_rank": 70,
//             "bank": 19,
//             "gameweek": 27,
//             "points": 49,
//             "rank": 7780909,
//             "overall_rank": 6,
//             "value": 1055,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 6
//         },
//         {
//             "percentile_rank": 30,
//             "bank": 19,
//             "gameweek": 28,
//             "points": 62,
//             "rank": 3120804,
//             "overall_rank": 8,
//             "value": 1058,
//             "transfers": 0,
//             "transfers_cost": 0,
//             "bench_points": 3
//         },
//         {
//             "percentile_rank": 10,
//             "bank": 19,
//             "gameweek": 29,
//             "points": 71,
//             "rank": 601987,
//             "overall_rank": 2,
//             "value": 1053,
//             "transfers": 3,
//             "transfers_cost": 4,
//             "bench_points": 0
//         },
//         {
//             "percentile_rank": 50,
//             "bank": 4,
//             "gameweek": 30,
//             "points": 45,
//             "rank": 5555363,
//             "overall_rank": 2,
//             "value": 1047,
//             "transfers": 0,
//             "transfers_cost": 0,
//             "bench_points": 15
//         },
//         {
//             "percentile_rank": 1,
//             "bank": 4,
//             "gameweek": 31,
//             "points": 70,
//             "rank": 49309,
//             "overall_rank": 1,
//             "value": 1053,
//             "transfers": 0,
//             "transfers_cost": 0,
//             "bench_points": 12
//         },
//         {
//             "percentile_rank": 10,
//             "bank": 4,
//             "gameweek": 32,
//             "points": 87,
//             "rank": 765727,
//             "overall_rank": 1,
//             "value": 1056,
//             "transfers": 0,
//             "transfers_cost": 0,
//             "bench_points": 11
//         },
//         {
//             "percentile_rank": 5,
//             "bank": 13,
//             "gameweek": 33,
//             "points": 90,
//             "rank": 293208,
//             "overall_rank": 1,
//             "value": 1058,
//             "transfers": 3,
//             "transfers_cost": 0,
//             "bench_points": 0
//         },
//         {
//             "percentile_rank": 5,
//             "bank": 13,
//             "gameweek": 34,
//             "points": 86,
//             "rank": 369923,
//             "overall_rank": 1,
//             "value": 1061,
//             "transfers": 0,
//             "transfers_cost": 0,
//             "bench_points": 11
//         },
//         {
//             "percentile_rank": 15,
//             "bank": 36,
//             "gameweek": 35,
//             "points": 56,
//             "rank": 1147275,
//             "overall_rank": 1,
//             "value": 1058,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 12
//         },
//         {
//             "percentile_rank": 1,
//             "bank": 0,
//             "gameweek": 36,
//             "points": 83,
//             "rank": 30479,
//             "overall_rank": 1,
//             "value": 1056,
//             "transfers": 2,
//             "transfers_cost": 4,
//             "bench_points": 9
//         },
//         {
//             "percentile_rank": 10,
//             "bank": 4,
//             "gameweek": 37,
//             "points": 61,
//             "rank": 695743,
//             "overall_rank": 1,
//             "value": 1057,
//             "transfers": 1,
//             "transfers_cost": 0,
//             "bench_points": 12
//         },
//         {
//             "percentile_rank": 15,
//             "bank": 11,
//             "gameweek": 38,
//             "points": 62,
//             "rank": 1551968,
//             "overall_rank": 1,
//             "value": 1061,
//             "transfers": 2,
//             "transfers_cost": 4,
//             "bench_points": 6
//         }
//     ],
//     "totalTransfers": 37,
//     "totalMinusPoints": 12,
//     "totalPointsOnBench": 276,
//     "bestWeek": {
//         "event": 24,
//         "points": 134,
//         "total_points": 1806,
//         "rank": 937768,
//         "rank_sort": 938907,
//         "overall_rank": 5,
//         "percentile_rank": 10,
//         "bank": 1,
//         "value": 1057,
//         "event_transfers": 2,
//         "event_transfers_cost": 0,
//         "points_on_bench": 5
//     },
//     "worstWeek": {
//         "event": 4,
//         "points": 23,
//         "total_points": 258,
//         "rank": 10068255,
//         "rank_sort": 10068566,
//         "overall_rank": 2882863,
//         "percentile_rank": 100,
//         "bank": 24,
//         "value": 1004,
//         "event_transfers": 0,
//         "event_transfers_cost": 0,
//         "points_on_bench": 10
//     },
//     "bestOverallRankWeek": {
//         "event": 4,
//         "points": 23,
//         "total_points": 258,
//         "rank": 10068255,
//         "rank_sort": 10068566,
//         "overall_rank": 2882863,
//         "percentile_rank": 100,
//         "bank": 24,
//         "value": 1004,
//         "event_transfers": 0,
//         "event_transfers_cost": 0,
//         "points_on_bench": 10
//     },
//     "worstOverallRankWeek": {
//         "event": 31,
//         "points": 70,
//         "total_points": 2293,
//         "rank": 49309,
//         "rank_sort": 49792,
//         "overall_rank": 1,
//         "percentile_rank": 1,
//         "bank": 4,
//         "value": 1053,
//         "event_transfers": 0,
//         "event_transfers_cost": 0,
//         "points_on_bench": 12
//     },
//     "highestValueWeek": {
//         "event": 23,
//         "points": 73,
//         "total_points": 1672,
//         "rank": 1304008,
//         "rank_sort": 1305722,
//         "overall_rank": 4,
//         "percentile_rank": 15,
//         "bank": 0,
//         "value": 1063,
//         "event_transfers": 1,
//         "event_transfers_cost": 0,
//         "points_on_bench": 4
//     },
//     "chips": [
//         {
//             "name": "wildcard",
//             "time": "2024-11-21T10:15:44.506529Z",
//             "gw": 12
//         },
//         {
//             "name": "manager",
//             "time": "2025-02-01T10:01:33.909883Z",
//             "gw": 24
//         },
//         {
//             "name": "wildcard",
//             "time": "2025-04-01T15:09:46.880868Z",
//             "gw": 30
//         },
//         {
//             "name": "3xc",
//             "time": "2025-04-12T09:53:15.401294Z",
//             "gw": 32
//         },
//         {
//             "name": "bboost",
//             "time": "2025-04-19T11:50:01.936765Z",
//             "gw": 33
//         },
//         {
//             "name": "freehit",
//             "time": "2025-04-20T08:19:43.399373Z",
//             "gw": 34
//         }
//     ],
//     "past": [
//         {
//             "season_name": "2020/21",
//             "total_points": 1830,
//             "rank": 4231523
//         },
//         {
//             "season_name": "2021/22",
//             "total_points": 1434,
//             "rank": 7769696
//         },
//         {
//             "season_name": "2022/23",
//             "total_points": 2306,
//             "rank": 1466498
//         },
//         {
//             "season_name": "2023/24",
//             "total_points": 2371,
//             "rank": 508866
//         },
//         {
//             "season_name": "2024/25",
//             "total_points": 2810,
//             "rank": 1
//         }
//     ],
//     "seasons": 5,
//     "seasons_managed": "2020/21",
//     "previousRank": 1
// }


// compareObjects(object1, object2);