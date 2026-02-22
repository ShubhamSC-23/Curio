import React, { useEffect, useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    useWindowDimensions,
    Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RenderHtml from 'react-native-render-html';
import {
    Calendar,
    Clock,
    Eye,
    Heart,
    Bookmark,
    Share2,
    ArrowLeft,
    BookOpen
} from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import { articlesAPI } from '../api/articles';
import { getImageUrl } from '../utils/imageUtils';
import { formatDate } from '../utils/formatDate';
import Container from '../components/Container';
import { Card, CardBody } from '../components/Card';
import Button from '../components/Button';
import CommentList from '../components/CommentList';
import { useAuthStore } from '../store/authStore';

const ArticleDetailScreen = ({ route, navigation }) => {
    const { slug } = route.params;
    const { width } = useWindowDimensions();
    const colors = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const { user, isAuthenticated } = useAuthStore();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [inReadingList, setInReadingList] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        fetchArticle();
    }, [slug]);

    const fetchArticle = async () => {
        try {
            setLoading(true);
            const data = await articlesAPI.getArticle(slug);
            const art = data.data;
            setArticle(art);
            setLikeCount(art.like_count || 0);

            if (isAuthenticated && art.article_id) {
                const [lStatus, bStatus, rStatus] = await Promise.all([
                    articlesAPI.getLikeStatus(art.article_id),
                    articlesAPI.getBookmarkStatus(art.article_id),
                    articlesAPI.getReadingListStatus(art.article_id)
                ]);
                setLiked(lStatus.data?.isLiked || false);
                setBookmarked(bStatus.data?.isBookmarked || false);
                setInReadingList(rStatus.data?.inReadingList || false);
            }
        } catch (error) {
            console.error('Error fetching article details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!isAuthenticated) {
            navigation.navigate('Profile');
            return;
        }
        try {
            await articlesAPI.likeArticle(article.article_id);
            setLiked(!liked);
            setLikeCount(prev => liked ? prev - 1 : prev + 1);
        } catch (error) {
            console.error('Error liking article:', error);
        }
    };

    const handleBookmark = async () => {
        if (!isAuthenticated) {
            navigation.navigate('Profile');
            return;
        }
        try {
            await articlesAPI.bookmarkArticle(article.article_id);
            setBookmarked(!bookmarked);
        } catch (error) {
            console.error('Error bookmarking article:', error);
        }
    };

    const handleReadingList = async () => {
        if (!isAuthenticated) {
            navigation.navigate('Profile');
            return;
        }
        try {
            if (inReadingList) {
                await articlesAPI.removeFromReadingList(article.article_id);
            } else {
                await articlesAPI.addToReadingList(article.article_id);
            }
            setInReadingList(!inReadingList);
        } catch (error) {
            console.error('Error updating reading list:', error);
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${article.title}\nRead more at: Curio MobileApp`,
                title: article.title,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.primary[600]} />
            </View>
        );
    }

    if (!article) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Article not found.</Text>
                <Button onPress={() => navigation.goBack()}>Go Back</Button>
            </View>
        );
    }

    const tagsArray = typeof article.tags === 'string'
        ? article.tags.split(',').map(t => t.trim())
        : Array.isArray(article.tags) ? article.tags : [];

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Image with back/share overlay */}
                <View style={styles.heroWrapper}>
                    {!!article.featured_image ? (
                        <Image source={{ uri: getImageUrl(article.featured_image) }} style={styles.featuredImage} resizeMode="cover" />
                    ) : (
                        <View style={[styles.featuredImage, { backgroundColor: colors.primary[700] }]} />
                    )}
                    <View style={styles.heroOverlay} />
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <ArrowLeft size={20} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                        <Share2 size={20} color="#fff" />
                    </TouchableOpacity>
                    {!!article.category_name && (
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryBadgeText}>{article.category_name}</Text>
                        </View>
                    )}
                </View>

                <Container style={styles.contentContainer}>
                    <Text style={styles.title}>{article.title}</Text>

                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Calendar size={14} color={colors.text.tertiary} />
                            <Text style={styles.metaText}>{formatDate(article.published_at)}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Clock size={14} color={colors.text.tertiary} />
                            <Text style={styles.metaText}>{article.reading_time} min read</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Eye size={14} color={colors.text.tertiary} />
                            <Text style={styles.metaText}>{article.view_count || 0}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.authorCard}
                        onPress={() => navigation.navigate('AuthorProfile', { username: article.username })}
                    >
                        <View style={styles.authorAvatar}>
                            <Text style={styles.avatarText}>
                                {(article.full_name || article.username).charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.authorName}>{article.full_name || article.username}</Text>
                            <Text style={styles.authorHandle}>@{article.username}</Text>
                        </View>
                    </TouchableOpacity>

                    <RenderHtml
                        contentWidth={width - 32}
                        source={{ html: article.content }}
                        baseStyle={{ color: colors.text.primary }}
                        tagsStyles={{
                            p: { color: colors.text.primary, fontSize: 17, lineHeight: 28, marginBottom: 16 },
                            h1: { color: colors.text.primary, fontSize: 26, fontWeight: '800', marginTop: 32, marginBottom: 16 },
                            h2: { color: colors.text.primary, fontSize: 22, fontWeight: '800', marginTop: 28, marginBottom: 12 },
                            h3: { color: colors.text.primary, fontSize: 19, fontWeight: '700', marginTop: 22, marginBottom: 10 },
                            h4: { color: colors.text.primary, fontSize: 17, fontWeight: '700', marginTop: 18, marginBottom: 8 },
                            h5: { color: colors.text.primary, fontSize: 16, fontWeight: '700', marginTop: 16, marginBottom: 8 },
                            h6: { color: colors.text.primary, fontSize: 14, fontWeight: '700', marginTop: 16, marginBottom: 8 },
                            blockquote: { borderLeftWidth: 4, borderLeftColor: colors.primary[400], paddingLeft: 12, color: colors.text.secondary, fontStyle: 'italic' },
                            a: { color: colors.primary[600], textDecorationLine: 'underline' },
                            li: { color: colors.text.primary, fontSize: 16, lineHeight: 26, marginBottom: 6 },
                            span: { color: colors.text.primary },
                            div: { color: colors.text.primary },
                            strong: { color: colors.text.primary, fontWeight: 'bold' },
                            b: { color: colors.text.primary, fontWeight: 'bold' },
                            em: { color: colors.text.primary, fontStyle: 'italic' },
                            i: { color: colors.text.primary, fontStyle: 'italic' },
                        }}
                        renderers={{
                            img: (props) => {
                                const { src } = props.tnode.attributes;
                                return (
                                    <Image
                                        source={{ uri: getImageUrl(src) }}
                                        style={{ width: width - 32, height: (width - 32) * 0.6, borderRadius: 10, marginVertical: 16 }}
                                        resizeMode="cover"
                                    />
                                );
                            }
                        }}
                    />

                    <CommentList articleId={article.article_id} />

                    {tagsArray.length > 0 && (
                        <View style={styles.tagsContainer}>
                            {tagsArray.map((tag, index) => (
                                <View key={index} style={styles.tagBadge}>
                                    <Text style={styles.tagText}>#{tag}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Floating Action Row */}
                    <View style={styles.actionBar}>
                        <TouchableOpacity
                            style={[styles.actionBtn, liked && styles.actionBtnActive]}
                            onPress={handleLike}
                        >
                            <Heart size={18} color={liked ? '#fff' : colors.text.secondary} fill={liked ? '#fff' : 'none'} />
                            <Text style={[styles.actionBtnText, liked && { color: '#fff' }]}>{likeCount}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionBtn, bookmarked && styles.actionBtnActive]}
                            onPress={handleBookmark}
                        >
                            <Bookmark size={18} color={bookmarked ? '#fff' : colors.text.secondary} fill={bookmarked ? '#fff' : 'none'} />
                            <Text style={[styles.actionBtnText, bookmarked && { color: '#fff' }]}>{bookmarked ? 'Saved' : 'Save'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionBtn, inReadingList && styles.actionBtnActive]}
                            onPress={handleReadingList}
                        >
                            <BookOpen size={18} color={inReadingList ? '#fff' : colors.text.secondary} />
                            <Text style={[styles.actionBtnText, inReadingList && { color: '#fff' }]}>{inReadingList ? 'In List' : 'Read Later'}</Text>
                        </TouchableOpacity>
                    </View>

                </Container>
                <View style={styles.footerSpace} />
            </ScrollView>
        </SafeAreaView>
    );
};

const makeStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background.primary,
    },
    heroWrapper: {
        position: 'relative',
        width: '100%',
        height: 280,
    },
    contentContainer: {
        paddingVertical: 24,
    },
    featuredImage: {
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    backBtn: {
        position: 'absolute',
        top: 48,
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    shareBtn: {
        position: 'absolute',
        top: 48,
        right: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryBadge: {
        position: 'absolute',
        bottom: 20,
        left: 16,
        backgroundColor: colors.primary[600],
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    categoryBadgeText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.text.primary,
        lineHeight: 36,
        marginBottom: 16,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        flexWrap: 'wrap',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 13,
        color: colors.text.tertiary,
        marginLeft: 6,
    },
    metaDot: {
        marginHorizontal: 10,
        color: colors.border.tertiary,
        fontSize: 18,
        lineHeight: 18,
    },
    authorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.secondary,
        padding: 12,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: colors.border.primary,
    },
    authorAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.primary[600],
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    authorName: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text.primary,
    },
    authorHandle: {
        fontSize: 13,
        color: colors.text.tertiary,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.primary,
    },
    tagBadge: {
        backgroundColor: colors.background.tertiary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        fontSize: 13,
        color: colors.text.secondary,
    },
    actionBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 32,
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: colors.border.primary,
        gap: 12,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.background.tertiary,
        borderWidth: 1,
        borderColor: colors.border.primary,
        gap: 8,
    },
    actionBtnActive: {
        backgroundColor: colors.primary[600],
        borderColor: colors.primary[600],
    },
    actionBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text.primary,
    },
    errorText: {
        fontSize: 18,
        color: colors.text.secondary,
        marginBottom: 16,
    },
    footerSpace: {
        height: 40,
    }
});

export default ArticleDetailScreen;
