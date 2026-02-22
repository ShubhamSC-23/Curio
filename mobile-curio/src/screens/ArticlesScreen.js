import React, { useEffect, useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, SlidersHorizontal, Clock, Eye } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import { articlesAPI } from '../api/articles';
import { categoriesAPI } from '../api/categories';
import Container from '../components/Container';
import { getImageUrl } from '../utils/imageUtils';

const ArticlesScreen = ({ navigation }) => {
    const colors = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => { fetchCategories(); }, []);
    useEffect(() => { setPage(1); fetchArticles(1, true); }, [search, selectedCategory]);

    const fetchCategories = async () => {
        try {
            const data = await categoriesAPI.getCategories();
            setCategories(data.data || []);
        } catch (error) { console.error('Error fetching categories:', error); }
    };

    const fetchArticles = async (pageNum, refresh = false) => {
        try {
            if (refresh) setLoading(true);
            else setLoadingMore(true);
            const params = { page: pageNum, limit: 10, search: search || undefined, category: selectedCategory || undefined };
            const data = await articlesAPI.getArticles(params);
            const newArticles = data.data || [];
            if (refresh) setArticles(newArticles);
            else setArticles(prev => [...prev, ...newArticles]);
            setHasMore(data.pagination?.hasNextPage || false);
        } catch (error) { console.error('Error fetching articles:', error); }
        finally { setLoading(false); setLoadingMore(false); }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        setPage(1);
        await fetchArticles(1, true);
        setRefreshing(false);
    };

    const handleLoadMore = () => {
        if (hasMore && !loadingMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchArticles(nextPage);
        }
    };

    const renderArticleItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('ArticleDetail', { slug: item.slug })}
            style={styles.articleItem}
            activeOpacity={0.85}
        >
            <View style={styles.cardRow}>
                {!!item.featured_image && (
                    <Image
                        source={{ uri: getImageUrl(item.featured_image) }}
                        style={styles.thumbnail}
                        resizeMode="cover"
                    />
                )}
                <View style={[styles.content, !item.featured_image && { paddingLeft: 0, paddingRight: 16 }]}>
                    {!!item.category_name && (
                        <Text style={styles.categoryName}>{item.category_name}</Text>
                    )}
                    <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                    <View style={styles.metaRow}>
                        <TouchableOpacity onPress={() => navigation.navigate('AuthorProfile', { username: item.username })}>
                            <Text style={styles.author}>{item.full_name || item.username}</Text>
                        </TouchableOpacity>
                        {!!item.reading_time && (
                            <View style={styles.metaBadge}>
                                <Clock size={11} color={colors.text.tertiary} />
                                <Text style={styles.metaText}>{item.reading_time}m</Text>
                            </View>
                        )}
                        {!!item.view_count && (
                            <View style={styles.metaBadge}>
                                <Eye size={11} color={colors.text.tertiary} />
                                <Text style={styles.metaText}>{item.view_count}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const allCats = [{ category_id: 'all', name: 'All', slug: null }, ...categories];

    return (
        <SafeAreaView style={styles.container}>
            {/* Search Bar */}
            <View style={styles.header}>
                <View style={styles.searchBox}>
                    <Search size={18} color={colors.text.tertiary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search articles..."
                        value={search}
                        onChangeText={setSearch}
                        placeholderTextColor={colors.text.tertiary}
                        returnKeyType="search"
                    />
                </View>
                <TouchableOpacity style={styles.filterBtn} onPress={() => navigation.navigate('Search')}>
                    <SlidersHorizontal size={18} color={colors.primary[600]} />
                </TouchableOpacity>
            </View>

            {/* Category Chips */}
            <View style={styles.chipsWrapper}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={allCats}
                    keyExtractor={(item) => item.category_id.toString()}
                    renderItem={({ item }) => {
                        const active = selectedCategory === item.slug;
                        return (
                            <TouchableOpacity
                                style={[styles.chip, active && styles.chipActive]}
                                onPress={() => setSelectedCategory(item.slug)}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.chipText, active && styles.chipTextActive]}>{item.name}</Text>
                            </TouchableOpacity>
                        );
                    }}
                    contentContainerStyle={styles.chipsList}
                />
            </View>

            {/* Results count */}
            {!loading && (
                <View style={styles.resultsBar}>
                    <Text style={styles.resultsText}>{articles.length} articles</Text>
                </View>
            )}

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.primary[600]} />
                </View>
            ) : (
                <FlatList
                    data={articles}
                    renderItem={renderArticleItem}
                    keyExtractor={(item) => item.article_id.toString()}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary[600]} />
                    }
                    ListFooterComponent={() => (
                        loadingMore ? <ActivityIndicator style={styles.footerLoader} color={colors.primary[600]} /> : null
                    )}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Search size={48} color={colors.text.tertiary} />
                            <Text style={styles.emptyTitle}>No articles found</Text>
                            <Text style={styles.emptyText}>Try a different search or category</Text>
                        </View>
                    )}
                    contentContainerStyle={styles.listContent}
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
        gap: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.primary,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: colors.background.tertiary,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    searchInput: { flex: 1, color: colors.text.primary, fontSize: 15 },
    filterBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: colors.primary[50],
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.primary[100],
    },
    chipsWrapper: {
        backgroundColor: colors.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.primary,
    },
    chipsList: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: colors.background.tertiary,
        borderWidth: 1,
        borderColor: colors.border.primary,
    },
    chipActive: { backgroundColor: colors.primary[600], borderColor: colors.primary[600] },
    chipText: { fontSize: 13, fontWeight: '600', color: colors.text.secondary },
    chipTextActive: { color: '#fff' },
    resultsBar: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    resultsText: { fontSize: 12, color: colors.text.tertiary, fontWeight: '500' },
    listContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 },
    articleItem: {
        marginBottom: 12,
        backgroundColor: colors.background.primary,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border.primary,
        overflow: 'hidden',
    },
    cardRow: { flexDirection: 'row', alignItems: 'stretch' },
    thumbnail: {
        width: 100,
        height: 100,
    },
    content: {
        flex: 1,
        padding: 12,
        paddingLeft: 12,
        justifyContent: 'center',
    },
    categoryName: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.primary[500],
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.text.primary,
        lineHeight: 20,
        marginBottom: 8,
    },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
    author: { fontSize: 12, color: colors.primary[600], fontWeight: '600' },
    metaBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    metaText: { fontSize: 11, color: colors.text.tertiary },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    footerLoader: { marginVertical: 20 },
    emptyContainer: { alignItems: 'center', paddingTop: 80, gap: 8 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.text.primary, marginTop: 12 },
    emptyText: { fontSize: 14, color: colors.text.tertiary },
    dot: { color: colors.text.tertiary },
    authorMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});

export default ArticlesScreen;
