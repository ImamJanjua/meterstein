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
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Label } from "~/components/ui/label";
import * as ImagePicker from "expo-image-picker";
import { toast } from "sonner-native";
import { supabase } from "~/lib/supabase";
import { getUserName } from "~/lib/jwt-utils";

const Sonstiges = () => {
  // Form fields state
  const [kundenName, setKundenName] = React.useState("");
  const [artikel, setArtikel] = React.useState("");
  const [stueck, setStueck] = React.useState("");
  const [images, setImages] = React.useState<string[]>([]);
  const [imageUrls, setImageUrls] = React.useState<string[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);

  function resetForm() {
    setKundenName("");
    setArtikel("");
    setStueck("");
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

  async function sendOrder() {
    const { data: { session } } = await supabase.auth.getSession();
    const userName = getUserName(session?.access_token || "");

    if (!kundenName.trim()) {
      toast.error("Kundenname erforderlich", {
        description: "Bitte geben Sie den Kundenname an.",
      });
      return;
    }

    if (!artikel.trim()) {
      toast.error("Artikel erforderlich", {
        description: "Bitte geben Sie den Artikel an.",
      });
      return;
    }

    if (!stueck.trim()) {
      toast.error("Stück erforderlich", {
        description: "Bitte geben Sie die Anzahl ein.",
      });
      return;
    }

    if (isUploading) {
      toast.error("Bilder werden hochgeladen", {
        description: "Bitte warten Sie, bis alle Bilder hochgeladen sind.",
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
          type: 'Sonstiges - Bestellung',
          data: {
            Kundenname: kundenName.trim(),
            Artikel: artikel.trim(),
            Stück: stueck.trim(),
          },
          imageUrls: imageUrls,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.dismiss();
        toast.success("E-Mail gesendet", {
          description: "Die Bestellung wurde erfolgreich gesendet.",
        });
        resetForm();
      } else {
        toast.dismiss();
        toast.error("Fehler beim Senden", {
          description: result.error || "Ein Fehler ist beim Senden der E-Mail aufgetreten.",
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.dismiss();
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
            <Text className="text-3xl font-bold text-red-500">Sonstiges</Text>
          </View>

          {/* Kundenname Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Kundenname *</Text>
            <Input
              value={kundenName}
              onChangeText={setKundenName}
              placeholder="Kundenname eingeben..."
            />
            <Text className="text-muted-foreground">Name des Kunden</Text>
          </View>

          {/* Artikel Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Artikel *</Text>
            <Input
              value={artikel}
              onChangeText={setArtikel}
              placeholder="Artikel eingeben..."
            />
            <Text className="text-muted-foreground">Was brauchen sie?</Text>
          </View>

          {/* Stück Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Stück *</Text>
            <Input
              value={stueck}
              onChangeText={setStueck}
              placeholder="Anzahl eingeben..."
              keyboardType="numeric"
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
          <Button onPress={sendOrder} className="bg-red-500 mb-8 mt-8" disabled={isUploading}>
            <Text className="text-foreground">{isUploading ? "Bilder werden hochgeladen..." : "Senden"}</Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Sonstiges;
