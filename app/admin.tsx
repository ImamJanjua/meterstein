import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { router } from "expo-router";
import { Save } from "lucide-react-native";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { supabase } from "~/lib/supabase";
import { getAppRole } from "~/lib/jwt-utils";
import { toast } from "sonner-native";

const CreateAlertScreen = () => {
    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");
    const [category, setCategory] = React.useState<string>("ALLGEMEIN");
    const [loading, setLoading] = React.useState(false);
    const [appRole, setAppRole] = React.useState<string | null>(null);

    React.useEffect(() => {
        const checkRole = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (session?.access_token) {
                const role = getAppRole(session.access_token);
                setAppRole(role);

                // Only allow büro and office roles
                if (role !== 'büro') {
                    router.replace('/');
                    return;
                }
            }
        };

        checkRole();
    }, []);

    const handleSave = async () => {
        if (!title.trim() || !content.trim() || !category) {
            toast.error('Bitte füllen Sie alle Felder aus');
            return;
        }

        setLoading(true);
        toast.loading('Nachricht wird erstellt...');
        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session?.access_token) {
                toast.dismiss();
                toast.error('Nicht angemeldet');
                return;
            }


            const { error } = await supabase
                .from('alerts')
                .insert({
                    title: title.trim(),
                    content: content.trim(),
                    category: category,
                });

            if (error) {
                console.error('Error creating alert:', error);
                toast.error('Nachricht konnte nicht erstellt werden');
                toast.dismiss();
                return;
            }

            toast.dismiss();
            toast.success('Nachricht wurde erfolgreich erstellt');
            router.back();
        } catch (error) {
            toast.dismiss();
            console.error('Error creating alert:', error);
            toast.error('Nachricht konnte nicht erstellt werden');
        } finally {
            setLoading(false);
        }
    };

    if (appRole !== 'büro') {
        return null;
    }

    return (
        <View className="flex-1 bg-background">
            <ScrollView className="flex-1">
                <View className="mb-8 mt-8 items-center">
                    <Text className="text-3xl font-bold text-red-500">
                        Nachricht erstellen
                    </Text>
                </View>
                <View className="p-4">
                    <Card className="p-4">
                        <View className="mb-4">
                            <Text className="text-sm font-medium text-foreground mb-2">
                                Titel *
                            </Text>
                            <Input
                                value={title}
                                onChangeText={setTitle}
                                placeholder="Titel der Nachricht"
                                className="w-full"
                            />
                        </View>

                        <View className="mb-6">
                            <Text className="text-sm font-medium text-foreground mb-2">
                                Inhalt *
                            </Text>
                            <Textarea
                                value={content}
                                onChangeText={setContent}
                                placeholder="Inhalt der Nachricht"
                                className="w-full min-h-[120px]"
                                multiline
                                numberOfLines={6}
                            />
                        </View>

                        <View className="mb-6">
                            <Text className="text-sm font-medium text-foreground mb-2">
                                Kategorie *
                            </Text>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full p-3 border border-input bg-background rounded-md text-foreground"
                                style={{ minHeight: '44px' }}
                            >
                                <option value="ALLGEMEIN">Allgemeine Nachrichten</option>
                                <option value="TEAM1">Team 1 Nachrichten</option>
                                <option value="TEAM2">Team 2 Nachrichten</option>
                            </select>
                        </View>

                        <Button
                            onPress={handleSave}
                            disabled={loading || !title.trim() || !content.trim() || !category}
                            className="w-full bg-red-500"
                        >
                            <Save size={16} className="text-white mr-2" />
                            <Text className="text-white font-medium">
                                {loading ? 'Speichern...' : 'Nachricht erstellen'}
                            </Text>
                        </Button>
                    </Card>
                </View>
            </ScrollView>
        </View>
    );
};

export default CreateAlertScreen;
