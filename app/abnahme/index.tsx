import React from "react";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import { ChevronRight } from "~/lib/icons/index";
import { openExternalLinkById } from "~/lib/external-links";

const AbnahmeScreen = () => {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-4 flex-1 justify-center">
        {/* Header */}
        <View className="mb-16 mt-8 items-center">
          <Text className="text-3xl font-bold text-red-500 mb-2">Abnahme</Text>
          <Text className="text-lg text-muted-foreground">
            Wählen Sie eine Option aus
          </Text>
        </View>

        {/* Abnahme Button */}
        <Card className="overflow-hidden">
          <TouchableOpacity
            onPress={() => openExternalLinkById("abnahme")}
            className="p-4 flex-row items-center justify-between bg-primary/5"
          >
            <View className="flex-row items-center gap-3">
              <Image
                source={require("~/assets/images/abnahme-icon.webp")}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={200}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 8,
                }}
              />
              <Text className="text-lg font-semibold">Abnahme</Text>
            </View>
            <ChevronRight className="w-6 h-6 text-foreground" />
          </TouchableOpacity>
        </Card>

        <View className="h-px bg-red-500 mx-4 my-2 mt-4" />

        {/* Teilabnahme Button */}
        <Card className="overflow-hidden">
          <TouchableOpacity
            onPress={() => openExternalLinkById("abnahme")}
            className="p-4 flex-row items-center justify-between bg-primary/5"
          >
            <View className="flex-row items-center gap-3">
              <Image
                source={require("~/assets/images/teilabnahme-icon.webp")}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={200}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 8,
                }}
              />
              <Text className="text-lg font-semibold">Teilabnahme</Text>
            </View>
            <ChevronRight className="w-6 h-6 text-foreground" />
          </TouchableOpacity>
        </Card>
      </View>
    </ScrollView>
  );
};

export default AbnahmeScreen;
