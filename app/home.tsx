import React from "react";
import { View, ScrollView, TouchableOpacity, Image } from "react-native";
import { Text } from "~/components/ui/text";
import { router } from "expo-router";
import { useColorScheme } from "~/lib/useColorScheme";
import { Platform } from "react-native";
import {
  AlertTriangle,
  Link,
  Calendar,
  Mail,
  HelpCircle,
  Car,
  Plane,
  Package,
  Truck,
  ClipboardList,
} from "lucide-react-native";
import { Card } from "~/components/ui/card";
import { supabase } from "~/lib/supabase";
import { getAppRole, getUserEmail, getUserId } from "~/lib/jwt-utils";

const HomeScreen = () => {
  const { isDarkColorScheme } = useColorScheme();
  const [appRole, setAppRole] = React.useState<string | null>(null);

  // Get user info from token
  React.useEffect(() => {
    const getUserInfo = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.access_token) {
        const role = getAppRole(session.access_token);
        const userEmail = getUserEmail(session.access_token);
        const userId = getUserId(session.access_token);

        setAppRole(role);

        console.log("🏠 Home Screen - User Info:", {
          appRole: role,
          userEmail,
          userId,
        });
      }
    };

    getUserInfo();
  }, []);

  const allNavigationItems = [
    {
      id: "bestellung",
      title: "Bestellung",
      icon: Package,
      onPress: () => router.push("/order"),
    },
    {
      id: "lieferung",
      title: "Lieferung",
      icon: Truck,
      onPress: () => router.push("/delivery" as any),
    },
    {
      id: "reklamation",
      title: "Reklamation",
      icon: AlertTriangle,
      onPress: () => router.push("/problem"),
    },
    {
      id: "abnahme",
      title: "Abnahme",
      icon: ClipboardList,
      onPress: () => router.push("/abnahme" as any),
    },
    {
      id: "kalender",
      title: "Kalender",
      icon: Calendar,
      onPress: () => router.push("/kalendar" as any),
    },
    {
      id: "kontakt",
      title: "Kontakt",
      icon: Mail,
      onPress: () => router.push("/kontakt" as any),
    },
    {
      id: "hilfe",
      title: "Hilfe",
      icon: HelpCircle,
      onPress: () => router.push("/hilfe" as any),
    },
    {
      id: "autos",
      title: "Autos",
      icon: Car,
      onPress: () => router.push("/autos" as any),
    },
    {
      id: "frei",
      title: "Frei?",
      icon: Plane,
      onPress: () => router.push("/frei" as any),
    },
  ];

  // Filter navigation items based on app role
  const navigationItems = allNavigationItems.filter((item) => {
    if (appRole === "aushilfe") {
      // Hide "lieferung" and "kontakt" for aushilfe role
      return item.id !== "lieferung" && item.id !== "kontakt";
    }
    if (appRole === "montage") {
      // Hide only "lieferung" for montage role
      return item.id !== "lieferung";
    }
    return true; // Show all items for other roles
  });

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        {/* Header */}
        <View className="items-center justify-center mb-12">
          {isDarkColorScheme ? (
            <Image
              source={require("../assets/images/icon-dark-transparent.png")}
              className={Platform.OS === "web" ? "w-16 h-16" : "w-64 h-64"}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={require("../assets/images/icon-transparent.png")}
              className={
                Platform.OS === "web" ? "w-12 h-12 mt-12" : "w-40 h-40 mt-12"
              }
              resizeMode="contain"
            />
          )}
        </View>

        {/* Grid Layout */}
        <View className="flex-row flex-wrap justify-between">
          {navigationItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={item.onPress}
              className="w-[30%] mb-4 p-2 items-center"
              activeOpacity={0.7}
            >
              <View className="mb-4">
                <item.icon size={48} className="text-card-foreground" />
              </View>
              <Text className="text-base font-semibold text-foreground text-center">
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
