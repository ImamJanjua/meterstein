import { Stack, router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Lieferung",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-row items-center ml-2"
            >
              <Text className="text-lg font-semibold mr-2">←</Text>
              <Text className="text-lg font-semibold">Home</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
