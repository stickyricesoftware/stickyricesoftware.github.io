import React from "react";
import { useContext } from "react";
import { TeamContext } from "../contexts/TeamContext";
import { View, Text, FlatList, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { styles } from "../styles";
import  useBootstrap  from "../useBootstrap";
import { ThemeContext } from "../contexts/ThemeContext";
import StoriesBar from "../components/BlogArticles";


  // let features = [
  //   {
  //     icon: "bi-person-badge",
  //     label: "My Team",
  //     action: showMyTeam,
  //     tier: "free",
  //     requiresData: true,
  //   },
  //   {
  //     icon: "bi-bar-chart",
  //     label: "GW Stats",
  //     action: showGameweekStats,
  //     tier: "free",
  //     requiresData: true,
  //   },
  //   {
  //     icon: "bi-boxes",
  //     label: "Chip Usage",
  //     action: showChipUsage,
  //     tier: "free",
  //     requiresData: true,
  //   },
  //   {
  //     icon: "bi-binoculars",
  //     label: "Rival Comparison",
  //     action: showRivalDiff,
  //     tier: "free",
  //     requiresData: true,
  //   },
  //   {
  //     icon: "bi-award",
  //     label: "Season Summary",
  //     action: showMySeasonSummary,
  //     tier: "free",
  //     requiresData: true,
  //   },
  //   {
  //     icon: "bi-arrow-repeat",
  //     label: "GW Transfer Summaries",
  //     action: showTransferSummaries,
  //     tier: "free",
  //     requiresData: true,
  //   },
  //   {
  //     icon: "bi-emoji-smile",
  //     label: "GW Memes",
  //     action: showMemes,
  //     tier: "free",
  //     requiresData: true,
  //   },
  //   {
  //     icon: "bi-person-badge",
  //     label: "Team Name Generator",
  //     action: generateTeamName,
  //     tier: "free",
  //     requiresData: false,
  //   },
  //   {
  //     icon: "bi-people",
  //     label: "Benched Points League",
  //     action: showBenchedPointsLeague,
  //     tier: "pro",
  //     requiresData: true,
  //   },
  //   {
  //     icon: "bi-trophy",
  //     label: "Captaincy Points League",
  //     action: showCaptaincyPointsLeague,
  //     tier: "pro",
  //     requiresData: true,
  //   },
  //   {
  //     icon: "bi-exclamation-triangle",
  //     label: "Cards League",
  //     action: showCardsLeague,
  //     tier: "pro",
  //     requiresData: true,
  //   },
  //   {
  //     icon: "bi-shield-check",
  //     label: "Golden Boot League",
  //     action: showGoldenbootLeague,
  //     tier: "pro",
  //     requiresData: true,
  //   },
  //   // {
  //   //   icon: "bi-bullseye",
  //   //   label: "Penalities Missed League",
  //   //   action: showPensMissedLeague,
  //   //   tier: "pro",
  //   //   requiresData: true,
  //   // },
  //   {
  //     icon: "bi-house-lock",
  //     label: "Defcon League",
  //     action: showDefconLeague,
  //     tier: "pro",
  //     requiresData: true,
  //   },
  //   {
  //     icon: "bi-calculator",
  //     label: "Rivals Transfer Calculator",
  //     action: showTransferCalculator,
  //     tier: "pro",
  //     requiresData: true,
  //   },
  //   {
  //     icon: "bi-cash-coin",
  //     label: "Team Value League",
  //     action: showTeamValueLeague,
  //     tier: "pro",
  //     requiresData: true,
  //   },
  //   {
  //     icon: "bi-person-check",
  //     label: "Download My Season",
  //     action: downloadMySeason,
  //     tier: "pro",
  //     requiresData: true,
  //   },
  //   {
  //     icon: "bi-person-check",
  //     label: "Catch A Copycat",
  //     action: showCopycatFinder,
  //     tier: "pro",
  //     requiresData: true,
  //   },
  //   {
  //     icon: "bi-graph-up-arrow",
  //     label: "Season Stats",
  //     action: showSeasonStats,
  //     tier: "pro",
  //     requiresData: true,
  //   },
  //   {
  //     icon: "bi-bag-plus",
  //     label: "Feature Request",
  //     action: featureRequest,
  //     tier: "pro",
  //     requiresData: false,
  //   },
  //   {
  //     icon: "bi-person-fill-dash",
  //     label: "Last Man Standing",
  //     action: showLastManStandingEliminations,
  //     tier: "max",
  //     requiresData: true,
  //   },

  //   {
  //     icon: "bi-speedometer2",
  //     label: "GW Max Dashboard  <br> Coming Soon",
  //     action: createGWMaxDashboard,
  //     tier: "max",
  //     requiresData: true,
  //   },
  //   {
  //     icon: "bi-speedometer2",
  //     label: "Season Max Dashboard",
  //     action: createSeasonMaxDashboard,
  //     tier: "max",
  //     requiresData: true,
  //   },
  //   {
  //     icon: "bi-cash-coin",
  //     label: "Mini League Admin",
  //     action: miniLeagueAdmin,
  //     tier: "max",
  //     requiresData: true,
  //   },
  // ];
const games = [
  { id: "1", name: "Word Guess", screen: "WordGuess" },
  { id: "2", name: "My Team", screen: "MyTeam" }


];


export default function HomeScreen({ navigation }) {
  const { bootstrap, currentGw, nextGw } = useBootstrap();

  const { effectiveTheme } = useContext(ThemeContext); // ✅ get theme

  const isDark = effectiveTheme === "dark";

  return (
    
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: isDark ? "#121212" : "#FFF" }}>
 <StoriesBar />
      {/* Games list */}
      <View style={styles.container}>
              {/* Place the StoriesBar component here */}
        <FlatList
          data={games}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                { backgroundColor: isDark ? "#333" : "#EEE" }
              ]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Text style={{ color: isDark ? "#FFF" : "#000" }}>{item.name}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.list}
        />
      </View>

      {/* GW Info */}
      <View style={{ marginTop: 20, alignItems: "center" }}>
        {!bootstrap ? (
          <>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={{ marginTop: 10, color: isDark ? "#FFF" : "#000" }}>Loading GW info...</Text>
          </>
        ) : (
          <>
            <Text style={{ color: isDark ? "#FFF" : "#000" }}>Current GW: {currentGw}</Text>
            <Text style={{ color: isDark ? "#FFF" : "#000" }}>Next GW: {nextGw}</Text>
            <Text style={{ color: isDark ? "#FFF" : "#000" }}>
              Total Players: {bootstrap.elements.length}
            </Text>
          </>
        )}
      </View>
    </ScrollView>
  );
}



