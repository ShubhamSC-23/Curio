import React, { useEffect, useState, useMemo } from 'react';
import {
    View, Text, StyleSheet, FlatList, Image, TouchableOpacity,
    ActivityIndicator, RefreshControl, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookMarked, CheckCircle2, Circle, Trash2, Clock } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import { userAPI } from '../api/user';
import { articlesAPI } from '../api/articles';
import { getImageUrl } from '../utils/imageUtils';
import { formatRelativeTime } from '../utils/formatDate';

const FILTERS = ['all', 'unread', 'read'];

const ReadingListScreen = ({ navigation }) => {
    const colors = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const [readingList, setReadingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState('all');

    useEffect(() => { fetchReadingList(); }, []);

    const fetchReadingList = async () => {
        try {
            setLoading(true);
            const data = await userAPI.getReadingList();
            setReadingList(data.data || []);
        } catch (error) {
            console.error('Error fetching reading list:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchReadingList();
        setRefreshing(false);
    };

    const handleMarkRead = async (articleId, currentState) => {
        try {
            await userAPI.markAsRead(articleId);
            setReadingList(prev =>
                prev.map(item => item.article_id === articleId ? { ...item, is_read: !currentState } : item)
            );
        } catch (error) { console.error(error); }
    };

    const handleRemove = (articleId) => {
        Alert.alert('Remove', 'Remove from reading list?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Remove', style: 'destructive',
                onPress: async () => {
                    try {
                        await articlesAPI.removeFromReadingList(articleId);
                        setReadingList(prev => prev.filter(i => i.article_id !== articleId));
                    } catch (e) { console.error(e); }
                }
            }
        ]);
    };

    const filtered = readingList.filter(item => {
        if (filter === 'unread') return !item.is_read;
        if (filter === 'read') return item.is_read;
        return true;
    });

    const readCount = readingList.filter(i => i.is_read).length;

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.card, item.is_read && styles.cardRead]}
            onPress={() => navigation.navigate('ArticleDetail', { slug: item.slug })}
            activeOpacity={0.85}
        >
            <View style={styles.cardRow}>
                <TouchableOpacity
                    style={styles.checkBtn}
                    onPress={() => handleMarkRead(item.article_id, item.is_read)}
                >
                    {item.is_read
                        ? <CheckCircle2 size={22} color={colors.status.success} />
                        : <Circle size={22} color={colors.border.secondary} />
                    }
                </TouchableOpacity>

                <View style={styles.info}>
                    {!!item.category_name && (
                        <Text style={styles.category}>{item.category_name}</Text>
                    )}
                    <Text style={[styles.title, item.is_read && styles.titleRead]} numberOfLines={2}>
                        {item.title}
                    </Text>
                    <View style={styles.meta}>
                        <Text style={styles.author}>{item.full_name || item.username}</Text>
                        {!!item.reading_time && (
                            <>
                                <Text style={styles.dot}>·</Text>
                                <Clock size={11} color={colors.text.tertiary} />
                                <Text style={styles.metaVal}>{item.reading_time}m</Text>
                            </>
                        )}
                    </View>
                </View>

                {!!item.featured_image && (
                    <Image source={{ uri: getImageUrl(item.featured_image) }} style={styles.thumb} resizeMode="cover" />
                )}

                <TouchableOpacity style={styles.del} onPress={() => handleRemove(item.article_id)}>
                    <Trash2 size={16} color={colors.status.error} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <BookMarked size={22} color={colors.primary[600]} />
                <Text style={styles.headerTitle}>Reading List</Text>
                <View style={styles.progressBadge}>
                    <Text style={styles.progressText}>{readCount}/{readingList.length} read</Text>
                </View>
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterRow}>
                {FILTERS.map(f => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.filterTab, filter === f && styles.filterTabActive]}
                        onPress={() => setFilter(f)}
                    >
                        <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? (
                <View style={styles.center}><ActivityIndicator size="large" color={colors.primary[600]} /></View>
            ) : filtered.length === 0 ? (
                <View style={styles.empty}>
                    <BookMarked size={56} color={colors.border.secondary} />
                    <Text style={styles.emptyTitle}>Nothing here</Text>
                    <Text style={styles.emptyText}>
                        {filter === 'read' ? 'No articles marked as read yet' : 'Add articles to your reading list'}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={item => item.article_id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary[600]} />}
                />
            )}
        </SafeAreaView>
    );
};

const makeStyles = (colors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background.secondary },
    header: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        paddingHorizontal: 20, paddingVertical: 16,
        backgroundColor: colors.background.primary,
        borderBottomWidth: 1, borderBottomColor: colors.border.primary,
    },
    headerTitle: { flex: 1, fontSize: 20, fontWeight: '800', color: colors.text.primary },
    progressBadge: {
        backgroundColor: colors.primary[50], paddingHorizontal: 10, paddingVertical: 4,
        borderRadius: 20, borderWidth: 1, borderColor: colors.primary[100],
    },
    progressText: { fontSize: 12, fontWeight: '700', color: colors.primary[600] },
    filterRow: {
        flexDirection: 'row',
        backgroundColor: colors.background.primary,
        borderBottomWidth: 1, borderBottomColor: colors.border.primary,
        paddingHorizontal: 16, paddingBottom: 12, paddingTop: 4, gap: 8,
    },
    filterTab: {
        paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
        backgroundColor: colors.background.tertiary, borderWidth: 1, borderColor: colors.border.primary,
    },
    filterTabActive: { backgroundColor: colors.primary[600], borderColor: colors.primary[600] },
    filterText: { fontSize: 13, fontWeight: '600', color: colors.text.secondary },
    filterTextActive: { color: '#fff' },
    list: { padding: 16, gap: 10 },
    card: {
        backgroundColor: colors.background.primary, borderRadius: 14,
        borderWidth: 1, borderColor: colors.border.primary, overflow: 'hidden',
    },
    cardRead: { opacity: 0.7 },
    cardRow: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
    checkBtn: { padding: 4 },
    info: { flex: 1 },
    category: {
        fontSize: 10, fontWeight: '700', color: colors.primary[500],
        textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3,
    },
    title: { fontSize: 14, fontWeight: '700', color: colors.text.primary, lineHeight: 20, marginBottom: 6 },
    titleRead: { textDecorationLine: 'line-through', color: colors.text.tertiary },
    meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    author: { fontSize: 12, color: colors.primary[600], fontWeight: '600' },
    dot: { color: colors.text.tertiary },
    metaVal: { fontSize: 11, color: colors.text.tertiary },
    thumb: { width: 60, height: 60, borderRadius: 8 },
    del: { padding: 6 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 32 },
    emptyTitle: { fontSize: 20, fontWeight: '700', color: colors.text.primary, marginTop: 16 },
    emptyText: { fontSize: 14, color: colors.text.tertiary, textAlign: 'center' },
});

export default ReadingListScreen;
