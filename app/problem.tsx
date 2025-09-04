import {
  View,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
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

const Reklamation = () => {
  const [clientName, setClientName] = React.useState("");
  const [whatIsBroken, setWhatIsBroken] = React.useState("");
  const [whoIsResponsible, setWhoIsResponsible] = React.useState("");
  const [whatHappened, setWhatHappened] = React.useState("");
  const [images, setImages] = React.useState<string[]>([]);

  const responsibleParties = [
    "Meterstein",
    "Montage",
    "Aluxe",
    "Surma",
    "Selt",
    "Varisol",
    "Glasliferant",
    "Solarwatt",
    "Matplast",
    "Liferant unbekannt",
  ];

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

  function resetForm() {
    setClientName("");
    setWhatIsBroken("");
    setWhoIsResponsible("");
    setWhatHappened("");
    setImages([]);
  }

  async function sendReklamation() {
    // Check if mail is available
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      toast.error("E-Mail nicht verfügbar", {
        description: "E-Mail-App ist auf diesem Gerät nicht verfügbar.",
      });
      return;
    }

    // Validate required fields
    if (!clientName.trim()) {
      toast.error("Kundenname erforderlich", {
        description: "Bitte geben Sie den Namen des Kunden ein.",
      });
      return;
    }

    if (!whatIsBroken.trim()) {
      toast.error("Beschreibung erforderlich", {
        description: "Bitte beschreiben Sie, was kaputt ist.",
      });
      return;
    }

    if (!whatHappened.trim()) {
      toast.error("Beschreibung erforderlich", {
        description: "Bitte beschreiben Sie, was passiert ist.",
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
    const emailBody = `
Reklamation - ${clientName}

Kundenname: ${clientName}

Was ist kaputt:
${whatIsBroken}

Wer ist verantwortlich: ${whoIsResponsible || "Nicht ausgewählt"}

Was ist passiert:
${whatHappened || "Keine weiteren Details angegeben"}

Anzahl der beigefügten Bilder: ${images.length}

---
Gesendet über Meterstein
    `.trim();

    try {
      // Compose email
      const result = await MailComposer.composeAsync({
        recipients: EMAIL_RECIPIENTS, // Replace with actual email
        subject: `Reklamation - ${clientName}`,
        body: emailBody,
        attachments: images, // Use image URIs directly
      });

      if (result.status === MailComposer.MailComposerStatus.SENT) {
        toast.success("E-Mail gesendet", {
          description: "Die Reklamation wurde erfolgreich gesendet.",
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
        <View className="mb-8 mt-8 items-center">
          <Text className="text-3xl font-bold text-red-500">Reklamation</Text>
        </View>

        <View className="gap-4 p-4">
          <View className="gap-2">
            <Text className="font-medium">Name des Kunden</Text>
            <Input
              value={clientName}
              onChangeText={(text) => setClientName(text)}
            />
          </View>
          <View className="gap-2">
            <Text className="font-medium">Was ist kaputt?</Text>
            <Textarea
              value={whatIsBroken}
              onChangeText={(text) => setWhatIsBroken(text)}
            />
          </View>

          <View className="gap-2">
            <Text className=" font-medium">Wer ist verantwortlich?</Text>
            <RadioGroup
              value={whoIsResponsible}
              onValueChange={setWhoIsResponsible}
              className="gap-3"
            >
              {responsibleParties.map((party) => (
                <RadioGroupItemWithLabel
                  key={party}
                  value={party}
                  onLabelPress={() => setWhoIsResponsible(party)}
                />
              ))}
            </RadioGroup>
          </View>

          <View className="gap-2 mt-2">
            <Text className=" font-medium">Was ist passiert?</Text>
            <Textarea
              value={whatHappened}
              onChangeText={(text) => setWhatHappened(text)}
            />
          </View>

          <View className="gap-2">
            <Text className=" font-medium">Bilder der Reklamation</Text>
            <Button variant="outline" onPress={pickImages}>
              <Text>Bilder auswählen ({images.length}/5)</Text>
            </Button>

            {images.length > 0 && (
              <View className="gap-3">
                <Text className=" text-muted-foreground">
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
                      <Image
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

          <Button
            className="w-full mb-8 mt-8 bg-red-500"
            onPress={sendReklamation}
          >
            <Text>Absenden</Text>
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

export default Reklamation;
