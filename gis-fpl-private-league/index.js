const BASE_URL =
  "https://api.codetabs.com/v1/proxy?quest=http://fantasy.premierleague.com/api/";
//"https://proxy.fpltoolbox.com/http://fantasy.premierleague.com/api/";
//"http://fantasy.premierleague.com/api/"
//"https://api.cors.lol/?url=http://fantasy.premierleague.com/api/"

const leagueID = 635219;

async function startLoader() {
  const screenDiv = document.getElementById("screen");
  const loader = document.createElement("div");
  loader.id = "loader";
  loader.innerHTML = `<div class="loader"></div>`;
  screenDiv.append(loader);
}
async function endLoader() {
  document.getElementById(`loader`).remove();
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchBootstrapData() {
  try {
    const bootstrapCall = await fetch(BASE_URL + "bootstrap-static/");

    const bootstrapData = await bootstrapCall.json();

    console.log("Bootstrap Data:", bootstrapData);

    return { bootstrapData };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw new Error("Failed to load league data.");
  }
}
const bootstrap = fetchBootstrapData();

async function fetchLeagueData(leagueID) {
  try {
    const bootstrapCall = await fetch(BASE_URL + "bootstrap-static/");
    const leagueCall = await fetch(
      `${BASE_URL}leagues-classic/${leagueID}/standings/`
    );

    //const bootstrapData = await bootstrapCall.json();
    const leagueData = await leagueCall.json();

    //console.log("Bootstrap Data:", bootstrapData);
    console.log("League Data:", leagueData);

    return { leagueData };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw new Error("Failed to load league data.");
  }
}

// A function to filter and re-rank the teams.
function getFilteredAndReRankedTeams(allTeams, teamsToKeep) {
  const filteredTeams = allTeams.filter((team) =>
    teamsToKeep.includes(String(team.entry))
  );

  return filteredTeams.map((team, index, arr) => {
    let currentRank =
      index === 0 || team.total < arr[index - 1].total
        ? index + 1
        : arr[index - 1].rank;
    return { ...team, rank: currentRank };
  });
}
function applyStaggeredRowAnimation(tableElement, delayStep = 0.1) {
  const rows = tableElement.querySelectorAll("tr");
  rows.forEach((row, index) => {
    // Calculate the delay based on the row's index
    const delay = (index * delayStep).toFixed(1); // .toFixed(1) for cleaner output

    // Apply the animation delay as a CSS custom property
    row.style.setProperty("--animation-delay", `${delay}s`);
  });
}
// A function to create the main league table HTML element.
function createLeagueTable(teams, isHiddenView) {
  const table = document.createElement("table");
  table.className = "league-table animated-table";

  // Calculate the total points of the top team
  const topTeamTotalPoints = teams.length > 0 ? teams[0].total : 0;

  table.innerHTML = `
    <thead>
      <tr>
        <th></th>
        <th>Team</th>
        <th>GW<br> Total</th>
        <th>Points<br> Gap</th>
        <th style="text-align:right">Total<br> Points</th>

      </tr>
    </thead>
    <tbody>
      ${teams
        .map((team, index) => {
          const isPaid = isHiddenView && index < 3;
          const rowClass = isPaid ? "is-paid" : "";

          // Calculate the points gap
          const pointsGap = topTeamTotalPoints - team.total;

          return `
            <tr class="${rowClass}">
              <td style="padding-left:10px">${team.rank}</td>
              <td>
                <strong>${team.entry_name}</strong><br>
                <span class="player-name">${team.player_name}</span>
              </td>
              <td>${team.event_total}</td>
              <td>${pointsGap > 0 ? pointsGap : "-"}</td>
              <td style="text-align:right; padding-right:10px">${
                team.total
              }</td>
             
            </tr>
          `;
        })
        .join("")}
    </tbody>
  `;
  return table;
}

// A function to create the toggle switch element.
function createToggleSwitch(isHiddenView, renderTable) {
  const switchContainer = document.createElement("div");
  switchContainer.className = "toggle-switch-container";

  switchContainer.innerHTML = `
    <span class="toggle-text-label full-league">Full League</span>
    <input type="checkbox" id="league-toggle" class="toggle-switch-checkbox" ${
      isHiddenView ? "checked" : ""
    }>
    <label for="league-toggle" class="toggle-switch-label">
      <span class="toggle-switch-inner"></span>
      <span class="toggle-switch-switch"></span>
    </label>
    <span class="toggle-text-label paid-league">Paid League</span>
  `;

  // Attach the event listener to the checkbox
  const checkbox = switchContainer.querySelector(".toggle-switch-checkbox");
  checkbox.addEventListener("change", () => {
    renderTable(checkbox.checked);
  });

  return switchContainer;
}

// A function to create and append the Manager of the Month section.
function appendManagerOfTheMonth(screenDiv) {
  const motm = document.createElement("div");
  motm.className = "card toggle-card";
  motm.innerHTML = `
    <h2 class="toggle-title">FPL Manager of the Month <span class="toggle-icon">▼</span></h2>
    <div class="collapsible-content">

        <div>
          <div id="motm-grid-placeholder"></div> </div>
          <span><strong></strong></span>
          <hr>
        </div>
 


      
    </div>
  `;
  screenDiv.appendChild(motm);

  setupCollapsibleCard(motm); // Use the reusable function

  // Find the grid placeholder inside the MOTM card
  const gridPlaceholder = motm.querySelector("#motm-grid-placeholder");

  // Append the grid to the placeholder
  if (gridPlaceholder) {
    appendMonthlyGrid(gridPlaceholder);
  }
}

function appendMonthlyGrid(parentElement) {
  const gridContainer = document.createElement("div");
  gridContainer.className = "motm-grid";

  const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];

  months.forEach((month) => {
    const gridItem = document.createElement("div");
    gridItem.className = "grid-item";
    gridItem.innerHTML = `
      <p class="month-name">${month}</p>
      <p class="winner-name">TBC</p>
    `;
    gridContainer.appendChild(gridItem);
  });

  parentElement.appendChild(gridContainer);
}

// A function to create and append the Manager of the Month section.
function appendCupCompetition(screenDiv) {
  const cupComp = document.createElement("div");
  cupComp.className = "card toggle-card";
  cupComp.innerHTML = `
    <h2 class="toggle-title">FPL Cup <span class="toggle-icon">▼</span></h2>
    <div class="collapsible-content">


        <div>
          <h3>The cup competition is scheduled to start in GW34</h3>
          <span><strong></strong></span>
        </div>
 <hr>


      
    </div>
  `;
  screenDiv.appendChild(cupComp);
  setupCollapsibleCard(cupComp); // Use the reusable function
}

// A function to create and append the Payout Structure section with a toggle.
function appendPayoutStructure(screenDiv) {
  const payoutStructureCard = document.createElement("div");
  payoutStructureCard.className = "card toggle-card"; // Added a new class for styling the toggle
  payoutStructureCard.innerHTML = `
    <h2 class="toggle-title">Payout Structure <span class="toggle-icon">▼</span></h2>
    <div class="collapsible-content">
        <div>
        <h3>Total Pot</h3>
        <span>RM100 Buy-in = <strong>RM1700</strong></span>
        </div>
<hr>
        <div>
          <h3>Monthly Prizes</h3>
          <span>Pot = <strong>RM400</strong></span>
          <p>8 x RM50 prizes for complete months only - September, October, November, December, January, February, March, and April. Paid out at the end of the season. Managers can only win this up to 2 times per season</p>
        </div>
<hr>

<div>
        <h3>End of Season</h3>
        <span>Pot = <strong>RM1300</strong></span>
        <div class="is-paid">
          <div class="key" style="padding:20px">1st Place: RM600</div>
          <div class="key" style="padding:20px">2nd Place: RM300</div>
          <div class="key" style="padding:20px">3rd Place: RM100</div>
          <div class="key" style="padding:20px">Cup Winner: RM300</div>
        </div>
      </div>
      <hr>
    </div>
  `;
  screenDiv.appendChild(payoutStructureCard);
  setupCollapsibleCard(payoutStructureCard); // Use the reusable function
}
function setupCollapsibleCard(cardElement) {
  const toggleTitle = cardElement.querySelector(".toggle-title");
  const content = cardElement.querySelector(".collapsible-content");

  if (!toggleTitle || !content) {
    console.error(
      "Collapsible card elements not found within the provided card."
    );
    return;
  }

  toggleTitle.addEventListener("click", () => {
    content.classList.toggle("show");
    const icon = toggleTitle.querySelector(".toggle-icon");
    if (content.classList.contains("show")) {
      icon.textContent = "▲";
    } else {
      icon.textContent = "▼";
    }
  });
}
// The main function that orchestrates the entire process.
async function runOnLoad(leagueID) {
  startLoader();

  const screenDiv = document.getElementById("screen");
  if (!screenDiv) {
    console.error('Element with id "screen" not found.');
    endLoader();
    return;
  }

  const teamsToKeep = [
    "2471830",
    "7011671",
    "9670559",
    "4439378",
    "5270716",
    "829035",
    "121633",
    "1077605",
    "252362",
    "137606",
    "6525541",
    "4359674",
    "7332950",
    "5496376",
    "5145044",
    "1216178",
    "6565912",
  ];

  try {
    const { leagueData } = await fetchLeagueData(leagueID);

    const allTeams = leagueData.standings.results;
    const filteredTeams = getFilteredAndReRankedTeams(allTeams, teamsToKeep);

    const playerNameKey = "fpl_player_name";
    const storedName = getPlayerName(playerNameKey);
    // Your predefined list of names
    const allPlayerNames = [];

    for (let i = 0; i < leagueData.standings.results.length; i++) {
      console.log(leagueData.standings.results[i].player_name);
      let playerName = leagueData.standings.results[i].player_name;
      allPlayerNames.push(playerName);
    }

    if (!storedName) {
      showPlayerNamePopup(allPlayerNames, playerNameKey);
    } else {
      const date = new Date();

      const formattedDateTime = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Use 24-hour format
      }).format(date);

      const notifcation = `    
    🖥️ ${storedName} Checked in at:
    🕒 ${formattedDateTime}`;
      fetch("https://ntfy.sunny.bz/gis-fpl", {
        method: "POST",
        body: notifcation,
      });
    }

    // This function will be called by the toggle button and the initial load.
    const renderTable = (isHiddenView) => {
      screenDiv.innerHTML = "";
      const teamsToDisplay = isHiddenView ? filteredTeams : allTeams;

      const tableContainer = document.createElement("div");
      tableContainer.className = "table-card";
      tableContainer.innerHTML = `<h2>GIS - FPL Mini League</h2>`;

      const toggleSwitch = createToggleSwitch(isHiddenView, renderTable);
      const table = createLeagueTable(teamsToDisplay, isHiddenView);

      tableContainer.appendChild(toggleSwitch);
      tableContainer.appendChild(table);
      screenDiv.appendChild(tableContainer);
      // Now, apply the staggered animation
      applyStaggeredRowAnimation(table);

      if (isHiddenView) {
        appendManagerOfTheMonth(screenDiv);
        appendCupCompetition(screenDiv);
        appendPayoutStructure(screenDiv);
      }
    };

    // Render the initial view.
    renderTable(false);
  } catch (error) {
    screenDiv.innerHTML = `<h2>Failed to load</h2>`;
    console.error("An error occurred during rendering:", error);
  } finally {
    endLoader();
  }
}

runOnLoad(leagueID);

function getPlayerName(storageKey) {
  return localStorage.getItem(storageKey);
}
function showPlayerNamePopup(playerNames, storageKey) {
  const popupContainer = document.createElement("div");
  popupContainer.id = "player-popup-overlay";

  // Create the list of names as buttons
  const namesListHtml = playerNames
    .map((name) => `<button class="player-name-option">${name}</button>`)
    .join("");

  popupContainer.innerHTML = `
    <div id="player-popup">
      <h2>Who are you?</h2>
      <p>Please select your name from the list.</p>
      <div id="player-names-list">${namesListHtml}</div>
    </div>
  `;

  document.body.appendChild(popupContainer);

  const namesList = document.getElementById("player-names-list");

  namesList.addEventListener("click", (event) => {
    // Check if the clicked element is a button
    if (event.target.tagName === "BUTTON") {
      const selectedName = event.target.textContent;
      localStorage.setItem(storageKey, selectedName);
      popupContainer.remove(); // Remove the popup after selection
    }
  });
}
