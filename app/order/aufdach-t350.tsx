import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
import * as MailComposer from "expo-mail-composer";
import { toast } from "sonner-native";
import { EMAIL_RECIPIENTS } from "~/lib/constants";

const UnterdachT350 = () => {
  // Customer and measurement fields
  const [nameKunde, setNameKunde] = React.useState("");
  const [measurementA, setMeasurementA] = React.useState("");
  const [measurementB, setMeasurementB] = React.useState("");

  // Color and motor side
  const [farbe, setFarbe] = React.useState("");
  const [motorseite, setMotorseite] = React.useState("");

  // Motor state
  const [motorType, setMotorType] = React.useState("");

  // Zubehör state
  const [windwaechter, setWindwaechter] = React.useState(false);
  const [sonnenwaechter, setSonnenwaechter] = React.useState(false);
  const [regensensor, setRegensensor] = React.useState(false);
  const [fernbedienung5Kanal, setFernbedienung5Kanal] = React.useState(false);
  const [fernbedienung1Kanal, setFernbedienung1Kanal] = React.useState(false);

  // Form fields state
  const [stoff, setStoff] = React.useState("");
  const [wichtiges, setWichtiges] = React.useState("");

  const motorOptions = ["Io mit Fernbedienung", "Kabelgebunden"];

  const farbeOptions = [
    "RAL 7016 Anthrazit",
    "RAL 9016 Weiß",
    "RAL 9010 Weiß Struktur",
    "RAL 9007 Silberbronze",
  ];

  const motorseiteOptions = ["Links", "Rechts"];

  function resetForm() {
    setNameKunde("");
    setMeasurementA("");
    setMeasurementB("");
    setFarbe("");
    setMotorseite("");
    setMotorType("");
    setWindwaechter(false);
    setSonnenwaechter(false);
    setRegensensor(false);
    setFernbedienung5Kanal(false);
    setFernbedienung1Kanal(false);
    setStoff("");
    setWichtiges("");
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

    // Compose email body
    const selectedZubehoer = [];
    if (windwaechter) selectedZubehoer.push("Windwächter");
    if (sonnenwaechter) selectedZubehoer.push("Sonnenwächter");
    if (regensensor) selectedZubehoer.push("Regensensor");
    if (fernbedienung5Kanal) selectedZubehoer.push("5 Kanal Fernbedienung");
    if (fernbedienung1Kanal) selectedZubehoer.push("1 Kanal Fernbedienung");

    const emailBody = `
  Bestellung - Aufdach T350 ZIP
  
  Kundenname: ${nameKunde}
  
  Maße:
  a: ${measurementA} mm (Innenkante - Innenkante -60mm)
  b: ${measurementB} mm (Außenkante - Außenkante)
  
  Farbe: ${farbe || "Nicht ausgewählt"}
  
  Motorseite: ${motorseite || "Nicht ausgewählt"}
  
  Motor:
  ${motorType || "Nicht ausgewählt"}
  
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
  
  ---
  Gesendet über Meterstein
      `.trim();

    try {
      // Compose email
      const result = await MailComposer.composeAsync({
        recipients: EMAIL_RECIPIENTS,
        subject: `Bestellung - Unterdach T350 ZIP - ${nameKunde}`,
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
            source={require("~/assets/images/unterdach-t200.webp")}
            contentFit="contain"
            cachePolicy="memory-disk"
            transition={200}
            style={{
              width: "100%",
              height: 300,
            }}
          />

          {/* Important Measurement Information */}
          <View className="gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <Text className="text-lg font-bold text-orange-800 dark:text-orange-200">
              WICHTIG für Maß "a"
            </Text>
            <Text className="text-base text-orange-700 dark:text-orange-300">
              zur Messung wird Innenkante zu Innenkante Sparren benötigt.
            </Text>
            <Text className="text-base font-semibold text-orange-800 dark:text-orange-200">
              dieses Maß -60mm ist Maß "a"
            </Text>
            <Text className="text-base text-orange-700 dark:text-orange-300">
              Maß "b" sollte klar sein.
            </Text>
          </View>

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

          {/* Motorseite Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Motorseite</Text>
            <RadioGroup
              value={motorseite}
              onValueChange={setMotorseite}
              className="gap-3"
            >
              {motorseiteOptions.map((option) => (
                <RadioGroupItemWithLabel
                  key={option}
                  value={option}
                  onLabelPress={() => setMotorseite(option)}
                />
              ))}
            </RadioGroup>
          </View>

          {/* Motor Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Motor</Text>
            <RadioGroup
              value={motorType}
              onValueChange={setMotorType}
              className="gap-3"
            >
              {motorOptions.map((option) => (
                <RadioGroupItemWithLabel
                  key={option}
                  value={option}
                  onLabelPress={() => setMotorType(option)}
                />
              ))}
            </RadioGroup>
          </View>

          {/* Zubehör Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Zubehör *</Text>
            <CheckboxWithLabel
              label="Windwächter"
              checked={windwaechter}
              onToggle={() => setWindwaechter(!windwaechter)}
            />

            <CheckboxWithLabel
              label="Sonnenwächter"
              checked={sonnenwaechter}
              onToggle={() => setSonnenwaechter(!sonnenwaechter)}
            />

            <CheckboxWithLabel
              label="Regensensor"
              checked={regensensor}
              onToggle={() => setRegensensor(!regensensor)}
            />

            <CheckboxWithLabel
              label="5 Kanal Fernbedienung"
              checked={fernbedienung5Kanal}
              onToggle={() => setFernbedienung5Kanal(!fernbedienung5Kanal)}
            />

            <CheckboxWithLabel
              label="1 Kanal Fernbedienung"
              checked={fernbedienung1Kanal}
              onToggle={() => setFernbedienung1Kanal(!fernbedienung1Kanal)}
            />
          </View>

          {/* Stoff Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Stoff *</Text>
            <Textarea
              value={stoff}
              onChangeText={setStoff}
              placeholder="Beschreiben Sie den gewünschten Stoff..."
            />
          </View>

          {/* Wichtiges Section */}
          <View className="gap-2">
            <Text className="text-lg font-semibold">Wichtiges</Text>
            <Textarea
              value={wichtiges}
              onChangeText={setWichtiges}
              placeholder="Wichtige Informationen..."
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

export default UnterdachT350;
