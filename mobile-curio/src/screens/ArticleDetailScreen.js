import React, { useEffect, useState } from 'react';
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
    ArrowLeft
} from 'lucide-react-native';
import { colors } from '../theme/colors';
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
                setLiked(lStatus.data?.liked || false);
                setBookmarked(bStatus.data?.bookmarked || false);
                setInReadingList(rStatus.data?.in_list || false);
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
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {!!article.featured_image && (
                    <Image source={{ uri: getImageUrl(article.featured_image) }} style={styles.featuredImage} />
                )}

                <Container style={styles.contentContainer}>
                    <Text style={styles.categoryBadge}>{article.category_name}</Text>
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
                        tagsStyles={{
                            p: { color: colors.text.primary, fontSize: 16, lineHeight: 24, marginBottom: 16 },
                            h2: { color: colors.text.primary, fontSize: 22, fontWeight: 'bold', marginTop: 24, marginBottom: 12 },
                            h3: { color: colors.text.primary, fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 8 },
                        }}
                        renderers={{
                            img: (props) => {
                                const { src } = props.tnode.attributes;
                                return (
                                    <Image
                                        source={{ uri: getImageUrl(src) }}
                                        style={{
                                            width: width - 32,
                                            height: (width - 32) * 0.6,
                                            borderRadius: 8,
                                            marginVertical: 12
                                        }}
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

                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={[styles.actionButton, liked && styles.actionButtonActive]}
                            onPress={handleLike}
                        >
                            <Heart size={20} color={liked ? '#fff' : colors.text.primary} fill={liked ? '#fff' : 'none'} />
                            <Text style={[styles.actionText, liked && styles.actionTextActive]}>
                                {likeCount}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, bookmarked && styles.actionButtonActive]}
                            onPress={handleBookmark}
                        >
                            <Bookmark size={20} color={bookmarked ? '#fff' : colors.text.primary} fill={bookmarked ? '#fff' : 'none'} />
                            <Text style={[styles.actionText, bookmarked && styles.actionTextActive]}>{bookmarked ? 'Saved' : 'Save'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                            <Share2 size={20} color={colors.text.primary} />
                            <Text style={styles.actionText}>Share</Text>
                        </TouchableOpacity>
                    </View>

                    <Button
                        variant={inReadingList ? 'outline' : 'primary'}
                        style={styles.readingListBtn}
                        onPress={handleReadingList}
                    >
                        {inReadingList ? 'In Reading List' : 'Add to Reading List'}
                    </Button>
                </Container>
                <View style={styles.footerSpace} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
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
    featuredImage: {
        width: '100%',
        height: 250,
    },
    contentContainer: {
        paddingVertical: 24,
    },
    categoryBadge: {
        color: colors.primary[600],
        fontWeight: '700',
        fontSize: 14,
        textTransform: 'uppercase',
        marginBottom: 12,
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
        marginRight: 16,
        marginBottom: 8,
    },
    metaText: {
        fontSize: 13,
        color: colors.text.tertiary,
        marginLeft: 6,
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
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background.secondary,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border.primary,
        flex: 1,
        marginHorizontal: 4,
    },
    readingListBtn: {
        marginTop: 16,
    },
    actionButtonActive: {
        backgroundColor: colors.primary[600],
        borderColor: colors.primary[600],
    },
    actionText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
        color: colors.text.primary,
    },
    actionTextActive: {
        color: '#fff',
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
