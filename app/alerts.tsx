import React from "react";
import { View, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { Text } from "~/components/ui/text";
import { router } from "expo-router";
import { Bell, ArrowLeft, Calendar, User } from "lucide-react-native";
import { Card } from "~/components/ui/card";
import { supabase } from "~/lib/supabase";

const AlertsScreen = () => {
    const [alerts, setAlerts] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const [loadingMore, setLoadingMore] = React.useState(false);
    const [hasMore, setHasMore] = React.useState(true);
    const [page, setPage] = React.useState(0);
    const ITEMS_PER_PAGE = 10;

    const fetchAlerts = async (isRefresh = false) => {
        try {
            const currentPage = isRefresh ? 0 : page;
            const from = currentPage * ITEMS_PER_PAGE;
            const to = from + ITEMS_PER_PAGE - 1;

            const { data, error } = await supabase
                .from('alerts')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) {
                console.error('Error fetching alerts:', error);
                return;
            }

            if (isRefresh) {
                setAlerts(data || []);
                setPage(0);
            } else {
                setAlerts(prev => [...prev, ...(data || [])]);
                setPage(currentPage + 1);
            }

            // Check if we have more data
            setHasMore((data || []).length === ITEMS_PER_PAGE);
        } catch (error) {
            console.error('Error fetching alerts:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
            setLoadingMore(false);
        }
    };

    React.useEffect(() => {
        fetchAlerts();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchAlerts(true);
    };

    const loadMore = () => {
        if (!loadingMore && hasMore) {
            setLoadingMore(true);
            fetchAlerts();
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
                    ) : alerts.length === 0 ? (
                        <View className="items-center py-8">
                            <Bell size={48} className="text-muted-foreground mb-4" />
                            <Text className="text-muted-foreground text-center">
                                Keine Nachrichten verfügbar
                            </Text>
                        </View>
                    ) : (
                        <>
                            {alerts.map((alert) => (
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
                                        <View className="w-3 h-3 bg-red-500 rounded-full" />
                                    </View>

                                    <View className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
                                        <Text className="text-red-800 dark:text-red-200 leading-relaxed">
                                            {alert.content}
                                        </Text>
                                    </View>
                                </Card>
                            ))}

                            {/* Load More Button */}
                            {hasMore && (
                                <TouchableOpacity
                                    onPress={loadMore}
                                    disabled={loadingMore}
                                    className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 items-center"
                                    activeOpacity={0.7}
                                >
                                    <Text className="text-red-600 dark:text-red-400 font-medium">
                                        {loadingMore ? 'Lade weitere...' : 'Weitere Nachrichten laden'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default AlertsScreen;
