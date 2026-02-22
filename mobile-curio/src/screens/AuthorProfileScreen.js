import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Calendar, BookOpen, Users, UserPlus, UserMinus } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { userAPI } from '../api/user';
import { articlesAPI } from '../api/articles';
import { getImageUrl } from '../utils/imageUtils';
import { formatDate, formatRelativeTime } from '../utils/formatDate';
import Container from '../components/Container';
import { Card, CardBody } from '../components/Card';
import Button from '../components/Button';

const AuthorProfileScreen = ({ route, navigation }) => {
    const { username } = route.params;
    const [profile, setProfile] = useState(null);
    const [articles, setArticles] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [username]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const profileData = await userAPI.getProfile(username);
            const user = profileData.data;
            setProfile(user);

            if (user.user_id) {
                const [statsData, articlesData] = await Promise.all([
                    userAPI.getStats(user.user_id),
                    articlesAPI.getArticles({ author: username, status: 'published' })
                ]);
                setStats(statsData.data);
                setArticles(articlesData.data || []);
            }
        } catch (error) {
            console.error('Error fetching author profile:', error);
            Alert.alert('Error', 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const renderArticle = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('ArticleDetail', { slug: item.slug })}
            style={styles.articleItem}
        >
            <Card>
                {item.featured_image && (
                    <Image
                        source={{ uri: getImageUrl(item.featured_image) }}
                        style={styles.articleImage}
                    />
                )}
                <CardBody>
                    <Text style={styles.articleTitle} numberOfLines={2}>{item.title}</Text>
                    <View style={styles.articleMeta}>
                        <Text style={styles.articleDate}>{formatDate(item.published_at)}</Text>
                        <Text style={styles.dot}>•</Text>
                        <Text style={styles.articleDate}>{item.reading_time} min read</Text>
                    </View>
                </CardBody>
            </Card>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.primary[600]} />
            </View>
        );
    }

    if (!profile) return null;

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                ListHeaderComponent={
                    <>
                        <View style={styles.header}>
                            <View style={styles.avatarContainer}>
                                {profile.profile_image ? (
                                    <Image source={{ uri: getImageUrl(profile.profile_image) }} style={styles.avatar} />
                                ) : (
                                    <View style={[styles.avatar, styles.placeholderAvatar]}>
                                        <User size={40} color={colors.primary[600]} />
                                    </View>
                                )}
                            </View>
                            <Text style={styles.name}>{profile.full_name || profile.username}</Text>
                            <Text style={styles.handle}>@{profile.username}</Text>

                            {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

                            <View style={styles.statsContainer}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{articles.length}</Text>
                                    <Text style={styles.statLabel}>Articles</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{stats?.followers || 0}</Text>
                                    <Text style={styles.statLabel}>Followers</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{formatDate(profile.created_at, 'yyyy')}</Text>
                                    <Text style={styles.statLabel}>Joined</Text>
                                </View>
                            </View>
                        </View>

                        <Container>
                            <Text style={styles.sectionTitle}>Published Articles</Text>
                        </Container>
                    </>
                }
                data={articles}
                keyExtractor={item => item.article_id.toString()}
                renderItem={renderArticle}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <BookOpen size={40} color={colors.text.tertiary} />
                        <Text style={styles.emptyText}>No articles published yet.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.secondary,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        backgroundColor: colors.background.primary,
        alignItems: 'center',
        paddingVertical: 32,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.primary,
    },
    avatarContainer: {
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    placeholderAvatar: {
        backgroundColor: colors.primary[50],
        alignItems: 'center',
        justifyContent: 'center',
    },
    name: {
        fontSize: 22,
        fontWeight: '800',
        color: colors.text.primary,
        marginBottom: 4,
    },
    handle: {
        fontSize: 15,
        color: colors.text.tertiary,
        marginBottom: 16,
    },
    bio: {
        fontSize: 15,
        color: colors.text.secondary,
        textAlign: 'center',
        paddingHorizontal: 40,
        marginBottom: 24,
        lineHeight: 22,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: colors.background.secondary,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderWidth: 1,
        borderColor: colors.border.primary,
    },
    statItem: {
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text.primary,
    },
    statLabel: {
        fontSize: 12,
        color: colors.text.tertiary,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: '100%',
        backgroundColor: colors.border.primary,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.text.primary,
        marginTop: 24,
        marginBottom: 16,
    },
    listContent: {
        paddingBottom: 24,
    },
    articleItem: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    articleImage: {
        width: '100%',
        height: 180,
    },
    articleTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: 8,
    },
    articleMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    articleDate: {
        fontSize: 12,
        color: colors.text.tertiary,
    },
    dot: {
        marginHorizontal: 6,
        color: colors.text.tertiary,
    },
    empty: {
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        marginTop: 12,
        color: colors.text.tertiary,
        fontSize: 15,
    }
});

export default AuthorProfileScreen;
