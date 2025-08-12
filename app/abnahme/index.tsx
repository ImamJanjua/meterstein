import React from "react";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";

const ProblemScreen = () => {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-3">
        {/* Abnahme Button */}
        <Card className="overflow-hidden">
          <TouchableOpacity
            onPress={() => router.push("/abnahme/abnahme" as any)}
            className="p-4 flex-row items-center justify-between bg-primary/5"
          >
            <View className="flex-row items-center gap-3">
              <Text className="text-2xl">📋</Text>
              <Text className="text-lg font-semibold">Abnahme</Text>
            </View>
            <Text className="text-lg">→</Text>
          </TouchableOpacity>
        </Card>

        {/* Teilabnahme Button */}
        <Card className="overflow-hidden">
          <TouchableOpacity
            onPress={() => router.push("/abnahme/teilabnahme" as any)}
            className="p-4 flex-row items-center justify-between bg-primary/5"
          >
            <View className="flex-row items-center gap-3">
              <Text className="text-2xl">📝</Text>
              <Text className="text-lg font-semibold">Teilabnahme</Text>
            </View>
            <Text className="text-lg">→</Text>
          </TouchableOpacity>
        </Card>
      </View>
    </ScrollView>
  );
};

export default ProblemScreen;
