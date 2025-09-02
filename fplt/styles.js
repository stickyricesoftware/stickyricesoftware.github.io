// styles.js

import { StyleSheet } from "react-native";

// Material Design 3 (Material You) Color Tokens
const primary = "#6750A4"; // A default M3 primary color
const onPrimary = "#FFFFFF";
const primaryContainer = "#EADDFF";
const onPrimaryContainer = "#21005D";

const secondary = "#625B71";
const onSecondary = "#FFFFFF";
const secondaryContainer = "#E8DEF8";
const onSecondaryContainer = "#1D192B";

const tertiary = "#7D5260";
const onTertiary = "#FFFFFF";
const tertiaryContainer = "#FFD8E4";
const onTertiaryContainer = "#31111D";

const surface = "#FFFBFE";
const onSurface = "#1C1B1F";
const surfaceVariant = "#E7E0EC";
const onSurfaceVariant = "#49454F";

const background = "#FFFBFE";
const onBackground = "#1C1B1F";

const outline = "#79747E";

// Default M3 typography scale values
const titleLarge = {
  fontSize: 22,
  lineHeight: 28,
  letterSpacing: 0,
};

const bodyLarge = {
  fontSize: 16,
  lineHeight: 24,
  letterSpacing: 0.5,
};

const labelLarge = {
  fontSize: 14,
  lineHeight: 20,
  letterSpacing: 0.1,
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: background,
  },

  title: {
    ...titleLarge,
    fontWeight: "bold",
    textAlign: "center",
    color: onBackground,
    marginVertical: 20,
  },

  list: {
    alignItems: "center",
  },

  card: {
    backgroundColor: surface,
    padding: 20,
    borderRadius: 16, // Larger, more rounded corners
    marginBottom: 15,
    width: "90%",
    alignItems: "center",
    // Subtle elevation, often a slight shadow or different background color
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 1,
    borderColor: surfaceVariant,
  },

  cardIconContainer: {
    backgroundColor: primaryContainer,
    padding: 15,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 0, // No border in M3
  },

  cardText: {
    ...bodyLarge,
    color: onSurface,
    textAlign: "center",
  },

  // Primary button (Elevated button)
  button: {
    backgroundColor: primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20, // More rounded, pill-like shape
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },

  buttonText: {
    ...labelLarge,
    color: onPrimary,
    fontWeight: "bold",
    textAlign: "center",
  },

  // Secondary button (Outlined button)
  buttonSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: outline,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 10,
  },

  buttonSecondaryText: {
    ...labelLarge,
    color: primary,
    fontWeight: "bold",
    textAlign: "center",
  },

  // Input fields (Filled text field)
  input: {
    width: "100%",
    backgroundColor: surfaceVariant,
    borderWidth: 0,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    ...bodyLarge,
    color: onSurface,
    marginVertical: 10,
  },

  inputFocused: {
    backgroundColor: surfaceVariant,
    borderWidth: 1,
    borderColor: primary,
  },
});

// A more complete Material Design 3 color theme object
// This is the structure you'd use with a library like react-native-paper's
// M3 theming.
export const lightTheme = {
  colors: {
    primary: primary,
    onPrimary: onPrimary,
    primaryContainer: primaryContainer,
    onPrimaryContainer: onPrimaryContainer,
    secondary: secondary,
    onSecondary: onSecondary,
    secondaryContainer: secondaryContainer,
    onSecondaryContainer: onSecondaryContainer,
    tertiary: tertiary,
    onTertiary: onTertiary,
    tertiaryContainer: tertiaryContainer,
    onTertiaryContainer: onTertiaryContainer,
    error: "#B3261E",
    onError: "#FFFFFF",
    errorContainer: "#F9DEDC",
    onErrorContainer: "#410E0B",
    background: background,
    onBackground: onBackground,
    surface: surface,
    onSurface: onSurface,
    surfaceVariant: surfaceVariant,
    onSurfaceVariant: onSurfaceVariant,
    outline: outline,
    shadow: "#000000",
    inverseSurface: "#313033",
    inverseOnSurface: "#F4EFF4",
    inversePrimary: "#D0BCFF",
  },
};

export const darkTheme = {
  colors: {
    primary: "#D0BCFF",
    onPrimary: "#381E72",
    primaryContainer: "#4F378B",
    onPrimaryContainer: "#EADDFF",
    secondary: "#CCC2DC",
    onSecondary: "#332D41",
    secondaryContainer: "#4A4458",
    onSecondaryContainer: "#E8DEF8",
    tertiary: "#EFB8C8",
    onTertiary: "#492532",
    tertiaryContainer: "#633B48",
    onTertiaryContainer: "#FFD8E4",
    error: "#F2B8B5",
    onError: "#601410",
    errorContainer: "#8C1D18",
    onErrorContainer: "#F9DEDC",
    background: "#1C1B1F",
    onBackground: "#E6E1E5",
    surface: "#1C1B1F",
    onSurface: "#E6E1E5",
    surfaceVariant: "#49454F",
    onSurfaceVariant: "#CAC4D0",
    outline: "#938F99",
    shadow: "#000000",
    inverseSurface: "#E6E1E5",
    inverseOnSurface: "#313033",
    inversePrimary: "#6750A4",
  },
};