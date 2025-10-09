import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image as RNImage,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import React from "react";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import * as ImagePicker from "expo-image-picker";
import * as MailComposer from "expo-mail-composer";
import { toast } from "sonner-native";
import { EMAIL_RECIPIENTS } from "~/lib/constants";

const Winkel = () => {
  // Image zoom state
  const [isImageModalVisible, setIsImageModalVisible] = React.useState(false);

  // Customer and measurement fields
  const [nameKunde, setNameKunde] = React.useState("");
  const [measurementB, setMeasurementB] = React.useState("");

  // Color and dimensions
  const [farbe, setFarbe] = React.useState("");
  const [abmessungen, setAbmessungen] = React.useState("");

  // Form fields state
  const [wichtiges, setWichtiges] = React.useState("");
  const [images, setImages] = React.useState<string[]>([]);

  const farbeOptions = [
    "RAL 7016 Anthrazit",
    "RAL 9016 Verkehrsweiß",
    "RAL 9010 Weiß Struktur",
    "RAL 9007 Silberbronze",
  ];

  const abmessungenOptions = ["25mm x 25mm", "50mm x 50mm"];

  function resetForm() {
    setNameKunde("");
    setMeasurementB("");
    setFarbe("");
    setAbmessungen("");
    setWichtiges("");
    setImages([]);
  }

  async function pickImages() {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5,
    });

    console.log(result);

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);

      // Check if adding new images would exceed the limit of 5
      if (images.length + newImages.length > 5) {
        toast.error("Zu viele Bilder", {
          description: `Sie können maximal 5 Bilder auswählen. Sie haben bereits ${images.length
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

  async function sendOrder() {
    // Check if mail is available
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      toast.error("E-Mail nicht verfügbar", {
        description: "E-Mail-App ist auf diesem Gerät nicht verfügbar.",
      });
      return;
    }

    // Validate required fields
    if (!nameKunde.trim()) {
      toast.error("Kundenname erforderlich", {
        description: "Bitte geben Sie den Namen des Kunden ein.",
      });
      return;
    }

    if (!measurementB.trim()) {
      toast.error("Stück erforderlich", {
        description: "Bitte geben Sie die Anzahl der Stücke ein.",
      });
      return;
    }

    if (!farbe.trim()) {
      toast.error("Farbe erforderlich", {
        description: "Bitte wählen Sie mindestens eine Farbe aus.",
      });
      return;
    }

    const emailBody = `
Bestellung - Winkel

Kundenname: ${nameKunde}

Stück: ${measurementB}

Abmessungen: ${abmessungen || "Nicht ausgewählt"}

Farbe: ${farbe}

Wichtiges:
${wichtiges || "Nichts angegeben"}

Anzahl der beigefügten Bilder: ${images.length}

---
Gesendet über Meterstein
    `.trim();

    try {
      // Compose email
      const result = await MailComposer.composeAsync({
        recipients: EMAIL_RECIPIENTS,
        subject: `Bestellung - Winkel - ${nameKunde}`,
        body: emailBody,
        attachments: images, // Use image URIs directly
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
            <Text className="text-3xl font-bold text-red-500">Winkel</Text>
          </View>

          {/* Product Image */}
          <TouchableOpacity
            onPress={() => setIsImageModalVisible(true)}
            activeOpacity={0.8}
          >
            <Image
              source={require("~/assets/images/winkel-main.webp")}
              contentFit="contain"
              cachePolicy="memory-disk"
              transition={200}
              style={{
                width: "100%",
                height: 300,
              }}
            />
          </TouchableOpacity>

          {/* Name Kunde Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Name Kunde *</Text>
            <Input
              value={nameKunde}
              onChangeText={setNameKunde}
              placeholder="Name des Kunden eingeben..."
            />
          </View>

          {/* Stück Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Stück *</Text>
            <Input
              value={measurementB}
              onChangeText={setMeasurementB}
              placeholder="Anzahl eingeben..."
              keyboardType="numeric"
            />
          </View>

          {/* Abmessungen Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Abmessungen</Text>
            <RadioGroup
              value={abmessungen}
              onValueChange={setAbmessungen}
              className="gap-3"
            >
              {abmessungenOptions.map((option) => (
                <RadioGroupItemWithLabel
                  key={option}
                  value={option}
                  onLabelPress={() => setAbmessungen(option)}
                />
              ))}
            </RadioGroup>
          </View>

          {/* Farbe Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Farbe *</Text>
            {farbeOptions.map((option) => (
              <CheckboxWithLabel
                key={option}
                label={option}
                checked={farbe === option}
                onToggle={() => setFarbe(farbe === option ? "" : option)}
              />
            ))}
          </View>

          {/* Wichtiges Section */}
          <View className="gap-2 mt-4">
            <Text className="text-lg font-semibold">Wichtiges</Text>
            <Textarea
              value={wichtiges}
              onChangeText={setWichtiges}
              placeholder="Irgendwas Außergewöhnliches..."
            />
          </View>

          {/* Bilder Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Bilder</Text>
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
                        <Text className="text-white text-xs font-bold">x</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
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
                  source={require("~/assets/images/winkel-main.webp")}
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

function CheckboxWithLabel({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      className="flex-row gap-2 items-center py-2"
    >
      <View
        className={`w-5 h-5 border-2 rounded ${checked
            ? "bg-primary border-primary"
            : "bg-background border-muted-foreground"
          } items-center justify-center`}
      >
        {checked && <Text className="text-primary-foreground text-xs">✓</Text>}
      </View>
      <Label>{label}</Label>
    </TouchableOpacity>
  );
}

export default Winkel;
