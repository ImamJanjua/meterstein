import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { WebView } from "react-native-webview";

const Abnahme = () => {
    // For web platform, use iframe instead of WebView
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <iframe
          src="https://meterstein.de/starscreen.pdf"
          style={styles.webview}
          title="senkrecht"
          allowFullScreen
        />
      </View>
    );
  }

  // For native platforms, use WebView
  return (
    <View style={styles.container}>
      <WebView
        source={{
          uri: "https://meterstein.de/starscreen.pdf",
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
    width: "100%",
    height: "100%",
  },
});

export default Abnahme;
