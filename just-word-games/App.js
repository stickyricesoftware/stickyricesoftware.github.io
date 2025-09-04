import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { styles } from "./styles";

import HomeScreen from "./screens/HomeScreen";
import {  AnagramScreen } from "./screens/GameScreens";
import { CrosswordScreen } from "./screens/CrosswordScreen";
import { WordGuessScreen } from "./screens/WordGuessScreen";


const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator

      >
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Home" }}
        />
        <Drawer.Screen
          name="WordGuess"
          component={WordGuessScreen}
          options={{ title: "Word Guess" }}
        />
        <Drawer.Screen
          name="Anagram"
          component={AnagramScreen}
          options={{ title: "Anagrams" }}
        />
        <Drawer.Screen
          name="Crossword"
          component={CrosswordScreen}
          options={{ title: "Crossword Fun" }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
