import React from "react";
import { Alert } from "react-native";
import * as Linking from "expo-linking";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

interface PhoneCallButtonProps {
  phoneNumber: string;
  displayName?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  className?: string;
}

const PhoneCallButton: React.FC<PhoneCallButtonProps> = ({
  phoneNumber,
  displayName,
  variant = "outline",
  className,
}) => {
  const handlePhoneCall = async () => {
    // Clean the phone number (remove spaces, dashes, etc.)
    const cleanNumber = phoneNumber.replace(/[^\d+]/g, "");
    const phoneUrl = `tel:${cleanNumber}`;

    try {
      // Check if the device can handle phone calls
      const canOpen = await Linking.canOpenURL(phoneUrl);

      if (canOpen) {
        // Open the phone app with the number pre-filled
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert(
          "Anruf nicht möglich",
          "Ihr Gerät unterstützt keine Telefonanrufe oder die Telefon-App ist nicht verfügbar.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error opening phone app:", error);
      Alert.alert("Fehler", "Es gab ein Problem beim Öffnen der Telefon-App.", [
        { text: "OK" },
      ]);
    }
  };

  return (
    <Button onPress={handlePhoneCall} variant={variant} className={className}>
      <Text>📞 {displayName || phoneNumber}</Text>
    </Button>
  );
};

export default PhoneCallButton;
