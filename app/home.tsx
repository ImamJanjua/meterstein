import { View, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  Link,
  Calendar,
  Mail,
  ShoppingCart,
  Truck,
  AlertTriangle,
  HelpCircle,
  Car,
  Plane,
  Phone,
} from "lucide-react-native";

const HomeScreen = () => {
  const navigationItems = [
    {
      id: "bestellung",
      title: "Bestellung",
      icon: ShoppingCart,
      color: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      onPress: () => router.push("/order"),
    },
    {
      id: "lieferung",
      title: "Lieferung",
      icon: Truck,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      onPress: () => router.push("/delivery" as any),
    },
    {
      id: "problem",
      title: "Problem",
      icon: AlertTriangle,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      onPress: () => router.push("/problem"),
    },
    {
      id: "abnahme",
      title: "Abnahme",
      icon: Link,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      onPress: () => router.push("/abnahme" as any),
    },
    {
      id: "kalender",
      title: "Kalender",
      icon: Calendar,
      color: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      onPress: () => router.push("/order" as any),
    },
    {
      id: "kontakt",
      title: "Kontakt",
      icon: Mail,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      onPress: () => router.push("/order" as any),
    },
    {
      id: "hilfe",
      title: "Hilfe",
      icon: HelpCircle,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      onPress: () => router.push("/hilfe" as any),
    },
    {
      id: "autos",
      title: "Autos",
      icon: Car,
      color: "text-teal-500",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
      onPress: () => router.push("/order" as any),
    },
    {
      id: "frei",
      title: "Frei?",
      icon: Plane,
      color: "text-pink-500",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      onPress: () => router.push("/frei" as any),
    },
    {
      id: "phone",
      title: "Telefon",
      icon: Phone,
      color: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      onPress: () => router.push("/phone-demo" as any),
    },
  ];

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Willkommen
          </Text>
          <Text className="text-lg text-muted-foreground">
            Wählen Sie eine Option aus dem Menü
          </Text>
        </View>

        {/* Grid Layout */}
        <View className="flex-row flex-wrap justify-between">
          {navigationItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={item.onPress}
              className="w-[30%] mb-6"
              activeOpacity={0.7}
            >
              <Card
                className={`p-4 items-center border-2 ${item.borderColor} ${item.bgColor} shadow-sm`}
              >
                <View className={`p-3 rounded-full ${item.bgColor} mb-3`}>
                  <item.icon size={32} className={item.color} />
                </View>
                <Text className="text-sm font-semibold text-gray-800 text-center">
                  {item.title}
                </Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
