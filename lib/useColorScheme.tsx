import { useColorScheme as useNativewindColorScheme } from "nativewind";

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useNativewindColorScheme();
  return {
    colorScheme: colorScheme ?? "dark",
    isDarkColorScheme: colorScheme === "dark",
    // colorScheme: "dark",
    // isDarkColorScheme: true,
    setColorScheme,
    toggleColorScheme,
  };
}
