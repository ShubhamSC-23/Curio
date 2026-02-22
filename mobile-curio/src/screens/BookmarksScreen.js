import React, { useEffect, useState, useMemo } from 'react';
import {
    View, Text, StyleSheet, FlatList, Image, TouchableOpacity,
    ActivityIndicator, RefreshControl, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bookmark, Trash2, Clock, Eye } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import { userAPI } from '../api/user';
import { articlesAPI } from '../api/articles';
import { getImageUrl } from '../utils/imageUtils';
import { formatRelativeTime } from '../utils/formatDate';

const BookmarksScreen = ({ navigation }) => {
    const colors = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => { fetchBookmarks(); }, []);

    const fetchBookmarks = async () => {
        try {
            setLoading(true);
            const data = await userAPI.getBookmarks();
            setBookmarks(data.data || []);
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchBookmarks();
        setRefreshing(false);
    };

    const handleRemove = (articleId) => {
        Alert.alert('Remove Bookmark', 'Remove this article from bookmarks?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Remove', style: 'destructive',
                onPress: async () => {
                    try {
                        await articlesAPI.bookmarkArticle(articleId);
                        setBookmarks(prev => prev.filter(i => i.article_id !== articleId));
                    } catch (error) {
                        console.error('Error removing bookmark:', error);
                    }
                }
            }
        ]);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ArticleDetail', { slug: item.slug })}
            activeOpacity={0.85}
        >
            <View style={styles.cardRow}>
                {!!item.featured_image && (
                    <Image
                        source={{ uri: getImageUrl(item.featured_image) }}
                        style={styles.thumb}
                        resizeMode="cover"
                    />
                )}
                <View style={styles.cardContent}>
                    {!!item.category_name && (
                        <Text style={styles.category}>{item.category_name}</Text>
                    )}
                    <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                    <View style={styles.meta}>
                        <Text style={styles.author}>{item.full_name || item.username}</Text>
                        <Text style={styles.dot}>·</Text>
                        <Text style={styles.time}>{formatRelativeTime(item.published_at)}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => handleRemove(item.article_id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Trash2 size={18} color={colors.status.error} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Bookmark size={22} color={colors.primary[600]} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.headerTitle}>Bookmarks</Text>
                    {bookmarks.length > 0 && (
                        <Text style={styles.headerSub}>{bookmarks.length} saved</Text>
                    )}
                </View>
            </View>

            {loading ? (
                <View style={styles.center}><ActivityIndicator size="large" color={colors.primary[600]} /></View>
            ) : bookmarks.length === 0 ? (
                <View style={styles.empty}>
                    <Bookmark size={56} color={colors.border.secondary} />
                    <Text style={styles.emptyTitle}>No bookmarks yet</Text>
                    <Text style={styles.emptyText}>Articles you save will appear here</Text>
                    <TouchableOpacity style={styles.cta} onPress={() => navigation.navigate('Articles')}>
                        <Text style={styles.ctaText}>Browse Articles</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={bookmarks}
                    keyExtractor={item => item.article_id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary[600]} />
                    }
                />
            )}
        </SafeAreaView>
    );
};

const makeStyles = (colors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background.secondary },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: colors.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.primary,
    },
    headerTitle: { fontSize: 20, fontWeight: '800', color: colors.text.primary },
    headerSub: { fontSize: 12, color: colors.text.tertiary, marginTop: 2 },
    list: { padding: 16, gap: 12 },
    card: {
        backgroundColor: colors.background.primary,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border.primary,
        overflow: 'hidden',
    },
    cardRow: { flexDirection: 'row', alignItems: 'center' },
    thumb: { width: 90, height: 90 },
    cardContent: { flex: 1, padding: 12 },
    category: {
        fontSize: 10, fontWeight: '700', color: colors.primary[500],
        textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4,
    },
    title: { fontSize: 14, fontWeight: '700', color: colors.text.primary, lineHeight: 20, marginBottom: 8 },
    meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    author: { fontSize: 12, color: colors.primary[600], fontWeight: '600' },
    dot: { color: colors.text.tertiary },
    time: { fontSize: 12, color: colors.text.tertiary },
    removeBtn: { padding: 12 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 8 },
    emptyTitle: { fontSize: 20, fontWeight: '700', color: colors.text.primary, marginTop: 16 },
    emptyText: { fontSize: 14, color: colors.text.tertiary, textAlign: 'center' },
    cta: {
        marginTop: 16, backgroundColor: colors.primary[600],
        paddingHorizontal: 28, paddingVertical: 12, borderRadius: 30,
    },
    ctaText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

export default BookmarksScreen;
