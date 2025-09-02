export const BASE_URL =
  "https://api.codetabs.com/v1/proxy?quest=http://fantasy.premierleague.com/api/";


// export const BASE_URL =
//   "http://fantasy.premierleague.com/api/";
  
const testMode = false;
const bootstrapTest = {}; // your test data


// Optional delay simulation for testing
const addDelaySimulationTime = 1000;

// Mock test data (optional)
const managerDataTest = {
  name: "Test Manager",
  summary_overall_points: 1234,
  leagues: {
    classic: [],
  },
};