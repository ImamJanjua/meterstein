import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image as RNImage,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import * as ImagePicker from "expo-image-picker";
import * as MailComposer from "expo-mail-composer";
import { toast } from "sonner-native";
import { EMAIL_RECIPIENTS } from "~/lib/constants";

const StaplerCheckup = () => {
  // Form fields state
  // Oil section
  const [oil, setOil] = React.useState("");

  // Coolant section
  const [coolant, setCoolant] = React.useState("");

  // Battery section
  const [battery, setBattery] = React.useState("");

  const [notes, setNotes] = React.useState("");
  const [images, setImages] = React.useState<string[]>([]);

  const statusOptions = ["noch voll", "leer", "aufgefüllt"];
  const batteryOptions = ["passt", "neu kaufen"];

  function resetForm() {
    setOil("");
    setCoolant("");
    setBattery("");
    setNotes("");
    setImages([]);
  }

  async function pickImages() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);

      if (images.length + newImages.length > 5) {
        toast.error("Zu viele Bilder", {
          description: `Sie können maximal 5 Bilder auswählen. Sie haben bereits ${
            images.length
          } Bild${images.length !== 1 ? "er" : ""} ausgewählt.`,
        });
        return;
      }

      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  }

  function removeImage(imageUri: string) {
    setImages((prevImages) => prevImages.filter((uri) => uri !== imageUri));
  }

  async function sendReport() {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      toast.error("E-Mail nicht verfügbar", {
        description: "E-Mail-App ist auf diesem Gerät nicht verfügbar.",
      });
      return;
    }

    try {
      const emailBody = `
Stapler Check-Up Bericht

=== PRÜFBERICHT ===

Öl: ${oil || "Nicht geprüft"}

Kühlmittel: ${coolant || "Nicht geprüft"}

Batterie: ${battery || "Nicht geprüft"}

${notes ? `\nAnmerkungen:\n${notes}` : ""}

${
  images.length > 0
    ? `\nAnhänge: ${images.length} Bild${images.length !== 1 ? "er" : ""}`
    : ""
}

---
Gesendet über Meterstein
      `.trim();

      const result = await MailComposer.composeAsync({
        recipients: EMAIL_RECIPIENTS,
        subject: `Stapler Check-Up - ${new Date().toLocaleDateString("de-DE")}`,
        body: emailBody,
        attachments: images,
      });

      if (result.status === MailComposer.MailComposerStatus.SENT) {
        toast.success("Check-Up gesendet", {
          description:
            "Der Stapler Check-Up Bericht wurde erfolgreich gesendet.",
        });
        resetForm();
      } else if (result.status === MailComposer.MailComposerStatus.CANCELLED) {
        toast("E-Mail abgebrochen", {
          description: "Das Senden des Berichts wurde abgebrochen.",
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Fehler beim Senden", {
        description: "Ein Fehler ist beim Senden des Berichts aufgetreten.",
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
            <Text className="text-3xl font-bold text-red-500">
              Stapler Check-Up
            </Text>
          </View>

          {/* Oil Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Öl</Text>
            <RadioGroup value={oil} onValueChange={setOil} className="gap-3">
              {statusOptions.map((option) => (
                <RadioGroupItemWithLabel
                  key={option}
                  value={option}
                  onLabelPress={() => setOil(option)}
                />
              ))}
            </RadioGroup>
          </View>

          {/* Coolant Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Kühlmittel</Text>
            <RadioGroup
              value={coolant}
              onValueChange={setCoolant}
              className="gap-3"
            >
              {statusOptions.map((option) => (
                <RadioGroupItemWithLabel
                  key={option}
                  value={option}
                  onLabelPress={() => setCoolant(option)}
                />
              ))}
            </RadioGroup>
          </View>

          {/* Battery Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Batterie</Text>
            <RadioGroup
              value={battery}
              onValueChange={setBattery}
              className="gap-3"
            >
              {batteryOptions.map((option) => (
                <RadioGroupItemWithLabel
                  key={option}
                  value={option}
                  onLabelPress={() => setBattery(option)}
                />
              ))}
            </RadioGroup>
          </View>

          {/* Notes Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Anmerkungen</Text>
            <Textarea
              value={notes}
              onChangeText={setNotes}
              placeholder="Besondere Beobachtungen oder Anmerkungen..."
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Images Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Bilder (optional)</Text>
            <Button variant="outline" onPress={pickImages}>
              <Text>Bilder auswählen ({images.length}/5)</Text>
            </Button>

            {images.length > 0 && (
              <View className="gap-3">
                <Text className="text-xs text-muted-foreground">
                  {images.length} Bild{images.length !== 1 ? "er" : ""}{" "}
                  ausgewählt
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="gap-2"
                  contentContainerStyle={{ gap: 8 }}
                >
                  {images.map((imageUri, index) => (
                    <View key={index} className="relative">
                      <RNImage
                        source={{ uri: imageUri }}
                        className="w-24 h-24 rounded-lg"
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        onPress={() => removeImage(imageUri)}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                      >
                        <Text className="text-white text-xs font-bold">×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Send Button */}
          <Button onPress={sendReport} className="bg-red-500 mb-8 mt-8">
            <Text className="text-foreground">Check-Up senden</Text>
          </Button>
        </View>
      </ScrollView>
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
    <View className="flex-row gap-2 items-center">
      <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
      <Label nativeID={`label-for-${value}`} onPress={onLabelPress}>
        {value}
      </Label>
    </View>
  );
}

export default StaplerCheckup;
