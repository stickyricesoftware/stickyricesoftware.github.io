// CrosswordScreen.js
import React, { useState , useContext} from "react";
import { styles } from "../styles";

import { TeamContext } from "../contexts/TeamContext";

import {
  View,
  Button,
  Text,
  TextInput,
  TouchableOpacity,

  ActivityIndicator,

} from "react-native";


export function MyTeamScreen() {
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { teamID, managerLeagues } = useContext(TeamContext);

  async function checkGuess() {
    const word = guess.trim().toLowerCase();
    if (!word) return;

    setLoading(true);
    setMessage("");
    
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) {
        setMessage("❌ Not a valid English word!");
      } else {
        const data = await response.json();
        // You can implement logic here to check if this is the "secret" word
        // For now, just accept any valid word
        setMessage("✅ Valid word!");
      }
    } catch (error) {
      setMessage("⚠️ Something went wrong. Try again!");
    }

    setGuess("");
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Word Guess</Text>
 <Text style={styles.title}>{teamID}</Text>

      <TextInput
        style={styles.input}
        value={guess}
        onChangeText={setGuess}
        placeholder="Enter your guess"
        autoCapitalize="characters"
      />

      <TouchableOpacity style={styles.button} onPress={checkGuess}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#EE5454" style={{ marginTop: 15 }} />}
      {message ? <Text style={[styles.message, { marginTop: 15 }]}>{message}</Text> : null}
    </View>
  );
}

