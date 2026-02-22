import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles, ArrowRight, TrendingUp, Users, BookOpen, Search as SearchIcon } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { articlesAPI } from '../api/articles';
import Container from '../components/Container';
import Button from '../components/Button';
import { Card, CardBody } from '../components/Card';
import { getImageUrl } from '../utils/imageUtils';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const [featuredArticles, setFeaturedArticles] = useState([]);
    const [recentArticles, setRecentArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const [featured, recent] = await Promise.all([
                articlesAPI.getArticles({ featured: true, limit: 3 }),
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

    const renderStats = () => (
        <View style={styles.statsContainer}>
            <Card style={styles.statCard}>
                <CardBody style={styles.statBody}>
                    <View style={[styles.statIconContainer, { backgroundColor: '#eef2ff' }]}>
                        <TrendingUp size={24} color={colors.primary[600]} />
                    </View>
                    <Text style={styles.statValue}>1000+</Text>
                    <Text style={styles.statLabel}>Articles</Text>
                </CardBody>
            </Card>

            <Card style={styles.statCard}>
                <CardBody style={styles.statBody}>
                    <View style={[styles.statIconContainer, { backgroundColor: '#fdf2f8' }]}>
                        <Users size={24} color="#db2777" />
                    </View>
                    <Text style={styles.statValue}>500+</Text>
                    <Text style={styles.statLabel}>Writers</Text>
                </CardBody>
            </Card>

            <Card style={styles.statCard}>
                <CardBody style={styles.statBody}>
                    <View style={[styles.statIconContainer, { backgroundColor: '#f5f3ff' }]}>
                        <BookOpen size={24} color="#7c3aed" />
                    </View>
                    <Text style={styles.statValue}>10k+</Text>
                    <Text style={styles.statLabel}>Readers</Text>
                </CardBody>
            </Card>
        </View>
    );

    const renderArticle = (article) => (
        <TouchableOpacity
            key={article.article_id}
            style={styles.articleCardWrapper}
            onPress={() => navigation.navigate('ArticleDetail', { slug: article.slug })}
        >
            <Card style={styles.articleCard}>
                {!!article.featured_image && (
                    <Image
                        source={{ uri: getImageUrl(article.featured_image) }}
                        style={styles.articleImage}
                    />
                )}
                <CardBody>
                    <Text style={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
                    <Text style={styles.articleExcerpt} numberOfLines={2}>{article.excerpt}</Text>
                    <View style={styles.articleFooter}>
                        <TouchableOpacity onPress={() => navigation.navigate('AuthorProfile', { username: article.username })}>
                            <Text style={styles.articleAuthor}>{article.full_name || article.username}</Text>
                        </TouchableOpacity>
                        <Text style={styles.articleDate}>{article.published_at_relative || 'Recently'}</Text>
                    </View>
                </CardBody>
            </Card>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" />
            <ScrollView style={styles.container}>

                {/* Hero Section */}
                <View style={styles.hero}>
                    <View style={styles.heroOverlay} />
                    <Container style={styles.heroContent}>
                        <View style={styles.welcomeBadge}>
                            <Sparkles size={14} color="#fff" />
                            <Text style={styles.welcomeText}>Welcome to Curio</Text>
                        </View>
                        <Text style={styles.heroTitle}>Discover Amazing Articles</Text>
                        <Text style={styles.heroSubtitle}>
                            Read, write, and share stories that matter. Join our community.
                        </Text>
                        <View style={styles.heroButtons}>
                            <Button
                                variant="secondary"
                                style={styles.heroButton}
                                onPress={() => navigation.navigate('Articles')}
                            >
                                Explore
                            </Button>
                        </View>
                    </Container>
                </View>

                {/* Stats Section */}
                <Container style={styles.sectionContainer}>
                    {renderStats()}
                </Container>

                {/* Featured Articles */}
                {featuredArticles.length > 0 && (
                    <View style={styles.featuredSection}>
                        <Container>
                            <Text style={styles.sectionTitle}>Featured Articles</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.featuredScroll}
                            >
                                {featuredArticles.map(article => (
                                    <TouchableOpacity
                                        key={article.article_id}
                                        style={styles.featuredCard}
                                        onPress={() => navigation.navigate('ArticleDetail', { slug: article.slug })}
                                    >
                                        <Card style={{ height: '100%' }}>
                                            <Image source={{ uri: getImageUrl(article.featured_image) }} style={styles.featuredImage} />
                                            <CardBody>
                                                <Text style={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
                                            </CardBody>
                                        </Card>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </Container>
                    </View>
                )}

                {/* Recent Articles */}
                <Container style={styles.sectionContainer}>
                    <View style={styles.recentHeader}>
                        <Text style={styles.sectionTitle}>Recent Articles</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Articles')}>
                            <Text style={styles.viewAll}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    {recentArticles.map(renderArticle)}
                </Container>

                <View style={styles.footerSpace} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.primary[700],
    },
    container: {
        flex: 1,
        backgroundColor: colors.background.secondary,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: colors.primary[700],
    },
    headerSubtitle: {
        fontSize: 14,
        color: colors.primary[100],
        fontWeight: '500',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
    },
    searchHeaderBtn: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    hero: {
        backgroundColor: colors.primary[700],
        paddingVertical: 40,
        minHeight: 300,
        justifyContent: 'center',
        position: 'relative',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    heroContent: {
        alignItems: 'flex-start',
    },
    welcomeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 16,
    },
    welcomeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 6,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        lineHeight: 40,
        marginBottom: 12,
    },
    heroSubtitle: {
        fontSize: 16,
        color: colors.primary[100],
        lineHeight: 24,
        marginBottom: 24,
    },
    heroButtons: {
        flexDirection: 'row',
    },
    heroButton: {
        paddingHorizontal: 24,
    },
    sectionContainer: {
        marginTop: -40,
        paddingBottom: 24,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statCard: {
        width: (width - 48) / 3,
    },
    statBody: {
        alignItems: 'center',
        padding: 12,
    },
    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text.primary,
    },
    statLabel: {
        fontSize: 10,
        color: colors.text.secondary,
    },
    featuredSection: {
        paddingVertical: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: 16,
    },
    featuredScroll: {
        paddingRight: 16,
    },
    featuredCard: {
        width: width * 0.7,
        marginRight: 16,
        height: 200,
    },
    featuredImage: {
        width: '100%',
        height: 120,
    },
    recentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 16,
    },
    viewAll: {
        color: colors.primary[600],
        fontWeight: '600',
    },
    articleCardWrapper: {
        marginBottom: 16,
    },
    articleCard: {},
    articleImage: {
        width: '100%',
        height: 180,
    },
    articleTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: 8,
    },
    articleExcerpt: {
        fontSize: 14,
        color: colors.text.secondary,
        lineHeight: 20,
        marginBottom: 12,
    },
    articleFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: colors.border.primary,
        paddingTop: 8,
    },
    articleAuthor: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.text.primary,
    },
    articleDate: {
        fontSize: 12,
        color: colors.text.tertiary,
    },
    footerSpace: {
        height: 40,
    }
});

export default HomeScreen;
