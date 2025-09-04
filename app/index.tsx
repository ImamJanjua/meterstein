import * as React from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { supabase } from "~/lib/supabase";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { toast } from "sonner-native";

export default function LoginScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function signInWithEmail() {
    setLoading(true);
    toast.loading("Anmelden...");

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.dismiss();
      toast.success("Anmeldung erfolgreich");
      router.replace("/home");
    }

    setLoading(false);
  }

  function handleSubmit() {
    if (!email || !password) {
      toast.error("Bitte fülle alle Felder aus");
      return;
    }

    signInWithEmail();
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 justify-center items-center p-6 bg-secondary/30">
        <Card className="w-full max-w-md p-2 rounded-2xl">
          <CardHeader className="items-center">
            <CardTitle className="text-2xl text-center">Anmelden</CardTitle>
            <CardDescription className="text-center">
              Bitte melde dich mit deinem Email und Passwort an
            </CardDescription>
          </CardHeader>

          <CardContent className="gap-4">
            <View className="gap-2">
              <Text className="text-sm font-medium">E-Mail</Text>
              <Input
                placeholder="max@mustermann.de"
                value={email}
                onChangeText={(text) => setEmail(text)}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-medium">Passwort</Text>
              <Input
                placeholder="Passwort"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
              />
            </View>

            <Button
              onPress={handleSubmit}
              disabled={loading}
              className="mt-4 bg-red-500"
            >
              <Text className="font-medium text-primary-foreground">
                Bestätigen
              </Text>
            </Button>
          </CardContent>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
}
