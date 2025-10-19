import "~/global.css";

import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Text } from "~/components/ui/text";
import { TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack, router, usePathname, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Appearance, Platform, View } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { Toaster } from "sonner-native";
import { supabase } from "~/lib/supabase";
import * as SplashScreen from "expo-splash-screen";
import { ChevronLeft } from "~/lib/icons/index";
import { getAppRole, getUserName } from "~/lib/jwt-utils";
import { colorScheme } from "nativewind";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

const usePlatformSpecificSetup = Platform.select({
  web: useSetWebBackgroundClassName,
  android: useSetAndroidNavigationBar,
  default: noop,
});

// Route Logger Component
function RouteLogger() {
  const pathname = usePathname();
  const segments = useSegments();

  React.useEffect(() => {
    console.log("📍 Current Route:", {
      pathname,
      segments,
      fullPath: `/${segments.join("/")}`,
    });
  }, [pathname, segments]);

  return null;
}

export default function RootLayout() {
  usePlatformSpecificSetup();
  const { isDarkColorScheme } = useColorScheme();
  const [appIsReady, setAppIsReady] = React.useState(false);

  React.useEffect(() => {
    async function prepare() {
      colorScheme.set("dark");
      try {
        await SplashScreen.preventAutoHideAsync();
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Don't navigate here, just set up the auth listener
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
          if (session?.access_token) {
            // const appRole = getAppRole(session.access_token);
            // const userName = getUserName(session.access_token);
            // console.log("🔐 App Role:", appRole);
            // console.log("🔐 User Name:", userName);
          }

          if (event === "INITIAL_SESSION") {
          } else if (event === "SIGNED_IN") {
          } else if (event === "SIGNED_OUT") {
            router.replace("/");
          }
        });

        return () => {
          data.subscription.unsubscribe();
        };
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);


  React.useEffect(() => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      SplashScreen.hideAsync();

      // Check if user is already signed in and navigate accordingly
      // supabase.auth.getSession().then(({ data: { session } }) => {
      //   if (session) {
      //     router.replace("/home");
      //   }
      // });
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
        <RouteLogger />
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: "Meterstein",
              headerTitleStyle: {
                color: "#BE1D1C",
              },
              // headerRight: () => <ThemeToggle />,
            }}
          />
          <Stack.Screen
            name="home"
            options={{
              title: "Home",
              headerTitleStyle: {
                color: "#BE1D1C",
              },
            }}
          />
          <Stack.Screen
            name="order"
            options={{
              title: "Bestellung",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="delivery"
            options={{
              title: "Lieferung",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="problem"
            options={{
              title: "",
              headerTitleAlign: "center",
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => router.back()}
                  className="flex-row items-center ml-2"
                >
                  <ChevronLeft className="w-6 h-6 text-red-500" />
                  <Text className="text-lg font-semibold text-red-500">
                    Home
                  </Text>
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="alerts"
            options={{
              title: "",
              headerTitleAlign: "center",
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => router.back()}
                  className="flex-row items-center ml-2"
                >
                  <ChevronLeft className="w-6 h-6 text-red-500" />
                  <Text className="text-lg font-semibold text-red-500">
                    Home
                  </Text>
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="admin"
            options={{
              title: "",
              headerTitleStyle: {
                color: "#BE1D1C",
              },
              headerTitleAlign: "center",
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => router.back()}
                  className="flex-row items-center ml-2"
                >
                  <ChevronLeft className="w-6 h-6 text-red-500" />
                  <Text className="text-lg font-semibold text-red-500">
                    Home
                  </Text>
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="autos"
            options={{
              title: "Autos",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="abnahme"
            options={{
              title: "Abnahme",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="kontakt"
            options={{
              title: "",
              headerTitleAlign: "center",
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => router.back()}
                  className="flex-row items-center ml-2"
                >
                  <ChevronLeft className="w-6 h-6 text-red-500" />
                  <Text className="text-lg font-semibold text-red-500">
                    Home
                  </Text>
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="hilfe"
            options={{
              title: "Hilfe",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="frei"
            options={{
              title: "",
              headerTitleAlign: "center",
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => router.back()}
                  className="flex-row items-center ml-2"
                >
                  <ChevronLeft className="w-6 h-6 text-red-500" />
                  <Text className="text-lg font-semibold text-red-500">
                    Home
                  </Text>
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="kalendar"
            options={{
              title: "",
              headerTitleAlign: "center",
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => router.back()}
                  className="flex-row items-center ml-2"
                >
                  <ChevronLeft className="w-6 h-6 text-red-500" />
                  <Text className="text-lg font-semibold text-red-500">
                    Home
                  </Text>
                </TouchableOpacity>
              ),
            }}
          />
        </Stack>
        <Toaster />
        <PortalHost />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;

function useSetWebBackgroundClassName() {
  useIsomorphicLayoutEffect(() => {
    // Adds the background color to the html element to prevent white background on overscroll.
    document.documentElement.classList.add("bg-background");
  }, []);
}

function useSetAndroidNavigationBar() {
  React.useLayoutEffect(() => {
    setAndroidNavigationBar(Appearance.getColorScheme() ?? "light");
  }, []);
}

function noop() { }
