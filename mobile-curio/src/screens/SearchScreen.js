import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Image,
    ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search as SearchIcon, X, SlidersHorizontal, Clock, Eye, TrendingUp, Sparkles, BookOpen } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import { articlesAPI } from '../api/articles';
import { categoriesAPI } from '../api/categories';
import { getImageUrl } from '../utils/imageUtils';
import { formatRelativeTime } from '../utils/formatDate';
import Container from '../components/Container';
import { Card, CardBody } from '../components/Card';

const SearchScreen = ({ navigation }) => {
    const colors = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const [query, setQuery] = useState('');
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [sortBy, setSortBy] = useState('latest'); // latest | popular | trending
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await categoriesAPI.getCategories();
            setCategories(data.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSearch = async (override = {}) => {
        const activeQuery = override.query !== undefined ? override.query : query;
        const activeCategory = override.category !== undefined ? override.category : selectedCategory;
        const activeSort = override.sortBy !== undefined ? override.sortBy : sortBy;

        if (!activeQuery.trim() && !activeCategory) return;

        try {
            setLoading(true);
            setHasSearched(true);

            const params = {
                search: activeQuery.trim() || undefined,
                category: activeCategory || undefined,
                limit: 20
            };

            if (activeSort === 'popular') {
                params.sortBy = 'view_count';
                params.order = 'desc';
            } else if (activeSort === 'trending') {
                params.sortBy = 'like_count';
                params.order = 'desc';
            }

            const data = await articlesAPI.getArticles(params);
            setArticles(data.data || []);
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setArticles([]);
        setHasSearched(false);
        setSelectedCategory(null);
        setSortBy('latest');
    };

    const renderArticle = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('ArticleDetail', { slug: item.slug })}
            style={styles.articleCard}
        >
            <Card>
                <View style={styles.cardRow}>
                    {!!item.featured_image && (
                        <Image
                            source={{ uri: getImageUrl(item.featured_image) }}
                            style={styles.thumbnail}
                        />
                    )}
                    <View style={styles.cardContent}>
                        <Text style={styles.categoryBadge}>{item.category_name}</Text>
                        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                        <View style={styles.meta}>
                            <Text style={styles.author}>{item.username}</Text>
                            <Text style={styles.dot}>•</Text>
                            <Text style={styles.metaText}>{formatRelativeTime(item.published_at)}</Text>
                        </View>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );

    const sortOptions = [
        { id: 'latest', label: 'Latest', icon: Clock },
        { id: 'popular', label: 'Popular', icon: Eye },
        { id: 'trending', label: 'Trending', icon: TrendingUp },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Search Header */}
            <View style={styles.header}>
                <Container>
                    <View style={styles.searchBar}>
                        <SearchIcon size={20} color={colors.text.tertiary} style={styles.searchIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Discover Indian Heritage..."
                            value={query}
                            onChangeText={setQuery}
                            onSubmitEditing={() => handleSearch()}
                            placeholderTextColor={colors.text.tertiary}
                        />
                        {query.length > 0 && (
                            <TouchableOpacity onPress={clearSearch}>
                                <X size={20} color={colors.text.tertiary} />
                            </TouchableOpacity>
                        )}
                    </View>
                </Container>
            </View>

            {/* Filters (Horizontal) */}
            <View style={styles.filtersWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
                    {/* Sorting Options */}
                    <View style={styles.filterGroup}>
                        {sortOptions.map(opt => (
                            <TouchableOpacity
                                key={opt.id}
                                style={[styles.filterChip, sortBy === opt.id && styles.filterChipActive]}
                                onPress={() => {
                                    setSortBy(opt.id);
                                    if (hasSearched) handleSearch({ sortBy: opt.id });
                                }}
                            >
                                <opt.icon size={14} color={sortBy === opt.id ? '#fff' : colors.text.secondary} style={styles.chipIcon} />
                                <Text style={[styles.filterChipText, sortBy === opt.id && styles.filterChipTextActive]}>
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.divider} />

                    {/* Categories */}
                    <View style={styles.filterGroup}>
                        {categories.map(cat => (
                            <TouchableOpacity
                                key={cat.category_id}
                                style={[styles.filterChip, selectedCategory === cat.slug && styles.filterChipActive]}
                                onPress={() => {
                                    const newCategory = selectedCategory === cat.slug ? null : cat.slug;
                                    setSelectedCategory(newCategory);
                                    handleSearch({ category: newCategory });
                                }}
                            >
                                <Text style={[styles.filterChipText, selectedCategory === cat.slug && styles.filterChipTextActive]}>
                                    {cat.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={colors.primary[600]} />
                    </View>
                ) : !hasSearched ? (
                    <View style={styles.emptyState}>
                        <View style={styles.sparkleIcon}>
                            <Sparkles size={48} color={colors.primary[600]} />
                        </View>
                        <Text style={styles.emptyTitle}>Start Exploring</Text>
                        <Text style={styles.emptySubtitle}>
                            Search for architecture, festivals, history, or anything else about Indian Heritage.
                        </Text>
                        <View style={styles.suggestions}>
                            {['History', 'Architecture', 'Art', 'Traditions'].map(tag => (
                                <TouchableOpacity
                                    key={tag}
                                    style={styles.suggestionTag}
                                    onPress={() => {
                                        setQuery(tag);
                                        handleSearch({ query: tag });
                                    }}
                                >
                                    <Text style={styles.suggestionText}>{tag}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ) : articles.length === 0 ? (
                    <View style={styles.emptyState}>
                        <BookOpen size={48} color={colors.text.tertiary} />
                        <Text style={styles.emptyTitle}>No Results Found</Text>
                        <Text style={styles.emptySubtitle}>Try different keywords or filters.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={articles}
                        keyExtractor={item => item.article_id.toString()}
                        renderItem={renderArticle}
                        contentContainerStyle={styles.listPadding}
                        ListHeaderComponent={
                            <Text style={styles.resultsCount}>Found {articles.length} articles</Text>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const makeStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.secondary,
    },
    header: {
        paddingVertical: 12,
        backgroundColor: colors.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.primary,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.tertiary,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.text.primary,
    },
    filtersWrapper: {
        backgroundColor: colors.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.primary,
    },
    filtersScroll: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    filterGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: colors.background.tertiary,
        marginRight: 8,
        borderWidth: 1,
        borderColor: colors.border.primary,
    },
    filterChipActive: {
        backgroundColor: colors.primary[600],
        borderColor: colors.primary[600],
    },
    filterChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.text.secondary,
    },
    filterChipTextActive: {
        color: '#fff',
    },
    chipIcon: {
        marginRight: 4,
    },
    divider: {
        width: 1,
        height: 20,
        backgroundColor: colors.border.primary,
        marginHorizontal: 8,
    },
    content: {
        flex: 1,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    sparkleIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary[50],
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.text.primary,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 15,
        color: colors.text.tertiary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    suggestions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    suggestionTag: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: colors.background.primary,
        borderWidth: 1,
        borderColor: colors.border.primary,
        margin: 4,
    },
    suggestionText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.primary[600],
    },
    listPadding: {
        padding: 16,
    },
    resultsCount: {
        fontSize: 14,
        color: colors.text.tertiary,
        marginBottom: 16,
    },
    articleCard: {
        marginBottom: 16,
    },
    cardRow: {
        flexDirection: 'row',
        padding: 12,
    },
    thumbnail: {
        width: 90,
        height: 90,
        borderRadius: 8,
        marginRight: 12,
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
    },
    categoryBadge: {
        fontSize: 10,
        fontWeight: '800',
        color: colors.primary[600],
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: 6,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    author: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.text.secondary,
    },
    dot: {
        marginHorizontal: 4,
        color: colors.text.tertiary,
    },
    metaText: {
        fontSize: 12,
        color: colors.text.tertiary,
    }
});

export default SearchScreen;
