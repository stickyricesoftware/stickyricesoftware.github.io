import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Pressable,
  Modal,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";

import { TeamContext } from "../contexts/TeamContext";
import { ThemeContext } from "../contexts/ThemeContext";
import ErrorModal from "../components/ErrorModal";

export default function SettingsScreen() {
  const {
    teamID,
    managerLeagues,
    setTeamID,
    resetTeamID,
    selectedLeague,
    setSelectedLeague,
    error,
    loading,
  } = useContext(TeamContext);

  const [inputValue, setInputValue] = useState(teamID ? String(teamID) : "");
  const [isFocused, setIsFocused] = useState(false);

  const { theme, changeTheme } = useContext(ThemeContext);
  const { colors } = useTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const [leagueModalVisible, setLeagueModalVisible] = useState(false);

  const showModal = (message, title = "Notice") => {
    setModalMessage(message);
    setModalTitle(title);
    setModalVisible(true);
  };

  const saveTeamIDHandler = async () => {
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

  const selectLeague = async (league) => {
    if (!league) {
      setSelectedLeague(null);
      await AsyncStorage.removeItem("@leagueID");
    } else {
      setSelectedLeague(league);
      await AsyncStorage.setItem("@leagueID", league.id.toString());
    }
    setLeagueModalVisible(false);
  };

  return (
    <View className="flex-1 p-4 bg-white dark:bg-black">
      {/* Team ID */}
      <Text className="text-base font-medium text-gray-800 dark:text-gray-200 mb-2">
        Enter Team ID:
      </Text>
      <TextInput
        className={`border rounded-lg p-3 text-base ${
          isFocused ? "border-blue-500" : "border-gray-300"
        } text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800`}
        value={inputValue}
        onChangeText={setInputValue}
        keyboardType="numeric"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Team ID"
        placeholderTextColor={colors.onSurfaceVariant}
      />

      {/* Loading / Buttons */}
      {loading ? (
        <View className="flex-row justify-center my-4">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <View className="flex-row space-x-4 mt-4">
          <Pressable
            onPress={saveTeamIDHandler}
            className="bg-blue-600 rounded-lg px-4 py-2 flex-1"
          >
            <Text className="text-white text-center font-medium">Save Team ID</Text>
          </Pressable>
          <Pressable
            onPress={handleReset}
            className="bg-gray-300 dark:bg-gray-700 rounded-lg px-4 py-2 flex-1"
          >
            <Text className="text-gray-800 dark:text-gray-200 text-center font-medium">
              Reset Team ID
            </Text>
          </Pressable>
        </View>
      )}

      {/* Styled League Picker */}
      {managerLeagues?.classic?.length > 0 && (
        <View className="mt-6">
          <Text className="text-base font-medium text-gray-800 dark:text-gray-200 mb-2">
            Change League:
          </Text>

          <Pressable
            onPress={() => setLeagueModalVisible(true)}
            className="border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 px-4 py-3"
          >
            <Text className="text-gray-900 dark:text-gray-100">
              {selectedLeague?.name || "Select League"}
            </Text>
          </Pressable>

          <Modal
            visible={leagueModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setLeagueModalVisible(false)}
          >
            <View className="flex-1 justify-center bg-black/50 px-4">
              <View className="bg-white dark:bg-gray-900 rounded-lg max-h-80 overflow-hidden">
                <FlatList
                  data={[null, ...managerLeagues.classic]}
                  keyExtractor={(item) => (item?.id ?? "none").toString()}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() =>
                        selectLeague(item ? { id: item.id, name: item.name } : null)
                      }
                      className="px-4 py-3 border-b border-gray-200 dark:border-gray-700"
                    >
                      <Text className="text-gray-900 dark:text-gray-100">
                        {item ? item.name : "Clear Selection"}
                      </Text>
                    </Pressable>
                  )}
                />
                <Pressable
                  onPress={() => setLeagueModalVisible(false)}
                  className="px-4 py-3 bg-gray-200 dark:bg-gray-800"
                >
                  <Text className="text-center text-gray-800 dark:text-gray-200 font-medium">
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      )}

      {/* Theme Buttons */}
      <Text className="text-base font-medium text-gray-800 dark:text-gray-200 mt-6 mb-2">
        Theme:
      </Text>
      <View className="flex-row justify-around">
        {["light", "dark", "system"].map((t) => (
          <Pressable
            key={t}
            onPress={() => changeTheme(t)}
            className={`px-4 py-2 rounded-lg ${
              theme === t ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                theme === t ? "text-white" : "text-gray-800 dark:text-gray-200"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Error Modal */}
      <ErrorModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
