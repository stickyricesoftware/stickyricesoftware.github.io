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
import superLeagueTransfersAddedDataTest from "./testData/superLeagueTransfersAddedDataTest.js";
import superLeagueAddWeeklyPicksTest from "./testData/superLeagueAddWeeklyPicksTest.js";

let testMode = true; // Set to true to use test data
let addDelaySimulationTime = 100;
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
let currentGw = 1;

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
      icon: "bi-bar-chart",
      label: "GW Stats",
      action: showGameweekStats,
      tier: "free",
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
      icon: "bi-trophy",
      label: "Captaincy Points League",
      action: showCaptaincyPointsLeague,
      tier: "pro",
      requiresData: true,
    },
    {
      icon: "bi-exclamation-triangle",
      label: "Cards League",
      action: showCardsLeague,
      tier: "pro",
      requiresData: true,
    },
    {
      icon: "bi-shield-check",
      label: "Golden Boot League",
      action: showGoldenbootLeague,
      tier: "pro",
      requiresData: true,
    },
    {
      icon: "bi-boxes",
      label: "Chip Usage",
      action: showChipUsage,
      tier: "free",
      requiresData: true,
    },
    {
      icon: "bi-calculator",
      label: "Rivals Transfer Calculator",
      action: showTransferCalculator,
      tier: "pro",
      requiresData: true,
    },
    {
      icon: "bi-cash-coin",
      label: "Team Value League",
      action: showTeamValueLeague,
      tier: "pro",
      requiresData: true,
    },
    {
      icon: "bi-award",
      label: "Season Summary",
      action: showMySeasonSummary,
      tier: "free",
      requiresData: true,
    },
    {
      icon: "bi-person-check",
      label: "Download My Season",
      action: downloadMySeason,
      tier: "pro",
      requiresData: true,
    },
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
      action: showMemes,
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
      icon: "bi-speedometer2",
      label: "Max Dashboard",
      action: handleStatsClick,
      tier: "max",
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
      console.log("simulating delay");
      await sleep(addDelaySimulationTime);
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
    await addDetailedGameweeksToLeague(standings, null);
    window.FPLToolboxLeagueDataReady = true;

    toolsScreen(); // Re-render for free features
  }

  // Pro Tier
  if (userHasAccess([10, 12])) {
    await weeklyPicksForSuperLeague(standings, null);
    await addAllTransfers(standings, null);
    window.FPLToolboxProLeagueDataReady = true;
    window.FPLToolboxMaxLeagueDataReady = true;

    toolsScreen(); // Re-render for pro features
  }

  // Max Tier (only user 12)
  if (userHasAccess([12])) {
    toolsScreen(); // Re-render for max features
  }
  window.FPLToolboxLeagueDataReady = true;
  window.FPLToolboxProLeagueDataReady = true;
  window.FPLToolboxMaxLeagueDataReady = true;
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
  if (hasStandings && (!needsPro || proReady) && (!needsMax || maxReady)) {
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

    window.FPLToolboxLeagueData.standings = sliceStandingsForUser(
      superLeagueManagerDataTest.standings
    );
    console.log(
      "%c TEST MODE - NO API CALL MADE - Adding Manager Details",
      "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: green; ",
      "New Data",
      window.FPLToolboxLeagueData.standings
    );
    console.log("simulating delay");
    await sleep(addDelaySimulationTime);

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

    window.FPLToolboxLeagueData.standings = sliceStandingsForUser(
      superLeagueGameweekDataTest.standings
    );
    console.log(
      "%c TEST MODE - NO API CALL MADE - Adding Gameweek Details",
      "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: green; ",
      "New Data",
      window.FPLToolboxLeagueData.standings
    );
    console.log("simulating delay");
    await sleep(addDelaySimulationTime);
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
async function addAllTransfers(standings, div) {
  const startTime = Date.now(); // Start the timer
  if (testMode) {
    console.log(
      "%c TEST MODE - NO API CALL MADE - Added Manager Transfers",
      "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: green; ",
      "Old Data",
      window.FPLToolboxLeagueData.standings
    );

    window.FPLToolboxLeagueData.standings = sliceStandingsForUser(
      superLeagueTransfersAddedDataTest.standings
    );
    console.log(
      "%c TEST MODE - NO API CALL MADE - Added Manager Transfers",
      "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: green; ",
      "New Data",
      window.FPLToolboxLeagueData.standings
    );
    console.log("simulating delay");
    await sleep(addDelaySimulationTime);
    return; // Skip live fetching
  }
  const allTransfersFetch = standings.map(async (team) => {
    try {
      const transfersPromises = [];

      // Fetch transfer data for each team
      transfersPromises.push(
        fetch(`${BASE_URL}/entry/${team.entry}/transfers/`).then((response) =>
          response.json()
        )
      );

      // Wait for all transfer data to resolve
      const transfersData = await Promise.all(transfersPromises);

      // Add transfers data to the team's object
      team.transfers = transfersData;

      // Add a small delay between requests (e.g., 500ms)
      await sleep(200);
      console.log("delay here");
    } catch (error) {
      console.error(`Error fetching transfers for team ${team.entry}: `, error);
    }
  });

  await Promise.all(allTransfersFetch);
  console.log(
    "%c API CALL MADE - All Transfers Added",
    "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: red; ",
    standings
  );
  const endTime = Date.now(); // End the timer
  console.log(
    `All transfers added in ${(endTime - startTime) / 1000} seconds.`
  );
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

    window.FPLToolboxLeagueData.standings = sliceStandingsForUser(
      superLeagueDetailedGameweekDataTest.standings
    );
    console.log(
      "%c TEST MODE - NO API CALL MADE - Adding Detailed Gameweek Details",
      "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: green; ",
      "New Data",
      window.FPLToolboxLeagueData.standings
    );
    console.log("simulating delay");
    await sleep(addDelaySimulationTime);
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

    window.FPLToolboxLeagueData.standings = sliceStandingsForUser(
      superLeagueAddWeeklyPicksTest.standings
    );
    console.log(
      "%c TEST MODE - NO API CALL MADE - Adding Weekly Picks",
      "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: green; ",
      "New Data",
      window.FPLToolboxLeagueData.standings
    );
    console.log("simulating longer delay");
    await sleep(addDelaySimulationTime);
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
  console.log(window.FPLToolboxLeagueData);
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

async function showGameweekStats() {
  // if (!userHasAccess([1, 10, 12])) {
  //   showModal({
  //     title: "Paid Feature",
  //     body: "This feature is only available to <strong>paid members</strong>. <br><br>Upgrade to unlock!",
  //     confirmText: "Upgrade Now",
  //     onConfirm: () => {
  //       window.location.href = "/subscribe";
  //     },
  //   });
  //   return;
  // }

  const container = document.getElementById("screen-tools");
  container.innerHTML = "";

  // Back button
  const backBtn = createBackButton();
  backBtn.classList.add("btn", "btn-secondary", "mb-3");
  container.appendChild(backBtn);

  const tableHeader = document.createElement("h6");
  tableHeader.classList.add("text-center", "mb-3");
  tableHeader.innerText = `${window.FPLToolboxLeagueData.leagueName} – Gameweek Activity`;
  container.appendChild(tableHeader);

  const tableWrapper = document.createElement("div");
  tableWrapper.className = "table-responsive";

  const table = document.createElement("table");
  const darkMode = localStorage.getItem("darkMode") === "true";

  table.classList.add(
    "table",
    "table-striped",
    "table-hover",
    "table-bordered",
    "align-middle",
    darkMode ? "table-dark" : "table-light"
  );

  const thead = document.createElement("thead");
  thead.classList.add("text-center");

  const headerRow = document.createElement("tr");
  const headers = [
    "Pos",
    "Team",
    "Chip",
    "Captain",
    "Score",
    "Total",
    "xfrs",
    "Minus P",
    "Bench P",
  ];

  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.innerText = headerText;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  try {
    for (const element of window.FPLToolboxLeagueData.standings) {
      const tr = document.createElement("tr");

      if (element.entry == theUser.info.team_id) {
        tr.classList.add("table-primary");
      }

      // Position and movement
      const pos = document.createElement("td");
      pos.className = "text-center fw-bold";
      const rankMovement = document.createElement("span");

      if (element.rank < element.last_rank) {
        rankMovement.innerText = " ▲";
        rankMovement.className = "text-success";
      } else if (element.rank > element.last_rank) {
        rankMovement.innerText = " ▼";
        rankMovement.className = "text-danger";
      } else {
        rankMovement.innerText = " ●";
        rankMovement.className = "text-muted";
      }

      pos.innerText = element.rank;
      pos.appendChild(rankMovement);
      tr.appendChild(pos);

      // Team

      const teamNameCell = document.createElement("td");
      teamNameCell.innerHTML = `<strong>${element.entry_name}</strong><br><small>${element.player_name}</small>`;
      tr.appendChild(teamNameCell);

      // Chip
      const chip = document.createElement("td");
      chip.className = "text-center";
      if (element.currentWeek[0].active_chip) {
        const chipName = convertChipName(element.currentWeek[0].active_chip);
        chip.innerText = chipName;
        chip.classList.add(`chip-${chipName.toLowerCase()}`);
      } else {
        chip.innerHTML = "-";
      }
      tr.appendChild(chip);

      // Captain
      const captain = document.createElement("td");
      const activeChip = convertChipName(element.currentWeek[0].active_chip);
      for (const player of element.currentWeek[0].picks) {
        if (player.is_captain) {
          const name = await getPlayerWebName(player.element);
          const score = await getPlayerScore(player.element);
          const scoreMultiplier = activeChip === "TC" ? 3 : 2;
          captain.innerText = `${name} (${score * scoreMultiplier})`;
        }
      }
      tr.appendChild(captain);

      // GW Score
      const score = document.createElement("td");
      score.className = "text-center";
      score.innerText = element.event_total;
      tr.appendChild(score);

      // Total Points
      const total = document.createElement("td");
      total.className = "text-center";
      total.innerText = element.total;
      tr.appendChild(total);

      // Transfers
      const transfers = document.createElement("td");
      transfers.className = "text-center";
      transfers.innerText = element.everyGw.at(-1).transfers;
      tr.appendChild(transfers);

      // Transfer cost
      const minus = document.createElement("td");
      minus.className = "text-center";
      const cost = element.everyGw.at(-1).transfers_cost;
      minus.innerText = cost;
      if (cost > 0) {
        minus.classList.add("text-danger", "fw-bold");
      }
      tr.appendChild(minus);

      // Bench Points
      const bench = document.createElement("td");
      bench.className = "text-center";
      bench.innerText = element.everyGw.at(-1).bench_points;
      tr.appendChild(bench);

      tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    tableWrapper.appendChild(table);
    container.appendChild(tableWrapper);
  } catch (error) {
    console.error("Error building table:", error);
  }
}

async function showCaptaincyPointsLeague() {
  if (!userHasAccess([10, 12])) {
    showModal({
      title: "Paid Feature",
      body: "This feature is only available to <strong>paid members</strong>. <br><br>Upgrade to unlock!",
      confirmText: "Upgrade Now",
      onConfirm: () => {
        window.location.href = "/subscribe";
      },
    });
    return;
  }
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
  if (!userHasAccess([10, 12])) {
    showModal({
      title: "Paid Feature",
      body: "This feature is only available to <strong>paid members</strong>. <br><br>Upgrade to unlock!",
      confirmText: "Upgrade Now",
      onConfirm: () => {
        window.location.href = "/subscribe";
      },
    });
    return;
  }
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
      shareMessage += `${
        index + 1
      }. ${teamName} - Benched Points: ${benchedPoints}\n`;
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
async function showCardsLeague() {
  if (!userHasAccess([10, 12])) {
    showModal({
      title: "Paid Feature",
      body: "This feature is only available to <strong>paid members</strong>. <br><br>Upgrade to unlock!",
      confirmText: "Upgrade Now",
      onConfirm: () => {
        window.location.href = "/subscribe";
      },
    });
    return;
  }

  const container = document.getElementById("screen-tools");
  container.innerHTML = "";

  const backBtn = createBackButton();
  backBtn.classList.add("btn", "btn-secondary", "mb-3");
  container.appendChild(backBtn);

  const leagueTable = document.createElement("div");
  leagueTable.setAttribute("id", "league-table");
  container.appendChild(leagueTable);

  const tableDescription = document.createElement("h6");
  tableDescription.innerText = `${FPLToolboxLeagueData.leagueName} \n Total Cards Leaderboard`;
  tableDescription.classList.add("text-center", "mb-3");
  leagueTable.appendChild(tableDescription);

  const table = document.createElement("table");
  table.classList.add(
    "table",
    "table-striped",
    "table-hover",
    "table-bordered"
  );

  const darkMode = localStorage.getItem("darkMode") === "true";
  table.classList.add(darkMode ? "table-dark" : "table-light");

  // Table Header
  const tableHeader = document.createElement("thead");
  const tableHeaderRow = document.createElement("tr");

  const headers = ["#", "Team Name", "Total"];
  headers.forEach((text, i) => {
    const th = document.createElement("th");

    if (text === "Total") {
      th.innerHTML = `Total <span id="sort-indicator">▼</span>`;
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

    const rowNum = document.createElement("td");
    rowNum.innerText = index + 1;
    row.appendChild(rowNum);

    const teamName = document.createElement("td");
    teamName.innerHTML = `<strong>${team.entry_name}</strong><br><small>${team.player_name}</small>`;
    row.appendChild(teamName);

    const total = document.createElement("td");
    total.innerText = team.total_cards || 0;
    total.classList.add("text-end");
    row.appendChild(total);

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  leagueTable.appendChild(table);

  // Sort Logic (by Total Cards)
  const sortTable = (ascending = false) => {
    const rows = Array.from(tableBody.querySelectorAll("tr"));
    rows.sort((a, b) => {
      const valA = parseFloat(a.cells[2].innerText) || 0;
      const valB = parseFloat(b.cells[2].innerText) || 0;
      return ascending ? valA - valB : valB - valA;
    });

    rows.forEach((row, i) => {
      row.cells[0].innerText = i + 1;
      tableBody.appendChild(row);
    });

    document.getElementById("sort-indicator").innerText = ascending ? "▲" : "▼";
  };

  sortTable(false);

  tableHeaderRow.children[2].addEventListener("click", () => {
    const current = tableHeaderRow.children[2].dataset.sorted === "asc";
    tableHeaderRow.children[2].dataset.sorted = current ? "desc" : "asc";
    sortTable(!current);
  });

  // Share Button
  const shareButton = document.createElement("button");
  shareButton.innerText = "Share League";
  shareButton.classList.add("btn", "btn-primary", "mt-3");
  shareButton.onclick = shareLeague;
  leagueTable.appendChild(shareButton);

  function shareLeague() {
    const rows = Array.from(tableBody.querySelectorAll("tr"));
    let shareText = `${FPLToolboxLeagueData.leagueName}\nTotal Cards Leaderboard:\n`;

    rows.forEach((row, i) => {
      const name = row.cells[1].innerText.split("\n")[0];
      const total = row.cells[2].innerText;
      shareText += `${i + 1}. ${name} - Cards: ${total}\n`;
    });

    shareText += `\nView your own league right here:\n https://fpltoolbox.com/fpl-toolbox-pro`;

    if (navigator.share) {
      navigator
        .share({
          title: "Share League",
          text: shareText,
        })
        .catch((err) => console.log("Share failed", err));
    } else {
      alert("Sharing is not supported in this browser.");
    }
  }
}
async function showGoldenbootLeague() {
  if (!userHasAccess([10, 12])) {
    showModal({
      title: "Paid Feature",
      body: "This feature is only available to <strong>paid members</strong>. <br><br>Upgrade to unlock!",
      confirmText: "Upgrade Now",
      onConfirm: () => {
        window.location.href = "/subscribe";
      },
    });
    return;
  }

  const container = document.getElementById("screen-tools");
  container.innerHTML = "";

  const backBtn = createBackButton();
  backBtn.classList.add("btn", "btn-secondary", "mb-3");
  container.appendChild(backBtn);

  console.log(FPLToolboxLeagueData);

  const leagueTable = document.createElement("div");
  leagueTable.setAttribute("id", "league-table");
  container.appendChild(leagueTable);

  const tableDescription = document.createElement("h6");
  tableDescription.innerText = `${FPLToolboxLeagueData.leagueName} \n Golden Boot Leaderboard`;
  tableDescription.classList.add("text-center", "mb-3");
  leagueTable.appendChild(tableDescription);

  const table = document.createElement("table");
  table.classList.add(
    "table",
    "table-striped",
    "table-hover",
    "table-bordered"
  );

  const darkMode = localStorage.getItem("darkMode") === "true";
  table.classList.add(darkMode ? "table-dark" : "table-light");

  const tableHeader = document.createElement("thead");
  const tableHeaderRow = document.createElement("tr");

  const headers = ["#", "Team Name", "TOT"];
  headers.forEach((headerText) => {
    const th = document.createElement("th");
    if (headerText === "TOT") {
      th.innerHTML = `TOT <span id="sort-indicator">▼</span>`;
      th.classList.add("text-end");
      th.style.cursor = "pointer";
    } else {
      th.innerText = headerText;
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

    const goalsCell = document.createElement("td");
    goalsCell.innerText = team.total_goals_scored || 0;
    goalsCell.classList.add("text-end");
    row.appendChild(goalsCell);

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  leagueTable.appendChild(table);

  const sortTable = (ascending = false) => {
    const rows = Array.from(tableBody.querySelectorAll("tr"));
    rows.sort((rowA, rowB) => {
      const goalsA = parseFloat(rowA.cells[2].innerText);
      const goalsB = parseFloat(rowB.cells[2].innerText);
      return ascending ? goalsA - goalsB : goalsB - goalsA;
    });

    rows.forEach((row, index) => {
      row.cells[0].innerText = index + 1;
      tableBody.appendChild(row);
    });

    const sortIndicator = document.getElementById("sort-indicator");
    sortIndicator.innerText = ascending ? "▲" : "▼";
  };

  sortTable(false);

  tableHeaderRow.children[2].addEventListener("click", () => {
    const isAscending = tableHeaderRow.children[2].dataset.sorted === "asc";
    tableHeaderRow.children[2].dataset.sorted = isAscending ? "desc" : "asc";
    sortTable(!isAscending);
  });

  const shareButton = document.createElement("button");
  shareButton.innerText = "Share League";
  shareButton.classList.add("btn", "btn-primary", "mt-3");
  shareButton.onclick = shareLeague;
  leagueTable.appendChild(shareButton);

  function shareLeague() {
    const rows = Array.from(tableBody.querySelectorAll("tr"));
    let shareMessage = `${FPLToolboxLeagueData.leagueName}\nGolden Boot Leaderboard:\n`;

    rows.forEach((row, index) => {
      const teamName = row.cells[1].innerText.split("\n")[0];
      const goals = row.cells[2].innerText;
      shareMessage += `${index + 1}. ${teamName} - Goals: ${goals}\n`;
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
async function showChipUsage() {
  const container = document.getElementById("screen-tools");
  container.innerHTML = "";

  const backBtn = createBackButton();
  backBtn.classList.add("btn", "btn-secondary", "mb-3");
  container.appendChild(backBtn);

  const tableHeader = document.createElement("h6");
  tableHeader.innerText = `${FPLToolboxLeagueData.leagueName} \n Chip Usage`;
  tableHeader.style.textAlign = "center";
  container.appendChild(tableHeader);

  const table = document.createElement("table");
  table.classList.add(
    "table",
    "table-bordered",
    "table-hover",
    "table-striped"
  );
  const darkMode = localStorage.getItem("darkMode") === "true";
  table.classList.add(darkMode ? "table-dark" : "table-light");

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");

  const chipOrder = [
    "wildcard1",
    "bboost",
    "3xc",
    "wildcard2",
    "freehit",
    "manager",
  ];
  const chipMap = {
    wildcard1: "Wildcard 1",
    wildcard2: "Wildcard 2",
    bboost: "Bench Boost",
    "3xc": "Triple Captain",
    freehit: "Free Hit",
    manager: "Assistant",
  };

  ["#", "Team", ...chipOrder.map((c) => chipMap[c])].forEach((header) => {
    const th = document.createElement("th");
    th.innerText = header;
    th.style.whiteSpace = "nowrap";
    headRow.appendChild(th);
  });

  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  FPLToolboxLeagueData.standings.forEach((element, index) => {
    const tr = document.createElement("tr");

    const numCell = document.createElement("td");
    numCell.innerText = index + 1;
    tr.appendChild(numCell);

    const nameCell = document.createElement("td");
    nameCell.innerHTML = `<strong>${element.entry_name}</strong><br><small>${element.player_name}</small>`;
    tr.appendChild(nameCell);

    const wildcards = element.chips.filter((c) => c.name === "wildcard");

    chipOrder.forEach((chipType) => {
      let chipData = null;

      if (chipType === "wildcard1") {
        chipData = wildcards[0];
      } else if (chipType === "wildcard2") {
        chipData = wildcards[1];
      } else {
        chipData = element.chips.find((c) => c.name === chipType);
      }

      const td = document.createElement("td");
      td.style.textAlign = "center";
      td.style.whiteSpace = "nowrap";

      const img = document.createElement("img");
      img.src = `https://fpltoolbox.com/wp-content/uploads/2025/03/${chipType.replace(
        /[12]/,
        ""
      )}.webp`;
      img.style.maxWidth = "30px";
      img.style.opacity = chipData ? "1" : "0.3";

      const info = document.createElement("div");
      info.style.fontSize = "0.75rem";
      info.innerText = chipData ? `GW${chipData.gw}` : "—";

      td.appendChild(img);
      td.appendChild(info);
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);

  const tableWrapper = document.createElement("div");
  tableWrapper.className = "table-responsive";
  tableWrapper.appendChild(table);
  container.appendChild(tableWrapper);
}
async function showTransferCalculator() {
  if (!userHasAccess([10, 12])) {
    showModal({
      title: "Paid Feature",
      body: "This feature is only available to <strong>paid members</strong>. <br><br>Upgrade to unlock!",
      confirmText: "Upgrade Now",
      onConfirm: () => {
        window.location.href = "/subscribe";
      },
    });
    return;
  }

  const container = document.getElementById("screen-tools");
  container.innerHTML = "";

  const backBtn = createBackButton();
  backBtn.classList.add("btn", "btn-secondary", "mb-3");
  container.appendChild(backBtn);

  const tableHeader = document.createElement("h6");
  tableHeader.innerText = `${FPLToolboxLeagueData.leagueName} \n Available Free Transfers Next Week`;
  tableHeader.style.textAlign = "center";
  container.appendChild(tableHeader);

  const tableWrapper = document.createElement("div");
  tableWrapper.className = "table-responsive";
  container.appendChild(tableWrapper);

  const table = document.createElement("table");
  table.classList.add(
    "table",
    "table-bordered",
    "table-hover",
    "table-striped"
  );
  const darkMode = localStorage.getItem("darkMode") === "true";
  table.classList.add(darkMode ? "table-dark" : "table-light");
  tableWrapper.appendChild(table);

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");

  ["Pos", "Team", "Available Transfers"].forEach((header) => {
    const th = document.createElement("th");
    th.innerText = header;
    th.style.whiteSpace = "nowrap";
    th.style.textAlign = header === "Available Transfers" ? "right" : "left";
    headRow.appendChild(th);
  });

  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  table.appendChild(tbody);

  try {
    // Calculate available transfers
    FPLToolboxLeagueData.standings.forEach((team) => {
      team.availableTransfers = calculateAvailableTransfers(team);
    });

    // Sort standings
    const sortedLeague = [...FPLToolboxLeagueData.standings].sort(
      (a, b) => b.availableTransfers - a.availableTransfers
    );

    // Render rows
    sortedLeague.forEach((team, index) => {
      const tr = document.createElement("tr");

      const posTd = document.createElement("td");
      posTd.innerText = index + 1;
      tr.appendChild(posTd);

      const teamTd = document.createElement("td");
      teamTd.innerHTML = `<strong>${
        team.entry_name
      }</strong><br><small>${team.player_name.slice(0, 40)}</small>`;
      tr.appendChild(teamTd);

      const transfersTd = document.createElement("td");
      transfersTd.innerText = team.availableTransfers;
      transfersTd.style.textAlign = "right";
      tr.appendChild(transfersTd);

      tbody.appendChild(tr);
    });

    // Share Button
    const shareButton = document.createElement("button");
    shareButton.innerText = "Share League";
    shareButton.classList.add("btn", "btn-primary", "mt-3");
    shareButton.onclick = () => shareTopTen(sortedLeague);
    container.appendChild(shareButton);
  } catch (error) {
    console.error("Error in transferCalculator:", error);
  }

  // Helper: Calculate Available Transfers
  function calculateAvailableTransfers(team) {
    let freeTransfers = 1;
    const maxTransfers = 5;
    const transfersByGW = {};

    team.transfers[0]?.forEach((transfer) => {
      if (!transfersByGW[transfer.event]) {
        transfersByGW[transfer.event] = [];
      }
      transfersByGW[transfer.event].push(transfer);
    });

    for (let gw = 2; gw <= currentGw; gw++) {
      freeTransfers = Math.min(freeTransfers + 1, maxTransfers);

      const chipUsed = team.chips.find(
        (chip) =>
          (chip.name === "wildcard" || chip.name === "freehit") &&
          chip.gw === gw
      );
      if (chipUsed) continue;

      const transfersMade = transfersByGW[gw]?.length || 0;
      freeTransfers -= transfersMade;
      freeTransfers = Math.max(freeTransfers, 1);
    }

    return freeTransfers;
  }

  // Helper: Share top 10 teams
  function shareTopTen(league) {
    const topTen = league.slice(0, 10);
    let shareMessage = `${FPLToolboxLeagueData.leagueName}\nAvailable Transfers:\n`;

    topTen.forEach((team, index) => {
      shareMessage += `${index + 1}. ${
        team.entry_name
      }\n (${team.player_name.slice(0, 10)}) - Available Transfers: ${
        team.availableTransfers
      }\n`;
    });

    if (navigator.share) {
      navigator
        .share({
          title: "Share League",
          text:
            shareMessage +
            `\nCheck your own league here:\nhttps://fpltoolbox.com/fpl-toolbox-pro/`,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      alert("Sharing is not supported in this browser.");
    }
  }
}
async function showTeamValueLeague() {
  if (!userHasAccess([10, 12])) {
    showModal({
      title: "Paid Feature",
      body: "This feature is only available to <strong>paid members</strong>. <br><br>Upgrade to unlock!",
      confirmText: "Upgrade Now",
      onConfirm: () => {
        window.location.href = "/subscribe";
      },
    });
    return;
  }

  const container = document.getElementById("screen-tools");
  container.innerHTML = "";

  const backBtn = createBackButton();
  backBtn.classList.add("btn", "btn-secondary", "mb-3");
  container.appendChild(backBtn);

  const leagueTable = document.createElement("div");
  leagueTable.setAttribute("id", "league-table");
  container.appendChild(leagueTable);

  const tableDescription = document.createElement("h6");
  tableDescription.innerText = `${FPLToolboxLeagueData.leagueName} \n Team Value Leaderboard`;
  tableDescription.classList.add("text-center", "mb-3");
  leagueTable.appendChild(tableDescription);

  const table = document.createElement("table");
  table.classList.add(
    "table",
    "table-striped",
    "table-hover",
    "table-bordered"
  );

  const darkMode = localStorage.getItem("darkMode") === "true";
  table.classList.add(darkMode ? "table-dark" : "table-light");

  const tableHeader = document.createElement("thead");
  const tableHeaderRow = document.createElement("tr");

  const headers = ["#", "Team Name", "Team Value (£m)"];
  headers.forEach((headerText, i) => {
    const th = document.createElement("th");

    if (i === 2) {
      th.innerHTML = `Team Value <span id="sort-indicator">▼</span>`;
      th.classList.add("text-end");
      th.style.cursor = "pointer";
    } else {
      th.innerText = headerText;
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

    const latestGw = team.everyGw?.[team.everyGw.length - 1];
    const rawValue = latestGw?.value || 0;
    const valueInMillions = (rawValue / 10).toFixed(1);

    const valueCell = document.createElement("td");
    valueCell.innerText = valueInMillions;
    valueCell.classList.add("text-end");
    row.appendChild(valueCell);

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  leagueTable.appendChild(table);

  const sortTable = (ascending = false) => {
    const rows = Array.from(tableBody.querySelectorAll("tr"));
    rows.sort((rowA, rowB) => {
      const valA = parseFloat(rowA.cells[2].innerText);
      const valB = parseFloat(rowB.cells[2].innerText);
      return ascending ? valA - valB : valB - valA;
    });

    rows.forEach((row, index) => {
      row.cells[0].innerText = index + 1;
      tableBody.appendChild(row);
    });

    const sortIndicator = document.getElementById("sort-indicator");
    sortIndicator.innerText = ascending ? "▲" : "▼";
  };

  sortTable(false);

  tableHeaderRow.children[2].addEventListener("click", () => {
    const isAscending = tableHeaderRow.children[2].dataset.sorted === "asc";
    tableHeaderRow.children[2].dataset.sorted = isAscending ? "desc" : "asc";
    sortTable(!isAscending);
  });

  const shareButton = document.createElement("button");
  shareButton.innerText = "Share League";
  shareButton.classList.add("btn", "btn-primary", "mt-3");
  shareButton.onclick = shareLeague;
  leagueTable.appendChild(shareButton);

  function shareLeague() {
    const rows = Array.from(tableBody.querySelectorAll("tr"));
    let shareMessage = `${FPLToolboxLeagueData.leagueName}\nTeam Value Leaderboard:\n`;

    rows.forEach((row, index) => {
      const teamName = row.cells[1].innerText.split("\n")[0];
      const value = row.cells[2].innerText;
      shareMessage += `${index + 1}. ${teamName} - £${value}m\n`;
    });

    shareMessage += `\nView your own league here:\nhttps://fpltoolbox.com/fpl-toolbox-pro`;

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
async function showMySeasonSummary() {
  if (userHasAccess([1, 10, 12])) {
    showModal({
      title: "Coming Soon",
      body: "Come back in a few weeks - we don't have enough info to yet to give you anything useful!",
      confirmText: "Ok",
      onConfirm: () => {}, // No action taken
    });
    return;
  }

  const container = document.getElementById("screen-tools");
  container.innerHTML = "";

  const backBtn = createBackButton();
  backBtn.classList.add("btn", "btn-secondary", "mb-3");
  container.appendChild(backBtn);
}
async function downloadMySeason() {
  if (!userHasAccess([10, 12])) {
    showModal({
      title: "Paid Feature",
      body: "This feature is only available to <strong>paid members</strong>.<br><br>Upgrade to unlock!",
      confirmText: "Upgrade Now",
      onConfirm: () => {
        window.location.href = "/subscribe";
      },
    });
    return;
  }

  const container = document.getElementById("screen-tools");
  container.innerHTML = "";
  container.classList.add("container", "py-4");

  const backBtn = createBackButton();
  backBtn.classList.add("btn", "btn-secondary", "mb-3");
  container.appendChild(backBtn);

  const startTime = new Date();
  console.log(`[${startTime.toLocaleTimeString()}] Starting fetchinig gameweek seasons`);

  const eventStatus = await getEventStatus();

  const ignoredUrls = [
    "https://fpltoolbox.com/tools-for-fpl-content/",
    "http://127.0.0.1:5500/index.html",
  ];

  const currentUrl = window.location.href;

  if (eventStatus.status[0].event != 38) {
    container.innerHTML = "";
    const loaderCard = document.createElement("div");
    const loaderContainer = document.createElement("div");
    loaderContainer.id = "loader-container";
    loaderCard.id = "loader-card";
    loaderCard.textContent = `Come back when the season is over to download all of your gameweeks with one click`;
    loaderCard.className = "skeleton";
    loaderContainer.appendChild(loaderCard);
    container.append(loaderContainer);
    return;
  }

  // Spinner setup
  const spinnerWrapper = document.createElement("div");
  spinnerWrapper.id = "loading-spinner";
  spinnerWrapper.className = "d-flex justify-content-center my-5";

  const spinner = document.createElement("div");
  spinner.className = "spinner-border text-primary";
  spinner.role = "status";

  const spinnerText = document.createElement("span");
  spinnerText.className = "visually-hidden";
  spinnerText.innerText = "Loading...";

  spinner.appendChild(spinnerText);
  spinnerWrapper.appendChild(spinner);
  container.appendChild(spinnerWrapper);

  // Container placeholders
  const season = document.createElement("div");
  season.id = "season-view";
  const firstHalf = document.createElement("div");
  firstHalf.className = "col-lg-6";
  const secondHalf = document.createElement("div");
  secondHalf.className = "col-lg-6";

  const nameHeader = document.createElement("h3");
  nameHeader.className = "text-center fw-bold mb-0";
  nameHeader.innerText = theUser.info.player_first_name + " " + theUser.info.player_last_name;

  const seasonDiv = document.createElement("div");
  seasonDiv.className = "badge bg-dark text-white mx-auto d-block my-2 px-3 py-2";
  seasonDiv.innerText = "Your 24/25 Season";

  let previousRank = undefined;

  try {
    const currentGw = eventStatus.status[0].event;

    for (let gameweekIdentifier = 1; gameweekIdentifier <= currentGw; gameweekIdentifier++) {
      const response = await fetch(`${BASE_URL}/entry/${theUser.info.team_id}/event/${gameweekIdentifier}/picks/`);
      const data = await response.json();

      const gameweekView = document.createElement("div");
      gameweekView.id = `gameweek-view-${gameweekIdentifier}`;

      const gwSummary = document.createElement("div");
      gwSummary.className = "text-center p-2";

      let rankArrowBadge = document.createElement("img");
      rankArrowBadge.style.width = "20px";
      rankArrowBadge.style.height = "20px";

      if (previousRank !== undefined) {
        const currentRank = data.entry_history.overall_rank;
        rankArrowBadge = document.createElement("img");
        rankArrowBadge.id = "download-season-rank";
        rankArrowBadge.style.width = "20px";
        rankArrowBadge.style.height = "20px";

        if (currentRank < previousRank) {
          rankArrowBadge.src = "https://fpltoolbox.com/wp-content/uploads/2024/12/green-arrow.png";
        } else if (currentRank > previousRank) {
          rankArrowBadge.src = "https://fpltoolbox.com/wp-content/uploads/2024/12/red-arrow.png";
          rankArrowBadge.style.transform = "rotate(180deg)";
        }
      }

      previousRank = data.entry_history.overall_rank;

      const summaryText = document.createElement("p");
      summaryText.className = "mb-1 fw-semibold";
      summaryText.innerText = `GW: ${gameweekIdentifier} | Points: ${data.entry_history.points} | Total: ${data.entry_history.total_points}`;
      gwSummary.append(rankArrowBadge, summaryText);

      if (data.active_chip) {
        const chipTag = document.createElement("div");
        chipTag.className = "small text-success mb-1";
        chipTag.innerText = `${convertChipName(data.active_chip)} activated`;
        gwSummary.append(chipTag);
      }

      const rankText = document.createElement("div");
      rankText.className = "text-muted";
      rankText.innerText = `Overall Rank: ${data.entry_history.overall_rank.toLocaleString("en")}`;
      gwSummary.append(rankText);

      gameweekView.appendChild(gwSummary);

      const playersContainer = document.createElement("div");
      playersContainer.className = "d-flex flex-wrap justify-content-center gap-2 mb-2";

      const benchContainer = document.createElement("div");
benchContainer.className = "d-flex flex-wrap justify-content-center gap-2 p-2 bg-secondary bg-opacity-10 rounded";



      for (const pick of data.picks) {
        if (pick.position > 16) continue;

        let pointsMultiplier = pick.multiplier || 1;
        const playerScore = (await getPlayerWeeklyScore(pick.element, gameweekIdentifier)) * pointsMultiplier;

        const card = await createPlayerCardNew(
          pick.element,
          playerScore,
          pick.is_captain,
          pick.is_vice_captain,
          pointsMultiplier
        );

const img = card.querySelector("img");
if (img) {
  img.style.maxWidth = "100%";
  img.style.height = "auto";
}

const col = document.createElement("div");
col.className = "col-4 col-sm-3 col-md-2 mb-2";
col.style.flex = "0 0 9.09%";
col.style.maxWidth = "9.09%";
card.style.maxWidth = "30px";
card.style.maxHeight = "30px";

col.appendChild(card);

        if (pick.position > 11) {
          benchContainer.appendChild(col);
        } else {
          playersContainer.appendChild(col);
        }
      }

      gameweekView.appendChild(playersContainer);
      gameweekView.appendChild(benchContainer);

      const toolboxCom = document.createElement("p");
      toolboxCom.innerText = "24/25 Season - fpltoolbox.com";
      toolboxCom.className = "text-center small text-muted";
      gameweekView.appendChild(toolboxCom);

      const gameweekCard = document.createElement("div");
      gameweekCard.className = "card mb-4 shadow-sm bg-light p-3";
      gameweekCard.appendChild(gameweekView);

      if (gameweekIdentifier <= 19) {
        firstHalf.appendChild(gameweekCard);
      } else {
        secondHalf.appendChild(gameweekCard);
      }
    }

// Done loading
    document.getElementById("loading-spinner")?.remove();

    container.appendChild(nameHeader);
    container.appendChild(seasonDiv);

    const halvesWrapper = document.createElement("div");
    halvesWrapper.className = "row";
    halvesWrapper.appendChild(firstHalf);
    halvesWrapper.appendChild(secondHalf);
    season.appendChild(halvesWrapper);
    container.appendChild(season);

    const endTime = new Date();
    console.log(`[${endTime.toLocaleTimeString()}] Finished fetching gameweek seasons`);

    addCaptainBadge();


    const shareBtn = document.createElement("button");
    shareBtn.id = "shareBtn";
    shareBtn.className = "btn btn-primary mt-4";
    shareBtn.textContent = "Download";
    container.appendChild(shareBtn);

    shareBtn.addEventListener("click", () => {
      document.body.classList.add("force-desktop");

      html2canvas(season, { scale: 2 }).then((canvas) => {
        document.body.classList.remove("force-desktop");
        const imgData = canvas.toDataURL("image/png");

        if (navigator.share) {
          fetch(imgData)
            .then((res) => res.blob())
            .then((blob) => {
              const file = new File([blob], "fpltoolbox-my-season.png", { type: "image/png" });
              navigator
                .share({
                  title: "Your Season",
                  text: "FPLTOOLBOX.com",
                  files: [file],
                })
                .catch((err) => alert("Error sharing: " + err));
            });
        } else {
          const link = document.createElement("a");
          link.href = imgData;
          link.download = "season.png";
          link.click();
          alert("Sharing is not supported on your device. Image downloaded instead.");
        }
      });
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Simple cache object
const weeklyPlayerDataCache = {};
async function getPlayerWeeklyScore(playerId, gameweek) {
  // Check if this player's data is already cached
  if (weeklyPlayerDataCache[playerId]) {
    const cachedData = weeklyPlayerDataCache[playerId];

    const matchingHistories = cachedData.history.filter(
      (entry) => entry.round === gameweek
    );

    if (matchingHistories.length > 0) {
      return matchingHistories.reduce(
        (sum, entry) => sum + (entry.total_points || 0),
        0
      );
    } else {
      console.warn(`No match found for player ${playerId} in GW ${gameweek}`);
      return null;
    }
  }

  const url = `${BASE_URL}/element-summary/${playerId}/`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.history || !Array.isArray(data.history)) {
      console.warn(`Unexpected data format from ${url}`, data);
      return null;
    }

    // Cache the full data for future use
    weeklyPlayerDataCache[playerId] = data;

    const matchingHistories = data.history.filter(
      (entry) => entry.round === gameweek
    );

    if (matchingHistories.length > 0) {
      return matchingHistories.reduce(
        (sum, entry) => sum + (entry.total_points || 0),
        0
      );
    } else {
      console.warn(`No match found for player ${playerId} in GW ${gameweek}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}



async function showMemes() {
    if (!userHasAccess([1, 10, 12])) {
    showModal({
      title: "Coming Soon",
      body: "Come back in a few weeks - we don't have enough info to yet to give you anything useful!",
      confirmText: "Ok",
      onConfirm: () => {}, // No action taken
    });
    return;
  }
  
  const container = document.getElementById("screen-tools");
  container.innerHTML = "";

  const backBtn = createBackButton();
  backBtn.classList.add("btn", "btn-secondary", "mb-3");
  container.appendChild(backBtn);

  // Add a header above the table
  const tableDescription = document.createElement("h6");
  tableDescription.innerText = `${FPLToolboxLeagueData.leagueName} - Gameweek ${currentGw} Memes \n Tap a meme to share`;
  tableDescription.style.textAlign = "center";
  container.appendChild(tableDescription);

  const memeContainer = document.createElement("div");
  memeContainer.id = "meme-container";
  // Create and append the loading indicator
  const memeLoaderContainer = document.createElement("div");
  memeLoaderContainer.id = "meme-loader-container";

  // List of URLs where you want to ignore the condition
  const ignoredUrls = [
    "https://fpltoolbox.com/tools-for-fpl-content/", // Example full URL
    "http://127.0.0.1:5500/index.html",
  ];

  const currentUrl = window.location.href; // Get the full URL
  const eventStatus = await getEventStatus();
  console.log(eventStatus)
  if (
    currentGw !== 34 && // Ignore this whole check if we're in Gameweek 34
    !ignoredUrls.includes(currentUrl) && // Check if the full URL is not in the ignore list
    eventStatus.status[eventStatus.status.length - 1].bonus_added === false
  ) {
    const memeLoader = document.createElement("div");
    memeLoader.id = "meme-loader";
    memeLoader.innerText = `Hold up - Let's wait for the gameweek to end before we start making accusations 👀`;
    memeLoader.className = "skeleton";
    memeLoaderContainer.appendChild(memeLoader);
    container.append(memeLoaderContainer);
    return;
  }

  const memeLoader = document.createElement("div");
  memeLoader.id = "meme-loader";
  memeLoader.innerText = "Memes loading..."; // Optional text
  memeLoader.innerText = `Loading some juicy memes for you... 👀`;
  memeLoader.className = "skeleton";

  for (let i = 0; i < 4; i++) {
    memeLoaderContainer.appendChild(memeLoader.cloneNode(true));
  }

  container.append(memeLoaderContainer);

  memeLoaderContainer.remove();

  function getRandomTeam(league) {
    return league[Math.floor(Math.random() * league.length)];
  }
  const pointingAtYouMemes = [
    "https://fpltoolbox.com/wp-content/uploads/2025/02/ronaldo.gif",
    "https://fpltoolbox.com/wp-content/uploads/2025/02/vaya.gif",
    "https://fpltoolbox.com/wp-content/uploads/2025/02/3845a815f8746f8cb96c6effd98d37c9.jpg",
  ];
  const surprisedMemes = [
    "https://fpltoolbox.com/wp-content/uploads/2025/02/omg-ohmygod.gif",
    "https://fpltoolbox.com/wp-content/uploads/2025/02/wow.png",
    "https://fpltoolbox.com/wp-content/uploads/2025/02/1grvjo.jpg",
    "https://fpltoolbox.com/wp-content/uploads/2025/02/yeah-excellent.gif",
    "https://fpltoolbox.com/wp-content/uploads/2025/02/lego-lego-batman.gif",
  ];

  const suicidalMemes = [
    "https://fpltoolbox.com/wp-content/uploads/2025/02/Ben-Affleck-Smoking-meme-1.jpg",
    "https://fpltoolbox.com/wp-content/uploads/2025/02/suicidal.gif",
    "https://fpltoolbox.com/wp-content/uploads/2025/02/oh-ffs-8abb884c90.jpg",
    "https://fpltoolbox.com/wp-content/uploads/2025/02/crying-crying-meme.gif",
    "https://fpltoolbox.com/wp-content/uploads/2025/02/caught-out.webp",
    "https://fpltoolbox.com/wp-content/uploads/2025/02/giphy.gif",
  ];

  const utterWokeMemes = [
    "https://fpltoolbox.com/wp-content/uploads/2025/02/sean-dyche-football.gif",
    "https://fpltoolbox.com/wp-content/uploads/2025/02/r7vfc0oych5e1.jpeg",
  ];

  function findCaptaincyFailDrake() {
    for (const team of FPLToolboxLeagueData.standings) {
      let captain = null;
      let vice = null;

      team.currentWeek[0].picks.forEach((player) => {
        if (player.is_captain) captain = player;
        if (player.is_vice_captain) vice = player;
      });

      if (captain && vice) {
        if (getPlayerScore(vice.element) > getPlayerScore(captain.element)) {
          const message = `Bro making gameweek ${currentGw} captaincy decisions`;

          const capCard = createPlayerCardNew(
            captain.element,
            getPlayerScore(captain.element),
            true,
            null,
            null
          );
          const viceCard = createPlayerCardNew(
            vice.element,
            getPlayerScore(vice.element),
            null,
            true,
            null
          );

          if (capCard instanceof HTMLElement) {
            capCard.style.marginLeft = "-70%";
            viceCard.style.marginLeft = "-70%";
            capCard.style.transform = "scale(1.2)";
            viceCard.style.transform = "scale(1.2)";
          } else {
            console.warn("message2 is not a DOM element:", capCard);
          }
          const footer = `Spoiler alert, It's ${team.player_name.substring(
            0,
            team.player_name.indexOf(" ")
          )}`;
          // Image URL for meme
          const img =
            "https://fpltoolbox.com/wp-content/uploads/2025/02/30b1gx-1.jpg";

          const meme = createMeme4Corners(
            message,
            " ",
            viceCard,
            capCard,
            " ",
            footer,
            img
          );

          memeContainer.append(meme);

          return; // Stop searching after finding the first qualifying team
        }
      }
    }
    console.log("No team found with a captaincy fail.");
  }
  function findCaptaincyFailDoggo() {
    for (const team of FPLToolboxLeagueData.standings) {
      let captain = null;
      let vice = null;

      team.currentWeek[0].picks.forEach((player) => {
        if (player.is_captain) captain = player;
        if (player.is_vice_captain) vice = player;
      });

      if (captain && vice) {
        if (getPlayerScore(vice.element) > getPlayerScore(captain.element)) {
          const message = `${team.player_name.substring(
            0,
            team.player_name.indexOf(" ")
          )}'s vice captain vs actual captain`;

          const capCard = createPlayerCardNew(
            captain.element,
            getPlayerScore(captain.element),
            true,
            null,
            null
          );
          const viceCard = createPlayerCardNew(
            vice.element,
            getPlayerScore(vice.element),
            null,
            true,
            null
          );

          if (capCard instanceof HTMLElement) {
            // capCard.style.marginLeft = "-70%";
            // viceCard.style.marginLeft = "-70%";
            capCard.style.transform = "scale(1.2)";
            viceCard.style.transform = "scale(1.2)";
          } else {
            console.warn("message2 is not a DOM element:", capCard);
          }
          const footer = `www.fpltoolbox.com`;
          // Image URL for meme
          const img =
            "https://fpltoolbox.com/wp-content/uploads/2025/02/430zkq.webp";

          const meme = createMeme4Corners(
            message,
            null,
            capCard,
            null,
            viceCard,
            footer,
            img
          );

          memeContainer.append(meme);

          return; // Stop searching after finding the first qualifying team
        }
      }
    }
    console.log("No team found with a captaincy fail.");
  }

  function findKeeperFail() {
    for (const team of FPLToolboxLeagueData.standings) {
      let keeper = null;
      let benchedKeeper = null;

      team.currentWeek[0].picks.forEach((player) => {
        if (player.element_type == 1 && player.position == 1) keeper = player;
        if (player.element_type == 1 && player.position == 12)
          benchedKeeper = player;
      });

      if (keeper && benchedKeeper) {
        if (
          getPlayerScore(benchedKeeper.element) > getPlayerScore(keeper.element)
        ) {
          const message = `${team.player_name.substring(
            0,
            team.player_name.indexOf(" ")
          )}'s thought process when deciding which keeper to start in gameweek ${currentGw}`;

          const capCard = createPlayerCardNew(
            keeper.element,
            getPlayerScore(keeper.element),
            null,
            null,
            null
          );
          const viceCard = createPlayerCardNew(
            benchedKeeper.element,
            getPlayerScore(benchedKeeper.element),
            null,
            null,
            null
          );

          if (capCard instanceof HTMLElement) {
            capCard.style.marginLeft = "-70%";
            viceCard.style.marginLeft = "-70%";
            capCard.style.transform = "scale(1.2)";
            viceCard.style.transform = "scale(1.2)";
          } else {
            console.warn("message2 is not a DOM element:", capCard);
          }

          // Image URL for meme
          const img =
            "https://fpltoolbox.com/wp-content/uploads/2025/02/30b1gx-1.jpg";

          const meme = createMeme4Corners(
            message,
            " ",
            viceCard,
            capCard,
            " ",
            null,
            img
          );

          memeContainer.append(meme);

          return; // Stop searching after finding the first qualifying team
        }
      }
    }
    console.log("No team found with a keeper bench fail.");
  }

  function findHighestandLowest() {
    const lowestTeam = FPLToolboxLeagueData.standings.reduce((lowest, team) => {
      return team.event_total < lowest.event_total ? team : lowest;
    }, FPLToolboxLeagueData.standings[0]); // Start with the first team
    const highestTeam = FPLToolboxLeagueData.standings.reduce((highest, team) => {
      return team.event_total > highest.event_total ? team : highest;
    }, FPLToolboxLeagueData.standings[0]); // Start with the first team

    console.log(lowestTeam);
    console.log(highestTeam);
    const team1 = `${lowestTeam.player_name.substring(
      0,
      lowestTeam.player_name.indexOf(" ")
    )}`;
    const team2 = `${highestTeam.player_name.substring(
      0,
      highestTeam.player_name.indexOf(" ")
    )}`;
    const img =
      "https://fpltoolbox.com/wp-content/uploads/2025/02/Batman-Slapping-Robin.jpg";
    const meme = createMeme4Corners(
      null,
      `GW${currentGw} locked in!`,
      `Nah mate, \n not this week!`,
      `${team2}`,
      `${team1}`,
      null,
      img
    );
    memeContainer.append(meme);
  }

  function findWorstRun() {
    const worstRankRun = FPLToolboxLeagueData.standings.find((team) => {
      const totalGWs = team.everyGw.length;

      // Ensure at least 3 gameweeks exist
      if (totalGWs < 3) return false;

      // Extract last 3 gameweek ranks
      const lastThreeRanks = team.everyGw
        .slice(-3)
        .map((gw) => gw.overall_rank);

      // Check if rank is consistently getting worse
      return (
        lastThreeRanks[0] < lastThreeRanks[1] &&
        lastThreeRanks[1] < lastThreeRanks[2]
      );
    });

    console.log(worstRankRun);

    if (worstRankRun) {
      const message1 = `When ${worstRankRun.player_name.substring(
        0,
        worstRankRun.player_name.indexOf(" ")
      )} realises that ${
        worstRankRun.entry_name
      } has had red arrows for three weeks in a row`;
      const img =
        "https://fpltoolbox.com/wp-content/uploads/2025/02/Monkey-Puppet-e1739162235444.jpg";

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        null,
        null,
        null,

        img
      );
      memeContainer.append(meme);
    }
  }

  function findBestMiniLeagueRun() {
    if (FPLToolboxLeagueData.standings[0].rank == FPLToolboxLeagueData.standings[0].last_rank) {
      const message1 = `${FPLToolboxLeagueData.standings[0].player_name.substring(
        0,
        FPLToolboxLeagueData.standings[0].player_name.indexOf(" ")
      )} being handed the award from last week's mini-league number 1`;
      const img =
        "https://fpltoolbox.com/wp-content/uploads/2025/02/download-1.png";

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        null,
        null,
        null,

        img
      );
      memeContainer.append(meme);
    }
  }

  function findChillGuy() {
    if (FPLToolboxLeagueData.standings[0].rank == FPLToolboxLeagueData.standings[0].last_rank) {
      const message1 = `Just ${FPLToolboxLeagueData.standings[0].player_name.substring(
        0,
        FPLToolboxLeagueData.standings[0].player_name.indexOf(" ")
      )} being a chill guy at the top of the mini-league again`;
      const img =
        "https://fpltoolbox.com/wp-content/uploads/2025/02/9au02y.jpg";
      const meme = createMeme4Corners(
        message1,
        null,
        null,
        null,
        null,
        null,
        img
      );
      memeContainer.append(meme);
    }
  }

  function findStrikerFail() {
    for (const team of FPLToolboxLeagueData.standings) {
      let striker = null;
      let benchedStriker = null;
      //console.log(team);
      team.currentWeek[0].picks.forEach((player) => {
        if (
          player.element_type == 4 &&
          player.position > 1 &&
          player.position < 12
        )
          striker = player;
        if (player.element_type == 4 && player.position > 11)
          benchedStriker = player;
      });

      if (striker && benchedStriker) {
        if (
          getPlayerScore(benchedStriker.element) >
          getPlayerScore(striker.element)
        ) {
          const message1 = `Imagine starting ${getPlayerWebName(
            striker.element
          )} but leaving ${getPlayerWebName(
            benchedStriker.element
          )} on the bench this week`;

          const message2 = `${team.player_name.substring(
            0,
            team.player_name.indexOf(" ")
          )}, \n to pick a striker!`;

          const img =
            "https://fpltoolbox.com/wp-content/uploads/2025/02/4lts08-e1739170546997.jpg";

          const benchCard = createPlayerCardNew(
            benchedStriker.element,
            getPlayerScore(benchedStriker.element),
            null,
            null,
            null
          );

          const footer = document.createElement("div");
          footer.style.display = "flex"; // Optional: Arrange elements in a row
          footer.style.alignItems = "center"; // Optional: Align content nicely
          footer.style.gap = "10px"; // Optional: Add space between them
          footer.style.color = "black";
          footer.style.backgroundColor = "white";
          footer.style.paddingLeft = "30px";
          footer.style.paddingright = "30px";
          footer.style.paddingTop = "10px";
          footer.style.paddingBottom = "10px";

          // Append benchCard (if it's an HTML element)
          if (benchCard instanceof HTMLElement) {
            footer.appendChild(benchCard);
          } else {
            console.warn("benchCard is not a valid HTMLElement", benchCard);
          }

          // Append message2 (if it's a string)
          if (typeof message2 === "string") {
            const messageText = document.createElement("span");
            messageText.textContent = message2;
            messageText.style.textAlign = "center";
            messageText.classList.add("whitespace-fix");
            footer.appendChild(messageText);
          } else {
            console.warn("message2 is not a string", message2);
          }

          const meme = createMeme4Corners(
            message1,
            null,
            null,
            null,
            null,
            footer,
            img
          );
          memeContainer.append(meme);
          return; // Stop searching after finding the first qualifying team
        }
      }
    }
    console.log("No team found with a striker bench fail.");
  }

  function findLowestScorer() {
    const lowestTeam = FPLToolboxLeagueData.standings.reduce((lowest, team) => {
      return team.event_total < lowest.event_total ? team : lowest;
    }, FPLToolboxLeagueData.standings[0]); // Start with the first team

    console.log(lowestTeam);

    const message1 = `I bet he's thinking about other women`;
    const message2 = `${lowestTeam.player_name.substring(
      0,
      lowestTeam.player_name.indexOf(" ")
    )}: How have I only got ${lowestTeam.event_total} FPL points this week`;

    const img = "https://fpltoolbox.com/wp-content/uploads/2025/02/1tl71a.jpg";

    const meme = createMeme4Corners(
      message1,
      null,
      null,
      null,
      null,
      message2,
      img
    );
    memeContainer.append(meme);
  }

  function findLowestScorer1() {
    const lowestTeam = FPLToolboxLeagueData.standings.reduce((lowest, team) => {
      return team.event_total < lowest.event_total ? team : lowest;
    }, FPLToolboxLeagueData.standings[0]); // Start with the first team

    console.log(lowestTeam);

    const message1 = `POV: Realising that you've got to listen to another year of "We got ____ before GTA 6... "`;
    const message2 = `and ${lowestTeam.player_name.substring(
      0,
      lowestTeam.player_name.indexOf(" ")
    )} being shit at FPL`;

    const img =
      "https://fpltoolbox.com/wp-content/uploads/2025/05/disgusted.webp";

    const meme = createMeme4Corners(
      message1,
      null,
      null,
      null,
      null,
      message2,
      img
    );
    memeContainer.append(meme);
  }

  function findLowestScorerAlternative() {
    const lowestTeam = FPLToolboxLeagueData.standings.reduce((lowest, team) => {
      return team.event_total < lowest.event_total ? team : lowest;
    }, FPLToolboxLeagueData.standings[0]); // Start with the first team

    console.log(lowestTeam);

    const message1 = `POV: ${lowestTeam.player_name.substring(
      0,
      lowestTeam.player_name.indexOf(" ")
    )} waiting for some FPL points this week`;

    const img = "https://fpltoolbox.com/wp-content/uploads/2025/02/1c1uej.jpg";

    const meme = createMeme4Corners(
      message1,
      null,
      null,
      null,
      null,
      null,
      img
    );
    memeContainer.append(meme);
  }

  function findBelowAverage() {
    let gwAverage = bootstrap.events[currentGw - 1].average_entry_score;

    const lowestAverage = FPLToolboxLeagueData.standings.filter((team) => team.event_total < gwAverage);

    console.log(lowestAverage);
    if (lowestAverage > 0) {
      const randomTeam = getRandomTeam(lowestAverage);

      const message1 = `POV: ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )} waiting to get at least the gameweek average this week`;
      const img =
        "https://fpltoolbox.com/wp-content/uploads/2025/02/1c1uej.jpg";

      const message2 = `${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )} needs ${gwAverage - randomTeam.event_total} more points 😅 `;

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        null,
        null,
        message2,
        img
      );
      memeContainer.append(meme);
    }
  }

  function find100Plus() {
    const club100 = FPLToolboxLeagueData.standings.filter((team) => team.event_total > 99);

    const randomTeam = getRandomTeam(club100);

    if (randomTeam) {
      const message1 = `POV: Your bro ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )} enters the 100 club this week`;

      const message2 = `(GW ${currentGw} score: ${randomTeam.event_total})`;

      const img =
        "https://fpltoolbox.com/wp-content/uploads/2025/02/aplausos-clapped.gif";

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        null,
        null,
        message2,
        img
      );
      memeContainer.append(meme);
    }
  }

  function findHighBench() {
    const teamsWithHighBenchPoints = []; // Array to store teams with bench points > 10

    for (const team of FPLToolboxLeagueData.standings) {
      let totalBenchPoints = 0;
      //console.log(team);
      team.currentWeek[0].picks.forEach((player) => {
        if (player.position > 11 && player.position < 16) {
          totalBenchPoints += getPlayerScore(player.element);
        }
      });

      //console.log("Player Bench Points: " + totalBenchPoints);

      // Only store teams with bench points greater than 10
      if (totalBenchPoints > 10) {
        teamsWithHighBenchPoints.push({ team, totalBenchPoints });
      }
    }

    //console.log(teamsWithHighBenchPoints); // Check the stored teams

    if (teamsWithHighBenchPoints.length > 0) {
      const randomTeam = getRandomTeam(teamsWithHighBenchPoints);

      const message1 = `POV: ${randomTeam.team.player_name.substring(
        0,
        randomTeam.team.player_name.indexOf(" ")
      )} after leaving ${
        randomTeam.totalBenchPoints
      } points on the bench this week`;
      const img =
        suicidalMemes[Math.floor(Math.random() * suicidalMemes.length)];

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        null,
        null,
        null,
        img
      );
      memeContainer.append(meme);
    }
  }

  function findLowBench() {
    const teamsWithHighBenchPoints = []; // Array to store teams with bench points > 10

    for (const team of FPLToolboxLeagueData.standings) {
      let totalBenchPoints = 0;
      //console.log(team);
      team.currentWeek[0].picks.forEach((player) => {
        if (player.position > 11 && player.position < 16) {
          totalBenchPoints += getPlayerScore(player.element);
        }
      });

      //console.log("Player Bench Points: " + totalBenchPoints);

      // Only store teams with bench points greater than 10
      if (totalBenchPoints == 4) {
        teamsWithHighBenchPoints.push({ team, totalBenchPoints });
      }
    }

    //console.log(teamsWithHighBenchPoints); // Check the stored teams

    if (teamsWithHighBenchPoints.length > 0) {
      const randomTeam = getRandomTeam(teamsWithHighBenchPoints);

      const message1 = `POV: ${randomTeam.team.player_name.substring(
        0,
        randomTeam.team.player_name.indexOf(" ")
      )}'s masterclass of a bench this gameweek`;
      const img =
        suicidalMemes[Math.floor(Math.random() * suicidalMemes.length)];

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        null,
        null,
        null,
        img
      );
      memeContainer.append(meme);
    }
  }

  function findFailedhBench() {
    const teamsWithHighBenchPoints = []; // Array to store teams with bench points > 10

    for (const team of FPLToolboxLeagueData.standings) {
      let totalBenchPoints = 0;
      //console.log(team);
      team.currentWeek[0].picks.forEach((player) => {
        if (player.position > 11 && player.position < 16) {
          totalBenchPoints += getPlayerScore(player.element);
        }
      });

      //console.log("Player Bench Points: " + totalBenchPoints);

      // Only store teams with bench points greater than 10
      if (totalBenchPoints > 10) {
        teamsWithHighBenchPoints.push({ team, totalBenchPoints });
      }
    }

    //console.log(teamsWithHighBenchPoints); // Check the stored teams

    if (teamsWithHighBenchPoints.length > 0) {
      const randomTeam = getRandomTeam(teamsWithHighBenchPoints);

      const message1 = document.createElement("div");
      message1.innerText = `Seeing your players score `;
      message1.style.color = "black";

      const message2 = document.createElement("div");
      message2.innerText = `${randomTeam.team.player_name.substring(
        0,
        randomTeam.team.player_name.indexOf(" ")
      )} after leaving them on the bench in GW${currentGw}`;
      message2.style.color = "black";

      const img = "https://fpltoolbox.com/wp-content/uploads/2025/03/pep.jpg";

      const meme = createMeme4Corners(
        null,
        message1,
        null,
        null,
        message2,
        null,
        img
      );
      memeContainer.append(meme);
    }
  }

  async function findRedCards() {
    const teamsWithRedCards = [];
    const playerStatsCache = new Map(); // Cache for storing player stats

    // Create and append the loading indicator
    const memeLoader = document.createElement("div");
    memeLoader.id = "meme-loader";
    memeLoader.innerText =
      "There might be a juicy meme loading here, just gotta do some more digging...";
    memeLoader.className = "skeleton";
    memeContainer.append(memeLoader);

    for (const team of FPLToolboxLeagueData.standings) {
      memeLoader.innerText = `There might be a juicy meme loading here, 👀 Just looking through ${team.player_name}'s team`;

      for (const player of team.currentWeek[0].picks) {
        let playerStats;

        // Check if player's stats are already cached
        if (playerStatsCache.has(player.element)) {
          playerStats = playerStatsCache.get(player.element);
        } else {
          // Fetch and store in cache
          playerStats = await fetchPlayerCurrentStats(player.element);
          playerStatsCache.set(player.element, playerStats);
        }

        if (playerStats[0].red_cards > 0) {
          console.log(playerStats);
          teamsWithRedCards.push(team);
          team.redCardPlayer = player.element;
          break; // Stop checking this team's players and move to the next team
        }
      }
    }

    if (teamsWithRedCards.length > 0) {
      const randomTeam = getRandomTeam(teamsWithRedCards);
      console.log(randomTeam);

      const message1 = `When ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )} gets a player sent off:`;

      const img =
        utterWokeMemes[Math.floor(Math.random() * utterWokeMemes.length)];

      const message2 = createPlayerCardNew(
        randomTeam.redCardPlayer,
        getPlayerScore(randomTeam.redCardPlayer),
        null,
        null,
        null
      );
      if (message2 instanceof HTMLElement) {
        message2.style.marginRight = "1.5rem";
        message2.style.transform = "scale(1.5)";
      } else {
        console.warn("message2 is not a DOM element:", message2);
      }

      const meme = createMeme4Corners(
        message1,
        null,
        message2,
        null,
        null,
        null,
        img
      );

      // ✅ Replace the loader with the actual meme
      memeLoader.replaceWith(meme);
    } else {
      memeLoader.remove();
    }
  }

  async function findTwoYellows() {
    const teamsWithTwoYellows = [];
    const playerStatsCache = new Map(); // Cache for storing player stats

    // Create and append the loading indicator
    const memeLoader = document.createElement("div");
    memeLoader.id = "meme-loader";
    memeLoader.innerText =
      "There might be a juicy meme loading here, just gotta do some more digging...";
    memeLoader.className = "skeleton";
    memeContainer.append(memeLoader);

    for (const team of FPLToolboxLeagueData.standings) {
      memeLoader.innerText = `There might be a juicy meme loading here, 👀 Just looking through ${team.player_name}'s team`;

      for (const player of team.currentWeek[0].picks) {
        let playerStats;

        // Check if player's stats are already cached
        if (playerStatsCache.has(player.element)) {
          playerStats = playerStatsCache.get(player.element);
        } else {
          // Fetch and store in cache
          playerStats = await fetchPlayerCurrentStats(player.element);
          playerStatsCache.set(player.element, playerStats);
        }

        //console.log(playerStats);
        if (playerStats[0].yellow_cards > 2) {
          //console.log(playerStats);
          teamsWithTwoYellows.push(team);
          team.twoYellowCardsPlayer = player.element;
          break; // Stop checking this team's players and move to the next team
        }
      }
    }

    if (teamsWithTwoYellows.length > 0) {
      const randomTeam = getRandomTeam(teamsWithTwoYellows);
      console.log(randomTeam);

      const message1 = `When ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )} sees a player get two yellow cards:`;

      const img =
        utterWokeMemes[Math.floor(Math.random() * utterWokeMemes.length)];

      const message2 = createPlayerCardNew(
        randomTeam.twoYellowCardsPlayer,
        getPlayerScore(randomTeam.twoYellowCardsPlayer),
        null,
        null,
        null
      );
      if (message2 instanceof HTMLElement) {
        message2.style.marginRight = "1.5rem";
        message2.style.transform = "scale(1.5)";
      } else {
        console.warn("message2 is not a DOM element:", message2);
      }

      const meme = createMeme4Corners(
        message1,
        null,
        message2,
        null,
        null,
        null,
        img
      );

      // ✅ Replace the loader with the actual meme
      memeLoader.replaceWith(meme);
    } else {
      memeLoader.remove();
    }
  }

  async function find59Minutes() {
    const teamsWith59Minutes = [];
    const playerStatsCache = new Map(); // Cache for storing player stats

    // Create and append the loading indicator
    const memeLoader = document.createElement("div");
    memeLoader.id = "meme-loader";
    memeLoader.innerText =
      "There might be a juicy meme loading here, just gotta do some more digging...";
    memeLoader.className = "skeleton";
    memeContainer.append(memeLoader);

    for (const team of FPLToolboxLeagueData.standings) {
      memeLoader.innerText = `There might be a juicy meme loading here, 👀 Just looking through ${team.player_name}'s team`;

      for (const player of team.currentWeek[0].picks) {
        if (player.element_type === 2) {
          let playerStats;

          // Check if player's stats are already cached
          if (playerStatsCache.has(player.element)) {
            playerStats = playerStatsCache.get(player.element);
          } else {
            // Fetch and store in cache
            playerStats = await fetchPlayerCurrentStats(player.element);
            playerStatsCache.set(player.element, playerStats);
          }

          const { minutes, was_home, team_a_score, team_h_score } =
            playerStats[0];

          if (
            minutes > 44 &&
            minutes < 60 &&
            ((was_home && team_a_score === 0) ||
              (!was_home && team_h_score === 0))
          ) {
            console.log(playerStats);
            teamsWith59Minutes.push(team);
            team.fiftyNineMinutePlayer = player.element;
            break; // Stop checking this team's players and move to the next team
          }
        }
      }
    }

    // Example of updating the text later
    setTimeout(() => {
      memeLoader.innerText = "Finding the perfect meme...";
    }, 2000);

    if (teamsWith59Minutes.length > 0) {
      const randomTeam = getRandomTeam(teamsWith59Minutes);
      console.log(randomTeam);

      const message1 = `POV: When your defender comes off before 60 minutes and doesn't even lock in the cleansheet. Looking at you ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )}`;

      const img =
        suicidalMemes[Math.floor(Math.random() * suicidalMemes.length)];

      const message2 = createPlayerCardNew(
        randomTeam.fiftyNineMinutePlayer,
        getPlayerScore(randomTeam.fiftyNineMinutePlayer),
        null,
        null,
        null
      );
      if (message2 instanceof HTMLElement) {
        message2.style.marginRight = "1.5rem";
        message2.style.transform = "scale(1.5)";
      } else {
        console.warn("message2 is not a DOM element:", message2);
      }

      const meme = createMeme4Corners(
        message1,
        null,
        message2,
        null,
        null,
        null,
        img
      );

      // ✅ Replace the loader with the actual meme
      memeLoader.replaceWith(meme);
    } else {
      memeLoader.innerText = `naaah, thought I had something, but not today`;
      setTimeout(() => {
        memeLoader.remove();
        console.log("No 59-minute players");
      }, 2000);
    }
  }
  async function findMissedPen() {
    const teamsWith59Minutes = [];
    const playerStatsCache = new Map(); // Cache for storing player stats

    // Create and append the loading indicator
    const memeLoader = document.createElement("div");
    memeLoader.id = "meme-loader";
    memeLoader.innerText =
      "There might be a juicy meme loading here, just gotta do some more digging...";
    memeLoader.className = "skeleton";
    memeContainer.append(memeLoader);

    for (const team of FPLToolboxLeagueData.standings) {
      memeLoader.innerText = `There might be a juicy meme loading here, 👀 Just looking through ${team.player_name}'s team`;

      for (const player of team.currentWeek[0].picks) {
        let playerStats;

        // Check if player's stats are already cached
        if (playerStatsCache.has(player.element)) {
          playerStats = playerStatsCache.get(player.element);
        } else {
          // Fetch and store in cache
          playerStats = await fetchPlayerCurrentStats(player.element);
          playerStatsCache.set(player.element, playerStats);
        }

        console.log(player);
        console.log(playerStats);
        if (playerStats[0].penalties_missed > 0) {
          teamsWith59Minutes.push(team);
          team.fiftyNineMinutePlayer = player.element;
          break; // Stop checking this team's players and move to the next team
        }
      }
    }

    // Example of updating the text later
    setTimeout(() => {
      memeLoader.innerText = "Finding the perfect meme...";
    }, 2000);

    if (teamsWith59Minutes.length > 0) {
      const randomTeam = getRandomTeam(teamsWith59Minutes);
      console.log(randomTeam);

      const message1 = `POV: When ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )}'s player misses a pen!`;

      const img =
        "https://fpltoolbox.com/wp-content/uploads/2025/04/dogshit.jpeg";

      const message2 = createPlayerCardNew(
        randomTeam.fiftyNineMinutePlayer,
        getPlayerScore(randomTeam.fiftyNineMinutePlayer),
        null,
        null,
        null
      );
      if (message2 instanceof HTMLElement) {
        message2.style.marginRight = "1.5rem";
        message2.style.transform = "scale(1.5)";
      } else {
        console.warn("message2 is not a DOM element:", message2);
      }

      const meme = createMeme4Corners(
        message1,
        null,
        message2,
        null,
        null,
        null,
        img
      );

      // ✅ Replace the loader with the actual meme
      memeLoader.replaceWith(meme);
    } else {
      memeLoader.innerText = `naaah, thought I had something, but not today`;
      setTimeout(() => {
        memeLoader.remove();
        console.log("No missed pens");
      }, 2000);
    }
  }
  function findHigestTransferMaker() {
    let gwAverage = bootstrap.events[currentGw - 1].average_entry_score;

    const lowestAverage = FPLToolboxLeagueData.standings.filter((team) => team.event_total < gwAverage);

    console.log(lowestAverage);
    if (lowestAverage > 0) {
      const randomTeam = getRandomTeam(lowestAverage);

      const message1 = `POV: ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )} after making the most transfers this week`;
      const video =
        "https://fpltoolbox.com/wp-content/uploads/2025/02/homer-bush.gif";

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        null,
        null,
        null,
        video
      );
      memeContainer.append(meme);
    }
  }

  function findFailedScorer() {
    // Select a random team from the league
    const randomTeam = getRandomTeam(FPLToolboxLeagueData.standings);

    // Generate message based on the random team
    const message1 = `Mood right now if your name is ${
      randomTeam.player_name.split(" ")[0]
    }`;

    // Select a random player from the team's picks
    const randomPlayer =
      randomTeam.currentWeek[0].picks[
        Math.floor(Math.random() * randomTeam.currentWeek[0].picks.length)
      ];

    // Get the player's score
    const playerScore = getPlayerScore(randomPlayer.element);

    let message2 = null;

    // If player score is exactly 2, create a player card
    if (playerScore < 0 || playerScore == 1) {
      console.log("Player score = 2");

      message2 = createPlayerCardNew(
        randomPlayer.element,
        playerScore,
        null,
        null,
        null
      );

      if (message2 instanceof HTMLElement) {
        message2.style.marginLeft = "75%";
        message2.style.marginTop = "50%";
        message2.style.transform = "scale(1.5)";
      } else {
        console.warn("message2 is not a DOM element:", message2);
      }
    }

    // Image URL for meme
    const img =
      "https://fpltoolbox.com/wp-content/uploads/2025/02/download-2.png";

    // Create and append meme only if message2 exists
    if (message2) {
      const meme = createMeme4Corners(
        message1,
        message2,
        null,
        null,
        null,
        null,
        img
      );
      memeContainer.append(meme);
    }
  }

  function findFailedTransfer() {
    const teamsWithFailedTranfers = []; // Array to store teams with bench points > 10
    //   {
    //     "element_in": 336,
    //     "element_in_cost": 63,
    //     "element_out": 398,
    //     "element_out_cost": 74,
    //     "entry": 18620,
    //     "event": 24,
    //     "time": "2025-02-01T01:02:49.163163Z"
    // }
    for (const team of FPLToolboxLeagueData.standings) {
      team.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) > getPlayerScore(xfr.element_in)
        ) {
          teamsWithFailedTranfers.push(team);
        }
      });
    }
    console.log(teamsWithFailedTranfers);

    if (teamsWithFailedTranfers.length > 0) {
      const randomTeam = getRandomTeam(teamsWithFailedTranfers);
      console.log(randomTeam);

      let xfrTracker = [];
      randomTeam.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) > getPlayerScore(xfr.element_in)
        ) {
          xfrTracker.push(xfr);
        }
      });

      console.log(xfrTracker);
      function findBiggestScoreDifference(xfrTracker) {
        if (!Array.isArray(xfrTracker) || xfrTracker.length === 0) {
          return null; // Return null if xfrTracker is empty or not an array
        }

        let biggestDiffXfr = null;
        let maxDifference = -Infinity;

        for (const xfr of xfrTracker) {
          const inScore = getPlayerScore(xfr.element_in);
          const outScore = getPlayerScore(xfr.element_out);
          const difference = Math.abs(inScore - outScore); // Absolute difference

          if (difference > maxDifference) {
            maxDifference = difference;
            biggestDiffXfr = xfr;
          }
        }

        return biggestDiffXfr;
      }

      // Example Usage
      const biggestXfr = findBiggestScoreDifference(xfrTracker);
      console.log(biggestXfr);

      const xfrIN = createPlayerCardNew(
        biggestXfr.element_in,
        getPlayerScore(biggestXfr.element_in),
        null,
        null,
        null
      );
      const xfrOUT = createPlayerCardNew(
        biggestXfr.element_out,
        getPlayerScore(biggestXfr.element_out),
        null,
        null,
        null
      );

      const message1 = `POV: The grass is always greener if you're ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )} making gameweek transfers`;

      images = [
        "https://fpltoolbox.com/wp-content/uploads/2025/02/download-3.png",
      ];
      const img = images[Math.floor(Math.random() * images.length)];

      const meme = createMeme4Corners(
        message1,
        null,
        xfrOUT,
        null,
        xfrIN,
        null,
        img
      );
      memeContainer.append(meme);
    }
  }
  function findFailedTransferSecond() {
    const teamsWithFailedTranfers = []; // Array to store teams with bench points > 10
    //   {
    //     "element_in": 336,
    //     "element_in_cost": 63,
    //     "element_out": 398,
    //     "element_out_cost": 74,
    //     "entry": 18620,
    //     "event": 24,
    //     "time": "2025-02-01T01:02:49.163163Z"
    // }
    for (const team of FPLToolboxLeagueData.standings) {
      team.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) > getPlayerScore(xfr.element_in)
        ) {
          teamsWithFailedTranfers.push(team);
        }
      });
    }
    console.log(teamsWithFailedTranfers);

    if (teamsWithFailedTranfers.length > 0) {
      const randomTeam = getRandomTeam(teamsWithFailedTranfers);
      console.log(randomTeam);

      let xfrTracker = [];
      randomTeam.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) > getPlayerScore(xfr.element_in)
        ) {
          xfrTracker.push(xfr);
        }
      });

      console.log(xfrTracker);
      function findBiggestScoreDifference(xfrTracker) {
        if (!Array.isArray(xfrTracker) || xfrTracker.length === 0) {
          return null; // Return null if xfrTracker is empty or not an array
        }

        let biggestDiffXfr = null;
        let maxDifference = -Infinity;

        for (const xfr of xfrTracker) {
          const inScore = getPlayerScore(xfr.element_in);
          const outScore = getPlayerScore(xfr.element_out);
          const difference = Math.abs(inScore - outScore); // Absolute difference

          if (difference > maxDifference) {
            maxDifference = difference;
            biggestDiffXfr = xfr;
          }
        }

        return biggestDiffXfr;
      }

      const biggestXfr = findBiggestScoreDifference(xfrTracker);
      console.log(biggestXfr);

      const xfrIN = createPlayerCardNew(
        biggestXfr.element_in,
        getPlayerScore(biggestXfr.element_in),
        null,
        null,
        null
      );
      const xfrOUT = createPlayerCardNew(
        biggestXfr.element_out,
        getPlayerScore(biggestXfr.element_out),
        null,
        null,
        null
      );

      const message1 = `POV: ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )} after transferring out ${getPlayerWebName(
        biggestXfr.element_out
      )} for ${getPlayerWebName(biggestXfr.element_in)}`;
      const img =
        suicidalMemes[Math.floor(Math.random() * suicidalMemes.length)];

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        xfrIN,
        xfrOUT,
        null,
        img
      );
      memeContainer.append(meme);
    }
  }
  function findFailedTransferThird() {
    const teamsWithFailedTranfers = []; // Array to store teams with bench points > 10
    //   {
    //     "element_in": 336,
    //     "element_in_cost": 63,
    //     "element_out": 398,
    //     "element_out_cost": 74,
    //     "entry": 18620,
    //     "event": 24,
    //     "time": "2025-02-01T01:02:49.163163Z"
    // }
    for (const team of FPLToolboxLeagueData.standings) {
      team.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) > getPlayerScore(xfr.element_in)
        ) {
          teamsWithFailedTranfers.push(team);
        }
      });
    }
    console.log(teamsWithFailedTranfers);

    if (teamsWithFailedTranfers.length > 0) {
      const randomTeam = getRandomTeam(teamsWithFailedTranfers);
      console.log(randomTeam);

      let xfrTracker = [];
      randomTeam.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) > getPlayerScore(xfr.element_in)
        ) {
          xfrTracker.push(xfr);
        }
      });

      console.log(xfrTracker);
      function findBiggestScoreDifference(xfrTracker) {
        if (!Array.isArray(xfrTracker) || xfrTracker.length === 0) {
          return null; // Return null if xfrTracker is empty or not an array
        }

        let biggestDiffXfr = null;
        let maxDifference = -Infinity;

        for (const xfr of xfrTracker) {
          const inScore = getPlayerScore(xfr.element_in);
          const outScore = getPlayerScore(xfr.element_out);
          const difference = Math.abs(inScore - outScore); // Absolute difference

          if (difference > maxDifference) {
            maxDifference = difference;
            biggestDiffXfr = xfr;
          }
        }

        return biggestDiffXfr;
      }

      const biggestXfr = findBiggestScoreDifference(xfrTracker);
      console.log(biggestXfr);

      const xfrIN = createPlayerCardNew(
        biggestXfr.element_in,
        getPlayerScore(biggestXfr.element_in),
        null,
        null,
        null
      );
      const xfrOUT = createPlayerCardNew(
        biggestXfr.element_out,
        getPlayerScore(biggestXfr.element_out),
        null,
        null,
        null
      );

      const message1 = `The group chat watching ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )} transfer out ${getPlayerWebName(
        biggestXfr.element_out
      )} for ${getPlayerWebName(biggestXfr.element_in)}`;
      const img =
        "https://fpltoolbox.com/wp-content/uploads/2025/02/henry-rio.gif";

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        xfrIN,
        xfrOUT,
        null,
        img
      );
      memeContainer.append(meme);
    }
  }
  function findFailedTransferFourth() {
    const teamsWithFailedTranfers = []; // Array to store teams with bench points > 10
    //   {
    //     "element_in": 336,
    //     "element_in_cost": 63,
    //     "element_out": 398,
    //     "element_out_cost": 74,
    //     "entry": 18620,
    //     "event": 24,
    //     "time": "2025-02-01T01:02:49.163163Z"
    // }
    for (const team of FPLToolboxLeagueData.standings) {
      team.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) > getPlayerScore(xfr.element_in)
        ) {
          teamsWithFailedTranfers.push(team);
        }
      });
    }
    console.log(teamsWithFailedTranfers);

    if (teamsWithFailedTranfers.length > 0) {
      const randomTeam = getRandomTeam(teamsWithFailedTranfers);
      let randomTeam2 = getRandomTeam(FPLToolboxLeagueData.standings);

      while (randomTeam2.player_name === randomTeam.player_name) {
        randomTeam2 = getRandomTeam(FPLToolboxLeagueData.standings);
      }

      let xfrTracker = [];
      randomTeam.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) > getPlayerScore(xfr.element_in)
        ) {
          xfrTracker.push(xfr);
        }
      });

      console.log(xfrTracker);
      function findBiggestScoreDifference(xfrTracker) {
        if (!Array.isArray(xfrTracker) || xfrTracker.length === 0) {
          return null; // Return null if xfrTracker is empty or not an array
        }

        let biggestDiffXfr = null;
        let maxDifference = -Infinity;

        for (const xfr of xfrTracker) {
          const inScore = getPlayerScore(xfr.element_in);
          const outScore = getPlayerScore(xfr.element_out);
          const difference = Math.abs(inScore - outScore); // Absolute difference

          if (difference > maxDifference) {
            maxDifference = difference;
            biggestDiffXfr = xfr;
          }
        }

        return biggestDiffXfr;
      }

      const biggestXfr = findBiggestScoreDifference(xfrTracker);
      console.log(biggestXfr);

      const xfrIN = createPlayerCardNew(
        biggestXfr.element_in,
        getPlayerScore(biggestXfr.element_in),
        null,
        null,
        null
      );
      const xfrOUT = createPlayerCardNew(
        biggestXfr.element_out,
        getPlayerScore(biggestXfr.element_out),
        null,
        null,
        null
      );

      const message1 = `${randomTeam2.player_name.substring(
        0,
        randomTeam2.player_name.indexOf(" ")
      )}
      seeing ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )} transfer out ${getPlayerWebName(
        biggestXfr.element_out
      )} for ${getPlayerWebName(biggestXfr.element_in)}`;
      const img =
        "https://fpltoolbox.com/wp-content/uploads/2025/04/1641347298.webp";

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        xfrIN,
        xfrOUT,
        null,
        img
      );
      memeContainer.append(meme);
    }
  }

  function findFailedTransferFifth() {
    const teamsWithFailedTranfers = []; // Array to store teams with bench points > 10
    //   {
    //     "element_in": 336,
    //     "element_in_cost": 63,
    //     "element_out": 398,
    //     "element_out_cost": 74,
    //     "entry": 18620,
    //     "event": 24,
    //     "time": "2025-02-01T01:02:49.163163Z"
    // }
    for (const team of FPLToolboxLeagueData.standings) {
      team.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) > getPlayerScore(xfr.element_in)
        ) {
          teamsWithFailedTranfers.push(team);
        }
      });
    }
    console.log(teamsWithFailedTranfers);

    if (teamsWithFailedTranfers.length > 0) {
      const randomTeam = getRandomTeam(teamsWithFailedTranfers);
      let randomTeam2 = getRandomTeam(FPLToolboxLeagueData.standings);

      while (randomTeam2.player_name === randomTeam.player_name) {
        randomTeam2 = getRandomTeam(FPLToolboxLeagueData.standings);
      }

      let xfrTracker = [];
      randomTeam.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) > getPlayerScore(xfr.element_in)
        ) {
          xfrTracker.push(xfr);
        }
      });

      console.log(xfrTracker);
      function findBiggestScoreDifference(xfrTracker) {
        if (!Array.isArray(xfrTracker) || xfrTracker.length === 0) {
          return null; // Return null if xfrTracker is empty or not an array
        }

        let biggestDiffXfr = null;
        let maxDifference = -Infinity;

        for (const xfr of xfrTracker) {
          const inScore = getPlayerScore(xfr.element_in);
          const outScore = getPlayerScore(xfr.element_out);
          const difference = Math.abs(inScore - outScore); // Absolute difference

          if (difference > maxDifference) {
            maxDifference = difference;
            biggestDiffXfr = xfr;
          }
        }

        return biggestDiffXfr;
      }

      const biggestXfr = findBiggestScoreDifference(xfrTracker);
      console.log(biggestXfr);

      const xfrIN = createPlayerCardNew(
        biggestXfr.element_in,
        getPlayerScore(biggestXfr.element_in),
        null,
        null,
        null
      );
      const xfrOUT = createPlayerCardNew(
        biggestXfr.element_out,
        getPlayerScore(biggestXfr.element_out),
        null,
        null,
        null
      );
      console.log(
        getPlayerScore(biggestXfr.element_in),
        getPlayerScore(biggestXfr.element_out)
      );
      const message1 = document.createElement("p");

      message1.innerText = `"What happened to ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )}?"`;

      const xfrOutMsg = document.createElement("p");
      xfrOutMsg.style.color = "black";
      xfrOutMsg.innerText = `"He transferred out ${getPlayerWebName(
        biggestXfr.element_out
      )}"`;

      const playerName = document.createElement("p");
      playerName.style.color = "black";
      playerName.innerText = `${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )}:`;

      const img =
        "https://fpltoolbox.com/wp-content/uploads/2025/04/what-happened.webp";

      const meme = createMeme4Corners(
        message1,
        playerName,
        null,
        xfrOutMsg,
        xfrOUT,
        null,
        img
      );
      memeContainer.append(meme);
    }
  }

  function findFailedTransferSixth() {
    const teamsWithFailedTranfers = []; // Array to store teams with bench points > 10
    for (const team of FPLToolboxLeagueData.standings) {
      team.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) > getPlayerScore(xfr.element_in)
        ) {
          teamsWithFailedTranfers.push(team);
        }
      });
    }
    console.log(teamsWithFailedTranfers);

    if (teamsWithFailedTranfers.length > 0) {
      const randomTeam = getRandomTeam(teamsWithFailedTranfers);
      console.log(randomTeam);

      let xfrTracker = [];
      randomTeam.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) > getPlayerScore(xfr.element_in)
        ) {
          xfrTracker.push(xfr);
        }
      });

      console.log(xfrTracker);
      function findBiggestScoreDifference(xfrTracker) {
        if (!Array.isArray(xfrTracker) || xfrTracker.length === 0) {
          return null; // Return null if xfrTracker is empty or not an array
        }

        let biggestDiffXfr = null;
        let maxDifference = -Infinity;

        for (const xfr of xfrTracker) {
          const inScore = getPlayerScore(xfr.element_in);
          const outScore = getPlayerScore(xfr.element_out);
          const difference = Math.abs(inScore - outScore); // Absolute difference

          if (difference > maxDifference) {
            maxDifference = difference;
            biggestDiffXfr = xfr;
          }
        }

        return biggestDiffXfr;
      }

      // Example Usage
      const biggestXfr = findBiggestScoreDifference(xfrTracker);
      console.log(biggestXfr);
      if (biggestXfr) {
        const xfrIN = createPlayerCardNew(
          biggestXfr.element_in,
          getPlayerScore(biggestXfr.element_in),
          null,
          null,
          null
        );

        const tInArrow = document.createElement("img");
        tInArrow.src =
          "https://fpltoolbox.com/wp-content/uploads/2024/12/svgexport-9.png";
        tInArrow.setAttribute("id", "transfer-direction-in");
        xfrIN.prepend(tInArrow);

        const xfrOUT = createPlayerCardNew(
          biggestXfr.element_out,
          getPlayerScore(biggestXfr.element_out),
          null,
          null,
          null
        );
        const tOutArrow = document.createElement("img");
        tOutArrow.src =
          "https://fpltoolbox.com/wp-content/uploads/2024/12/svgexport-9.png";
        tOutArrow.setAttribute("id", "transfer-direction-out");
        xfrOUT.prepend(tOutArrow);
        const message1 = `${randomTeam.player_name.substring(
          0,
          randomTeam.player_name.indexOf(" ")
        )} making transfer decisions like this:`;

        images = [
          "https://fpltoolbox.com/wp-content/uploads/2025/04/sweating.png",
        ];
        const img = images[Math.floor(Math.random() * images.length)];

        const meme = createMeme4Corners(
          message1,
          xfrOUT,
          xfrIN,
          null,
          null,
          null,
          img
        );
        memeContainer.append(meme);
      }
    }
  }

  function findSuccesfulTransfer() {
    const teamsWithFailedTranfers = []; // Array to store teams with bench points > 10
    for (const team of FPLToolboxLeagueData.standings) {
      team.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) < getPlayerScore(xfr.element_in)
        ) {
          teamsWithFailedTranfers.push(team);
        }
      });
    }
    console.log(teamsWithFailedTranfers);

    if (teamsWithFailedTranfers.length > 0) {
      const randomTeam = getRandomTeam(teamsWithFailedTranfers);
      console.log(randomTeam);

      let xfrTracker = [];
      randomTeam.transfers[0].forEach((xfr) => {
        if (
          xfr.event === currentGw &&
          getPlayerScore(xfr.element_out) < getPlayerScore(xfr.element_in)
        ) {
          xfrTracker.push(xfr);
        }
      });

      console.log(xfrTracker);
      function findBiggestScoreDifference(xfrTracker) {
        if (!Array.isArray(xfrTracker) || xfrTracker.length === 0) {
          return null; // Return null if xfrTracker is empty or not an array
        }

        let biggestDiffXfr = null;
        let maxDifference = -Infinity;

        for (const xfr of xfrTracker) {
          const inScore = getPlayerScore(xfr.element_in);
          const outScore = getPlayerScore(xfr.element_out);
          const difference = Math.abs(inScore - outScore); // Absolute difference

          if (difference > maxDifference) {
            maxDifference = difference;
            biggestDiffXfr = xfr;
          }
        }

        return biggestDiffXfr;
      }

      // Example Usage
      const biggestXfr = findBiggestScoreDifference(xfrTracker);
      console.log(biggestXfr);
      if (biggestXfr) {
        const xfrIN = createPlayerCardNew(
          biggestXfr.element_in,
          getPlayerScore(biggestXfr.element_in),
          null,
          null,
          null
        );

        const tInArrow = document.createElement("img");
        tInArrow.src =
          "https://fpltoolbox.com/wp-content/uploads/2024/12/svgexport-9.png";
        tInArrow.setAttribute("id", "transfer-direction-in");
        xfrIN.prepend(tInArrow);

        const xfrOUT = createPlayerCardNew(
          biggestXfr.element_out,
          getPlayerScore(biggestXfr.element_out),
          null,
          null,
          null
        );
        const tOutArrow = document.createElement("img");
        tOutArrow.src =
          "https://fpltoolbox.com/wp-content/uploads/2024/12/svgexport-9.png";
        tOutArrow.setAttribute("id", "transfer-direction-out");
        xfrOUT.prepend(tOutArrow);
        const message1 = `${randomTeam.player_name.substring(
          0,
          randomTeam.player_name.indexOf(" ")
        )} making the right transfer decision this week`;

        images = [
          "https://fpltoolbox.com/wp-content/uploads/2025/04/note-dead.webp",
          "https://fpltoolbox.com/wp-content/uploads/2025/04/very-nice.png",

          ,
        ];
        const img = images[Math.floor(Math.random() * images.length)];

        const meme = createMeme4Corners(
          message1,
          xfrOUT,
          xfrIN,
          null,
          null,
          null,
          img
        );
        memeContainer.append(meme);
      }
    }
  }
  function findSolidDefence() {
    const teamsWithAllDefendersScoring = []; // Array to store teams with bench points > 10

    for (const team of FPLToolboxLeagueData.standings) {
      let allDefendersScoredFiveOrMore = true;

      team.currentWeek[0].picks.forEach((player) => {
        //console.log(player, getPlayerWebName(player.element))
        if (player.element_type === 2 && getPlayerScore(player.element) < 5) {
          allDefendersScoredFiveOrMore = false;
        }
      });

      if (allDefendersScoredFiveOrMore) {
        teamsWithAllDefendersScoring.push(team);
      }
    }

    console.log(teamsWithAllDefendersScoring); // Check the stored teams

    if (teamsWithAllDefendersScoring.length > 0) {
      const randomTeam = getRandomTeam(teamsWithAllDefendersScoring);
      console.log(randomTeam);
      const message1 = `POV: When ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )}'s defenders all pull their socks up`;
      const img =
        surprisedMemes[Math.floor(Math.random() * surprisedMemes.length)];

      const defenderRow = document.createElement("div");
      defenderRow.style.display = "flex";
      defenderRow.style.gap = "5px";
      defenderRow.style.flexDirection = "row";
      randomTeam.currentWeek[0].picks.forEach((player) => {
        if (player.element_type === 2) {
          const card = createPlayerCardNew(
            player.element,
            getPlayerScore(player.element),
            null,
            null,
            null
          );
          defenderRow.appendChild(card);
        }
      });

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        null,
        null,
        defenderRow,
        img
      );
      memeContainer.append(meme);
    }
  }
  function findSolidStrikeForce() {
    const teamsWithAllDefendersScoring = []; // Array to store teams with bench points > 10

    for (const team of FPLToolboxLeagueData.standings) {
      let allDefendersScoredFiveOrMore = true;

      team.currentWeek[0].picks.forEach((player) => {
        if (player.element_type === 4 && getPlayerScore(player.element) < 5) {
          allDefendersScoredFiveOrMore = false;
        }
      });

      if (allDefendersScoredFiveOrMore) {
        teamsWithAllDefendersScoring.push(team);
      }
    }

    console.log(teamsWithAllDefendersScoring); // Check the stored teams

    if (teamsWithAllDefendersScoring.length > 0) {
      const randomTeam = getRandomTeam(teamsWithAllDefendersScoring);
      console.log(randomTeam);
      const message1 = `POV: When ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )}'s strikers all pull their socks up`;
      const img =
        surprisedMemes[Math.floor(Math.random() * surprisedMemes.length)];

      const defenderRow = document.createElement("div");
      defenderRow.style.display = "flex";
      defenderRow.style.gap = "5px";
      defenderRow.style.flexDirection = "row";
      randomTeam.currentWeek[0].picks.forEach((player) => {
        if (player.element_type === 4) {
          const card = createPlayerCardNew(
            player.element,
            getPlayerScore(player.element),
            null,
            null,
            null
          );
          defenderRow.appendChild(card);
        }
      });

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        null,
        null,
        defenderRow,
        img
      );
      memeContainer.append(meme);
    }
  }
  function findPlayersWithOnePoint() {
    console.log("Failed row");
    const teamsWithAllDefendersScoring = []; // Array to store teams with bench points > 10

    for (const team of FPLToolboxLeagueData.standings) {
      team.currentWeek[0].picks.forEach((player) => {
        if (getPlayerScore(player.element) === 1) {
          teamsWithAllDefendersScoring.push(team);
          return;
        }
      });
    }

    console.log(teamsWithAllDefendersScoring); // Check the stored teams

    if (teamsWithAllDefendersScoring.length > 0) {
      const randomTeam = getRandomTeam(teamsWithAllDefendersScoring);
      console.log(randomTeam);
      const message1 = `POV: When ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )} opens the FPL app`;

      images = [
        "https://fpltoolbox.com/wp-content/uploads/2025/03/fine-this-is-fine.png",

        ,
      ];
      const img = images[Math.floor(Math.random() * images.length)];

      const defenderRow = document.createElement("div");
      defenderRow.style.display = "flex";
      defenderRow.style.gap = "5px";
      defenderRow.style.flexDirection = "row";
      randomTeam.currentWeek[0].picks.forEach((player) => {
        if (getPlayerScore(player.element) === 1) {
          const card = createPlayerCardNew(
            player.element,
            getPlayerScore(player.element),
            null,
            null,
            null
          );
          defenderRow.appendChild(card);
        }
      });

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        null,
        null,
        defenderRow,
        img
      );
      memeContainer.append(meme);
    }
  }
  function findPlayersWithOnePointSecond() {
    console.log("Failed row");
    const teamsWithAllDefendersScoring = []; // Array to store teams with bench points > 10

    for (const team of FPLToolboxLeagueData.standings) {
      team.currentWeek[0].picks.forEach((player) => {
        if (getPlayerScore(player.element) === 1) {
          teamsWithAllDefendersScoring.push(team);
          return;
        }
      });
    }

    console.log(teamsWithAllDefendersScoring); // Check the stored teams

    if (teamsWithAllDefendersScoring.length > 0) {
      const randomTeam = getRandomTeam(teamsWithAllDefendersScoring);
      console.log(randomTeam);
      const message1 = `"Bro, how's your gameweek going...?"`;

      images = [
        "https://fpltoolbox.com/wp-content/uploads/2025/04/thumbs-up.png",
      ];
      const img = images[Math.floor(Math.random() * images.length)];

      const defenderRow = document.createElement("div");
      defenderRow.style.display = "flex";
      defenderRow.style.gap = "5px";
      defenderRow.style.flexDirection = "row";
      randomTeam.currentWeek[0].picks.forEach((player) => {
        if (getPlayerScore(player.element) === 1) {
          const card = createPlayerCardNew(
            player.element,
            getPlayerScore(player.element),
            null,
            null,
            null
          );
          defenderRow.appendChild(card);
        }
      });

      const randomName = document.createElement("div");
      randomName.innerText = `${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )}:`;

      randomName.style.fontSize = "1.5rem";
      randomName.style.fontWeight = "bold";
      randomName.style.color = "black";
      randomName.style.backgroundColor = "white";
      randomName.style.padding = "0.5rem";

      const meme = createMeme4Corners(
        message1,
        randomName,
        null,
        null,
        null,
        defenderRow,
        img
      );
      memeContainer.append(meme);
    }
  }

  function findPlayerSuccess() {
    const teamsWithAllDefendersScoring = []; // Array to store teams with bench points > 10

    for (const team of FPLToolboxLeagueData.standings) {
      //console.log(team);
      if (team) {
        team.currentWeek[0].picks.forEach((player) => {
          if (getPlayerScore(player.element) > 8) {
            teamsWithAllDefendersScoring.push(team);
            return;
          }
        });
      }
    }

    console.log(teamsWithAllDefendersScoring); // Check the stored teams

    if (teamsWithAllDefendersScoring.length > 0) {
      const randomTeam = getRandomTeam(teamsWithAllDefendersScoring);
      console.log(randomTeam);
      const message1 = `POV: When ${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )} opens the FPL app`;

      images = [
        "https://fpltoolbox.com/wp-content/uploads/2025/03/8d30zh.jpg",
        "https://fpltoolbox.com/wp-content/uploads/2025/04/liplicking.png",
        "https://fpltoolbox.com/wp-content/uploads/2025/04/iamjose.webp",
      ];
      const img = images[Math.floor(Math.random() * images.length)];

      const defenderRow = document.createElement("div");
      defenderRow.style.display = "flex";
      defenderRow.style.gap = "5px";
      defenderRow.style.flexDirection = "row";
      randomTeam.currentWeek[0].picks.forEach((player) => {
        if (getPlayerScore(player.element) > 8) {
          const card = createPlayerCardNew(
            player.element,
            getPlayerScore(player.element),
            null,
            null,
            null
          );
          defenderRow.appendChild(card);
        }
      });

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        null,
        null,
        defenderRow,
        img
      );
      memeContainer.append(meme);
    }
  }

  function findCaptaincyResults() {
    console.log("finding captains");
    const successfulCaptains = [];
    const failedCaptains = [];

    for (const team of FPLToolboxLeagueData.standings) {
      let captain = null;

      // Find the captain
      team.currentWeek[0].picks.forEach((player) => {
        if (player.is_captain) captain = player;
      });

      if (captain) {
        const captainScore = getPlayerScore(captain.element);

        if (captainScore > 4) {
          successfulCaptains.push({ team, captain, score: captainScore });
        } else {
          failedCaptains.push({ team, captain, score: captainScore });
        }
      }
    }
    let result = [];
    // Check if there is at least one failed captain
    if (failedCaptains.length > 0) {
      // Pick a random failed captain
      const randomFailedCaptain =
        failedCaptains[Math.floor(Math.random() * failedCaptains.length)];
      result.push(randomFailedCaptain);
    }

    // Check how many successful captains exist
    if (successfulCaptains.length >= 2) {
      const count = successfulCaptains.length >= 3 ? 3 : 2;

      // Shuffle the array and pick the required number of successful captains
      const shuffledSuccessful = successfulCaptains.sort(
        () => 0.5 - Math.random()
      );
      result.push(...shuffledSuccessful.slice(0, count));
    }
    console.log(result);

    if (result.length > 2) {
      const message = `There's always one...`;

      const captainCards = document.createElement("div");
      captainCards.id = "dragon-meme-footer";

      function addCaptainToFooter(teamNumber) {
        const cap = document.createElement("div");
        const capCard = createPlayerCardNew(
          result[teamNumber].captain.element,
          result[teamNumber].score,
          true,
          null,
          null
        );
        const capCardText = document.createElement("div");
        capCardText.id = "dragon-meme-footer-text";
        capCardText.innerText = `${result[
          teamNumber
        ].team.player_name.substring(
          0,
          result[teamNumber].team.player_name.indexOf(" ")
        )}`;

        cap.appendChild(capCard);
        cap.appendChild(capCardText);

        captainCards.appendChild(cap);
      }

      addCaptainToFooter(1);
      addCaptainToFooter(2);

      let img = "https://fpltoolbox.com/wp-content/uploads/2025/02/9e2.jpg";

      if (result.length === 4) {
        addCaptainToFooter(3);
        img = "https://fpltoolbox.com/wp-content/uploads/2025/02/4p4zc2.jpg";
      }

      addCaptainToFooter(0);
      // if (capCard1 instanceof HTMLElement) {
      //   capCard1.style.marginLeft = "-70%";
      //   capCard1.style.transform = "scale(1.2)";
      // } else {
      //   console.warn("capCard is not a DOM element:", capCard1);
      // }

      const meme = createMeme4Corners(
        message,
        null,
        null,
        null,
        null,
        captainCards,
        img
      );

      memeContainer.append(meme);
    } else {
      console.log("Captain Dragons Meme unavailable");
    }

    console.log("Successful Captains:", successfulCaptains);
    console.log("Failed Captains:", failedCaptains);
  }

  function gwSpecificMeme() {
    const teamsWithKeyPlayers = []; // Array to store teams with both target players
    const playersToTarget = [668, 366, 424];

    for (const team of FPLToolboxLeagueData.standings) {
      if (team) {
        const pickedPlayerElements = team.currentWeek[0].picks.map(
          (player) => player.element
        );

        // Check if ALL playersToTarget are in pickedPlayerElements
        const hasAllTargetPlayers = playersToTarget.every((targetId) =>
          pickedPlayerElements.includes(targetId)
        );

        if (hasAllTargetPlayers) {
          teamsWithKeyPlayers.push(team);
        }
      }
    }

    console.log(teamsWithKeyPlayers); // Check the stored teams

    if (teamsWithKeyPlayers.length > 0) {
      const randomTeam = getRandomTeam(teamsWithKeyPlayers);
      console.log(randomTeam);
      const message1 = `${randomTeam.player_name.substring(
        0,
        randomTeam.player_name.indexOf(" ")
      )} owning these three this gameweek`;

      images = [
        "https://fpltoolbox.com/wp-content/uploads/2025/03/8d30zh.jpg",
        "https://fpltoolbox.com/wp-content/uploads/2025/04/liplicking.png",
        "https://fpltoolbox.com/wp-content/uploads/2025/04/iamjose.webp",
        "https://fpltoolbox.com/wp-content/uploads/2025/04/very-nice.png",
      ];
      const img = images[Math.floor(Math.random() * images.length)];

      const defenderRow = document.createElement("div");
      defenderRow.style.display = "flex";
      defenderRow.style.gap = "5px";
      defenderRow.style.flexDirection = "row";
      randomTeam.currentWeek[0].picks.forEach((player) => {
        if (playersToTarget.includes(player.element)) {
          const card = createPlayerCardNew(
            player.element,
            getPlayerScore(player.element),
            null,
            null,
            null
          );
          defenderRow.appendChild(card);
        }
      });

      const meme = createMeme4Corners(
        message1,
        null,
        null,
        null,
        null,
        defenderRow,
        img
      );
      memeContainer.append(meme);
    }
  }

  function runAllRandomly() {
    const functionsList = [
      findFailedScorer,
       findHigestTransferMaker,
       findHighBench,
      find100Plus,
      gwSpecificMeme,
      findMissedPen,
      findBelowAverage,
      findLowestScorer,
      findLowestScorer1,
      findStrikerFail,
      findFailedTransferSixth,
      findChillGuy,
      findLowBench,
      findBestMiniLeagueRun,
      findWorstRun,
      findHighestandLowest,
      findKeeperFail,
      findCaptaincyFailDrake,
      findCaptaincyFailDoggo,
      findFailedTransfer,
      findRedCards,
      find59Minutes,
      //findSolidDefence,
      findPlayersWithOnePoint,
      findTwoYellows,
      findLowestScorerAlternative,
      findCaptaincyResults,
      findFailedTransferSecond,
      findPlayerSuccess,
      //findSolidStrikeForce,
      findSuccesfulTransfer,
      findFailedTransferThird,
      findFailedTransferFourth,
      findFailedTransferFifth,
      findPlayersWithOnePointSecond,
      findFailedhBench,
    ];

    // Shuffle the list randomly
    const shuffled = functionsList.sort(() => Math.random() - 0.5);

    // Execute each function in the new random order
    shuffled.forEach((fn) => fn());
  }

  function endOfMemes() {
    const message1 = `Guess who's had enough FPL memes for one day:`;
    const img =
      pointingAtYouMemes[Math.floor(Math.random() * pointingAtYouMemes.length)];

    const meme = createMeme4Corners(
      message1,
      null,
      null,
      null,
      null,
      "www.fpltoolbox.com",
      img
    );
    memeContainer.append(meme);
  }

  function subscribeToProMeme() {
    const message1 = `POV: You just subscribed to FPL Toolbox Pro and got instant access to even more personalised FPL memes`;
    const img =
      surprisedMemes[Math.floor(Math.random() * surprisedMemes.length)];

    const meme = createMeme4Corners(
      message1,
      null,
      null,
      null,
      null,
      "www.fpltoolbox.com",
      img
    );
    memeContainer.append(meme);
  }

  if (
    theUser.username.data.membership_level.ID == 10 ||
    theUser.username.data.membership_level.ID == 12
  ) {
    // Call the function to execute all in random order
    runAllRandomly();
    endOfMemes();
    addCaptainBadge();
  } else if (
    theUser.username.data.membership_level.ID != 10 ||
    theUser.username.data.membership_level.ID != 12
  ) {
    runAllRandomly(); //Turn off after testing
    subscribeToProMeme();
    endOfMemes();
    addCaptainBadge();
  } else {
    ontainer.append("You need to be a pro member to access this feature");
  }
  const refreshButton = document.createElement("button");
  refreshButton.innerHTML = "Refresh Memes";
  refreshButton.addEventListener("click", showMemes);
  memeContainer.prepend(refreshButton);
  container.appendChild(memeContainer);
  addCaptainBadge();
}


function shareMeme(meme) {
  html2canvas(meme).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");

    if (navigator.share) {
      // Create a Blob from the image
      fetch(imgData)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "comparison.png", {
            type: "image/png",
          });
          navigator
            .share({
              title: "Check out this FPL meme!",
              text: "Get personalised FPL memes with just one click at \n www.FPLToolbox.com",
              files: [file], // Share the image as a file
            })
            .catch((err) => alert("Error sharing: " + err));
        });
    } else {
      // Fallback: Download the image if sharing isn't supported
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "fpltoolbox-meme.png";
      link.click();
      alert(
        "Sharing is not supported on your device. Image downloaded instead."
      );
    }
  });
}

function createMeme4Corners(
  header,
  topLeft,
  topRight,
  bottomRight,
  bottomLeft,
  footer,
  imageSrc
) {
  // Main meme container
  const meme = document.createElement("div");
  meme.className = "custom-meme";
  meme.style.position = "relative";
  meme.style.width = "100%";
  meme.style.display = "flex";
  meme.style.flexDirection = "column";
  meme.style.alignItems = "center";

  // Utility function to handle text or elements
  function appendContent(container, content) {
    if (typeof content === "string") {
      container.textContent = content;
    } else if (content instanceof HTMLElement) {
      container.appendChild(content);
    }
  }

  // Header
  if (header) {
    const headerContainer = document.createElement("div");
    headerContainer.className = "meme-header";

    // Watermark Container
    const watermarkContainer = document.createElement("div");
    watermarkContainer.id = "watermark-container";

    const watermarkLogo = document.createElement("img");
    watermarkLogo.src =
      "https://fpltoolbox.com/wp-content/uploads/2024/01/Blog-Graphic-Mobile-1-e1733487933669.jpg";
    watermarkLogo.id = "watermark-logo";

    const watermarkText = document.createElement("p");
    watermarkText.textContent = "FPLToolbox";
    watermarkText.id = "watermark-text";

    watermarkContainer.appendChild(watermarkLogo);
    watermarkContainer.appendChild(watermarkText);

    // Create a header wrapper for text
    const headerContent = document.createElement("div");
    appendContent(headerContent, header); // This handles both text & elements

    // Append watermark & header text separately
    headerContainer.appendChild(watermarkContainer);
    headerContainer.appendChild(headerContent);

    // Add header to meme
    meme.appendChild(headerContainer);
  }

  // Image container
  const imgContainer = document.createElement("div");
  imgContainer.style.position = "relative";
  imgContainer.style.width = "100%";
  imgContainer.id = "meme-image-container";

  const img = document.createElement("img");
  img.src = imageSrc;
  img.style.width = "100%";
  img.style.display = "block";

  // Overlay Text Positions
  const overlayTextStyles = {
    position: "absolute",
    color: "white",
    maxWidth: "45%",
  };

  const overlayPositions = {
    topLeft: { top: "10%", left: "5%" },
    topRight: { top: "10%", right: "5%", textAlign: "right" },
    bottomRight: { bottom: "10%", right: "5%", textAlign: "right" },
    bottomLeft: { bottom: "10%", left: "5%" },
  };

  function createOverlay(position, content) {
    if (content) {
      const overlay = document.createElement("div");
      Object.assign(overlay.style, overlayTextStyles, position);
      appendContent(overlay, content);
      imgContainer.appendChild(overlay);
    }
  }

  createOverlay(overlayPositions.topLeft, topLeft);
  createOverlay(overlayPositions.topRight, topRight);
  createOverlay(overlayPositions.bottomRight, bottomRight);
  createOverlay(overlayPositions.bottomLeft, bottomLeft);

  imgContainer.appendChild(img);
  meme.appendChild(imgContainer);

  // Footer
  if (footer) {
    const footerContainer = document.createElement("div");
    footerContainer.className = "meme-footer";

    appendContent(footerContainer, footer);
    meme.appendChild(footerContainer);
  }
  // Share functionality
  meme.addEventListener("click", () => shareMeme(meme));
  return meme;
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
// Fetch player's current game stats from API
async function fetchPlayerCurrentStats(elementId) {
  const response = await fetch(`${BASE_URL}/element-summary/${elementId}/`);
  const data = await response.json();
  return data.history.slice(-1);
}
// Make getFootballerObject return a Promise
function getFootballerObject(playerId) {
  return new Promise((resolve, reject) => {
    const player = bootstrap.elements.find((el) => el.id == playerId);

    if (!player) {
      reject(`Player with ID ${playerId} not found.`);
      return;
    }

    const team = bootstrap.teams.find((t) => t.id == player.team);

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

async function getPlayerScore(playerId) {
  const footballer = await getFootballerObject(playerId); // Store the returned object
  return footballer.event_points;
}
async function getPlayerAssists(playerId) {
  const footballer = await getFootballerObject(playerId);
  return footballer.assists;
}
async function getPlayerGoals(playerId) {
  const footballer = await getFootballerObject(playerId);
  return footballer.goals_scored;
}

async function getPlayerTeam(playerId) {
  const footballer = await getFootballerObject(playerId);
  return footballer.team;
}
async function getPlayerTeamCode(playerId) {
  const footballer = await getFootballerObject(playerId);
  return footballer.team_code;
}
async function getPlayerEP(playerId) {
  const footballer = await getFootballerObject(playerId);
  return footballer.ep_this;
}

async function getPlayerTotalPoints(playerId) {
  const footballer = await getFootballerObject(playerId);
  return footballer.total_points;
}

async function getPlayerType(playerId) {
  const footballer = await getFootballerObject(playerId);
  return footballer.element_type;
}

async function getPlayerPhoto(playerId) {
  const footballer = await getFootballerObject(playerId);
  return footballer.photo;
}

function addCaptainBadge() {
  //console.log("Adding Captain Badges");
  // Select all elements with the class 'player'
  const players = document.querySelectorAll(".player");

  players.forEach((player) => {
    if (player.querySelectorAll(".my-captain-name")[0]) {
      // Create a new image element
      const img = document.createElement("img");
      img.src = "https://fpltoolbox.com/wp-content/uploads/2024/12/Captain.png";
      img.setAttribute("class", "captain-badge");
      // Append the image to the player element
      player.prepend(img);
    }
    if (player.querySelectorAll(".my-vice-captain-name")[0]) {
      // Create a new image element
      const img = document.createElement("img");
      img.src =
        "https://fpltoolbox.com/wp-content/uploads/2024/12/Captain-1.png";
      img.setAttribute("class", "my-vice-captain-badge");
      // Append the image to the player element
      player.prepend(img);
    }
    if (player.querySelectorAll(".my-triple-captain-name")[0]) {
      // Create a new image element
      const img = document.createElement("img");
      img.src =
        "https://fpltoolbox.com/wp-content/uploads/2025/02/svgexport-10.png";
      img.setAttribute("class", "my-triple-captain-badge");
      // Append the image to the player element
      player.prepend(img);
    }
  });
}

async function createPlayerCardNew(
  elementId,
  score,
  isCaptain,
  isViceCaptain,
  isTriple
) {
  const card = document.createElement("div");
  const type = await getPlayerType(elementId);

  card.classList.add("player");
  card.classList.add("type" + type);
  card.classList.add("player-new");
  card.id = elementId;

  const img = document.createElement("img");
  img.setAttribute("class", "player-img");

  const teamCode = await getPlayerTeamCode(elementId);

  img.src = `https://fpltoolbox.com/wp-content/uploads/2025/04/shirt_${teamCode}${
    type == 1 ? "_1" : ""
  }.webp`;

  const name = document.createElement("div");
  if (isTriple == 3) {
    name.className = "my-triple-captain-name";
  } else if (isCaptain) {
    name.className = "my-captain-name";
  } else if (isViceCaptain) {
    name.className = "my-vice-captain-name";
  } else {
    name.className = "my-player-name";
  }

  name.textContent = (await getPlayerWebName(elementId)).slice(0, 10);

  const scoreText = document.createElement("div");
  scoreText.className = "my-player-xp";
  scoreText.textContent = score;

  card.append(img, name, scoreText);

  return card;
}
