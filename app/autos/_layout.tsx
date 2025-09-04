import { Stack, router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { ChevronLeft } from "~/lib/icons/index";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: "",
        headerTitleAlign: "center",
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center ml-2"
          >
            <ChevronLeft className="w-6 h-6 text-red-500" />
            <Text className="text-lg font-semibold text-red-500">Zurück</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-row items-center ml-2"
            >
              <ChevronLeft className="w-6 h-6 text-red-500" />
              <Text className="text-lg font-semibold text-red-500">Home</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
