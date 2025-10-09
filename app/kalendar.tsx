import React, { useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Text } from "~/components/ui/text";

const Kalendar = () => {
  useEffect(() => {
    // Redirect immediately to Google Calendar login
    window.open("https://calendar.google.com/calendar/u/0/r", "_blank");
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.text}>Kalender wird geöffnet...</Text>
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
  text: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },
});

export default Kalendar;
