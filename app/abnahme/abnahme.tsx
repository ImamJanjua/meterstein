import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { WebView } from "react-native-webview";

const Abnahme = () => {
  const abnahmeUrl = "https://www.meterstein.de/abnahmeprotokoll/";

  // For web platform, use iframe with mobile-optimized settings
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <iframe
          src={abnahmeUrl}
          style={styles.webview}
          title="Abnahmeprotokoll"
          allowFullScreen
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
          allow="autoplay; camera; microphone; geolocation"
        />
      </View>
    );
  }

  // For native platforms, use WebView
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: "https://www.meterstein.de/abnahmeprotokoll/" }}
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
