// contexts/ThemeContext.js
import React, { createContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState("system"); // default

  useEffect(() => {
    (async () => {
      const storedTheme = await AsyncStorage.getItem("appTheme");
      if (storedTheme) setTheme(storedTheme);
    })();
  }, []);

  const changeTheme = async (newTheme) => {
    setTheme(newTheme);
    await AsyncStorage.setItem("appTheme", newTheme);
  };

  // effective theme: resolve "system" to actual device theme
  const effectiveTheme = theme === "system" ? systemScheme : theme;

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
