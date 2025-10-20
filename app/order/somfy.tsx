import {
    View,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Modal,
    Dimensions,
} from "react-native";
import { Image } from "expo-image";
import React from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Label } from "~/components/ui/label";
import { toast } from "sonner-native";
import { supabase } from "~/lib/supabase";
import { getUserName } from "~/lib/jwt-utils";
import { BACKEND_URL } from "~/lib/constants";

const Flexscheiben = () => {
    // Image zoom state
    const [isImageModalVisible, setIsImageModalVisible] = React.useState(false);

    // Art (Type)
    const [metall, setMetall] = React.useState(false);
    const [stein, setStein] = React.useState(false);
    const [faecherscheibe, setFaecherscheibe] = React.useState(false);
    const [fernbedienung1Kanal, setFernbedienung1Kanal] = React.useState(false);
    const [fernbedienung5Kanal, setFernbedienung5Kanal] = React.useState(false);



    // Stück (Quantity)
    const [stueck, setStueck] = React.useState("");
    const [nameKunde, setNameKunde] = React.useState("");
    const [isSending, setIsSending] = React.useState(false);

    function resetForm() {
        setMetall(false);
        setStein(false);
        setFaecherscheibe(false);
        setFernbedienung1Kanal(false);
        setFernbedienung5Kanal(false);
        setStueck("");
        setNameKunde("");
    }

    async function sendOrder() {
        const { data: { session } } = await supabase.auth.getSession();
        const userName = getUserName(session?.access_token || "");


        // Validate required fields
        if (!nameKunde.trim()) {
            toast.error("Kundenname erforderlich", {
                description: "Bitte geben Sie den Namen des Kunden ein.",
            });
            return;
        }

        if (!stueck.trim()) {
            toast.error("Stück erforderlich", {
                description: "Bitte geben Sie die Anzahl der Stücke ein.",
            });
            return;
        }

        if (!metall && !stein && !faecherscheibe && !fernbedienung1Kanal && !fernbedienung5Kanal) {
            toast.error("Art erforderlich", {
                description: "Bitte wählen Sie mindestens eine Art aus.",
            });
            return;
        }


        try {
            setIsSending(true);
            toast.loading("E-Mail wird gesendet...", {
                description: "Bitte warten Sie einen Moment.",
            });

            // Send email via Resend API
            const response = await fetch(`${BACKEND_URL}/api/email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    senderName: `${userName}`,
                    type: 'Bestellung - Sompfy',
                    data: {
                        NameKunde: nameKunde.trim(),
                        Stück: stueck.trim(),
                        "Art - Io louver": metall ? "Ja" : "Nein",
                        "Art - White reciver 24v": stein ? "Ja" : "Nein",
                        "Art - RGB reciver 24v": faecherscheibe ? "Ja" : "Nein",
                        "Art - 1 Kanal Fernbedienung": fernbedienung1Kanal ? "Ja" : "Nein",
                        "Art - 5 Kanal Fernbedienung": fernbedienung5Kanal ? "Ja" : "Nein",
                    },
                    imageUrls: [],
                }),
            });

            const result = await response.json();

            if (result.success) {
                toast.dismiss();
                toast.success("E-Mail gesendet", {
                    description: "Die Bestellung wurde erfolgreich gesendet.",
                });
                resetForm();
            } else {
                toast.dismiss();
                toast.error("Fehler beim Senden", {
                    description: result.error || "Ein Fehler ist beim Senden der E-Mail aufgetreten.",
                });
            }
        } catch (error: any) {
            console.error("Error sending email:", error);
            toast.dismiss();
            toast.error("Fehler beim Senden", {
                description: "Ein Fehler ist beim Senden der E-Mail aufgetreten.",
            });
        } finally {
            setIsSending(false);
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
            style={{ flex: 1 }}
        >
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <View className="gap-8 p-4 bg-background/30">
                    <View className="mt-8 items-center">
                        <Text className="text-3xl font-bold text-red-500">
                            Somfy
                        </Text>
                    </View>

                    {/* Product Image */}
                    <TouchableOpacity
                        onPress={() => setIsImageModalVisible(true)}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={require("~/assets/images/somfy.jpg")}
                            contentFit="contain"
                            cachePolicy="memory-disk"
                            transition={200}
                            style={{
                                width: "100%",
                                height: 300,
                            }}
                        />
                    </TouchableOpacity>


                    {/* Name Kunde Section */}
                    <View className="gap-2">
                        <Text className="text-lg font-semibold">Name Kunde *</Text>
                        <Input
                            value={nameKunde}
                            onChangeText={setNameKunde}
                            placeholder="Name des Kunden eingeben..."
                        />
                    </View>

                    {/* Stück Section */}
                    <View className="gap-2">
                        <Text className="text-lg font-semibold">Stück *</Text>
                        <Input
                            value={stueck}
                            onChangeText={setStueck}
                            placeholder="Anzahl eingeben..."
                            keyboardType="numeric"
                        />
                        <Text className="text-muted-foreground">
                            Anzahl der Sompfy
                        </Text>
                    </View>

                    {/* Art Section */}
                    <View className="gap-2">
                        <Text className="text-lg font-semibold">Art *</Text>
                        <CheckboxWithLabel
                            label="Io louver"
                            checked={metall}
                            onToggle={() => setMetall(!metall)}
                        />
                        <CheckboxWithLabel
                            label="White reciver 24v"
                            checked={stein}
                            onToggle={() => setStein(!stein)}
                        />
                        <CheckboxWithLabel
                            label="RGB reciver 24v"
                            checked={faecherscheibe}
                            onToggle={() => setFaecherscheibe(!faecherscheibe)}
                        />
                        <CheckboxWithLabel
                            label="1 Kanal Fernbedienung"
                            checked={fernbedienung1Kanal}
                            onToggle={() => setFernbedienung1Kanal(!fernbedienung1Kanal)}
                        />
                        <CheckboxWithLabel
                            label="5 Kanal Fernbedienung"
                            checked={fernbedienung5Kanal}
                            onToggle={() => setFernbedienung5Kanal(!fernbedienung5Kanal)}
                        />
                    </View>


                    {/* Send Button */}
                    <Button onPress={sendOrder} className="bg-red-500 mb-8 mt-8" disabled={isSending}>
                        <Text className="text-foreground">{isSending ? "Wird gesendet..." : "Senden"}</Text>
                    </Button>
                </View>
            </ScrollView>

            {/* Image Zoom Modal */}
            <Modal
                visible={isImageModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsImageModalVisible(false)}
            >
                <View className="flex-1 bg-black/90">
                    {/* Image Container */}
                    <View className="flex-1 justify-center items-center">
                        {/* Close Button */}
                        <TouchableOpacity
                            onPress={() => setIsImageModalVisible(false)}
                            className="absolute top-20 w-14 h-14 right-8 items-center justify-center z-20 bg-red-500 rounded-full p-2 shadow-lg"
                            activeOpacity={0.7}
                        >
                            <Text className="text-white text-xl font-bold">✕</Text>
                        </TouchableOpacity>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            maximumZoomScale={3.0}
                            minimumZoomScale={1.0}
                            contentContainerStyle={{
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            style={{ flex: 1 }}
                        >
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                maximumZoomScale={3.0}
                                minimumZoomScale={1.0}
                                contentContainerStyle={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                style={{ flex: 1 }}
                            >
                                <Image
                                    source={require("~/assets/images/somfy.jpg")}
                                    contentFit="contain"
                                    cachePolicy="memory-disk"
                                    transition={200}
                                    style={{
                                        width: Dimensions.get("window").width * 0.85,
                                        height: Dimensions.get("window").height * 0.8,
                                    }}
                                />
                            </ScrollView>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};

function CheckboxWithLabel({
    label,
    checked,
    onToggle,
}: {
    label: string;
    checked: boolean;
    onToggle: () => void;
}) {
    return (
        <TouchableOpacity
            onPress={onToggle}
            className="flex-row gap-2 items-center py-2"
        >
            <View
                className={`w-5 h-5 border-2 rounded ${checked
                    ? "bg-primary border-primary"
                    : "bg-background border-muted-foreground"
                    } items-center justify-center`}
            >
                {checked && <Text className="text-primary-foreground text-xs">✓</Text>}
            </View>
            <Label>{label}</Label>
        </TouchableOpacity>
    );
}

export default Flexscheiben;
