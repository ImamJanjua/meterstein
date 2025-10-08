import React, { useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

const Abnahme = () => {
  const abnahmeUrl = "https://www.meterstein.de/abnahmeprotokoll/";

  useEffect(() => {
    // Öffne direkt beim Laden in neuem Tab
    window.open(abnahmeUrl, "_blank");
  }, []);

  const openAbnahme = () => {
    // Falls User nochmal öffnen möchte
    window.open(abnahmeUrl, "_blank");
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Abnahmeprotokoll</Text>
        <Text style={styles.description}>
          Das Abnahmeprotokoll wurde in einem neuen Tab geöffnet.
        </Text>
        <TouchableOpacity style={styles.button} onPress={openAbnahme}>
          <Text style={styles.buttonText}>Erneut öffnen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  description: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: "center",
    color: "#666",
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default Abnahme;