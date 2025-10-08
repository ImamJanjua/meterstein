import React from "react";
import { View, ScrollView, TouchableOpacity, Image, Dimensions } from "react-native";
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
  LogOut,
} from "lucide-react-native";
import { Card } from "~/components/ui/card";
import { supabase } from "~/lib/supabase";
import { getAppRole, getUserEmail, getUserId } from "~/lib/jwt-utils";

const HomeScreen = () => {
  const [appRole, setAppRole] = React.useState<string | null>(null);
  const [screenWidth, setScreenWidth] = React.useState(Dimensions.get('window').width);

  // Logout function
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Navigate to login or home page after logout
      router.replace("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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

  // Listen for screen size changes
  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });

    return () => subscription?.remove();
  }, []);

  // Get responsive logo size
  const getLogoSize = () => {
    if (Platform.OS !== "web") {
      return { width: 256, height: 256 };
    }

    // Responsive sizes based on screen width
    if (screenWidth < 480) return { width: 400, height: 400 };      // Very small mobile
    if (screenWidth < 640) return { width: 450, height: 450 };       // Mobile
    if (screenWidth < 768) return { width: 500, height: 500 };     // Small tablet
    if (screenWidth < 1024) return { width: 550, height: 550 };   // Large tablet
    if (screenWidth < 1280) return { width: 600, height: 600 };   // Small desktop
    return { width: 650, height: 650 };                           // Large desktop
  };

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
      // Show all items for montage role (including "lieferung")
      return true;
    }
    return true; // Show all items for other roles
  });

  return (
    <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Header */}
        <View className="items-center justify-center -mt-16 -mb-8">
          <Image
            source={require("../assets/images/icon-dark-transparent.png")}
            style={getLogoSize()}
            resizeMode="contain"
          />
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

        {/* Logout Button */}
        <View className="mt-8 mb-4 items-center">
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center justify-center px-6 py-3 bg-red-500/10 rounded-lg border border-red-500/20 self-center"
            activeOpacity={0.7}
          >
            <LogOut size={18} className="text-red-500 mr-2" />
            <Text className="text-red-500 font-semibold text-sm">Abmelden</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
