// App.js

import * as React from "react";
import { useContext, useState } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useTheme,
} from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";


// Import your custom style and theme objects
import { lightTheme, darkTheme } from "./styles";
import HomeScreen from "./screens/HomeScreen";
import { WordGuessScreen } from "./screens/WordGuessScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { MyTeamScreen } from "./screens/MyTeamScreen";
import { TeamProvider, TeamContext } from "./contexts/TeamContext";
import { ThemeProvider, ThemeContext } from "./contexts/ThemeContext";
import logo from "./assets/logo.jpg"; // 👈 Import your logo

const Drawer = createDrawerNavigator();

// Merge default React Navigation themes with your custom themes
const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...lightTheme.colors,
  },
};

const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...darkTheme.colors,
  },
};

function CustomDrawerContent(props) {
  const { colors } = useTheme();
  const {
    teamID,
    managerLeagues,
    setTeamID,
    resetTeamID,
    selectedLeague,
    setSelectedLeague, // 👈 from context
    error,
    loading,
  } = useContext(TeamContext);
  const [inputValue, setInputValue] = useState(teamID ? String(teamID) : "");

  const currentLeague = managerLeagues?.classic.find(
    (league) => league.id === selectedLeague
  );

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, backgroundColor: colors.background }}
    >
      <View
        style={[localStyles.drawerHeader, { backgroundColor: "transparrent" }]}
      >
        <Image
          source={logo}
          style={localStyles.logo}
          resizeMode="contain" // Keeps the image's aspect ratio
        />
      </View>
      {/* Top items */}
      <View style={{ flex: 1 }}>
        <DrawerItemList
          {...props}
          activeTintColor={colors.primary}
          inactiveTintColor={colors.onBackground}
        />
      </View>

      {/* Bottom section */}
      <View
        style={[localStyles.bottomSection, { borderTopColor: colors.outline }]}
      >
        <View
          style={[
            localStyles.bottomSection,
            { borderTopColor: colors.outline },
          ]}
        >
          <Text style={{ marginLeft: 10, color: colors.onSurface }}>
            Current Team: {teamID}
          </Text>

          <Text style={{ marginLeft: 10, color: colors.onSurface }}>
            Current League:{" "}
            {currentLeague ? currentLeague.name : "None selected"}
          </Text>
        </View>
      </View>
      <View
        style={[localStyles.bottomSection, { borderTopColor: colors.outline }]}
      >
        <View
          style={[localStyles.divider, { backgroundColor: colors.outline }]}
        />

        <DrawerItem
          label={() => (
            <View style={localStyles.itemLabel}>
              <Text style={{ fontSize: 18, color: colors.onSurface }}>⚙️</Text>
              <Text style={{ marginLeft: 10, color: colors.onSurface }}>
                Settings
              </Text>
            </View>
          )}
          onPress={() => props.navigation.navigate("Settings")}
          icon={() => null}
        />
      </View>
    </DrawerContentScrollView>
  );
}

export default function App() {

  
 
  return (
    <ThemeProvider>
      <TeamProvider>
        <ThemedNavigation />
      </TeamProvider>
    </ThemeProvider>
  );
}

function ThemedNavigation() {
  const { effectiveTheme } = useContext(ThemeContext);

  return (
    <NavigationContainer
      theme={effectiveTheme === "dark" ? MyDarkTheme : MyLightTheme}
    >
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="home"
          component={HomeScreen}
          options={{ title: "Home" }}
        />
        <Drawer.Screen
          name="MyTeam"
          component={MyTeamScreen}
          options={{ title: "My Team" }}
        />

        <Drawer.Screen
          name="WordGuess"
          component={WordGuessScreen}
          options={{ title: "Word Guess" }}
        />

        <Drawer.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ drawerItemStyle: { display: "none" } }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const localStyles = StyleSheet.create({
  bottomSection: {
    paddingBottom: 20,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  itemLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 80, // You can adjust this width
    height: 80, // You can adjust this height
    borderRadius: 100,
    backgroundColor: "transparent",
    marginBottom: 10,
  },
});
