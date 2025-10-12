import {
    View,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image as RNImage,
    TouchableOpacity,
} from "react-native";
import React from "react";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import * as ImagePicker from "expo-image-picker";
import { toast } from "sonner-native";
import { supabase } from "~/lib/supabase";
import { getUserName } from "~/lib/jwt-utils";
import { BACKEND_URL } from "~/lib/constants";

const IvecoCheckup = () => {
    // Form fields state

    // Oil section
    const [oil, setOil] = React.useState("");

    // Windshield washer fluid section
    const [windshieldFluid, setWindshieldFluid] = React.useState("");

    // Coolant section
    const [coolant, setCoolant] = React.useState("");

    // Rear lights section
    const [rearLights, setRearLights] = React.useState("");

    // Front lights section
    const [frontLights, setFrontLights] = React.useState("");

    // Turn signals section
    const [turnSignals, setTurnSignals] = React.useState("");

    // Tires section
    const [tires, setTires] = React.useState("");

    // First aid kit section
    const [firstAidKit, setFirstAidKit] = React.useState("");

    // Body section
    const [bodyCondition, setBodyCondition] = React.useState("");

    const [notes, setNotes] = React.useState("");
    const [images, setImages] = React.useState<string[]>([]);
    const [imageUrls, setImageUrls] = React.useState<string[]>([]);
    const [isUploading, setIsUploading] = React.useState(false);

    const statusOptions = ["noch voll", "leer", "aufgefüllt"];
    const functionalityOptions = [
        "funktionieren alle",
        "funktionieren teilweise",
        "funktionieren nicht",
    ];
    const tiresOptions = ["alle okay", "teilweise okay", "nicht okay"];
    const firstAidOptions = [
        "Vollständig und einsatzbereit",
        "Unvollständig und einsatzbereit",
        "Über Verfallsdatum / abgelaufen",
    ];
    const bodyOptions = ["Okay", "Kaputt"];

    function resetForm() {
        setOil("");
        setWindshieldFluid("");
        setCoolant("");
        setRearLights("");
        setFrontLights("");
        setTurnSignals("");
        setTires("");
        setFirstAidKit("");
        setBodyCondition("");
        setNotes("");
        setImages([]);
        setImageUrls([]);
    }

    async function uploadImageToSupabase(uri: string): Promise<string | null> {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const blobType = blob.type || 'image/jpeg';
            const extension = blobType.split('/')[1] || 'jpg';
            const fileName = `${Date.now()}.${extension}`;
            const filePath = `${fileName}`;

            const { data, error } = await supabase.storage
                .from('images')
                .upload(filePath, blob, {
                    contentType: blobType,
                    cacheControl: '3600',
                    upsert: false,
                });

            if (error) {
                console.error('Supabase upload error:', error);
                return null;
            }

            const { data: publicData } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            return publicData.publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    }

    async function pickImages() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: false,
            allowsMultipleSelection: true,
            quality: 0.8,
            selectionLimit: 5,
        });

        if (!result.canceled) {
            const newImages = result.assets.map((asset) => asset.uri);

            if (images.length + newImages.length > 5) {
                toast.error("Zu viele Bilder", {
                    description: `Sie können maximal 5 Bilder auswählen. Sie haben bereits ${images.length} Bild${images.length !== 1 ? "er" : ""} ausgewählt.`,
                });
                return;
            }

            setImages((prevImages) => [...prevImages, ...newImages]);

            setIsUploading(true);
            toast.loading("Bilder werden hochgeladen...", {
                description: "Bitte warten Sie einen Moment.",
            });

            const uploadedUrls: string[] = [];
            for (const imageUri of newImages) {
                const url = await uploadImageToSupabase(imageUri);
                if (url) {
                    uploadedUrls.push(url);
                }
            }

            setImageUrls((prevUrls) => [...prevUrls, ...uploadedUrls]);
            setIsUploading(false);
            toast.dismiss();

            if (uploadedUrls.length === newImages.length) {
                toast.success("Bilder hochgeladen", {
                    description: `${uploadedUrls.length} Bild${uploadedUrls.length !== 1 ? "er" : ""} erfolgreich hochgeladen.`,
                });
            } else {
                toast.error("Fehler beim Hochladen", {
                    description: `Nur ${uploadedUrls.length} von ${newImages.length} Bildern wurden hochgeladen.`,
                });
            }
        }
    }

    function removeImage(imageUri: string) {
        const index = images.indexOf(imageUri);
        setImages((prevImages) => prevImages.filter((uri) => uri !== imageUri));
        if (index !== -1) {
            setImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
        }
    }

    async function sendReport() {
        const { data: { session } } = await supabase.auth.getSession();
        const userName = getUserName(session?.access_token || "");

        if (isUploading) {
            toast.error("Bilder werden hochgeladen", {
                description: "Bitte warten Sie, bis alle Bilder hochgeladen sind.",
            });
            return;
        }

        try {

            toast.loading("E-Mail wird gesendet...", {
                description: "Bitte warten Sie einen Moment.",
            });

            const response = await fetch(`${BACKEND_URL}/api/email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    senderName: `${userName}`,
                    type: `Iveco 3 A:MS 249 Check-Up`,
                    data: {
                        Öl: oil || "Nicht geprüft",
                        'Scheibenwischer-Flüssigkeit (im Winter mit Frostschutz)': windshieldFluid || "Nicht geprüft",
                        Kühlmittel: coolant || "Nicht geprüft",
                        'Lichter hinten': rearLights || "Nicht geprüft",
                        'Lichter vorne': frontLights || "Nicht geprüft",
                        Blinker: turnSignals || "Nicht geprüft",
                        Reifen: tires || "Nicht geprüft",
                        Verbandskasten: firstAidKit || "Nicht geprüft",
                        Karosserie: bodyCondition || "Nicht geprüft",
                        Anmerkungen: notes || "Keine",
                    },
                    imageUrls: imageUrls,
                }),
            });

            const result = await response.json();

            if (result.success) {
                toast.dismiss();
                toast.success("Check-Up gesendet", {
                    description: "Der Check-Up Bericht wurde erfolgreich gesendet.",
                });
                resetForm();
            } else {
                toast.dismiss();
                toast.error("Fehler beim Senden", {
                    description: result.error || "Ein Fehler ist beim Senden des Berichts aufgetreten.",
                });
            }
        } catch (error) {
            console.error("Error sending email:", error);
            toast.dismiss();
            toast.error("Fehler beim Senden", {
                description: "Ein Fehler ist beim Senden des Berichts aufgetreten.",
            });
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
                            Iveco 3 A:MS 249 Check-Up
                        </Text>
                    </View>

                    {/* Oil Section */}
                    <View className="gap-2">
                        <Text className="text-lg font-semibold">Öl</Text>
                        <RadioGroup value={oil} onValueChange={setOil} className="gap-3">
                            {statusOptions.map((option) => (
                                <RadioGroupItemWithLabel
                                    key={option}
                                    value={option}
                                    onLabelPress={() => setOil(option)}
                                />
                            ))}
                        </RadioGroup>
                    </View>

                    {/* Windshield Washer Fluid Section */}
                    <View className="gap-2">
                        <Text className="text-lg font-semibold">
                            Scheibenwischer-Flüssigkeit
                        </Text>
                        <Text className="text-muted-foreground">
                            im Winter mit Frostschutz
                        </Text>
                        <RadioGroup
                            value={windshieldFluid}
                            onValueChange={setWindshieldFluid}
                            className="gap-3"
                        >
                            {statusOptions.map((option) => (
                                <RadioGroupItemWithLabel
                                    key={option}
                                    value={option}
                                    onLabelPress={() => setWindshieldFluid(option)}
                                />
                            ))}
                        </RadioGroup>
                    </View>

                    {/* Coolant Section */}
                    <View className="gap-2">
                        <Text className="text-lg font-semibold">Kühlmittel</Text>
                        <RadioGroup
                            value={coolant}
                            onValueChange={setCoolant}
                            className="gap-3"
                        >
                            {statusOptions.map((option) => (
                                <RadioGroupItemWithLabel
                                    key={option}
                                    value={option}
                                    onLabelPress={() => setCoolant(option)}
                                />
                            ))}
                        </RadioGroup>
                    </View>

                    {/* Rear Lights Section */}
                    <View className="gap-2">
                        <Text className="text-lg font-semibold">Lichter hinten</Text>
                        <RadioGroup
                            value={rearLights}
                            onValueChange={setRearLights}
                            className="gap-3"
                        >
                            {functionalityOptions.map((option) => (
                                <RadioGroupItemWithLabel
                                    key={option}
                                    value={option}
                                    onLabelPress={() => setRearLights(option)}
                                />
                            ))}
                        </RadioGroup>
                    </View>

                    {/* Front Lights Section */}
                    <View className="gap-2">
                        <Text className="text-lg font-semibold">Lichter vorne</Text>
                        <RadioGroup
                            value={frontLights}
                            onValueChange={setFrontLights}
                            className="gap-3"
                        >
                            {functionalityOptions.map((option) => (
                                <RadioGroupItemWithLabel
                                    key={option}
                                    value={option}
                                    onLabelPress={() => setFrontLights(option)}
                                />
                            ))}
                        </RadioGroup>
                    </View>

                    {/* Turn Signals Section */}
                    <View className="gap-2">
                        <Text className="text-lg font-semibold">Blinker</Text>
                        <RadioGroup
                            value={turnSignals}
                            onValueChange={setTurnSignals}
                            className="gap-3"
                        >
                            {functionalityOptions.map((option) => (
                                <RadioGroupItemWithLabel
                                    key={option}
                                    value={option}
                                    onLabelPress={() => setTurnSignals(option)}
                                />
                            ))}
                        </RadioGroup>
                    </View>

                    {/* Tires Section */}
                    <View className="gap-2">
                        <Text className="text-lg font-semibold">Reifen</Text>
                        <RadioGroup
                            value={tires}
                            onValueChange={setTires}
                            className="gap-3"
                        >
                            {tiresOptions.map((option) => (
                                <RadioGroupItemWithLabel
                                    key={option}
                                    value={option}
                                    onLabelPress={() => setTires(option)}
                                />
                            ))}
                        </RadioGroup>
                    </View>

                    {/* First Aid Kit Section */}
                    <View className="gap-2">
                        <Text className="text-lg font-semibold">Verbandskasten</Text>
                        <RadioGroup
                            value={firstAidKit}
                            onValueChange={setFirstAidKit}
                            className="gap-3"
                        >
                            {firstAidOptions.map((option) => (
                                <RadioGroupItemWithLabel
                                    key={option}
                                    value={option}
                                    onLabelPress={() => setFirstAidKit(option)}
                                />
                            ))}
                        </RadioGroup>
                    </View>

                    {/* Body Condition Section */}
                    <View className="gap-2">
                        <Text className="text-lg font-semibold">Karosserie</Text>
                        <RadioGroup
                            value={bodyCondition}
                            onValueChange={setBodyCondition}
                            className="gap-3"
                        >
                            {bodyOptions.map((option) => (
                                <RadioGroupItemWithLabel
                                    key={option}
                                    value={option}
                                    onLabelPress={() => setBodyCondition(option)}
                                />
                            ))}
                        </RadioGroup>
                    </View>

                    {/* Notes Section */}
                    <View className="gap-2">
                        <Text className="text-lg font-semibold">Anmerkungen</Text>
                        <Textarea
                            value={notes}
                            onChangeText={setNotes}
                            placeholder="Besondere Beobachtungen oder Anmerkungen..."
                            multiline
                            numberOfLines={4}
                        />
                    </View>

                    {/* Images Section */}
                    <View className="gap-2">
                        <Text className="text-lg font-semibold">Bilder (optional)</Text>
                        <Button variant="outline" onPress={pickImages}>
                            <Text>Bilder auswählen ({images.length}/5)</Text>
                        </Button>

                        {images.length > 0 && (
                            <View className="gap-3">
                                <Text className="text-xs text-muted-foreground">
                                    {images.length} Bild{images.length !== 1 ? "er" : ""}{" "}
                                    ausgewählt
                                </Text>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    className="gap-2"
                                    contentContainerStyle={{ gap: 8 }}
                                >
                                    {images.map((imageUri, index) => (
                                        <View key={index} className="relative">
                                            <RNImage
                                                source={{ uri: imageUri }}
                                                className="w-24 h-24 rounded-lg"
                                                resizeMode="cover"
                                            />
                                            <TouchableOpacity
                                                onPress={() => removeImage(imageUri)}
                                                className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                                            >
                                                <Text className="text-white text-xs font-bold">×</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>

                    {/* Send Button */}
                    <Button onPress={sendReport} className="bg-red-500 mb-8 mt-8" disabled={isUploading}>
                        <Text className="text-foreground">{isUploading ? "Bilder werden hochgeladen..." : "Check-Up senden"}</Text>
                    </Button>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

function RadioGroupItemWithLabel({
    value,
    onLabelPress,
}: {
    value: string;
    onLabelPress: () => void;
}) {
    return (
        <View className="flex-row gap-2 items-center">
            <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
            <Label nativeID={`label-for-${value}`} onPress={onLabelPress}>
                {value}
            </Label>
        </View>
    );
}

export default IvecoCheckup;
