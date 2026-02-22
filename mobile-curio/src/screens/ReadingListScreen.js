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
import { BookMarked, Clock, CheckCircle2, Trash2, Check } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { userAPI } from '../api/user';
import { articlesAPI } from '../api/articles';
import { getImageUrl } from '../utils/imageUtils';
import { formatRelativeTime } from '../utils/formatDate';
import Container from '../components/Container';
import { Card, CardBody } from '../components/Card';

const ReadingListScreen = ({ navigation }) => {
    const [readingList, setReadingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all | unread | read

    useEffect(() => {
        fetchReadingList();
    }, []);

    const fetchReadingList = async () => {
        try {
            setLoading(true);
            const data = await userAPI.getReadingList();
            setReadingList(data.data || []);
        } catch (error) {
            console.error('Error fetching reading list:', error);
            Alert.alert('Error', 'Failed to load reading list');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (articleId) => {
        try {
            await userAPI.markAsRead(articleId);
            setReadingList(prev =>
                prev.map(item =>
                    item.article_id === articleId ? { ...item, is_read: !item.is_read } : item
                )
            );
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleRemove = async (articleId) => {
        try {
            await articlesAPI.removeFromReadingList(articleId);
            setReadingList(prev => prev.filter(item => item.article_id !== articleId));
        } catch (error) {
            console.error('Error removing:', error);
        }
    };

    const filteredList = readingList.filter(item => {
        if (filter === 'unread') return !item.is_read;
        if (filter === 'read') return item.is_read;
        return true;
    });

    const renderItem = ({ item }) => (
        <Card style={[styles.card, item.is_read && styles.readCard]}>
            <CardBody style={styles.cardBody}>
                <TouchableOpacity
                    style={styles.contentRow}
                    onPress={() => navigation.navigate('ArticleDetail', { slug: item.slug })}
                >
                    <View style={[styles.statusCircle, item.is_read && styles.statusCircleRead]}>
                        {!!item.is_read && <Check size={12} color="#fff" />}
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={[styles.title, item.is_read && styles.readText]} numberOfLines={2}>
                            {item.title}
                        </Text>
                        <View style={styles.metaRow}>
                            <Text style={styles.metaText}>{item.username}</Text>
                            <Text style={styles.dot}>•</Text>
                            <Text style={styles.metaText}>{formatRelativeTime(item.added_at)}</Text>
                        </View>
                    </View>

                    {item.featured_image && (
                        <Image
                            source={{ uri: getImageUrl(item.featured_image) }}
                            style={styles.thumbnail}
                        />
                    )}
                </TouchableOpacity>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => handleMarkAsRead(item.article_id)}
                    >
                        <Text style={styles.actionText}>{item.is_read ? 'Mark Unread' : 'Mark Read'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.removeBtn]}
                        onPress={() => handleRemove(item.article_id)}
                    >
                        <Trash2 size={16} color={colors.status.error} />
                    </TouchableOpacity>
                </View>
            </CardBody>
        </Card>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Container>
                    <Text style={styles.headerTitle}>Reading List</Text>
                    <View style={styles.filterContainer}>
                        <TouchableOpacity
                            style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
                            onPress={() => setFilter('all')}
                        >
                            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.filterTab, filter === 'unread' && styles.filterTabActive]}
                            onPress={() => setFilter('unread')}
                        >
                            <Text style={[styles.filterText, filter === 'unread' && styles.filterTextActive]}>Unread</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.filterTab, filter === 'read' && styles.filterTabActive]}
                            onPress={() => setFilter('read')}
                        >
                            <Text style={[styles.filterText, filter === 'read' && styles.filterTextActive]}>Read</Text>
                        </TouchableOpacity>
                    </View>
                </Container>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.primary[600]} />
                </View>
            ) : filteredList.length === 0 ? (
                <View style={styles.center}>
                    <BookMarked size={48} color={colors.text.tertiary} />
                    <Text style={styles.emptyText}>Nothing here yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredList}
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
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.primary,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.text.primary,
        marginBottom: 16,
    },
    filterContainer: {
        flexDirection: 'row',
    },
    filterTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: colors.background.tertiary,
    },
    filterTabActive: {
        backgroundColor: colors.primary[600],
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text.secondary,
    },
    filterTextActive: {
        color: '#fff',
    },
    listContent: {
        padding: 16,
    },
    card: {
        marginBottom: 12,
    },
    readCard: {
        opacity: 0.7,
    },
    cardBody: {
        padding: 12,
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.border.tertiary,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusCircleRead: {
        backgroundColor: '#10b981',
        borderColor: '#10b981',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: 4,
    },
    readText: {
        textDecorationLine: 'line-through',
        color: colors.text.tertiary,
    },
    metaRow: {
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
    thumbnail: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginLeft: 12,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: colors.border.tertiary,
        marginTop: 12,
        paddingTop: 8,
        alignItems: 'center',
    },
    actionBtn: {
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    actionText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.primary[600],
    },
    removeBtn: {
        marginLeft: 8,
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
    }
});

export default ReadingListScreen;
