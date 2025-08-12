import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const Abnahme = () => {
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
  },
});

export default Abnahme;
