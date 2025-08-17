const BASE_URL = "https://api.codetabs.com/v1/proxy?quest=http://fantasy.premierleague.com/api/"
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


async function fetchData(leagueID) {
 
  try {
    const bootstrapCall = await fetch(BASE_URL + "bootstrap-static/");
    const leagueCall = await fetch(
      `${BASE_URL}leagues-classic/${leagueID}/standings/`
    );

    const bootstrapData = await bootstrapCall.json();
    const leagueData = await leagueCall.json();

    console.log("Bootstrap Data:", bootstrapData);
    console.log("League Data:", leagueData);

    return { bootstrapData, leagueData };
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

// A function to create the main league table HTML element.
function createLeagueTable(teams, isHiddenView) {
  const table = document.createElement("table");
  table.className = "league-table";
  table.innerHTML = `
    <thead>
      <tr>
        <th></th>
        <th>Team</th>
        <th>GW<br> Total</th>
        <th>Total<br> Points</th>
      </tr>
    </thead>
    <tbody>
      ${teams
        .map((team, index) => {
          const isPaid = isHiddenView && index < 3;
          const rowClass = isPaid ? "is-paid" : "";
          return `
            <tr class="${rowClass}">
              <td>${team.rank}</td>
              <td>
                <strong>${team.entry_name}</strong><br>
                <span class="player-name">${team.player_name}</span>
              </td>
              <td>${team.event_total}</td>
              <td>${team.total}</td>
            </tr>
          `;
        })
        .join("")}
    </tbody>
  `;
  return table;
}

// A function to create and append the toggle button.
function createToggleButton(isHiddenView, renderTable) {
  const toggleButton = document.createElement("button");
  toggleButton.textContent = isHiddenView
    ? "Show Full League"
    : "Show Paid League";
  toggleButton.onclick = () => renderTable(!isHiddenView);
  return toggleButton;
}

// A function to append additional content for the paid league view.
function appendPaidLeagueContent(screenDiv) {
  const motm = document.createElement("div");
  motm.className = "card";
  motm.innerHTML = `
    <h2>Manager of the Month</h2>
    <div><h3>Monthly Prizes</h3></div>
  `;
  screenDiv.appendChild(motm);

  const payoutStructure = document.createElement("div");
  payoutStructure.className = "card";
  payoutStructure.innerHTML = `
    <h2>Payout Structure</h2>
    <div class="card">
    <h3>Total Pot</h3>
    <span>RM100 Buy-in = <strong>RM1700</strong></span>
    </div>
<div class="card">
    <div><h3>Monthly Prizes</h3>
    <span>Pot = <strong>RM400</strong></span>
      <p>Complete months only - September, October, November, December, January, February, March, and April. Paid out at the end of the season. Managers can only win this up to 2 times per season</p>
    </div>
</div>
<div class="card">
    <h3>End of Season</h3>
    <span>Pot = <strong>RM1300</strong></span>

    <div class="is-paid">
      <div class="key" style="padding:20px">1st Place: RM600</div>
      <div class="key" style="padding:20px">2nd Place: RM300</div>
      <div class="key" style="padding:20px">3rd Place: RM100</div>
      <div class="key" style="padding:20px">Cup Winner: RM300</div>
    </div>
</div>
  `;
  screenDiv.appendChild(payoutStructure);
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
    const { leagueData } = await fetchData(leagueID);

    const allTeams = leagueData.standings.results;
    const filteredTeams = getFilteredAndReRankedTeams(allTeams, teamsToKeep);

    // This function will be called by the toggle button and the initial load.
    const renderTable = (isHiddenView) => {
      screenDiv.innerHTML = "";
      const teamsToDisplay = isHiddenView ? filteredTeams : allTeams;

      const tableContainer = document.createElement("div");
      tableContainer.className = "card";
      tableContainer.innerHTML = `<h2>GIS - FPL</h2>`;

      const toggleButton = createToggleButton(isHiddenView, renderTable);
      const table = createLeagueTable(teamsToDisplay, isHiddenView);

      tableContainer.appendChild(toggleButton);
      tableContainer.appendChild(table);
      screenDiv.appendChild(tableContainer);

      if (isHiddenView) {
        appendPaidLeagueContent(screenDiv);
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
