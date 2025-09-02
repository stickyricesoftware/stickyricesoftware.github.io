import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { styles } from "../styles"; // Import your new style sheet
import { TeamContext } from "../contexts/TeamContext";
import ErrorModal from "../components/ErrorModal";
import { ThemeContext } from "../contexts/ThemeContext";
import { Picker } from "@react-native-picker/picker";

export default function SettingsScreen() {
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
  const [isFocused, setIsFocused] = useState(false); // To handle input focus style

  const { theme, effectiveTheme, changeTheme } = useContext(ThemeContext);
  const { colors } = useTheme(); // Access the colors from the active theme

  // modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const showModal = (message, title = "Notice") => {
    setModalMessage(message);
    setModalTitle(title);
    setModalVisible(true);
  };

  const saveTeamID = async () => {
    const id = parseInt(inputValue, 10);

    if (isNaN(id)) {
      showModal("Please enter a valid number", "Error");
      return;
    }

    const success = await setTeamID(id);

    if (success) {
      showModal(`Team ID set to ${id}`, "Success");
    } else {
      showModal(error || "Invalid Team ID", "Error");
    }
  };

  const handleReset = async () => {
    await resetTeamID();
    setInputValue("");
    showModal("Team ID has been cleared", "Reset");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[localStyles.label, { color: colors.onBackground }]}>
        Enter Team ID:
      </Text>
      <TextInput
        style={[styles.input, isFocused && styles.inputFocused]}
        value={inputValue}
        onChangeText={setInputValue}
        keyboardType="numeric"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor={colors.onSurfaceVariant} // Use a theme color for placeholder
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginVertical: 10 }}
        />
      ) : (
        <>
          {/* Primary Button */}
          <Pressable onPress={saveTeamID} style={styles.button}>
            <Text style={styles.buttonText}>Save Team ID</Text>
          </Pressable>

          {/* Secondary Button */}
          <Pressable onPress={handleReset} style={styles.buttonSecondary}>
            <Text style={styles.buttonSecondaryText}>Reset Team ID</Text>
          </Pressable>
        </>
      )}

      {/* Dropdown for leagues */}
      {managerLeagues?.classic?.length > 0 && (
        <>
          <Text
            style={[
              localStyles.label,
              { marginTop: 20, color: colors.onBackground },
            ]}
          >
            Select a League:
          </Text>

          <Picker
            selectedValue={selectedLeague}
            onValueChange={(value) => setSelectedLeague(value)}
            style={[localStyles.dropdown, { color: colors.onBackground }]} // 👈 combine theme + local
            dropdownIconColor={colors.onBackground} // 👈 makes the chevron match theme
          >
            <Picker.Item label="-- Choose League --" value={null} />
            {managerLeagues.classic.map((league) => (
              <Picker.Item
                key={league.id}
                label={league.name}
                value={league.id}
                color={colors.onBackground} // 👈 ensures items also respect theme
              />
            ))}
          </Picker>

          {selectedLeague && (
            <Text style={{ color: colors.onBackground, marginTop: 10 }}>
              ✅ Selected League:{" "}
              {
                managerLeagues?.classic?.find(
                  (league) => league.id === selectedLeague
                )?.name
              }
            </Text>
          )}
        </>
      )}

      {/* Theme Options */}
      <Text
        style={[
          localStyles.label,
          { marginTop: 20, color: colors.onBackground },
        ]}
      >
        Theme:
      </Text>
      <View style={localStyles.themeButtonsContainer}>
        <Pressable
          onPress={() => changeTheme("light")}
          style={[
            styles.button,
            {
              backgroundColor:
                theme === "light" ? colors.primary : colors.surfaceVariant,
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color:
                  theme === "light"
                    ? colors.onPrimary
                    : colors.onSurfaceVariant,
              },
            ]}
          >
            Light
          </Text>
        </Pressable>

        <Pressable
          onPress={() => changeTheme("dark")}
          style={[
            styles.button,
            {
              backgroundColor:
                theme === "dark" ? colors.primary : colors.surfaceVariant,
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color:
                  theme === "dark" ? colors.onPrimary : colors.onSurfaceVariant,
              },
            ]}
          >
            Dark
          </Text>
        </Pressable>

        <Pressable
          onPress={() => changeTheme("system")}
          style={[
            styles.button,
            {
              backgroundColor:
                theme === "system" ? colors.primary : colors.surfaceVariant,
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color:
                  theme === "system"
                    ? colors.onPrimary
                    : colors.onSurfaceVariant,
              },
            ]}
          >
            System
          </Text>
        </Pressable>
      </View>

      {/* Error Modal Integration */}
      <ErrorModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "500", // Medium weight for MD3 labels
    marginBottom: 6,
    letterSpacing: 0.15, // MD3 body/label spacing
    color: "#49454F", // Neutral on-surface-variant tone
  },
  themeButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly", // more balanced spacing than space-around
    alignItems: "center",
    width: "100%",
    marginTop: 12,
    paddingHorizontal: 4, // subtle padding for breathing room
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#CAC4D0", // outline variant
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "#FFFBFE", // surface container low
    color: "#1C1B1F", // on-surface
  },
  placeholder: {
    fontSize: 16,
    color: "#49454F", // on-surface-variant
  },
  selectedText: {
    fontSize: 16,
    color: "#1C1B1F", // on-surface
    fontWeight: "500",
  },
  icon: {
    tintColor: "#49454F", // dropdown arrow
    marginRight: 8,
  },
  dropdownMenu: {
    borderRadius: 12,
    backgroundColor: "#FFFBFE", // surface container
    elevation: 3, // MD3 shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    marginTop: 4,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#1C1B1F",
  },
});
