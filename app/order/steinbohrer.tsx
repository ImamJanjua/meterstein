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
import { Label } from "~/components/ui/label";
import { toast } from "sonner-native";
import { supabase } from "~/lib/supabase";
import { getUserName } from "~/lib/jwt-utils";
import { BACKEND_URL } from "~/lib/constants";

const Steinbohrer = () => {
  // Image zoom state
  const [isImageModalVisible, setIsImageModalVisible] = React.useState(false);

  // Durchmesser (Diameter)
  const [durchmesser6mm, setDurchmesser6mm] = React.useState(false);
  const [durchmesser8mm, setDurchmesser8mm] = React.useState(false);
  const [durchmesser10mm, setDurchmesser10mm] = React.useState(false);
  const [durchmesser12mm, setDurchmesser12mm] = React.useState(false);
  const [durchmesser14mm, setDurchmesser14mm] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);

  function resetForm() {
    setDurchmesser6mm(false);
    setDurchmesser8mm(false);
    setDurchmesser10mm(false);
    setDurchmesser12mm(false);
    setDurchmesser14mm(false);
  }

  async function sendOrder() {
    const { data: { session } } = await supabase.auth.getSession();
    const userName = getUserName(session?.access_token || "");

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
          type: 'Bestellung - Steinbohrer',
          data: {
            "6mm Durchmesser": durchmesser6mm ? "Ja" : "Nein",
            "8mm Durchmesser": durchmesser8mm ? "Ja" : "Nein",
            "10mm Durchmesser": durchmesser10mm ? "Ja" : "Nein",
            "12mm Durchmesser": durchmesser12mm ? "Ja" : "Nein",
            "14mm Durchmesser": durchmesser14mm ? "Ja" : "Nein",
          },
          imageUrls: [],
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
            <Text className="text-3xl font-bold text-red-500">Steinbohrer</Text>
          </View>

          {/* Product Image */}
          <TouchableOpacity
            onPress={() => setIsImageModalVisible(true)}
            activeOpacity={0.8}
          >
            <Image
              source={require("~/assets/images/steinbohrer.webp")}
              contentFit="contain"
              cachePolicy="memory-disk"
              transition={200}
              style={{
                width: "100%",
                height: 300,
              }}
            />
          </TouchableOpacity>

          {/* Durchmesser Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Durchmesser *</Text>
            <CheckboxWithLabel
              label="6mm"
              checked={durchmesser6mm}
              onToggle={() => setDurchmesser6mm(!durchmesser6mm)}
            />
            <CheckboxWithLabel
              label="8mm"
              checked={durchmesser8mm}
              onToggle={() => setDurchmesser8mm(!durchmesser8mm)}
            />
            <CheckboxWithLabel
              label="10mm"
              checked={durchmesser10mm}
              onToggle={() => setDurchmesser10mm(!durchmesser10mm)}
            />
            <CheckboxWithLabel
              label="12mm"
              checked={durchmesser12mm}
              onToggle={() => setDurchmesser12mm(!durchmesser12mm)}
            />
            <CheckboxWithLabel
              label="14mm"
              checked={durchmesser14mm}
              onToggle={() => setDurchmesser14mm(!durchmesser14mm)}
            />
          </View>

          {/* Send Button */}
          <Button onPress={sendOrder} className="bg-red-500 mb-8 mt-8" disabled={isSending}>
            <Text className="text-foreground">{isSending ? "Wird gesendet..." : "Senden"}</Text>
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
                  source={require("~/assets/images/steinbohrer.webp")}
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

export default Steinbohrer;
