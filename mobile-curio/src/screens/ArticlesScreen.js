import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Clock, Eye } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { articlesAPI } from '../api/articles';
import { categoriesAPI } from '../api/categories';
import Container from '../components/Container';
import { Card, CardBody } from '../components/Card';
import { getImageUrl } from '../utils/imageUtils';

const ArticlesScreen = ({ navigation }) => {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        setPage(1);
        fetchArticles(1, true);
    }, [search, selectedCategory]);

    const fetchCategories = async () => {
        try {
            const data = await categoriesAPI.getCategories();
            setCategories(data.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchArticles = async (pageNum, refresh = false) => {
        try {
            if (refresh) setLoading(true);
            else setLoadingMore(true);

            const params = {
                page: pageNum,
                limit: 10,
                search: search || undefined,
                category: selectedCategory || undefined,
            };

            const data = await articlesAPI.getArticles(params);
            const newArticles = data.data || [];

            if (refresh) {
                setArticles(newArticles);
            } else {
                setArticles(prev => [...prev, ...newArticles]);
            }

            setHasMore(data.pagination?.hasNextPage || false);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
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
        >
            <Card style={styles.card}>
                <View style={styles.row}>
                    {!!item.featured_image && (
                        <Image
                            source={{ uri: getImageUrl(item.featured_image) }}
                            style={styles.thumbnail}
                        />
                    )}
                    <View style={styles.content}>
                        <Text style={styles.categoryName}>{item.category_name}</Text>
                        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                        <View style={styles.authorMeta}>
                            <TouchableOpacity onPress={() => navigation.navigate('AuthorProfile', { username: item.username })}>
                                <Text style={styles.author}>{item.username}</Text>
                            </TouchableOpacity>
                            <Text style={styles.dot}>•</Text>
                            <View style={styles.metaItem}>
                                <Clock size={12} color={colors.text.tertiary} />
                                <Text style={styles.metaText}>{item.reading_time} min</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Eye size={12} color={colors.text.tertiary} />
                                <Text style={styles.metaText}>{item.view_count || 0}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <Search size={18} color={colors.text.tertiary} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search articles..."
                        value={search}
                        onChangeText={setSearch}
                        placeholderTextColor={colors.text.tertiary}
                    />
                </View>
                <TouchableOpacity
                    style={styles.advancedSearchBtn}
                    onPress={() => navigation.navigate('Search')}
                >
                    <Filter size={20} color={colors.primary[600]} />
                </TouchableOpacity>
            </View>

            <View style={styles.categoriesContainer}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={[{ category_id: 'all', name: 'All', slug: null }, ...categories]}
                    keyExtractor={(item) => item.category_id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.categoryBadge,
                                selectedCategory === item.slug && styles.categoryBadgeSelected
                            ]}
                            onPress={() => setSelectedCategory(item.slug)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.categoryText,
                                selectedCategory === item.slug && styles.categoryTextSelected
                            ]}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.categoriesList}
                />
            </View>

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
                    ListFooterComponent={() => (
                        loadingMore ? <ActivityIndicator style={styles.footerLoader} /> : null
                    )}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No articles found.</Text>
                        </View>
                    )}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.secondary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.primary,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.tertiary,
        borderRadius: 10,
        paddingHorizontal: 12,
    },
    advancedSearchBtn: {
        marginLeft: 12,
        padding: 10,
        backgroundColor: colors.primary[50],
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.primary[100],
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 44,
        color: colors.text.primary,
        fontSize: 16,
    },
    categoriesContainer: {
        paddingVertical: 12,
        backgroundColor: colors.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.primary,
    },
    categoriesList: {
        paddingHorizontal: 16,
    },
    categoryBadge: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 25,
        backgroundColor: colors.background.tertiary,
        marginRight: 10,
        borderWidth: 1,
        borderColor: colors.border.primary,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    categoryBadgeSelected: {
        backgroundColor: colors.primary[600],
        borderColor: colors.primary[600],
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.text.secondary,
    },
    categoryTextSelected: {
        color: '#fff',
    },
    listContent: {
        padding: 16,
    },
    articleItem: {
        marginBottom: 16,
    },
    card: {
        backgroundColor: colors.background.primary,
    },
    row: {
        flexDirection: 'row',
    },
    thumbnail: {
        width: 100,
        height: 100,
        borderRadius: 8,
        margin: 8,
    },
    content: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    categoryName: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.primary[600],
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: 8,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    metaText: {
        fontSize: 12,
        color: colors.text.tertiary,
        marginLeft: 4,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerLoader: {
        marginVertical: 16,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        color: colors.text.secondary,
        fontSize: 16,
    },
});

export default ArticlesScreen;
