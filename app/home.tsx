import React from "react";
import { View, ScrollView, TouchableOpacity, Image, Dimensions } from "react-native";
import { Text } from "~/components/ui/text";
import { router, useFocusEffect } from "expo-router";
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
  Bell,
  ChevronRight,
  Settings,
} from "lucide-react-native";
import { Card } from "~/components/ui/card";
import { supabase } from "~/lib/supabase";
import { getAppRole, getUserEmail, getUserId } from "~/lib/jwt-utils";
import { openExternalLinkById } from "~/lib/external-links";
import Test from "./test";

const HomeScreen = () => {
  const [appRole, setAppRole] = React.useState<string | null>(null);
  const [screenWidth, setScreenWidth] = React.useState(Dimensions.get('window').width);
  const [latestAlert, setLatestAlert] = React.useState<any>(null);

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

  // Fetch latest alert
  const fetchLatestAlert = async () => {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error fetching latest alert:', error);
        return;
      }

      setLatestAlert(data);
    } catch (error) {
      console.error('Error fetching latest alert:', error);
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

        setAppRole(role);
      }
    };

    getUserInfo();
    fetchLatestAlert();
  }, []);

  // Refresh alerts when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchLatestAlert();
    }, [])
  );

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
      onPress: () => openExternalLinkById("kalendar"),
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
    {
      id: "büro",
      title: "Büro",
      icon: Settings,
      onPress: () => router.push("/admin" as any),
    },
  ];

  // Filter navigation items based on app role
  const navigationItems = allNavigationItems.filter((item) => {
    if (appRole === "aushilfe") {
      // Hide "lieferung", "kontakt", and "büro" for aushilfe role
      return item.id !== "lieferung" && item.id !== "kontakt" && item.id !== "büro";
    }
    if (appRole === "montage") {
      // Show all items for montage role (including "lieferung") but hide "büro"
      return item.id !== "büro";
    }
    if (appRole === "büro") {
      // Show all items including "büro" for büro role
      return true;
    }
    // For other roles, hide admin
    return item.id !== "büro";
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

        {/* Alerts Section */}
        {latestAlert && (
          <View className="mb-6">
            <TouchableOpacity
              onPress={() => router.push("/alerts")}
              className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <Bell size={20} className="text-red-600 dark:text-red-400 mr-3" />
                  <View className="flex-1">
                    <Text className="text-red-900 dark:text-red-100 font-semibold text-sm mb-1">
                      {latestAlert.title}
                    </Text>
                    <Text className="text-red-700 dark:text-red-300 text-xs" numberOfLines={2}>
                      {latestAlert.content}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={16} className="text-red-600 dark:text-red-400" />
              </View>
            </TouchableOpacity>
          </View>
        )}

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
