import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import PhoneCallButton from "~/components/PhoneCallButton";

const KontaktScreen = () => {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-4 mb-8">
        <View className="mb-8 mt-8 items-center">
          <Text className="text-3xl font-bold text-red-500">Kontakte</Text>
        </View>

        {/* Management Contacts */}
        <Card className="p-4">
          <Text className="text-lg font-semibold mb-4 text-blue-600">
            👔 Management
          </Text>

          <View className="gap-3">
            <PhoneCallButton
              phoneNumber="+491634631111"
              displayName="MEHMET ORGANISATION"
              variant="outline"
              className="w-full"
            />

            <PhoneCallButton
              phoneNumber="+491723271132"
              displayName="GESCHÄFTSFÜHRUNG"
              variant="outline"
              className="w-full"
            />
          </View>
        </Card>

        {/* Office Contacts */}
        <Card className="p-4">
          <Text className="text-lg font-semibold mb-4 text-green-600">
            🏢 Büro
          </Text>

          <View className="gap-3">
            <PhoneCallButton
              phoneNumber="+4915228722556"
              displayName="ÖZLEM BUCHHALTUNG"
              variant="outline"
              className="w-full"
            />

            <PhoneCallButton
              phoneNumber="+4982145034995"
              displayName="METERSTEIN BÜRO"
              variant="outline"
              className="w-full"
            />
          </View>
        </Card>

        {/* Sales Team */}
        <Card className="p-4">
          <Text className="text-lg font-semibold mb-4 text-purple-600">
            💼 Vertrieb
          </Text>

          <View className="gap-3">
            <PhoneCallButton
              phoneNumber="+4915168454060"
              displayName="MARKUS VERTRIEB"
              variant="outline"
              className="w-full"
            />

            <PhoneCallButton
              phoneNumber="+4915168450427"
              displayName="MIKE VERTRIEB"
              variant="outline"
              className="w-full"
            />
          </View>
        </Card>

        {/* Production Team */}
        <Card className="p-4">
          <Text className="text-lg font-semibold mb-4 text-orange-600">
            🔧 Produktion
          </Text>

          <View className="gap-3">
            <PhoneCallButton
              phoneNumber="+491792008765"
              displayName="ABDUL GLASER GERSTHOFEN"
              variant="outline"
              className="w-full"
            />
          </View>
        </Card>

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
      </View>
    </ScrollView>
  );
};

export default KontaktScreen;
