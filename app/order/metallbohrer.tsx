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

const Metallbohrer = () => {
  // 4,2mm
  const [durchmesser42mm, setDurchmesser42mm] = React.useState("");

  // 6mm
  const [durchmesser6mm, setDurchmesser6mm] = React.useState("");

  // 8mm
  const [durchmesser8mm, setDurchmesser8mm] = React.useState("");

  // 10mm
  const [durchmesser10mm, setDurchmesser10mm] = React.useState("");

  // 12mm
  const [durchmesser12mm, setDurchmesser12mm] = React.useState("");

  const laengeOptions = ["kurz", "mittel", "lang"];

  function resetForm() {
    setDurchmesser42mm("");
    setDurchmesser6mm("");
    setDurchmesser8mm("");
    setDurchmesser10mm("");
    setDurchmesser12mm("");
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
                Bestellung - Metallbohrer
                
                4,2mm: ${durchmesser42mm || "Nicht ausgewählt"}
                6mm: ${durchmesser6mm || "Nicht ausgewählt"}
                8mm: ${durchmesser8mm || "Nicht ausgewählt"}
                10mm: ${durchmesser10mm || "Nicht ausgewählt"}
                12mm: ${durchmesser12mm || "Nicht ausgewählt"}
                
                ---
                Gesendet über Meterstein
                    `.trim();

    try {
      // Compose email
      const result = await MailComposer.composeAsync({
        recipients: EMAIL_RECIPIENTS,
        subject: `Bestellung - Metallbohrer`,
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
            source={require("~/assets/images/metallbohrer.webp")}
            contentFit="contain"
            cachePolicy="memory-disk"
            transition={200}
            style={{
              width: "100%",
              height: 300,
            }}
          />

          {/* 4,2mm Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">4,2mm</Text>
            <RadioGroup
              value={durchmesser42mm}
              onValueChange={setDurchmesser42mm}
              className="gap-3"
            >
              {laengeOptions.map((option) => (
                <RadioGroupItemWithLabel
                  key={option}
                  value={option}
                  onLabelPress={() => setDurchmesser42mm(option)}
                />
              ))}
            </RadioGroup>
          </View>

          {/* 6mm Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">6mm</Text>
            <RadioGroup
              value={durchmesser6mm}
              onValueChange={setDurchmesser6mm}
              className="gap-3"
            >
              {laengeOptions.map((option) => (
                <RadioGroupItemWithLabel
                  key={option}
                  value={option}
                  onLabelPress={() => setDurchmesser6mm(option)}
                />
              ))}
            </RadioGroup>
          </View>

          {/* 8mm Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">8mm</Text>
            <RadioGroup
              value={durchmesser8mm}
              onValueChange={setDurchmesser8mm}
              className="gap-3"
            >
              {laengeOptions.map((option) => (
                <RadioGroupItemWithLabel
                  key={option}
                  value={option}
                  onLabelPress={() => setDurchmesser8mm(option)}
                />
              ))}
            </RadioGroup>
          </View>

          {/* 10mm Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">10mm</Text>
            <RadioGroup
              value={durchmesser10mm}
              onValueChange={setDurchmesser10mm}
              className="gap-3"
            >
              {laengeOptions.map((option) => (
                <RadioGroupItemWithLabel
                  key={option}
                  value={option}
                  onLabelPress={() => setDurchmesser10mm(option)}
                />
              ))}
            </RadioGroup>
          </View>

          {/* 12mm Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">12mm</Text>
            <RadioGroup
              value={durchmesser12mm}
              onValueChange={setDurchmesser12mm}
              className="gap-3"
            >
              {laengeOptions.map((option) => (
                <RadioGroupItemWithLabel
                  key={option}
                  value={option}
                  onLabelPress={() => setDurchmesser12mm(option)}
                />
              ))}
            </RadioGroup>
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

export default Metallbohrer;
