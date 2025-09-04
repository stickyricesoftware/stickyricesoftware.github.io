// styles.js
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000000",
    marginVertical: 20,
  },
  list: {
    alignItems: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 2,
    borderColor: "#FFC510",
  },
  cardIconContainer: {
    backgroundColor: "#F6DB35",
    padding: 15,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#EE5454",
  },
  cardText: {
    color: "#959595",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#FFC510",
    borderWidth: 2,
    borderColor: "#EE5454",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: "#000000",
    fontWeight: "bold",
    textAlign: "center",
  },

});