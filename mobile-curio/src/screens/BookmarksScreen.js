import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bookmark, Trash2, BookOpen } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { userAPI } from '../api/user';
import { articlesAPI } from '../api/articles';
import { getImageUrl } from '../utils/imageUtils';
import { formatRelativeTime } from '../utils/formatDate';
import Container from '../components/Container';
import { Card, CardBody } from '../components/Card';

const BookmarksScreen = ({ navigation }) => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const fetchBookmarks = async () => {
        try {
            setLoading(true);
            const data = await userAPI.getBookmarks();
            setBookmarks(data.data || []);
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
            Alert.alert('Error', 'Failed to load bookmarks');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (articleId) => {
        try {
            await articlesAPI.bookmarkArticle(articleId); // Toggles bookmark
            setBookmarks(prev => prev.filter(item => item.article_id !== articleId));
        } catch (error) {
            console.error('Error removing bookmark:', error);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('ArticleDetail', { slug: item.slug })}
            style={styles.cardContainer}
        >
            <Card>
                <CardBody style={styles.cardBody}>
                    {!!item.featured_image && (
                        <Image
                            source={{ uri: getImageUrl(item.featured_image) }}
                            style={styles.thumbnail}
                        />
                    )}
                    <View style={styles.textContainer}>
                        {!!item.category_name && (
                            <Text style={styles.category}>{item.category_name}</Text>
                        )}
                        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                        <View style={styles.meta}>
                            <Text style={styles.metaText}>{item.username}</Text>
                            <Text style={styles.dot}>•</Text>
                            <Text style={styles.metaText}>{formatRelativeTime(item.published_at)}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.removeBtn}
                        onPress={() => handleRemove(item.article_id)}
                    >
                        <Trash2 size={20} color={colors.status.error} />
                    </TouchableOpacity>
                </CardBody>
            </Card>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Container>
                    <Text style={styles.headerTitle}>Bookmarks</Text>
                    <Text style={styles.headerSubtitle}>{bookmarks.length} saved articles</Text>
                </Container>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.primary[600]} />
                </View>
            ) : bookmarks.length === 0 ? (
                <View style={styles.center}>
                    <Bookmark size={48} color={colors.text.tertiary} />
                    <Text style={styles.emptyText}>No bookmarks yet.</Text>
                    <TouchableOpacity
                        style={styles.browseBtn}
                        onPress={() => navigation.navigate('Articles')}
                    >
                        <Text style={styles.browseText}>Browse Articles</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={bookmarks}
                    keyExtractor={item => item.article_id.toString()}
                    renderItem={renderItem}
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
        backgroundColor: colors.background.primary,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.primary,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.text.primary,
    },
    headerSubtitle: {
        fontSize: 14,
        color: colors.text.tertiary,
        marginTop: 4,
    },
    listContent: {
        padding: 16,
    },
    cardContainer: {
        marginBottom: 16,
    },
    cardBody: {
        flexDirection: 'row',
        padding: 12,
    },
    thumbnail: {
        width: 80,
        height: 80,
        borderRadius: 12,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    category: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.primary[600],
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: 6,
        lineHeight: 22,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 12,
        color: colors.text.tertiary,
    },
    dot: {
        marginHorizontal: 4,
        color: colors.text.tertiary,
    },
    removeBtn: {
        padding: 8,
        justifyContent: 'center',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    emptyText: {
        marginTop: 12,
        fontSize: 16,
        color: colors.text.tertiary,
        marginBottom: 20,
    },
    browseBtn: {
        backgroundColor: colors.primary[600],
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    browseText: {
        color: '#fff',
        fontWeight: '700',
    }
});

export default BookmarksScreen;
