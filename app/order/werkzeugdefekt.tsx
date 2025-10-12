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
import { Label } from "~/components/ui/label";
import * as ImagePicker from "expo-image-picker";
import { toast } from "sonner-native";
import { supabase } from "~/lib/supabase";
import { getUserName } from "~/lib/jwt-utils";
import { BACKEND_URL } from "~/lib/constants";

const Werkzeugdefekt = () => {
  // Image zoom state
  const [isImageModalVisible, setIsImageModalVisible] = React.useState(false);

  // Form fields state
  const [welcherArtikel, setWelcherArtikel] = React.useState("");
  const [wasIstPassiert, setWasIstPassiert] = React.useState("");
  const [images, setImages] = React.useState<string[]>([]); // Local URIs for display
  const [imageUrls, setImageUrls] = React.useState<string[]>([]); // Public URLs for email
  const [isUploading, setIsUploading] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);

  function resetForm() {
    setWelcherArtikel("");
    setWasIstPassiert("");
    setImages([]);
    setImageUrls([]);
  }

  async function uploadImageToSupabase(uri: string): Promise<string | null> {
    try {
      // Fetch the image as blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Generate unique filename - get extension from blob type instead of URI
      const blobType = blob.type || 'image/jpeg';
      const extension = blobType.split('/')[1] || 'jpg';
      const fileName = `${Date.now()}.${extension}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('images') // Make sure this bucket exists in your Supabase project
        .upload(filePath, blob, {
          contentType: blobType,
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        return null;
      }

      // Get public URL
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

      // Add images to display immediately
      setImages((prevImages) => [...prevImages, ...newImages]);

      // Upload images to Supabase in the background
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
    // Also remove from uploaded URLs
    if (index !== -1) {
      setImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
    }
  }

  async function sendOrder() {
    const { data: { session } } = await supabase.auth.getSession();
    const userName = getUserName(session?.access_token || "");

    // Validate required fields
    if (!welcherArtikel.trim()) {
      toast.error("Artikel erforderlich", {
        description: "Bitte geben Sie an, welcher Artikel betroffen ist.",
      });
      return;
    }

    if (!wasIstPassiert.trim()) {
      toast.error("Beschreibung erforderlich", {
        description: "Bitte beschreiben Sie, was passiert ist.",
      });
      return;
    }

    // Check if images are still uploading
    if (isUploading) {
      toast.error("Bilder werden hochgeladen", {
        description: "Bitte warten Sie, bis alle Bilder hochgeladen sind.",
      });
      return;
    }

    try {
      setIsSending(true);
      toast.loading("E-Mail wird gesendet...", {
        description: "Bitte warten Sie einen Moment.",
      });

      // Send email via Resend API
      const response = await fetch(`${BACKEND_URL}/api/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderName: `${userName}`,
          type: 'Werkzeugdefekt - Meldung',
          data: {
            WelcherArtikel: welcherArtikel.trim(),
            WasIstPassiert: wasIstPassiert.trim(),
          },
          imageUrls: imageUrls,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.dismiss();
        toast.success("E-Mail gesendet", {
          description: "Die Meldung wurde erfolgreich gesendet.",
        });
        resetForm();
      } else {
        toast.dismiss();
        toast.error("Fehler beim Senden", {
          description: result.error || "Ein Fehler ist beim Senden der E-Mail aufgetreten.",
        });
      }
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast.dismiss();
      toast.error("Fehler beim Senden", {
        description: "Ein Fehler ist beim Senden der E-Mail aufgetreten.",
      });
    } finally {
      setIsSending(false);
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
              Werkzeugdefekt
            </Text>
          </View>

          {/* Welcher Artikel Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Welcher Artikel *</Text>
            <Input value={welcherArtikel} onChangeText={setWelcherArtikel} />
            <Text className="text-muted-foreground">
              Um welche Maschine geht es?
            </Text>
          </View>

          {/* Was ist passiert Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Was ist passiert? *</Text>
            <Textarea
              value={wasIstPassiert}
              onChangeText={setWasIstPassiert}
              placeholder="Beschreiben Sie, was passiert ist..."
            />
            <Text className="text-muted-foreground">Genaue Beschreibung</Text>
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
          <Button onPress={sendOrder} className="bg-red-500 mb-8 mt-8" disabled={isUploading || isSending}>
            <Text className="text-foreground">
              {isUploading ? "Bilder werden hochgeladen..." : isSending ? "Wird gesendet..." : "Senden"}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Werkzeugdefekt;
