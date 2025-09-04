import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { WebView } from "react-native-webview";

const EMAIL = "info@meterstein.de";

const Kalendar = () => {
  // For web platform, use iframe
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <iframe
          src={`https://calendar.google.com/calendar/embed?src=${EMAIL}&ctz=Europe%2FBerlin`}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            borderRadius: "8px",
          }}
          title="Google Calendar"
        />
      </View>
    );
  }

  // For mobile platforms, use WebView
  return (
    <View style={styles.container}>
      <WebView
        source={{
          uri: "https://calendar.google.com",
        }}
        style={styles.webview}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default Kalendar;
