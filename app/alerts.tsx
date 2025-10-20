import React from "react";
import { View, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { Text } from "~/components/ui/text";
import { Bell, Calendar, Trash2 } from "lucide-react-native";
import { Card } from "~/components/ui/card";
import { supabase } from "~/lib/supabase";
import { getAppRole } from "~/lib/jwt-utils";
import { toast } from "sonner-native";

const AlertsScreen = () => {
    const [alerts, setAlerts] = React.useState<{
        ALLGEMEIN: any[];
        TEAM1: any[];
        TEAM2: any[];
    }>({
        ALLGEMEIN: [],
        TEAM1: [],
        TEAM2: []
    });
    const [loading, setLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const [loadingMore, setLoadingMore] = React.useState(false);
    const [hasMore, setHasMore] = React.useState({
        ALLGEMEIN: true,
        TEAM1: true,
        TEAM2: true
    });
    const [page, setPage] = React.useState({
        ALLGEMEIN: 0,
        TEAM1: 0,
        TEAM2: 0
    });
    const [appRole, setAppRole] = React.useState<string | null>(null);
    const ITEMS_PER_PAGE = 10;

    const fetchAlerts = async (isRefresh = false) => {
        try {
            const categories = ['ALLGEMEIN', 'TEAM1', 'TEAM2'];
            const newAlerts = { ALLGEMEIN: [], TEAM1: [], TEAM2: [] };
            const newHasMore = { ALLGEMEIN: true, TEAM1: true, TEAM2: true };
            const newPage = { ...page };

            for (const category of categories) {
                const currentPage = isRefresh ? 0 : page[category as keyof typeof page];
                const from = currentPage * ITEMS_PER_PAGE;
                const to = from + ITEMS_PER_PAGE - 1;

                const { data, error } = await supabase
                    .from('alerts')
                    .select('*')
                    .eq('category', category)
                    .order('created_at', { ascending: false })
                    .range(from, to);

                if (error) {
                    console.error(`Error fetching ${category} alerts:`, error);
                    continue;
                }

                if (isRefresh) {
                    (newAlerts as any)[category] = data || [];
                    (newPage as any)[category] = 0;
                } else {
                    (newAlerts as any)[category] = [
                        ...(alerts as any)[category],
                        ...(data || [])
                    ];
                    (newPage as any)[category] = currentPage + 1;
                }

                // Check if we have more data for this category
                (newHasMore as any)[category] = (data || []).length === ITEMS_PER_PAGE;
            }

            setAlerts(newAlerts);
            setPage(newPage);
            setHasMore(newHasMore);
        } catch (error) {
            console.error('Error fetching alerts:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
            setLoadingMore(false);
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
        fetchAlerts();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchAlerts(true);
    };

    const loadMore = (category: 'ALLGEMEIN' | 'TEAM1' | 'TEAM2') => {
        if (!loadingMore && hasMore[category]) {
            setLoadingMore(true);
            fetchAlerts();
        }
    };

    const deleteAlert = async (alertId: string, category: 'ALLGEMEIN' | 'TEAM1' | 'TEAM2') => {
        try {
            const { error } = await supabase
                .from('alerts')
                .delete()
                .eq('id', alertId);

            if (error) {
                console.error('Error deleting alert:', error);
                toast.error('Nachricht konnte nicht gelöscht werden');
                return;
            }

            // Remove the alert from the local state
            setAlerts(prev => ({
                ...prev,
                [category]: prev[category as keyof typeof prev].filter(alert => alert.id !== alertId)
            }));

            toast.success('Nachricht wurde gelöscht');
        } catch (error) {
            console.error('Error deleting alert:', error);
            toast.error('Nachricht konnte nicht gelöscht werden');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <View className="flex-1 bg-background">
            <ScrollView
                className="flex-1"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View className="p-4">
                    <View className="mb-8 mt-8 items-center">
                        <Text className="text-3xl font-bold text-red-500">
                            Nachrichten
                        </Text>
                    </View>
                    {loading ? (
                        <View className="items-center py-8">
                            <Text className="text-muted-foreground">Lade Nachrichten...</Text>
                        </View>
                    ) : (
                        <>
                            {/* ALLGEMEIN Section */}
                            <View className="mb-8">
                                <View className="mb-4">
                                    <Text className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
                                        Allgemeine Nachrichten
                                    </Text>
                                    <View className="h-1 bg-red-200 dark:bg-red-800 rounded-full" />
                                </View>

                                {alerts.ALLGEMEIN.length === 0 ? (
                                    <View className="items-center py-6">
                                        <Bell size={32} className="text-muted-foreground mb-2" />
                                        <Text className="text-muted-foreground text-center">
                                            Keine allgemeinen Nachrichten
                                        </Text>
                                    </View>
                                ) : (
                                    <>
                                        {alerts.ALLGEMEIN.map((alert) => (
                                            <Card key={alert.id} className="mb-4 p-5 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 border border-red-200 dark:border-red-800 shadow-sm">
                                                <View className="flex-row items-start justify-between mb-3">
                                                    <View className="flex-1 mr-3">
                                                        <Text className="text-xl font-bold text-red-900 dark:text-red-100 mb-1">
                                                            {alert.title}
                                                        </Text>
                                                        <View className="flex-row items-center">
                                                            <Calendar size={14} className="text-red-600 dark:text-red-400 mr-1" />
                                                            <Text className="text-sm text-red-700 dark:text-red-300 font-medium">
                                                                {formatDate(alert.created_at)}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View className="flex-row items-center">
                                                        {appRole === 'büro' && (
                                                            <TouchableOpacity
                                                                onPress={() => deleteAlert(alert.id, 'ALLGEMEIN')}
                                                                className="p-1"
                                                                activeOpacity={0.7}
                                                            >
                                                                <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                                                            </TouchableOpacity>
                                                        )}
                                                    </View>
                                                </View>

                                                <View className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
                                                    <Text className="text-red-800 dark:text-red-200 leading-relaxed">
                                                        {alert.content}
                                                    </Text>
                                                </View>
                                            </Card>
                                        ))}

                                        {hasMore.ALLGEMEIN && (
                                            <TouchableOpacity
                                                onPress={() => loadMore('ALLGEMEIN')}
                                                disabled={loadingMore}
                                                className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 items-center mb-4"
                                                activeOpacity={0.7}
                                            >
                                                <Text className="text-red-600 dark:text-red-400 font-medium">
                                                    {loadingMore ? 'Lade weitere...' : 'Weitere allgemeine Nachrichten laden'}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </>
                                )}
                            </View>

                            {/* TEAM1 Section */}
                            <View className="mb-8">
                                <View className="mb-4">
                                    <Text className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
                                        Team 1 Nachrichten
                                    </Text>
                                    <View className="h-1 bg-red-200 dark:bg-red-800 rounded-full" />
                                </View>

                                {alerts.TEAM1.length === 0 ? (
                                    <View className="items-center py-6">
                                        <Bell size={32} className="text-muted-foreground mb-2" />
                                        <Text className="text-muted-foreground text-center">
                                            Keine Team 1 Nachrichten
                                        </Text>
                                    </View>
                                ) : (
                                    <>
                                        {alerts.TEAM1.map((alert) => (
                                            <Card key={alert.id} className="mb-4 p-5 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 border border-red-200 dark:border-red-800 shadow-sm">
                                                <View className="flex-row items-start justify-between mb-3">
                                                    <View className="flex-1 mr-3">
                                                        <Text className="text-xl font-bold text-red-900 dark:text-red-100 mb-1">
                                                            {alert.title}
                                                        </Text>
                                                        <View className="flex-row items-center">
                                                            <Calendar size={14} className="text-red-600 dark:text-red-400 mr-1" />
                                                            <Text className="text-sm text-red-700 dark:text-red-300 font-medium">
                                                                {formatDate(alert.created_at)}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View className="flex-row items-center">
                                                        {appRole === 'büro' && (
                                                            <TouchableOpacity
                                                                onPress={() => deleteAlert(alert.id, 'TEAM1')}
                                                                className="p-1"
                                                                activeOpacity={0.7}
                                                            >
                                                                <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                                                            </TouchableOpacity>
                                                        )}
                                                    </View>
                                                </View>

                                                <View className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
                                                    <Text className="text-red-800 dark:text-red-200 leading-relaxed">
                                                        {alert.content}
                                                    </Text>
                                                </View>
                                            </Card>
                                        ))}

                                        {hasMore.TEAM1 && (
                                            <TouchableOpacity
                                                onPress={() => loadMore('TEAM1')}
                                                disabled={loadingMore}
                                                className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 items-center mb-4"
                                                activeOpacity={0.7}
                                            >
                                                <Text className="text-red-600 dark:text-red-400 font-medium">
                                                    {loadingMore ? 'Lade weitere...' : 'Weitere Team 1 Nachrichten laden'}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </>
                                )}
                            </View>

                            {/* TEAM2 Section */}
                            <View className="mb-8">
                                <View className="mb-4">
                                    <Text className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
                                        Team 2 Nachrichten
                                    </Text>
                                    <View className="h-1 bg-red-200 dark:bg-red-800 rounded-full" />
                                </View>

                                {alerts.TEAM2.length === 0 ? (
                                    <View className="items-center py-6">
                                        <Bell size={32} className="text-muted-foreground mb-2" />
                                        <Text className="text-muted-foreground text-center">
                                            Keine Team 2 Nachrichten
                                        </Text>
                                    </View>
                                ) : (
                                    <>
                                        {alerts.TEAM2.map((alert) => (
                                            <Card key={alert.id} className="mb-4 p-5 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 border border-red-200 dark:border-red-800 shadow-sm">
                                                <View className="flex-row items-start justify-between mb-3">
                                                    <View className="flex-1 mr-3">
                                                        <Text className="text-xl font-bold text-red-900 dark:text-red-100 mb-1">
                                                            {alert.title}
                                                        </Text>
                                                        <View className="flex-row items-center">
                                                            <Calendar size={14} className="text-red-600 dark:text-red-400 mr-1" />
                                                            <Text className="text-sm text-red-700 dark:text-red-300 font-medium">
                                                                {formatDate(alert.created_at)}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View className="flex-row items-center">
                                                        {appRole === 'büro' && (
                                                            <TouchableOpacity
                                                                onPress={() => deleteAlert(alert.id, 'TEAM2')}
                                                                className="p-1"
                                                                activeOpacity={0.7}
                                                            >
                                                                <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                                                            </TouchableOpacity>
                                                        )}
                                                    </View>
                                                </View>

                                                <View className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
                                                    <Text className="text-red-800 dark:text-red-200 leading-relaxed">
                                                        {alert.content}
                                                    </Text>
                                                </View>
                                            </Card>
                                        ))}

                                        {hasMore.TEAM2 && (
                                            <TouchableOpacity
                                                onPress={() => loadMore('TEAM2')}
                                                disabled={loadingMore}
                                                className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 items-center mb-4"
                                                activeOpacity={0.7}
                                            >
                                                <Text className="text-red-600 dark:text-red-400 font-medium">
                                                    {loadingMore ? 'Lade weitere...' : 'Weitere Team 2 Nachrichten laden'}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </>
                                )}
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default AlertsScreen;
