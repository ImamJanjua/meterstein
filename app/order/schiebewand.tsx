import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image as RNImage,
  TouchableOpacity,
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

const Schiebewand = () => {
  // Customer and measurement fields
  const [nameKunde, setNameKunde] = React.useState("");
  const [measurementA, setMeasurementA] = React.useState("");
  const [measurementB, setMeasurementB] = React.useState("");

  // Color and handle position
  const [farbe, setFarbe] = React.useState("");
  const [griffVonAussen, setGriffVonAussen] = React.useState("");

  // Zubehör state
  const [windwaechter, setWindwaechter] = React.useState(false);
  const [sonnenwaechter, setSonnenwaechter] = React.useState(false);
  const [regensensor, setRegensensor] = React.useState(false);
  const [fernbedienung5Kanal, setFernbedienung5Kanal] = React.useState(false);
  const [fernbedienung1Kanal, setFernbedienung1Kanal] = React.useState(false);

  // Form fields state
  const [stoff, setStoff] = React.useState("");
  const [wichtiges, setWichtiges] = React.useState("");
  const [images, setImages] = React.useState<string[]>([]);

  const farbeOptions = [
    "RAL 7016 Anthrazit",
    "RAL 9016 Verkehrsweiß",
    "RAL 9010 Weiß Struktur",
    "RAL 9007 Silberbronze",
  ];

  const griffVonAussenOptions = ["Links", "Rechts"];

  function resetForm() {
    setNameKunde("");
    setMeasurementA("");
    setMeasurementB("");
    setFarbe("");
    setGriffVonAussen("");
    setWindwaechter(false);
    setSonnenwaechter(false);
    setRegensensor(false);
    setFernbedienung5Kanal(false);
    setFernbedienung1Kanal(false);
    setStoff("");
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

    if (!measurementA.trim()) {
      toast.error("Maß 'a' erforderlich", {
        description: "Bitte geben Sie das Maß 'a' ein.",
      });
      return;
    }

    if (!measurementB.trim()) {
      toast.error("Maß 'b' erforderlich", {
        description: "Bitte geben Sie das Maß 'b' ein.",
      });
      return;
    }

    if (!stoff.trim()) {
      toast.error("Stoff erforderlich", {
        description: "Bitte geben Sie die Stoffinformationen ein.",
      });
      return;
    }

    if (images.length === 0) {
      toast.error("Bilder erforderlich", {
        description: "Bitte fügen Sie mindestens ein Bild hinzu.",
      });
      return;
    }

    // Compose email body
    const selectedZubehoer = [];
    if (windwaechter) selectedZubehoer.push("Windwächter");
    if (sonnenwaechter) selectedZubehoer.push("Sonnenwächter");
    if (regensensor) selectedZubehoer.push("Regensensor");
    if (fernbedienung5Kanal) selectedZubehoer.push("5 Kanal Fernbedienung");
    if (fernbedienung1Kanal) selectedZubehoer.push("1 Kanal Fernbedienung");

    const emailBody = `
Bestellung - Schiebewand

Kundenname: ${nameKunde}

Maße:
a: ${measurementA} mm (Innenkante - Innenkante -60mm)
b: ${measurementB} mm (Außenkante - Außenkante)

Farbe: ${farbe || "Nicht ausgewählt"}

Griff von außen: ${griffVonAussen || "Nicht ausgewählt"}

Zubehör:
${
  selectedZubehoer.length > 0
    ? selectedZubehoer.join(", ")
    : "Kein Zubehör ausgewählt"
}

Stoff:
${stoff}

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
        subject: `Bestellung - Schiebewand - ${nameKunde}`,
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
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-4 p-4 bg-background/30">
          {/* Product Image */}
          <Image
            source={require("~/assets/images/schiebewand-main.webp")}
            contentFit="contain"
            cachePolicy="memory-disk"
            transition={200}
            style={{
              width: "100%",
              height: 300,
            }}
          />

          {/* Name Kunde Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Name Kunde *</Text>
            <Input
              value={nameKunde}
              onChangeText={setNameKunde}
              placeholder="Name des Kunden eingeben..."
            />
          </View>

          {/* Measurement A Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">a *</Text>
            <Input
              value={measurementA}
              onChangeText={setMeasurementA}
              placeholder="Maß eingeben..."
              keyboardType="numeric"
            />
            <Text className="text-sm text-muted-foreground">
              in mm Innenkante - Innenkante -60mm
            </Text>
          </View>

          {/* Measurement B Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">b *</Text>
            <Input
              value={measurementB}
              onChangeText={setMeasurementB}
              placeholder="Maß eingeben..."
              keyboardType="numeric"
            />
            <Text className="text-sm text-muted-foreground">
              in mm Außenkante - Außenkante
            </Text>
          </View>

          {/* Farbe Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Farbe</Text>
            <RadioGroup
              value={farbe}
              onValueChange={setFarbe}
              className="gap-3"
            >
              {farbeOptions.map((option) => (
                <RadioGroupItemWithLabel
                  key={option}
                  value={option}
                  onLabelPress={() => setFarbe(option)}
                />
              ))}
            </RadioGroup>
          </View>

          {/* Griff von außen Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Griff von außen</Text>
            <RadioGroup
              value={griffVonAussen}
              onValueChange={setGriffVonAussen}
              className="gap-3"
            >
              {griffVonAussenOptions.map((option) => (
                <RadioGroupItemWithLabel
                  key={option}
                  value={option}
                  onLabelPress={() => setGriffVonAussen(option)}
                />
              ))}
            </RadioGroup>
          </View>

          {/* Zubehör Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Zubehör *</Text>
            <CheckboxWithLabel
              label="Bürsten"
              checked={windwaechter}
              onToggle={() => setWindwaechter(!windwaechter)}
            />

            <CheckboxWithLabel
              label="Absperrbar"
              checked={sonnenwaechter}
              onToggle={() => setSonnenwaechter(!sonnenwaechter)}
            />
          </View>

          {/* Stoff Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Stoff *</Text>
            <Textarea value={stoff} onChangeText={setStoff} />
          </View>

          {/* Wichtiges Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Wichtiges</Text>
            <Textarea
              value={wichtiges}
              onChangeText={setWichtiges}
              placeholder="Irgendwas Außergewöhnliches..."
            />
          </View>

          {/* Bilder Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Bilder *</Text>
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
          <Button onPress={sendOrder}>
            <Text>Senden</Text>
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
        className={`w-5 h-5 border-2 rounded ${
          checked
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

export default Schiebewand;
