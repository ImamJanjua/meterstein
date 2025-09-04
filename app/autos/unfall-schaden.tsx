import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image as RNImage,
  TouchableOpacity,
  Modal,
} from "react-native";
import React from "react";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Label } from "~/components/ui/label";
import * as ImagePicker from "expo-image-picker";
import * as MailComposer from "expo-mail-composer";
import { toast } from "sonner-native";
import { EMAIL_RECIPIENTS } from "~/lib/constants";

const UnfallSchaden = () => {
  // Form fields state
  const [selectedVehicle, setSelectedVehicle] = React.useState("");
  const [showVehiclePopover, setShowVehiclePopover] = React.useState(false);
  const [damageTypes, setDamageTypes] = React.useState({
    karosserie: false,
    innenraum: false,
    licht: false,
    tueren: false,
    reifen: false,
  });
  const [description, setDescription] = React.useState("");
  const [images, setImages] = React.useState<string[]>([]);

  const vehicleOptions = ["Ford A:MS 5120", "Opel A:Y 783", "Iveco 1 A:V 8004"];

  function resetForm() {
    setSelectedVehicle("");
    setShowVehiclePopover(false);
    setDamageTypes({
      karosserie: false,
      innenraum: false,
      licht: false,
      tueren: false,
      reifen: false,
    });
    setDescription("");
    setImages([]);
  }

  function toggleDamageType(type: keyof typeof damageTypes) {
    setDamageTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
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

    if (!selectedVehicle.trim()) {
      toast.error("Fahrzeug erforderlich", {
        description: "Bitte wählen Sie ein Fahrzeug aus.",
      });
      return;
    }

    const selectedDamages = Object.entries(damageTypes)
      .filter(([_, checked]) => checked)
      .map(([type]) => type);

    if (selectedDamages.length === 0) {
      toast.error("Schadensart erforderlich", {
        description: "Bitte wählen Sie mindestens eine Schadensart aus.",
      });
      return;
    }

    if (!description.trim()) {
      toast.error("Beschreibung erforderlich", {
        description: "Bitte beschreiben Sie, was passiert ist.",
      });
      return;
    }

    try {
      const emailBody = `
Unfall-/Schadensmeldung

Fahrzeug: ${selectedVehicle}

Art des Schadens:
${selectedDamages
  .map(
    (damage) =>
      `- ${damage.charAt(0).toUpperCase() + damage.slice(1)} (${getDamageLabel(
        damage
      )})`
  )
  .join("\n")}

Was ist passiert?:
${description}

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
        subject: `Unfall/Schaden - ${selectedVehicle}`,
        body: emailBody,
        attachments: images,
      });

      if (result.status === MailComposer.MailComposerStatus.SENT) {
        toast.success("Meldung gesendet", {
          description: "Die Schadensmeldung wurde erfolgreich gesendet.",
        });
        resetForm();
      } else if (result.status === MailComposer.MailComposerStatus.CANCELLED) {
        toast("E-Mail abgebrochen", {
          description: "Das Senden der Meldung wurde abgebrochen.",
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Fehler beim Senden", {
        description: "Ein Fehler ist beim Senden der Meldung aufgetreten.",
      });
    }
  }

  function getDamageLabel(type: string): string {
    const labels: Record<string, string> = {
      karosserie: "Blech",
      innenraum: "Innenraum",
      licht: "Licht",
      tueren: "Türen",
      reifen: "Reifen",
    };
    return labels[type] || type;
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
              Unfall/Schaden
            </Text>
          </View>

          {/* Vehicle Selection */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Welches Auto? *</Text>
            <View className="border border-border rounded-lg">
              <TouchableOpacity
                className="p-3 flex-row items-center justify-between"
                onPress={() => setShowVehiclePopover(true)}
              >
                <Text
                  className={
                    selectedVehicle
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }
                >
                  {selectedVehicle || "Fahrzeug auswählen..."}
                </Text>
                <Text className="text-muted-foreground">▼</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Vehicle Selection Popover */}
          <Modal
            visible={showVehiclePopover}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowVehiclePopover(false)}
          >
            <TouchableOpacity
              className="flex-1 bg-black/50 justify-center items-center"
              activeOpacity={1}
              onPress={() => setShowVehiclePopover(false)}
            >
              <View className="bg-background rounded-lg border border-border mx-4 max-w-sm w-full">
                <View className="p-4 border-b border-border">
                  <Text className="text-lg font-semibold text-center">
                    Fahrzeug auswählen
                  </Text>
                </View>
                <View className="max-h-64">
                  {vehicleOptions.map((vehicle) => (
                    <TouchableOpacity
                      key={vehicle}
                      onPress={() => {
                        setSelectedVehicle(vehicle);
                        setShowVehiclePopover(false);
                      }}
                      className={`p-4 border-b border-border/50 ${
                        selectedVehicle === vehicle
                          ? "bg-primary/10 border-primary"
                          : "bg-background"
                      }`}
                    >
                      <Text
                        className={
                          selectedVehicle === vehicle
                            ? "text-primary font-medium"
                            : "text-foreground"
                        }
                      >
                        {vehicle}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Damage Type Selection */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Art des Schadens *</Text>
            <Text className="text-muted-foreground">Wo ist der Schaden?</Text>

            <View className="gap-3">
              <CheckboxWithLabel
                label="Karosserie (Blech)"
                checked={damageTypes.karosserie}
                onToggle={() => toggleDamageType("karosserie")}
              />
              <CheckboxWithLabel
                label="Innenraum"
                checked={damageTypes.innenraum}
                onToggle={() => toggleDamageType("innenraum")}
              />
              <CheckboxWithLabel
                label="Licht"
                checked={damageTypes.licht}
                onToggle={() => toggleDamageType("licht")}
              />
              <CheckboxWithLabel
                label="Türen"
                checked={damageTypes.tueren}
                onToggle={() => toggleDamageType("tueren")}
              />
              <CheckboxWithLabel
                label="Reifen"
                checked={damageTypes.reifen}
                onToggle={() => toggleDamageType("reifen")}
              />
            </View>
          </View>

          {/* Description Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Was ist passiert? *</Text>
            <Textarea
              value={description}
              onChangeText={setDescription}
              placeholder="Beschreiben Sie den Unfall oder Schaden..."
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
            <Text className="text-foreground">Senden</Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

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
      className="flex-row gap-3 items-center py-3"
    >
      <View
        className={`w-6 h-6 border-2 rounded ${
          checked
            ? "bg-primary border-primary"
            : "bg-background border-muted-foreground"
        } items-center justify-center`}
      >
        {checked && (
          <Text className="text-primary-foreground text-sm font-bold">✓</Text>
        )}
      </View>
      <Text className="text-base">{label}</Text>
    </TouchableOpacity>
  );
}

export default UnfallSchaden;
