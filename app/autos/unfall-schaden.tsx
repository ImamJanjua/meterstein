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
import { toast } from "sonner-native";
import { supabase } from "~/lib/supabase";
import { getUserName } from "~/lib/jwt-utils";

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
  const [imageUrls, setImageUrls] = React.useState<string[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);

  const vehicleOptions = [
    "Ford A:MS 5160",
    "Opel A:Y 783",
    "Iveco 1 A:V 8004",
    "Iveco 2 A:D 4115",
    "Iveco 3 A:MS 249",
    "Stapler"
  ];

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
    setImageUrls([]);
  }

  async function uploadImageToSupabase(uri: string): Promise<string | null> {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const blobType = blob.type || 'image/jpeg';
      const extension = blobType.split('/')[1] || 'jpg';
      const fileName = `${Date.now()}.${extension}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, blob, {
          contentType: blobType,
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        return null;
      }

      const { data: publicData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return publicData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
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
          description: `Sie können maximal 5 Bilder auswählen. Sie haben bereits ${images.length} Bild${images.length !== 1 ? "er" : ""} ausgewählt.`,
        });
        return;
      }

      setImages((prevImages) => [...prevImages, ...newImages]);

      setIsUploading(true);
      toast.loading("Bilder werden hochgeladen...", {
        description: "Bitte warten Sie einen Moment.",
      });

      const uploadedUrls: string[] = [];
      for (const imageUri of newImages) {
        const url = await uploadImageToSupabase(imageUri);
        if (url) {
          uploadedUrls.push(url);
        }
      }

      setImageUrls((prevUrls) => [...prevUrls, ...uploadedUrls]);
      setIsUploading(false);
      toast.dismiss();

      if (uploadedUrls.length === newImages.length) {
        toast.success("Bilder hochgeladen", {
          description: `${uploadedUrls.length} Bild${uploadedUrls.length !== 1 ? "er" : ""} erfolgreich hochgeladen.`,
        });
      } else {
        toast.error("Fehler beim Hochladen", {
          description: `Nur ${uploadedUrls.length} von ${newImages.length} Bildern wurden hochgeladen.`,
        });
      }
    }
  }

  function removeImage(imageUri: string) {
    const index = images.indexOf(imageUri);
    setImages((prevImages) => prevImages.filter((uri) => uri !== imageUri));
    if (index !== -1) {
      setImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
    }
  }

  async function sendReport() {
    const { data: { session } } = await supabase.auth.getSession();
    const userName = getUserName(session?.access_token || "");

    if (isUploading) {
      toast.error("Bilder werden hochgeladen", {
        description: "Bitte warten Sie, bis alle Bilder hochgeladen sind.",
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

      toast.loading("E-Mail wird gesendet...", {
        description: "Bitte warten Sie einen Moment.",
      });

      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderName: `${userName}`,
          type: `Unfall/Schaden`,
          data: {
            Fahrzeug: selectedVehicle.trim(),
            'Art des Schadens': selectedDamages
              .map(
                (damage) =>
                  `${damage.charAt(0).toUpperCase() + damage.slice(1)} (${getDamageLabel(
                    damage
                  )})`
              )
              .join(", "),
            'Was ist passiert': description.trim(),
          },
          imageUrls: imageUrls,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.dismiss();
        toast.success("Meldung gesendet", {
          description: "Die Schadensmeldung wurde erfolgreich gesendet.",
        });
        resetForm();
      } else {
        toast.dismiss();
        toast.error("Fehler beim Senden", {
          description: result.error || "Ein Fehler ist beim Senden der Meldung aufgetreten.",
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.dismiss();
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
              <View className="bg-background rounded-lg border border-border mx-4 max-w-sm w-full max-h-96">
                <View className="p-4 border-b border-border">
                  <Text className="text-lg font-semibold text-center">
                    Fahrzeug auswählen
                  </Text>
                </View>
                <ScrollView className="max-h-80" showsVerticalScrollIndicator={false}>
                  {vehicleOptions.map((vehicle) => (
                    <TouchableOpacity
                      key={vehicle}
                      onPress={() => {
                        setSelectedVehicle(vehicle);
                        setShowVehiclePopover(false);
                      }}
                      className={`p-4 border-b border-border/50 ${selectedVehicle === vehicle
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
                </ScrollView>
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
          <Button onPress={sendReport} className="bg-red-500 mb-8 mt-8" disabled={isUploading}>
            <Text className="text-foreground">{isUploading ? "Bilder werden hochgeladen..." : "Senden"}</Text>
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
        className={`w-6 h-6 border-2 rounded ${checked
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
