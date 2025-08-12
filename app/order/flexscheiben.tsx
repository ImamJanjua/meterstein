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

const Flexscheiben = () => {
  // Art (Type)
  const [metall, setMetall] = React.useState(false);
  const [stein, setStein] = React.useState(false);
  const [faecherscheibe, setFaecherscheibe] = React.useState(false);

  // Größe (Size)
  const [groesse125mm, setGroesse125mm] = React.useState(false);
  const [groesse230mm, setGroesse230mm] = React.useState(false);

  // Stück (Quantity)
  const [stueck, setStueck] = React.useState("");

  function resetForm() {
    setMetall(false);
    setStein(false);
    setFaecherscheibe(false);
    setGroesse125mm(false);
    setGroesse230mm(false);
    setStueck("");
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
         Bestellung - Flexscheiben
         
         Stück: ${stueck || "Nicht angegeben"}
         
         Art:
         - Metall: ${metall ? "Ja" : "Nein"}
         - Stein: ${stein ? "Ja" : "Nein"}
         - Fächerscheibe: ${faecherscheibe ? "Ja" : "Nein"}
         
         Größe:
         - 125mm: ${groesse125mm ? "Ja" : "Nein"}
         - 230mm: ${groesse230mm ? "Ja" : "Nein"}
         
         ---
         Gesendet über Meterstein
             `.trim();

    try {
      // Compose email
      const result = await MailComposer.composeAsync({
        recipients: EMAIL_RECIPIENTS,
        subject: `Bestellung - Flexscheiben`,
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
            source={require("~/assets/images/flexscheiben.webp")}
            contentFit="contain"
            cachePolicy="memory-disk"
            transition={200}
            style={{
              width: "100%",
              height: 300,
            }}
          />

          {/* Stück Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Stück *</Text>
            <Input
              value={stueck}
              onChangeText={setStueck}
              placeholder="Anzahl eingeben..."
              keyboardType="numeric"
            />
            <Text className="text-sm text-muted-foreground">
              Anzahl der Flexscheiben
            </Text>
          </View>

          {/* Art Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Art *</Text>
            <CheckboxWithLabel
              label="Metall"
              checked={metall}
              onToggle={() => setMetall(!metall)}
            />
            <CheckboxWithLabel
              label="Stein"
              checked={stein}
              onToggle={() => setStein(!stein)}
            />
            <CheckboxWithLabel
              label="Fächerscheibe"
              checked={faecherscheibe}
              onToggle={() => setFaecherscheibe(!faecherscheibe)}
            />
          </View>

          {/* Größe Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Größe *</Text>
            <CheckboxWithLabel
              label="125mm"
              checked={groesse125mm}
              onToggle={() => setGroesse125mm(!groesse125mm)}
            />
            <CheckboxWithLabel
              label="230mm"
              checked={groesse230mm}
              onToggle={() => setGroesse230mm(!groesse230mm)}
            />
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

export default Flexscheiben;
