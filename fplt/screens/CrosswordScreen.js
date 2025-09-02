// CrosswordScreen.js
import React, { useState } from "react";
import { styles } from "../styles";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";

export function CrosswordScreen() {
  // 5x5 crossword grid (predefined words)
  const initialGrid = [
    ["C", "A", "T", "", ""],
    ["", "", "R", "", ""],
    ["D", "O", "G", "", ""],
    ["", "", "", "B", "A"],
    ["", "", "", "L", "L"],
  ];

  // User input grid (initially empty)
  const [userGrid, setUserGrid] = useState(
    Array(5)
      .fill(null)
      .map(() => Array(5).fill(""))
  );

  // Handle user input
  const handleChange = (row, col, value) => {
    const newGrid = userGrid.map((r) => [...r]);
    newGrid[row][col] = value.toUpperCase().slice(-1); // only one letter
    setUserGrid(newGrid);
  };

  // Check answers
  const checkAnswers = () => {
    let correct = true;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (initialGrid[i][j] !== "" && initialGrid[i][j] !== userGrid[i][j]) {
          correct = false;
        }
      }
    }
    Alert.alert(correct ? "✅ Correct!" : "❌ Keep trying!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Crossword</Text>

      <View style={styles.grid}>
        {initialGrid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <TextInput
                key={colIndex}
                style={[styles.cell, cell === "" && styles.emptyCell]}
                value={userGrid[rowIndex][colIndex]}
                onChangeText={(text) => handleChange(rowIndex, colIndex, text)}
                maxLength={1}
                editable={cell !== ""} // only editable if part of a word
              />
            ))}
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={checkAnswers}>
        <Text style={styles.buttonText}>Check Answers</Text>
      </TouchableOpacity>
    </View>
  );
}


