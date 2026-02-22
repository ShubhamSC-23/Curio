import React, { useEffect, useState, useMemo } from 'react';
import {
    View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
    ActivityIndicator, FlatList, RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, BookOpen, ArrowLeft, Globe, Clock } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import { userAPI } from '../api/user';
import { articlesAPI } from '../api/articles';
import { getImageUrl } from '../utils/imageUtils';
import { formatDate } from '../utils/formatDate';

const AuthorProfileScreen = ({ route, navigation }) => {
    const { username } = route.params;
    const colors = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const [profile, setProfile] = useState(null);
    const [articles, setArticles] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => { fetchData(); }, [username]);

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
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => { setRefreshing(true); await fetchData(); setRefreshing(false); };

    const renderArticle = ({ item }) => (
        <TouchableOpacity
            style={styles.articleCard}
            onPress={() => navigation.navigate('ArticleDetail', { slug: item.slug })}
            activeOpacity={0.85}
        >
            {!!item.featured_image && (
                <Image source={{ uri: getImageUrl(item.featured_image) }} style={styles.articleImage} resizeMode="cover" />
            )}
            <View style={styles.articleInfo}>
                {!!item.category_name && <Text style={styles.articleCategory}>{item.category_name}</Text>}
                <Text style={styles.articleTitle} numberOfLines={2}>{item.title}</Text>
                <View style={styles.articleMeta}>
                    <Text style={styles.metaText}>{formatDate(item.published_at)}</Text>
                    {!!item.reading_time && (
                        <>
                            <Text style={styles.dot}>·</Text>
                            <Clock size={11} color={colors.text.tertiary} />
                            <Text style={styles.metaText}>{item.reading_time}m read</Text>
                        </>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary[600]} />
            </View>
        );
    }

    if (!profile) return null;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <FlatList
                data={articles}
                keyExtractor={item => item.article_id.toString()}
                renderItem={renderArticle}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary[600]} />}
                ListHeaderComponent={
                    <>
                        {/* Back Button */}
                        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                            <ArrowLeft size={20} color={colors.text.primary} />
                            <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>

                        {/* Profile Banner */}
                        <View style={styles.profileBanner}>
                            <View style={styles.avatarWrapper}>
                                {profile.profile_image ? (
                                    <Image source={{ uri: getImageUrl(profile.profile_image) }} style={styles.avatar} />
                                ) : (
                                    <View style={styles.avatarPlaceholder}>
                                        <User size={44} color={colors.primary[400]} />
                                    </View>
                                )}
                            </View>

                            <Text style={styles.name}>{profile.full_name || profile.username}</Text>
                            <Text style={styles.handle}>@{profile.username}</Text>

                            {!!profile.bio && (
                                <Text style={styles.bio} numberOfLines={3}>{profile.bio}</Text>
                            )}

                            {/* Stats Chips */}
                            <View style={styles.statsRow}>
                                <View style={styles.statChip}>
                                    <Text style={styles.statVal}>{articles.length}</Text>
                                    <Text style={styles.statKey}>Articles</Text>
                                </View>
                                <View style={styles.statChipDivider} />
                                <View style={styles.statChip}>
                                    <Text style={styles.statVal}>{stats?.followers || 0}</Text>
                                    <Text style={styles.statKey}>Followers</Text>
                                </View>
                                <View style={styles.statChipDivider} />
                                <View style={styles.statChip}>
                                    <Text style={styles.statVal}>{stats?.total_views || '—'}</Text>
                                    <Text style={styles.statKey}>Views</Text>
                                </View>
                            </View>

                            {!!profile.location && (
                                <View style={styles.locationRow}>
                                    <Globe size={13} color={colors.text.tertiary} />
                                    <Text style={styles.locationText}>{profile.location}</Text>
                                </View>
                            )}
                        </View>

                        {/* Section header */}
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Published Articles</Text>
                            <View style={styles.countBadge}>
                                <Text style={styles.countText}>{articles.length}</Text>
                            </View>
                        </View>
                    </>
                }
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <BookOpen size={48} color={colors.border.secondary} />
                        <Text style={styles.emptyTitle}>No articles yet</Text>
                        <Text style={styles.emptyText}>This author hasn't published anything</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const makeStyles = (colors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background.secondary },
    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background.secondary },
    backBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingHorizontal: 16, paddingVertical: 12,
        backgroundColor: colors.background.primary,
    },
    backText: { fontSize: 15, fontWeight: '600', color: colors.text.primary },
    profileBanner: {
        backgroundColor: colors.background.primary,
        alignItems: 'center',
        paddingVertical: 28, paddingHorizontal: 24,
        borderBottomWidth: 1, borderBottomColor: colors.border.primary,
    },
    avatarWrapper: {
        width: 100, height: 100, borderRadius: 50,
        overflow: 'hidden', marginBottom: 14,
        borderWidth: 3, borderColor: colors.primary[100],
    },
    avatar: { width: '100%', height: '100%' },
    avatarPlaceholder: {
        flex: 1, backgroundColor: colors.primary[50],
        alignItems: 'center', justifyContent: 'center',
    },
    name: { fontSize: 22, fontWeight: '800', color: colors.text.primary, marginBottom: 4 },
    handle: { fontSize: 14, color: colors.text.tertiary, marginBottom: 12 },
    bio: {
        fontSize: 14, color: colors.text.secondary, textAlign: 'center',
        lineHeight: 22, marginBottom: 20, paddingHorizontal: 16,
    },
    statsRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: colors.background.secondary,
        borderRadius: 16, borderWidth: 1, borderColor: colors.border.primary,
        paddingVertical: 14, paddingHorizontal: 8,
        marginBottom: 12,
    },
    statChip: { flex: 1, alignItems: 'center' },
    statChipDivider: { width: 1, height: 36, backgroundColor: colors.border.primary },
    statVal: { fontSize: 18, fontWeight: '800', color: colors.text.primary },
    statKey: { fontSize: 11, color: colors.text.tertiary, marginTop: 3 },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    locationText: { fontSize: 13, color: colors.text.tertiary },
    sectionHeader: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingHorizontal: 16, paddingVertical: 16,
    },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.text.primary },
    countBadge: {
        backgroundColor: colors.primary[50], paddingHorizontal: 10, paddingVertical: 3,
        borderRadius: 20, borderWidth: 1, borderColor: colors.primary[100],
    },
    countText: { fontSize: 12, fontWeight: '700', color: colors.primary[600] },
    list: { paddingBottom: 24 },
    articleCard: {
        flexDirection: 'row', marginHorizontal: 16, marginBottom: 12,
        backgroundColor: colors.background.primary, borderRadius: 14,
        borderWidth: 1, borderColor: colors.border.primary, overflow: 'hidden',
    },
    articleImage: { width: 90, height: 90 },
    articleInfo: { flex: 1, padding: 12 },
    articleCategory: {
        fontSize: 10, fontWeight: '700', color: colors.primary[500],
        textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4,
    },
    articleTitle: { fontSize: 14, fontWeight: '700', color: colors.text.primary, lineHeight: 20, marginBottom: 6 },
    articleMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: 12, color: colors.text.tertiary },
    dot: { color: colors.text.tertiary },
    empty: { alignItems: 'center', paddingTop: 40, gap: 8 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.text.primary, marginTop: 12 },
    emptyText: { fontSize: 14, color: colors.text.tertiary },
});

export default AuthorProfileScreen;
