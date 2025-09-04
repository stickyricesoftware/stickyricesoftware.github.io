import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getManagerData } from "../getManagerData";

export const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const [teamID, setTeamID] = useState(null);
  const [managerData, setManagerData] = useState(null);
  const [managerLeagues, setManagerLeagues] = useState(null);
  const [selectedLeague, setSelectedLeague] = useState(null); // 👈 NEW
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);
  // Save league selection
const saveLeague = (leagueId) => {
  const leagueName = managerLeagues.classic.find(l => l.id === leagueId)?.name ?? "";
  setSelectedLeague({ id: leagueId, name: leagueName });
  AsyncStorage.setItem("@leagueID", leagueId.toString()).catch(console.error);
};


  // Validate & save Team ID (fetches manager data + leagues)
  const saveTeamID = async (id) => {
    setLoading(true);
    try {
      const data = await getManagerData(id);

      if (!data || data.detail || data.error) {
        setManagerData(null);
        setManagerLeagues(null);
        setError("❌ Invalid Team ID. Please try again.");
        return false;
      }

      await AsyncStorage.setItem("@teamID", id.toString());
      setTeamID(id);

      setManagerData(data);
      setManagerLeagues(data.leagues ?? null);
      setError(null);

      return true;
    } catch (err) {
      console.error("Error saving Team ID:", err);
      setError("⚠️ Could not fetch manager data. Try again later.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load saved Team ID + league on app start
  useEffect(() => {
    async function loadStoredData() {
      try {
        const storedID = await AsyncStorage.getItem("@teamID");
        if (storedID !== null) {
          const id = parseInt(storedID, 10);
          await saveTeamID(id);
        }

        const storedLeague = await AsyncStorage.getItem("@leagueID");
        if (storedLeague !== null) {
          setSelectedLeague(parseInt(storedLeague, 10));
        }
      } catch (err) {
        console.log("Error loading stored data:", err);
      }
    }
    loadStoredData();
  }, []);

  // Clear Team ID & league
  const resetTeamID = async () => {
    try {
      await AsyncStorage.removeItem("@teamID");
      await AsyncStorage.removeItem("@leagueID"); // 👈 clear league too
      setTeamID(null);
      setManagerData(null);
      setManagerLeagues(null);
      setSelectedLeague(null);
      setError(null);
    } catch (err) {
      console.log("Error resetting Team ID:", err);
      setError("⚠️ Could not reset Team ID.");
    }
  };

  return (
    <TeamContext.Provider
      value={{
        teamID,
        setTeamID: saveTeamID,
        resetTeamID,
        managerData,
        managerLeagues,
        selectedLeague, // 👈 expose
        setSelectedLeague: saveLeague, // 👈 expose setter
        error,
        loading,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};
