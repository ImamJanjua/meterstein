import React from "react";
import { View, StyleSheet, Platform, Dimensions } from "react-native";
import { WebView } from "react-native-webview";


const Abnahme = () => {
  const [screenData, setScreenData] = React.useState(Dimensions.get('window'));
  
  // Listen for screen size changes
  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(window);
    });
    return () => subscription?.remove();
  }, []);

  const pdfUrl = "https://meterstein.de/starscreen.pdf";
  const isMobile = screenData.width < 768;

  // For web platform, use iframe with mobile-optimized settings
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <iframe
          src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH&zoom=page-width`}
          style={styles.webview}
          title="senkrecht"
          allowFullScreen
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </View>
    );
  }

  // For native platforms, use WebView
  return (
    <View style={styles.container}>
      <WebView
        source={{
          uri: pdfUrl,
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
