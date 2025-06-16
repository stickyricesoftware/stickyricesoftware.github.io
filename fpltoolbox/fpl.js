const BASE_URL =
  "https://proxy.fpltoolbox.com/http://fantasy.premierleague.com/api/";
//  const BASE_URL =
//  "http://fantasy.premierleague.com/api/";

import eventStatusTest from "./testData/eventStatusTest.js";
import bootstrapTest from "./testData/bootsatrapTest.js";
import superLeagueTest from "./testData/superLeagueTest.js";
import superLeagueAddingManagerDataTest from "./testData/superLeagueAddingManagerDataTest.js";
import superLeagueAddingGameweekDataTest from "./testData/superLeagueGameweekDataTest copy.js";
import superLeagueAddWeeklyPicksTest from "./testData/superLeagueAddWeeklyPicksTest.js"

let testMode = true; // Set to true to use test data
window.FPLToolboxLeagueDataReady = false;

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
      requiresData: false,
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
    },
    {
      icon: "bi-bar-chart",
      label: "GW Stats",
      action: handleStatsClick,
      tier: "free",
    },
    {
      icon: "bi-graph-up-arrow",
      label: "Season Stats",
      action: handleStatsClick,
      tier: "pro",
    },
    {
      icon: "bi-people",
      label: "Benched Points League",
      action: handleStatsClick,
      tier: "pro",
    },
    {
      icon: "bi-cash-coin",
      label: "Rich List League",
      action: richListNew,
      tier: "pro",
    },
    {
      icon: "bi-exclamation-triangle",
      label: "The Dirty League",
      action: handleStatsClick,
      tier: "pro",
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
    },
    {
      icon: "bi-person-check",
      label: "Catch A Copycat",
      action: handleStatsClick,
      tier: "pro",
    },
    {
      icon: "bi-arrow-repeat",
      label: "GW Transfer Summaries",
      action: handleStatsClick,
      tier: "free",
    },
    {
      icon: "bi-boxes",
      label: "Chip Usage",
      action: handleStatsClick,
      tier: "free",
    },
    {
      icon: "bi-compass",
      label: "Captain Picks",
      action: handleStatsClick,
      tier: "free",
    },
    {
      icon: "bi-binoculars",
      label: "Rival Comparison",
      action: handleStatsClick,
      tier: "free",
    },
    {
      icon: "bi-award",
      label: "Season Summary",
      action: handleStatsClick,
      tier: "free",
    },
    {
      icon: "bi-speedometer2",
      label: "Max Dashboard",
      action: handleStatsClick,
      tier: "max",
    },
    {
      icon: "bi-calculator",
      label: "Rivals Transfer Calculator",
      action: handleStatsClick,
      tier: "pro",
    },
  ];

  features.forEach(({ icon, label, action, tier, requiresData = false }, i) => {
    const needsData = requiresData && !window.FPLToolboxLeagueDataReady;

    const featureId = `feature-btn-${i}`;

    const col = document.createElement("div");
    col.className = "col-4 p-2";

    const button = document.createElement("div");
    button.id = featureId;
    button.className =
      "btn btn-light w-100 feature-icon d-flex flex-column align-items-center justify-content-center text-center position-relative";
    button.style.height = "120px";

    if (needsData) {
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
      await sleep(500); // Simulate test delay
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
  

  if (userHasAccess([1, 10, 12])) {
    await addManagerDetailsToLeague(standings, null);
    await addGameweeksToLeague(standings, null);
    window.FPLToolboxLeagueDataReady = true;
  }

  if (userHasAccess([10, 12])) {
    window.FPLToolboxLeagueDataReady = false;
    await addDetailedGameweeksToLeague(standings, null);
    await weeklyPicksForSuperLeague(standings, null);
    window.FPLToolboxLeagueDataReady = true;
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
  // Step 1: Initial render to show UI (spinners if data not ready)
  toolsScreen();

  // Step 2: Check if data is already available (e.g. cached)
  if (window.FPLToolboxLeagueData?.standings?.length) return;

  // Step 3: Fetch and re-render after processing
  await fetchAndProcessLeague(leagueId, (status, data) => {
    if (status === "complete") {
      toolsScreen(); // Re-render after league data is ready
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
      sliceStandingsForUser(superLeagueAddingManagerDataTest.standings)
    console.log(
      "%c TEST MODE - NO API CALL MADE - Adding Manager Details",
      "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: green; ",
      "New Data",
      window.FPLToolboxLeagueData.standings
    );

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
  console.log(standings);
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
      sliceStandingsForUser(superLeagueAddingGameweekDataTest.standings);
    console.log(
      "%c TEST MODE - NO API CALL MADE - Adding Gameweek Details",
      "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: green; ",
      "New Data",
      window.FPLToolboxLeagueData.standings
    );

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
  console.log(`Searching database for Gameweek stats`);
  if (testMode) {
    console.log(
      "%c TEST MODE - NO API CALL MADE - Adding Gameweek Details",
      "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: green; ",
      "Old Data",
      window.FPLToolboxLeagueData.standings
    );

    window.FPLToolboxLeagueData.standings =
      sliceStandingsForUser(superLeagueAddingGameweekDataTest.standings);
    console.log(
      "%c TEST MODE - NO API CALL MADE - Adding Gameweek Details",
      "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: green; ",
      "New Data",
      window.FPLToolboxLeagueData.standings
    );

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
  shareButton.onclick = shareTopTen;
  leagueTable.appendChild(shareButton);

  function shareTopTen() {
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
