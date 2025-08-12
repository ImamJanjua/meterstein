import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import PhoneCallButton from "~/components/PhoneCallButton";

const PhoneDemoScreen = () => {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-4">
        <Text className="text-2xl font-bold text-center mb-4">Kontakte</Text>

        {/* Emergency Contacts */}
        <Card className="p-4">
          <Text className="text-lg font-semibold mb-4 text-red-600">
            🚨 Notfallkontakte
          </Text>

          <View className="gap-3">
            <PhoneCallButton
              phoneNumber="112"
              displayName="Notruf (112)"
              variant="destructive"
              className="w-full"
            />

            <PhoneCallButton
              phoneNumber="110"
              displayName="Polizei (110)"
              variant="destructive"
              className="w-full"
            />
          </View>
        </Card>

        {/* Company Contacts */}
        <Card className="p-4">
          <Text className="text-lg font-semibold mb-4 text-blue-600">
            🏢 Unternehmen
          </Text>

          <View className="gap-3">
            <PhoneCallButton
              phoneNumber="+49 123 456789"
              displayName="Hauptgeschäft"
              variant="outline"
              className="w-full"
            />

            <PhoneCallButton
              phoneNumber="+49 987 654321"
              displayName="Kundendienst"
              variant="outline"
              className="w-full"
            />

            <PhoneCallButton
              phoneNumber="+49 555 123456"
              displayName="Technik Support"
              variant="secondary"
              className="w-full"
            />
          </View>
        </Card>

        {/* Team Contacts */}
        <Card className="p-4">
          <Text className="text-lg font-semibold mb-4 text-green-600">
            👥 Team
          </Text>

          <View className="gap-3">
            <PhoneCallButton
              phoneNumber="+49 176 12345678"
              displayName="Max Mustermann (Manager)"
              variant="outline"
              className="w-full"
            />

            <PhoneCallButton
              phoneNumber="+49 177 87654321"
              displayName="Anna Schmidt (HR)"
              variant="outline"
              className="w-full"
            />

            <PhoneCallButton
              phoneNumber="+49 178 55512345"
              displayName="Tom Wagner (IT)"
              variant="outline"
              className="w-full"
            />
          </View>
        </Card>

        {/* Info Card */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <Text className="text-sm text-blue-800 text-center">
            💡 Tipp: Tippen Sie auf eine Telefonnummer, um die Telefon-App mit
            der vorausgefüllten Nummer zu öffnen.
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
};

export default PhoneDemoScreen;
