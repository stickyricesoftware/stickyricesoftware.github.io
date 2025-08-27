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
let bootstrapData
(async () => {
  bootstrapData = await fetchBootstrapData();
  console.log("Bootstrap:", bootstrapData);
})();

async function fetchLeagueData(leagueID) {
  try {
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
        <th>Points Gap<br>(From Top)</th>
        <th style="text-align:right">Total<br> Points</th>

      </tr>
    </thead>
    <tbody>
      ${teams
        .map((team, index) => {
          const isPaid = isHiddenView && index < 3;
          const rowClass = isPaid ? "is-paid" : "";

          // Calculate the points gap
          const fromTop = topTeamTotalPoints - team.total;

          // Calculate the points gap to the team above
          let pointsGap = "-";
          if (index > 0) {
            const prevTeam = teams[index - 1];
            pointsGap = prevTeam.total - team.total;
          }

          // Determine the rank display: medal emojis for top 3, nothing for others
          let rankDisplay = "";
          if (index === 0) {
            rankDisplay = "🥇";
          } else if (index === 1) {
            rankDisplay = "🥈";
          } else if (index === 2) {
            rankDisplay = "🥉";
          } else {
            rankDisplay = index + 1;
          }

          return `
            <tr class="${rowClass}">
              <td style="padding-left:10px">${rankDisplay}</td>
              <td>
                <strong>${team.entry_name}</strong><br>
                <span class="player-name">${team.player_name}</span>
              </td>
              <td>${team.event_total}</td>
              <td><strong>${
                pointsGap > 0 ? pointsGap : "-"
              }</strong> (${fromTop})</td>
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
async function appendManagerOfTheMonth(screenDiv, filteredTeams) {
  const phases = bootstrapData.bootstrapData.phases;
//     const phases = [

//     {
//         "highest_score": 211,
//         "id": 2,
//         "name": "August",
//         "start_event": 1,
//         "stop_event": 2
//     },
//     {
//         "highest_score": null,
//         "id": 3,
//         "name": "September",
//         "start_event": 1,
//         "stop_event": 2
//     },
//     {
//         "highest_score": null,
//         "id": 4,
//         "name": "October",
//         "start_event": 1,
//         "stop_event": 2
//     },
//     {
//         "highest_score": null,
//         "id": 5,
//         "name": "November",
//         "start_event": 1,
//         "stop_event": 2
//     },
//     {
//         "highest_score": null,
//         "id": 6,
//         "name": "December",
//         "start_event": 1,
//         "stop_event": 2
//     },
//     {
//         "highest_score": null,
//         "id": 7,
//         "name": "January",
//         "start_event": 1,
//         "stop_event": 2
//     },
//     {
//         "highest_score": null,
//         "id": 8,
//         "name": "February",
//         "start_event": 1,
//         "stop_event": 2
//     },
//     {
//         "highest_score": null,
//         "id": 9,
//         "name": "March",
//         "start_event": 29,
//         "stop_event": 31
//     },
//     {
//         "highest_score": null,
//         "id": 10,
//         "name": "April",
//         "start_event": 32,
//         "stop_event": 34
//     },
//     {
//         "highest_score": null,
//         "id": 11,
//         "name": "May",
//         "start_event": 35,
//         "stop_event": 38
//     }
// ]
  
  
  const events = bootstrapData.bootstrapData.events;

  // Find the current GW
  const currentEvent = events.find(e => e.is_current);
  const currentGw = currentEvent ? currentEvent.id : 0;

  //const excludedMonths = [];
const excludedMonths = [ "August","May"];

  // Filter valid phases
  const validPhases = phases.filter(
    p => !excludedMonths.includes(p.name) && p.start_event <= currentGw
  );

  // Track number of wins per team
const winCounts = {};

// Calculate winners/runner-ups
const phaseResults = validPhases.map(phase => {
  const scores = filteredTeams.map(team => {
    const phasePoints = team.everyGw
      .filter(gw => gw.gameweek >= phase.start_event && gw.gameweek <= phase.stop_event)
      .reduce((sum, gw) => sum + gw.points, 0);

    return {
      entry_name: team.entry_name,
      player_name: team.player_name,
      total_points: phasePoints,
    };
  });

  // Sort by descending points
  scores.sort((a, b) => b.total_points - a.total_points);

  // --- Find winner (respecting win cap) ---
  let winners = [];
  const usedScores = new Set();

  for (const scoreObj of scores) {
    if (usedScores.has(scoreObj.total_points)) continue;

    // teams tied at this score
    const tiedTeams = scores.filter(s => s.total_points === scoreObj.total_points);

    // filter eligible
    const eligible = tiedTeams.filter(t => {
      if (!winCounts[t.entry_name]) winCounts[t.entry_name] = 0;
      return winCounts[t.entry_name] < 2;
    });

    if (eligible.length > 0) {
      eligible.forEach(t => {
        winCounts[t.entry_name]++;
      });
      winners = eligible;
      break;
    }

    usedScores.add(scoreObj.total_points);
  }

  // --- Find runner-up (next highest eligible after winners) ---
  let runnerUp = [];
  if (winners.length > 0) {
    const winnerScore = winners[0].total_points;
    const nextScores = scores.filter(s => s.total_points < winnerScore);

    for (const scoreObj of nextScores) {
      if (usedScores.has(scoreObj.total_points)) continue;

      const tiedTeams = nextScores.filter(s => s.total_points === scoreObj.total_points);

      const eligible = tiedTeams.filter(t => {
        if (!winCounts[t.entry_name]) winCounts[t.entry_name] = 0;
        return winCounts[t.entry_name] < 2;
      });

      if (eligible.length > 0) {
        runnerUp = eligible;
        break;
      }

      usedScores.add(scoreObj.total_points);
    }
  }

  return { phase: phase.name, winners, runnerUp };
});

// --- Create card ---
const motm = document.createElement("div");
motm.className = "card toggle-card";
motm.innerHTML = `
  <h2 class="toggle-title">
    FPL Manager of the Month <span class="toggle-icon">▼</span>
  </h2>
  <div class="collapsible-content">
    <div id="motm-grid-placeholder" class="container-fluid"></div>
  </div>
`;
screenDiv.appendChild(motm);
setupCollapsibleCard(motm);

const gridPlaceholder = motm.querySelector("#motm-grid-placeholder");

// Build rows of 2 cols each
for (let i = 0; i < phaseResults.length; i += 2) {
  const row = document.createElement("div");
  row.className = "row";

  phaseResults.slice(i, i + 2).forEach(result => {
    const col = document.createElement("div");
    col.className = "col-6 mb-4";

    const winnersHTML = result.winners.length
      ? result.winners
          .map(
            w =>
              `<strong>${w.entry_name}</strong> <span class="player-name">(${w.player_name})</span> - ${w.total_points} pts`
          )
          .join("<br>")
      : `<em>No eligible winner</em>`; // only if literally all capped out

    const runnerUpHTML = result.runnerUp.length
      ? `<div class="text-muted" style="font-size:0.9em; margin-top:4px;">
           ${result.runnerUp.length > 1 ? "Runners-up" : "Runner-up"}: 
           ${result.runnerUp
             .map(r => `${r.entry_name} (${r.player_name}) - ${r.total_points} pts`)
             .join(", ")}
         </div>`
      : "";

    col.innerHTML = `
      <div class="motm-phase card shadow-sm p-3 h-100 text-center">
        <div style="font-size:2rem;">⭐</div>
        <h5 class="mb-2">${result.phase}</h5>
        <div>${winnersHTML}</div>
        ${runnerUpHTML}
      </div>
    `;

    row.appendChild(col);
  });

  gridPlaceholder.appendChild(row);
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
        <span>RM100 Buy-in = <strong>RM1900</strong></span>
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
        <span>Pot = <strong>RM1500</strong></span>
        <div class="is-paid">
          <div class="key" style="padding:20px">🥇 1st Place: RM750</div>
          <div class="key" style="padding:20px">🥈 2nd Place: RM300</div>
          <div class="key" style="padding:20px">🥉 3rd Place: RM150</div>
          <div class="key" style="padding:20px">🏆 Cup Winner: RM300</div>
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
    "4630220",
    "4225067",
  ];

  try {
    const { leagueData } = await fetchLeagueData(leagueID);

    const allTeams = leagueData.standings.results;
    const filteredTeams = getFilteredAndReRankedTeams(allTeams, teamsToKeep);

    const playerNameKey = "fpl_player_name";
    const storedName = getPlayerName(playerNameKey);
    // Your predefined list of names
    const allPlayerNames = [];


    //Create player select popup
    for (let i = 0; i < leagueData.standings.results.length; i++) {
      
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

async function addGameweeksToLeague(standings) {
  const startTime = Date.now(); // Start the timer

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
      // const calculateTotal = (field) =>
      //   teamData.current.reduce((sum, week) => sum + week[field], 0);

      // Calculate totals
      // team.totalTransfers = calculateTotal("event_transfers");
      // team.totalMinusPoints = calculateTotal("event_transfers_cost");
      // team.totalPointsOnBench = calculateTotal("points_on_bench");

      // Add chips data (limited to 6 chips)
      //console.log(teamData)
      team.chips = teamData.chips.slice(0, 8).map((chip) => ({
        name: chip.name,
        time: chip.time,
        gw: chip.event,
      }));

      // team.past = teamData.past;

      // Other team data
      // team.seasons = teamData.past.length;
      // team.seasons_managed = teamData.past[0]?.season_name || "NEW";
      // team.previousRank =
      //   teamData.current[teamData.current.length - 2]?.overall_rank || "";
      // Add a small delay between requests (e.g., 500ms)
      await sleep(500);
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
    "%c Gameweek Details Added",
    "min-width: 100%; padding: 1rem 3rem; font-family: Roboto; font-size: 2.2em; line-height: 1.4em; color: white; background-color: red; ",
    standings
  );

  return standings;
}
await addGameweeksToLeague(filteredTeams)



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
        appendManagerOfTheMonth(screenDiv, filteredTeams);
        appendCupCompetition(screenDiv);
        appendPayoutStructure(screenDiv);

        if (storedName) {
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
    🖥️ ${storedName} Checked paid league:
    🕒 ${formattedDateTime}`;
          fetch("https://ntfy.sunny.bz/gis-fpl", {
            method: "POST",
            body: notifcation,
          });
        }
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

