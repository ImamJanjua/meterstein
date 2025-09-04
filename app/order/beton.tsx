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
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import * as MailComposer from "expo-mail-composer";
import { toast } from "sonner-native";
import { EMAIL_RECIPIENTS } from "~/lib/constants";

const Beton = () => {
  // Image zoom state
  const [isImageModalVisible, setIsImageModalVisible] = React.useState(false);

  // Palette
  const [palette, setPalette] = React.useState("");

  const paletteOptions = ["ja"];

  function resetForm() {
    setPalette("");
  }

  async function sendOrder() {
    // Check if mail is available
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      toast.error("E-Mail nicht verfügbar", {
        description: "E-Mail-App ist auf diesem Gerät nicht verfügbar.",
      });
      return;
    }

    const emailBody = `
Bestellung - Beton

Palette: ${palette || "Nicht ausgewählt"}

---
Gesendet über Meterstein
    `.trim();

    try {
      // Compose email
      const result = await MailComposer.composeAsync({
        recipients: EMAIL_RECIPIENTS,
        subject: `Bestellung - Beton`,
        body: emailBody,
      });

      if (result.status === MailComposer.MailComposerStatus.SENT) {
        toast.success("E-Mail gesendet", {
          description: "Die Bestellung wurde erfolgreich gesendet.",
        });
        resetForm();
      } else if (result.status === MailComposer.MailComposerStatus.CANCELLED) {
        toast("E-Mail abgebrochen", {
          description: "Das Senden der E-Mail wurde abgebrochen.",
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Fehler beim Senden", {
        description: "Ein Fehler ist beim Senden der E-Mail aufgetreten.",
      });
    }
  }

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
          <View className="mt-8 items-center">
            <Text className="text-3xl font-bold text-red-500">Beton</Text>
          </View>

          {/* Product Image */}
          <TouchableOpacity
            onPress={() => setIsImageModalVisible(true)}
            activeOpacity={0.8}
          >
            <Image
              source={require("~/assets/images/beton.webp")}
              contentFit="contain"
              cachePolicy="memory-disk"
              transition={200}
              style={{
                width: "100%",
                height: 300,
              }}
            />
          </TouchableOpacity>

          {/* Palette Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Palette</Text>
            <RadioGroup
              value={palette}
              onValueChange={setPalette}
              className="gap-3"
            >
              {paletteOptions.map((option) => (
                <RadioGroupItemWithLabel
                  key={option}
                  value={option}
                  onLabelPress={() => setPalette(option)}
                />
              ))}
            </RadioGroup>
          </View>

          {/* Send Button */}
          <Button onPress={sendOrder} className="bg-red-500 mb-8 mt-8">
            <Text className="text-foreground">Senden</Text>
          </Button>
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
                  source={require("~/assets/images/beton.webp")}
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

function RadioGroupItemWithLabel({
  value,
  onLabelPress,
}: {
  value: string;
  onLabelPress: () => void;
}) {
  return (
    <View className={"flex-row gap-2 items-center"}>
      <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
      <Label nativeID={`label-for-${value}`} onPress={onLabelPress}>
        {value}
      </Label>
    </View>
  );
}

export default Beton;
