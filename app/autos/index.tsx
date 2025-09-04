import React, { useState } from "react";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import { ChevronRight, Car, Bus, Forklift } from "~/lib/icons/index";

const AutosCategoriesScreen = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const categories = [
    {
      id: "checkup",
      name: "Check-Up",
      image: require("~/assets/images/checkup-icon.webp"),
      items: [
        {
          id: "ford-5160",
          name: "Ford A:MMS 5160 Check-Up",
          description: "Fahrzeuginspektion durchführen",
          icon: Car,
        },
        {
          id: "opel-783",
          name: "Opel A:Y 783 Check-Up",
          description: "Fahrzeuginspektion durchführen",
          icon: Car,
        },
        {
          id: "iveco-8004",
          name: "Iveco 1 A:V 8004 Check-Up",
          description: "Fahrzeuginspektion durchführen",
          icon: Bus,
        },
        {
          id: "iveco-4115",
          name: "Iveco 2 A:D 4115 Check-Up",
          description: "Fahrzeuginspektion durchführen",
          icon: Bus,
        },
        {
          id: "stapler",
          name: "Stapler Check-Up",
          description: "Staplerinspektion durchführen",
          icon: Forklift,
        },
      ],
    },
  ];

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-4 flex-1 justify-center">
        {/* Header */}
        <View className="mb-16 mt-8 items-center">
          <Text className="text-3xl font-bold text-red-500 mb-2">Autos</Text>
          <Text className="text-lg text-muted-foreground">
            Wählen Sie eine Kategorie aus
          </Text>
        </View>

        {/* Unfall/Schaden Direct Button */}
        <Card className="overflow-hidden">
          <TouchableOpacity
            onPress={() => router.push("/autos/unfall-schaden" as any)}
            className="p-4 flex-row items-center justify-between bg-primary/5"
          >
            <View className="flex-row items-center gap-3">
              <Image
                source={require("~/assets/images/unfall-icon.jpg")}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={200}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 8,
                }}
              />
              <Text className="text-lg font-semibold">Unfall/Schaden</Text>
            </View>
            <ChevronRight className="w-6 h-6 text-foreground" />
          </TouchableOpacity>
        </Card>

        <View className="h-px bg-red-500 mx-4 my-2 mt-4" />

        {/* Check-Up Accordion */}
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <TouchableOpacity
              onPress={() =>
                setExpandedCategory(
                  expandedCategory === category.id ? null : category.id
                )
              }
              className="p-4 flex-row items-center justify-between bg-primary/5"
            >
              <View className="flex-row items-center gap-3">
                <Image
                  source={category.image}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  transition={200}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 8,
                  }}
                />
                <Text className="text-lg font-semibold">{category.name}</Text>
              </View>
              <ChevronRight className="w-6 h-6 text-foreground" />
            </TouchableOpacity>

            {expandedCategory === category.id && (
              <View className="border-t border-border">
                {category.items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      // Navigate to specific item form
                      router.push(`/autos/${item.id}` as any);
                    }}
                    className="p-4 flex-row items-center justify-between bg-secondary/20 border-b border-red-500/40"
                  >
                    <View className="flex-row items-center gap-3 flex-1">
                      {item.icon && (
                        <item.icon
                          size={24}
                          className={
                            item.id === "stapler"
                              ? "text-yellow-500"
                              : item.id.includes("ford") ||
                                item.id.includes("opel")
                              ? "text-red-500"
                              : "text-foreground"
                          }
                        />
                      )}
                      <View className="flex-1">
                        <Text className="font-medium text-lg">{item.name}</Text>
                        <Text className="text-sm text-muted-foreground">
                          {item.description}
                        </Text>
                      </View>
                    </View>
                    <ChevronRight className="w-6 h-6 text-foreground" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

export default AutosCategoriesScreen;
