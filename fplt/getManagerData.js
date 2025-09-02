import { BASE_URL, testMode, managerDataTest, addDelaySimulationTime } from "./config";


// Utility sleep function
export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fetch manager data by teamID
export async function getManagerData(teamID) {
  let managerData = null;

  if (testMode) {
    managerData = managerDataTest;
    console.log("TEST MODE - Manager Data:", managerData);

    // simulate delay
    await sleep(addDelaySimulationTime);
    return managerData;
  }

  try {
    const res = await fetch(`${BASE_URL}/entry/${teamID}`);
    const data = await res.json();
    managerData = data;

    console.log("Fetched manager data:", managerData);

    return managerData;
  } catch (error) {
    console.error("Something went wrong fetching manager data:", error);


    return null;
  }
}
