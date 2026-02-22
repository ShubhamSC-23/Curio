import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    ActivityIndicator, RefreshControl, Image, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Heart, MessageCircle, UserPlus, FileText, CheckCheck, Trash2, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import { notificationsAPI } from '../api/notifications';
import { useAuthStore } from '../store/authStore';
import { formatRelativeTime } from '../utils/formatDate';
import { getImageUrl } from '../utils/imageUtils';

const NotificationsScreen = ({ navigation }) => {
    const colors = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const { isAuthenticated } = useAuthStore();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await notificationsAPI.getNotifications({ limit: 50 });
            setNotifications(response.data || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchNotifications();
        setRefreshing(false);
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationsAPI.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleClearRead = async () => {
        Alert.alert(
            "Clear Notifications",
            "Are you sure you want to clear all read notifications?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await notificationsAPI.clearReadNotifications();
                            setNotifications(prev => prev.filter(n => n.is_read === 0));
                        } catch (error) {
                            console.error('Error clearing read notifications:', error);
                        }
                    }
                }
            ]
        );
    };

    const handleNotificationPress = async (notification) => {
        // Mark as read immediately locally
        if (notification.is_read === 0) {
            setNotifications(prev => prev.map(n =>
                n.notification_id === notification.notification_id ? { ...n, is_read: 1 } : n
            ));
            try {
                await notificationsAPI.markAsRead(notification.notification_id);
            } catch (error) {
                console.error('Error marking as read:', error);
            }
        }

        // Navigate based on type
        if (notification.related_type === 'article' && notification.link) {
            // Usually link might be the slug or something parseable
            // Let's assume link holds the slug if it's an article
            // For now, if we have article_id or link, try mapping it
            // We'll just try to use related_id for fetching later, or if link is slug, we can inject directly
            const slug = notification.link.split('/').pop(); // fallback guess
            if (slug && slug !== 'undefined') {
                navigation.navigate('ArticleDetail', { slug: slug });
            }
        } else if (notification.related_type === 'user' && notification.actor_username) {
            navigation.navigate('AuthorProfile', { username: notification.actor_username });
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'like': return <Heart size={20} color="#e11d48" />;
            case 'comment': return <MessageCircle size={20} color="#3b82f6" />;
            case 'follow': return <UserPlus size={20} color="#10b981" />;
            case 'article': return <FileText size={20} color="#8b5cf6" />;
            default: return <Bell size={20} color={colors.primary[600]} />;
        }
    };

    const renderNotification = ({ item }) => {
        const isUnread = item.is_read === 0;
        return (
            <TouchableOpacity
                onPress={() => handleNotificationPress(item)}
                style={[styles.notificationCard, isUnread && styles.unreadCard]}
                activeOpacity={0.8}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.iconContainer}>
                        {getNotificationIcon(item.type)}
                    </View>
                    <View style={styles.contentContainer}>
                        <View style={styles.titleRow}>
                            <Text style={[styles.title, isUnread && styles.unreadText]} numberOfLines={1}>
                                {item.title}
                            </Text>
                            <Text style={styles.timeText}>{formatRelativeTime(item.created_at)}</Text>
                        </View>
                        <Text style={[styles.message, isUnread && styles.unreadMessage]} numberOfLines={2}>
                            {item.message}
                        </Text>

                        {/* Actor details if present */}
                        {item.actor_name && (
                            <View style={styles.actorRow}>
                                {item.actor_image ? (
                                    <Image source={{ uri: getImageUrl(item.actor_image) }} style={styles.actorImage} />
                                ) : (
                                    <View style={styles.actorFallback} />
                                )}
                                <Text style={styles.actorName}>{item.actor_name}</Text>
                            </View>
                        )}
                    </View>
                    {isUnread && <View style={styles.unreadDot} />}
                </View>
            </TouchableOpacity>
        );
    };

    if (!isAuthenticated) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notifications</Text>
                </View>
                <View style={styles.center}>
                    <Bell size={48} color={colors.text.tertiary} style={{ marginBottom: 16 }} />
                    <Text style={styles.emptyTitle}>Login Required</Text>
                    <Text style={styles.emptySubtitle}>Please login to view your notifications.</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={handleMarkAllRead} style={styles.iconButton}>
                        <CheckCheck size={20} color={colors.primary[600]} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleClearRead} style={[styles.iconButton, { marginLeft: 12 }]}>
                        <Trash2 size={20} color={colors.text.tertiary} />
                    </TouchableOpacity>
                </View>
            </View>

            {loading && !refreshing ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.primary[600]} />
                </View>
            ) : notifications.length === 0 ? (
                <View style={styles.center}>
                    <View style={styles.iconCircleFallback}>
                        <Bell size={40} color={colors.primary[400]} />
                    </View>
                    <Text style={styles.emptyTitle}>You're all caught up!</Text>
                    <Text style={styles.emptySubtitle}>No new notifications right now.</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={item => item.notification_id.toString()}
                    renderItem={renderNotification}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor={colors.primary[600]}
                        />
                    }
                />
            )}
        </SafeAreaView>
    );
};

const makeStyles = (colors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background.secondary },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 14, backgroundColor: colors.background.primary,
        borderBottomWidth: 1, borderBottomColor: colors.border.primary,
    },
    backButton: { marginRight: 16 },
    headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: colors.text.primary },
    headerActions: { flexDirection: 'row', alignItems: 'center' },
    iconButton: { padding: 8, backgroundColor: colors.background.tertiary, borderRadius: 20 },
    listContainer: { padding: 16 },
    notificationCard: {
        backgroundColor: colors.background.primary, borderRadius: 16, padding: 16, marginBottom: 12,
        borderWidth: 1, borderColor: colors.border.primary
    },
    unreadCard: { backgroundColor: colors.background.tertiary, borderColor: colors.primary[200] },
    cardHeader: { flexDirection: 'row' },
    iconContainer: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary[50],
        alignItems: 'center', justifyContent: 'center', marginRight: 12
    },
    contentContainer: { flex: 1 },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    title: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text.secondary, marginRight: 8 },
    unreadText: { fontWeight: '800', color: colors.text.primary },
    timeText: { fontSize: 12, color: colors.text.tertiary },
    message: { fontSize: 14, color: colors.text.tertiary, lineHeight: 20 },
    unreadMessage: { color: colors.text.secondary },
    actorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    actorImage: { width: 24, height: 24, borderRadius: 12, marginRight: 8 },
    actorFallback: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.border.primary, marginRight: 8 },
    actorName: { fontSize: 13, fontWeight: '500', color: colors.primary[600] },
    unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary[600], marginLeft: 8, alignSelf: 'center' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
    emptyTitle: { fontSize: 20, fontWeight: '700', color: colors.text.primary, marginBottom: 8, textAlign: 'center' },
    emptySubtitle: { fontSize: 15, color: colors.text.tertiary, textAlign: 'center' },
    iconCircleFallback: {
        width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary[50],
        alignItems: 'center', justifyContent: 'center', marginBottom: 20
    }
});

export default NotificationsScreen;
