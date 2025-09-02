import React from "react";
import { Modal, View, Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "@react-navigation/native";
import { styles } from "../styles"; // Import your new style sheet

export default function ErrorModal({ visible, title, message, onClose }) {
  const { colors } = useTheme();

  return (
    <Modal
      animationType="fade" // 'fade' is often better for modals
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[localStyles.overlay, { backgroundColor: colors.inverseSurface, opacity: 1 }]}>
        <View style={[
          localStyles.modalView,
          {
            backgroundColor: colors.surface,
            // Dynamic elevation/shadow
            shadowColor: colors.shadow,
          }
        ]}>
          <Text style={[localStyles.title, { color: colors.onSurface }]}>{title}</Text>
          <Text style={[localStyles.message, { color: colors.onSurfaceVariant }]}>{message}</Text>
          
          {/* Use your styled button */}
          <Pressable onPress={onClose} style={styles.buttonSecondary}>
            <Text style={styles.buttonSecondaryText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const localStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "80%",
    padding: 24,
    borderRadius: 24, // More rounded corners for M3 feel
    alignItems: "center",
    // Standard M3 elevation for modals (often expressed through color)
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    ...styles.title, // Inherit font styles from the title in your stylesheet
    marginBottom: 8,
  },
  message: {
    ...styles.cardText, // Inherit font styles from cardText
    marginBottom: 16,
    textAlign: "center",
  },
});