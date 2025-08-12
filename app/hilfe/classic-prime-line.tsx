import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const Abnahme = () => {
  return (
    <View style={styles.container}>
      <WebView
        source={{
          uri: "https://www.meterstein.de/app/montageanleitungen/montageanleitung-Classic-Prime.pdf",
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
