import React, { useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";

const Abnahme = () => {
  const pdfUrl = "https://www.meterstein.de/app/montageanleitungen/montageanleitung-Cabrio-Line-compact.pdf";

  useEffect(() => {
    // Öffne in neuem Tab
    window.open(pdfUrl, "_blank");
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
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
  },
});

export default Abnahme;
