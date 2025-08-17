const BASE_URL = 
  "https://proxy.fpltoolbox.com/http://fantasy.premierleague.com/api/"
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
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function runOnLoad(leagueID) {
  startLoader();
 await sleep(1000); // pause for 1000 ms (1 second)
  try {
    const bootstrapCall = await fetch(BASE_URL + "bootstrap-static/");
    const bootstrapData = await bootstrapCall.json();
    const leagueCall = await fetch(
      `${BASE_URL}leagues-classic/${leagueID}/standings/`
    );
    const leagueData = await leagueCall.json();
    console.log(BASE_URL);
    console.log(bootstrapData);

    console.log(leagueData);
    /**
     * Appends a league table to a div with the id "screen",
     * with a toggle to hide specific teams and re-rank the table.
     * @param {string[]} teamsToKeep An array of team IDs to be shown by the toggle.
     */
    function displayLeagueTableWithToggle(teamsToKeep = []) {
      const screenDiv = document.getElementById("screen");
      if (!screenDiv) {
        console.error('Element with id "screen" not found.');
        return;
      }

      // Filter for teams to KEEP and re-rank them
      const filteredAndReRankedTeams = leagueData.standings.results
        .filter((team) => teamsToKeep.includes(String(team.id))) // CHANGED LOGIC
        .map((team, index, arr) => {
          let currentRank =
            index === 0 || team.total < arr[index - 1].total
              ? index + 1
              : arr[index - 1].rank;
          return { ...team, rank: currentRank };
        });

      // Function to create and render the table
      const renderTable = (teams, isHiddenView) => {
        // Clear the current table before rendering a new one
        screenDiv.innerHTML = "";

        const tableContainer = document.createElement("div");
        tableContainer.className = "card";
        tableContainer.innerHTML = `<h2>GIS -FPL</h2>`;

        // Create the toggle button
        const toggleButton = document.createElement("button");
        toggleButton.textContent = isHiddenView
          ? "Show Full League"
          : "Show Paid League";
        toggleButton.onclick = () => {
          // This line renders the table
          renderTable(
            isHiddenView
              ? leagueData.standings.results
              : filteredAndReRankedTeams,
            !isHiddenView
          );

          // Your separate function call goes here, conditioned on the new state
          if (!isHiddenView) {
            const payoutStructure = document.createElement("div");
            payoutStructure.className = "card";

            payoutStructure.innerHTML = `
  <h2>Payout Structure</h2>
  <div><h3>Monthly Prizes</h3>
<p>Paid out at the end of the season</p>
  </div>
  
  <ul>
    <li>RM50 × 8 months = <strong>RM400</strong></li>
  </ul>
  <h3>End of Season</h3>
  <ul>
    <li class="key">1st Place: RM600</li>
    <li class="key">2nd Place: RM300</li>
    <li class="key">3rd Place: RM100</li>
    <li>Cup Winner: RM300</li>
  </ul>
  <h3>Total Pot</h3>
  <p><strong>RM1,700</strong></p>
`;

            screenDiv.appendChild(payoutStructure);
          }
        };
        tableContainer.appendChild(toggleButton);

        const table = document.createElement("table");
        table.className = "league-table";
        table.innerHTML = `
      <thead>
        <tr>
          <th></th>
          <th>Team</th>
          <th>Event Total</th>
          <th>Total Points</th>
        </tr>
      </thead>
 <tbody>
 ${teams
   .map((team, index) => {
     // Determine if the 'is-paid' class should be added
     const isPaid = isHiddenView && index < 3;
     const rowClass = isPaid ? "is-paid" : "";

     return `
 <tr class="${rowClass}">
 <td>${team.rank}</td>
 <td><strong>${team.player_name}</strong><br> ${team.entry_name}</td>
<td>${team.event_total}</td>
 <td>${team.total}</td>
 </tr>
 `;
   })
   .join("")}
 </tbody>
    `;

        tableContainer.appendChild(table);
        screenDiv.appendChild(tableContainer);
      };

      // Render the initial view showing all teams
      renderTable(leagueData.standings.results, false);
      endLoader();
    }
  } catch (error) {
    console.error("ERROR");
    const screenDiv = document.getElementById("screen");
    screenDiv.innerHTML = `<h2>Failed to load</h2>`;
    endLoader();
  }

  // IDs of the teams you want to KEEP when toggled ie: Paid entries only
  const teamsToKeep = [
    "23745637",
    "59392628",
    "40237933",
    "43139140",
    "40248422",
    "36653856",
    "43138959",
    "43631917",
    "52421611",
    "55865016",
    "56328339",
    "56543395",
    "57275835",
    "70271347",
    "73314948",
    "5270716",
    "9670559",
  ];

  // Call the function to display the initial table
  displayLeagueTableWithToggle(teamsToKeep);
}

runOnLoad(leagueID);


