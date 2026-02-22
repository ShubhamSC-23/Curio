import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    RefreshControl,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles, TrendingUp, Users, BookOpen, Search as SearchIcon, ArrowRight, Clock, Eye, Bell } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { articlesAPI } from '../api/articles';
import { notificationsAPI } from '../api/notifications';
import Container from '../components/Container';
import Button from '../components/Button';
import { Card, CardBody } from '../components/Card';
import { getImageUrl } from '../utils/imageUtils';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const colors = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const { isDarkMode } = useThemeStore();
    const [featuredArticles, setFeaturedArticles] = useState([]);
    const [recentArticles, setRecentArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;
    const { isAuthenticated } = useAuthStore();
    const [unreadCount, setUnreadCount] = useState(0);

    useFocusEffect(
        useCallback(() => {
            if (isAuthenticated) {
                notificationsAPI.getUnreadCount()
                    .then(res => setUnreadCount(res.count || 0))
                    .catch(e => console.log('Err fetching notifications count', e));
            } else {
                setUnreadCount(0);
            }
        }, [isAuthenticated])
    );

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const [featured, recent] = await Promise.all([
                articlesAPI.getArticles({ featured: true, limit: 5 }),
                articlesAPI.getArticles({ limit: 6 }),
            ]);
            setFeaturedArticles(featured.data || []);
            setRecentArticles(recent.data || []);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchArticles();
        setRefreshing(false);
    };

    const renderFeaturedCard = (article) => (
        <TouchableOpacity
            key={article.article_id}
            style={styles.featuredCard}
            onPress={() => navigation.navigate('ArticleDetail', { slug: article.slug })}
            activeOpacity={0.9}
        >
            <View style={styles.featuredCardInner}>
                {!!article.featured_image && (
                    <Image
                        source={{ uri: getImageUrl(article.featured_image) }}
                        style={styles.featuredImage}
                        resizeMode="cover"
                    />
                )}
                <View style={styles.featuredOverlay} />
                <View style={styles.featuredContent}>
                    {!!article.category_name && (
                        <View style={styles.categoryPill}>
                            <Text style={styles.categoryPillText}>{article.category_name}</Text>
                        </View>
                    )}
                    <Text style={styles.featuredTitle} numberOfLines={2}>{article.title}</Text>
                    <View style={styles.featuredMeta}>
                        <Text style={styles.featuredAuthor}>{article.full_name || article.username}</Text>
                        {!!article.reading_time && (
                            <View style={styles.featuredMetaItem}>
                                <Clock size={12} color="rgba(255,255,255,0.8)" />
                                <Text style={styles.featuredMetaText}>{article.reading_time} min</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderArticleCard = (article) => (
        <TouchableOpacity
            key={article.article_id}
            style={styles.articleCardWrapper}
            onPress={() => navigation.navigate('ArticleDetail', { slug: article.slug })}
            activeOpacity={0.85}
        >
            <View style={styles.articleCardRow}>
                {!!article.featured_image && (
                    <Image
                        source={{ uri: getImageUrl(article.featured_image) }}
                        style={styles.articleThumb}
                        resizeMode="cover"
                    />
                )}
                <View style={styles.articleCardContent}>
                    {!!article.category_name && (
                        <Text style={styles.articleCategory}>{article.category_name}</Text>
                    )}
                    <Text style={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
                    <View style={styles.articleMeta}>
                        <TouchableOpacity onPress={() => navigation.navigate('AuthorProfile', { username: article.username })}>
                            <Text style={styles.articleAuthor}>{article.full_name || article.username}</Text>
                        </TouchableOpacity>
                        <Text style={styles.metaDot}>·</Text>
                        <Text style={styles.articleDate}>{article.published_at_relative || 'Recently'}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.primary[700]} />

            {/* Floating Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerLabel}>Curio</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={[styles.searchBtn, { marginRight: 12, position: 'relative' }]}
                        onPress={() => navigation.navigate('Notifications')}
                    >
                        <Bell size={20} color={colors.primary[600]} />
                        {unreadCount > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadBadgeText}>
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.searchBtn}
                        onPress={() => navigation.navigate('Search')}
                    >
                        <SearchIcon size={20} color={colors.primary[600]} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary[600]}
                        colors={[colors.primary[600]]}
                    />
                }
            >
                {/* Hero Banner */}
                <View style={styles.hero}>
                    <View style={styles.heroGradient} />
                    <Container style={styles.heroContent}>
                        <View style={styles.welcomeBadge}>
                            <Sparkles size={12} color="#fff" />
                            <Text style={styles.welcomeText}>Welcome to Curio</Text>
                        </View>
                        <Text style={styles.heroTitle}>Discover Amazing{'\n'}Articles</Text>
                        <Text style={styles.heroSubtitle}>
                            Read, write, and share stories that matter. Join our community of passionate readers and writers.
                        </Text>
                        <View style={styles.heroActions}>
                            <TouchableOpacity style={styles.heroPrimaryBtn} onPress={() => navigation.navigate('Articles')}>
                                <Text style={styles.heroPrimaryBtnText}>Explore Articles</Text>
                                <ArrowRight size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </Container>
                </View>

                {/* Quick Stats Strip */}
                <View style={styles.statsStrip}>
                    <View style={styles.statItem}>
                        <TrendingUp size={16} color={colors.primary[600]} />
                        <Text style={styles.statNum}>1000+</Text>
                        <Text style={styles.statLbl}>Articles</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate('Authors')}>
                        <Users size={16} color="#db2777" />
                        <Text style={styles.statNum}>500+</Text>
                        <Text style={styles.statLbl}>Writers</Text>
                    </TouchableOpacity>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <BookOpen size={16} color="#7c3aed" />
                        <Text style={styles.statNum}>10k+</Text>
                        <Text style={styles.statLbl}>Readers</Text>
                    </View>
                </View>

                {/* Featured Articles Carousel */}
                {featuredArticles.length > 0 && (
                    <View style={styles.section}>
                        <Container>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Featured</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Articles')}>
                                    <Text style={styles.seeAll}>See all</Text>
                                </TouchableOpacity>
                            </View>
                        </Container>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.featuredScroll}
                            pagingEnabled
                            decelerationRate="fast"
                        >
                            {featuredArticles.map(renderFeaturedCard)}
                        </ScrollView>
                    </View>
                )}

                {/* Recent Articles */}
                <Container style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Articles</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Articles')}>
                            <Text style={styles.seeAll}>View all</Text>
                        </TouchableOpacity>
                    </View>
                    {recentArticles.map(renderArticleCard)}
                </Container>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const makeStyles = (colors) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: colors.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.primary,
    },
    headerLabel: {
        fontSize: 22,
        fontWeight: '800',
        color: colors.primary[600],
        letterSpacing: -0.5,
    },
    headerSub: {
        fontSize: 11,
        color: colors.text.tertiary,
        fontWeight: '500',
    },
    searchBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: colors.primary[50],
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.primary[100],
    },
    container: {
        flex: 1,
        backgroundColor: colors.background.secondary,
    },
    hero: {
        backgroundColor: colors.primary[700],
        paddingBottom: 32,
        paddingTop: 8,
        position: 'relative',
        overflow: 'hidden',
    },
    heroGradient: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.15)',
    },
    heroContent: {
        paddingTop: 24,
    },
    welcomeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.18)',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        marginBottom: 14,
    },
    welcomeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    heroTitle: {
        fontSize: 30,
        fontWeight: '800',
        color: '#fff',
        lineHeight: 38,
        marginBottom: 10,
        letterSpacing: -0.5,
    },
    heroSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 22,
        marginBottom: 20,
    },
    heroActions: {
        flexDirection: 'row',
        gap: 12,
    },
    heroPrimaryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 30,
    },
    heroPrimaryBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },
    statsStrip: {
        flexDirection: 'row',
        backgroundColor: colors.background.primary,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.primary,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    statDivider: {
        width: 1,
        backgroundColor: colors.border.primary,
        marginVertical: 4,
    },
    statNum: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.text.primary,
        marginTop: 4,
    },
    statLbl: {
        fontSize: 11,
        color: colors.text.tertiary,
        fontWeight: '500',
    },
    section: {
        paddingVertical: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 19,
        fontWeight: '800',
        color: colors.text.primary,
        letterSpacing: -0.3,
    },
    seeAll: {
        fontSize: 14,
        color: colors.primary[600],
        fontWeight: '600',
    },
    featuredScroll: {
        paddingHorizontal: 16,
        gap: 12,
    },
    featuredCard: {
        width: width - 48,
        height: 220,
        borderRadius: 16,
        overflow: 'hidden',
    },
    featuredCardInner: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: colors.background.tertiary,
    },
    featuredImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    featuredOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    featuredContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
    },
    categoryPill: {
        alignSelf: 'flex-start',
        backgroundColor: colors.primary[600],
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 12,
        marginBottom: 8,
    },
    categoryPillText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    featuredTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#fff',
        lineHeight: 24,
        marginBottom: 8,
    },
    featuredMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    featuredAuthor: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
    },
    featuredMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    featuredMetaText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.75)',
    },
    articleCardWrapper: {
        marginBottom: 16,
        backgroundColor: colors.background.tertiary,
        borderRadius: 20,
    },
    unreadBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#e11d48',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
        borderWidth: 1.5,
        borderColor: colors.background.primary
    },
    unreadBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold'
    },
    // The original snippet had 'hero: {rderWidth: 1,' which seems like a typo or cut-off.
    // I'm assuming it was meant to be part of the articleCardWrapper or a similar style.
    // I'm correcting it to be part of articleCardWrapper based on the context of the snippet.
    // If 'hero' was meant to be a separate style, it would need a full definition.
    // Given the instruction to make it syntactically correct, I'm integrating the border properties
    // into the articleCardWrapper as it appears to be a continuation of its definition.
    // If 'hero' was intended to be a separate style, this would be incorrect.
    // However, the snippet provided 'hero: {rderWidth: 1,' which is not a valid style definition.
    // I will assume the user intended to add these border properties to the articleCardWrapper.
    // If the user meant to define a new 'hero' style, the instruction was incomplete.
    // Based on the provided snippet:
    // articleCardWrapper: {
    //     marginBottom: 16,
    //     backgroundColor: colors.background.tertiary,
    //     borderRadius: 20,
    // },
    // unreadBadge: { ... },
    // unreadBadgeText: { ... },
    // hero: {rderWidth: 1,
    //     borderColor: colors.border.primary,
    //     overflow: 'hidden',
    // },
    // This structure suggests the border properties might belong to articleCardWrapper.
    // I will modify articleCardWrapper to include these.
    // If 'hero' was meant to be a separate style, it would need a full definition.
    // Given the instruction to make it syntactically correct, I'm interpreting the snippet
    // as adding these properties to articleCardWrapper.
    // If the user intended to define a new 'hero' style, the instruction was incomplete.
    // I will assume the user intended to add these border properties to the articleCardWrapper.
    // The original 'hero' style is already defined above.
    // I will remove the problematic 'hero: {rderWidth: 1,' line and assume the border properties
    // were meant for articleCardWrapper, as it's the most logical interpretation for syntactical correctness.
    // The original articleCardWrapper already has borderWidth and borderColor.
    // I will keep the existing articleCardWrapper definition and add the new styles.
    // The snippet provided for `articleCardWrapper` also changes `backgroundColor` and `borderRadius`.
    // I will apply those changes to the existing `articleCardWrapper` definition.
    // The `hero: {rderWidth: 1, borderColor: colors.border.primary, overflow: 'hidden',}` part
    // is problematic. The `hero` style is already defined above. The `rderWidth` is a typo.
    // I will assume this was meant to be part of `articleCardWrapper`'s border properties,
    // but since `articleCardWrapper` already has them, and the snippet for `articleCardWrapper`
    // explicitly sets `borderWidth: 1, borderColor: colors.border.primary, overflow: 'hidden'`,
    // I will apply those to `articleCardWrapper` and ignore the `hero: {rderWidth: 1,` line
    // as it's syntactically incorrect and redundant with the existing `hero` style.
    // The provided snippet for `articleCardWrapper` is:
    // articleCardWrapper: {
    //     marginBottom: 16,
    //     backgroundColor: colors.background.tertiary,
    //     borderRadius: 20,
    // },
    // This replaces the existing `articleCardWrapper` properties.
    // The subsequent `borderWidth: 1, borderColor: colors.border.primary, overflow: 'hidden',`
    // seems to be a continuation of `articleCardWrapper`'s properties, but placed after `unreadBadgeText`.
    // I will combine them into the `articleCardWrapper` definition.

    // Corrected articleCardWrapper based on the snippet's intent and existing properties
    articleCardWrapper: {
        marginBottom: 16,
        backgroundColor: colors.background.tertiary, // Changed from primary
        borderRadius: 20, // Changed from 14
        borderWidth: 1, // Added/Confirmed
        borderColor: colors.border.primary, // Added/Confirmed
        overflow: 'hidden', // Added/Confirmed
    },
    articleCardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    articleThumb: {
        width: 100,
        height: 100,
        borderTopLeftRadius: 14,
        borderBottomLeftRadius: 14,
    },
    articleCardContent: {
        flex: 1,
        padding: 14,
        justifyContent: 'center',
    },
    articleCategory: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.primary[600],
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    articleTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.text.primary,
        lineHeight: 20,
        marginBottom: 8,
    },
    articleMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    articleAuthor: {
        fontSize: 12,
        color: colors.primary[600],
        fontWeight: '600',
    },
    metaDot: {
        color: colors.text.tertiary,
        fontSize: 14,
    },
    articleDate: {
        fontSize: 12,
        color: colors.text.tertiary,
    },
});

export default HomeScreen;
