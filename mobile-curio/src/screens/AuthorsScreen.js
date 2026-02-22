import React, { useState, useEffect, useMemo } from 'react';
import {
    View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
    ActivityIndicator, RefreshControl, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search as SearchIcon, Users, UserPlus, FileText, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import { userAPI } from '../api/user';
import Container from '../components/Container';
import { getImageUrl } from '../utils/imageUtils';

const AuthorsScreen = ({ navigation }) => {
    const colors = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const [authors, setAuthors] = useState([]);
    const [filteredAuthors, setFilteredAuthors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeFilter, setActiveFilter] = useState('popular'); // popular, active, new

    useEffect(() => {
        fetchAuthors();
    }, [activeFilter]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredAuthors(authors);
        } else {
            const lowerQuery = searchQuery.toLowerCase();
            const filtered = authors.filter(a =>
                (a.username && a.username.toLowerCase().includes(lowerQuery)) ||
                (a.full_name && a.full_name.toLowerCase().includes(lowerQuery))
            );
            setFilteredAuthors(filtered);
        }
    }, [searchQuery, authors]);

    const fetchAuthors = async () => {
        try {
            setLoading(true);
            const data = await userAPI.getAuthors({ filter: activeFilter, limit: 100 });
            setAuthors(data.data || []);
            setFilteredAuthors(data.data || []);
        } catch (error) {
            console.error('Error fetching authors:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchAuthors();
        setRefreshing(false);
    };

    const renderAuthor = ({ item }) => (
        <TouchableOpacity
            style={styles.authorCard}
            onPress={() => navigation.navigate('AuthorProfile', { username: item.username })}
            activeOpacity={0.8}
        >
            <View style={styles.avatarContainer}>
                {item.profile_image ? (
                    <Image source={{ uri: getImageUrl(item.profile_image) }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarFallback}>
                        <Text style={styles.avatarInitial}>
                            {(item.full_name || item.username).charAt(0).toUpperCase()}
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{item.full_name || item.username}</Text>
                <Text style={styles.authorHandle}>@{item.username}</Text>

                <View style={styles.statsRow}>
                    <View style={styles.statBadge}>
                        <FileText size={12} color={colors.text.tertiary} style={{ marginRight: 4 }} />
                        <Text style={styles.statText}>{item.article_count || 0} Articles</Text>
                    </View>
                    <View style={styles.statBadge}>
                        <Users size={12} color={colors.text.tertiary} style={{ marginRight: 4 }} />
                        <Text style={styles.statText}>{item.follower_count || 0} Followers</Text>
                    </View>
                </View>
            </View>

            <View style={styles.chevron}>
                <ChevronRight size={20} color={colors.text.tertiary} />
            </View>
        </TouchableOpacity>
    );

    const filters = [
        { id: 'popular', label: 'Popular' },
        { id: 'active', label: 'Most Active' },
        { id: 'new', label: 'Newest' }
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Discover Authors</Text>
            </View>

            <View style={styles.searchSection}>
                <View style={styles.searchBar}>
                    <SearchIcon size={20} color={colors.text.tertiary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search writers by name..."
                        placeholderTextColor={colors.text.tertiary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Filter Chips */}
                <View style={styles.filterRow}>
                    {filters.map(filter => (
                        <TouchableOpacity
                            key={filter.id}
                            style={[styles.filterChip, activeFilter === filter.id && styles.filterChipActive]}
                            onPress={() => setActiveFilter(filter.id)}
                        >
                            <Text style={[styles.filterChipText, activeFilter === filter.id && styles.filterChipTextActive]}>
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.content}>
                {loading && !refreshing ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={colors.primary[600]} />
                    </View>
                ) : filteredAuthors.length === 0 ? (
                    <View style={styles.center}>
                        <Users size={48} color={colors.border.secondary} style={{ marginBottom: 16 }} />
                        <Text style={styles.emptyTitle}>No Authors Found</Text>
                        <Text style={styles.emptySubtitle}>Try adjusting your search criteria.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredAuthors}
                        keyExtractor={item => item.user_id.toString()}
                        renderItem={renderAuthor}
                        contentContainerStyle={styles.listPadding}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor={colors.primary[600]}
                                colors={[colors.primary[600]]}
                            />
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const makeStyles = (colors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background.secondary },
    header: {
        paddingHorizontal: 20, paddingVertical: 16, backgroundColor: colors.background.primary,
        borderBottomWidth: 1, borderBottomColor: colors.border.primary,
    },
    headerTitle: { fontSize: 22, fontWeight: '800', color: colors.text.primary, letterSpacing: 0.5 },
    searchSection: {
        paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors.background.primary,
        borderBottomWidth: 1, borderBottomColor: colors.border.primary,
    },
    searchBar: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background.tertiary,
        borderRadius: 12, paddingHorizontal: 14, height: 48, marginBottom: 16,
    },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: colors.text.primary },
    filterRow: { flexDirection: 'row', alignItems: 'center' },
    filterChip: {
        paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
        backgroundColor: colors.background.tertiary, marginRight: 8,
        borderWidth: 1, borderColor: colors.border.primary,
    },
    filterChipActive: { backgroundColor: colors.primary[600], borderColor: colors.primary[600] },
    filterChipText: { fontSize: 13, fontWeight: '600', color: colors.text.secondary },
    filterChipTextActive: { color: '#fff' },
    content: { flex: 1 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
    emptyTitle: { fontSize: 20, fontWeight: '700', color: colors.text.primary, marginBottom: 8, textAlign: 'center' },
    emptySubtitle: { fontSize: 15, color: colors.text.tertiary, textAlign: 'center' },
    listPadding: { padding: 16 },
    authorCard: {
        flexDirection: 'row', alignItems: 'center', padding: 16,
        backgroundColor: colors.background.primary, borderRadius: 16, marginBottom: 12,
        borderWidth: 1, borderColor: colors.border.primary,
    },
    avatarContainer: { marginRight: 16 },
    avatar: { width: 56, height: 56, borderRadius: 28 },
    avatarFallback: {
        width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary[100],
        alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.primary[200]
    },
    avatarInitial: { fontSize: 22, fontWeight: '800', color: colors.primary[600] },
    authorInfo: { flex: 1 },
    authorName: { fontSize: 17, fontWeight: '700', color: colors.text.primary, marginBottom: 2 },
    authorHandle: { fontSize: 13, color: colors.primary[600], fontWeight: '500', marginBottom: 8 },
    statsRow: { flexDirection: 'row', alignItems: 'center' },
    statBadge: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
    statText: { fontSize: 12, color: colors.text.tertiary, fontWeight: '500' },
    chevron: { marginLeft: 8 },
});

export default AuthorsScreen;
