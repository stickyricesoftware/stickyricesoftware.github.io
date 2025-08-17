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

// A function to create the main league table HTML element.
function createLeagueTable(teams, isHiddenView) {
  const table = document.createElement("table");
  table.className = "league-table";

  // Calculate the total points of the top team
  const topTeamTotalPoints = teams.length > 0 ? teams[0].total : 0;

  table.innerHTML = `
    <thead>
      <tr>
        <th></th>
        <th>Team</th>
        <th>GW<br> Total</th>
        <th>Points<br> Gap</th>
        <th>Total<br> Points</th>

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
              <td>${team.rank}</td>
              <td>
                <strong>${team.entry_name}</strong><br>
                <span class="player-name">${team.player_name}</span>
              </td>
              <td>${team.event_total}</td>
              <td>${pointsGap > 0 ? pointsGap : '-'}</td>
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

// A function to create and append the Manager of the Month section.
function appendManagerOfTheMonth(screenDiv) {
  const motm = document.createElement("div");
  motm.className = "card toggle-card"
  motm.innerHTML = `
    <h2 class="toggle-title">Manager of the Month <span class="toggle-icon">▼</span></h2>
    <div class="collapsible-content">


        <div>
          <h3>Monthly Prizes</h3>
          <span>Pot = <strong>RM400</strong></span>
          <p>Complete months only - September, October, November, December, January, February, March, and April. Paid out at the end of the season. Managers can only win this up to 2 times per season</p>
        </div>
 <hr>


      
    </div>
  `;
  screenDiv.appendChild(motm);
  setupCollapsibleCard(motm); // Use the reusable function
}

// A function to create and append the Manager of the Month section.
function appendCupCompetition(screenDiv) {
  const cupComp = document.createElement("div");
  cupComp.className = "card toggle-card"
  cupComp.innerHTML = `
    <h2 class="toggle-title">Cup Competition <span class="toggle-icon">▼</span></h2>
    <div class="collapsible-content">


        <div>
          <h3>Monthly Prizes</h3>
          <span>Pot = <strong>RM400</strong></span>
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
    console.error("Collapsible card elements not found within the provided card.");
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
        appendManagerOfTheMonth(screenDiv)
        appendCupCompetition(screenDiv)
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
