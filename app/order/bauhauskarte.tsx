import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import React from "react";
import { Text } from "~/components/ui/text";

const Bauhauskarte = () => {
  // Image zoom state
  const [isImageModalVisible, setIsImageModalVisible] = React.useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      style={{ flex: 1 }}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="gap-8 p-4 bg-background/30">
          {/* Product Image */}
          <TouchableOpacity
            onPress={() => setIsImageModalVisible(true)}
            activeOpacity={0.8}
          >
            <Image
              source={require("~/assets/images/bauhauskarte.webp")}
              contentFit="contain"
              cachePolicy="memory-disk"
              transition={200}
              style={{
                width: "100%",
                height: 600,
              }}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Image Zoom Modal */}
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsImageModalVisible(false)}
      >
        <View className="flex-1 bg-black/90">
          {/* Image Container */}
          <View className="flex-1 justify-center items-center">
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setIsImageModalVisible(false)}
              className="absolute top-20 w-14 h-14 right-8 items-center justify-center z-20 bg-red-500 rounded-full p-2 shadow-lg"
              activeOpacity={0.7}
            >
              <Text className="text-white text-xl font-bold">✕</Text>
            </TouchableOpacity>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              maximumZoomScale={3.0}
              minimumZoomScale={1.0}
              contentContainerStyle={{
                alignItems: "center",
                justifyContent: "center",
              }}
              style={{ flex: 1 }}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                maximumZoomScale={3.0}
                minimumZoomScale={1.0}
                contentContainerStyle={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
                style={{ flex: 1 }}
              >
                <Image
                  source={require("~/assets/images/bauhauskarte.webp")}
                  contentFit="contain"
                  cachePolicy="memory-disk"
                  transition={200}
                  style={{
                    width: Dimensions.get("window").width * 0.85,
                    height: Dimensions.get("window").height * 0.8,
                  }}
                />
              </ScrollView>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default Bauhauskarte;
