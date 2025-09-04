import React from "react";
import { View, Text, FlatList, TouchableOpacity, } from "react-native";
import { styles } from "../styles";

const games = [
  { id: "1", name: "Word Guess", screen: "WordGuess" },
  { id: "2", name: "Anagram Shuffle", screen: "Anagram" },
  { id: "3", name: "Daily Crossword", screen: "Crossword" },

];

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Just Word Games </Text> */}
      <FlatList
        data={games}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}



