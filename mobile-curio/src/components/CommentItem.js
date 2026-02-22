import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import { Heart, MessageCircle, Flag, Trash2, Edit } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useAuthStore } from '../store/authStore';
import { commentsAPI } from '../api/comments';
import { formatRelativeTime } from '../utils/formatDate';
import CommentForm from './CommentForm';

const CommentItem = ({ comment, onUpdate, onDelete, level = 0 }) => {
    const { user, isAuthenticated } = useAuthStore();
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(comment.like_count || 0);

    const isAuthor = user?.user_id === comment.user_id;
    const canReply = level < 2; // Limit nesting depth for mobile screens (max 2 levels)

    const handleLike = async () => {
        if (!isAuthenticated) {
            Alert.alert('Login Required', 'Please login to like comments');
            return;
        }

        try {
            await commentsAPI.likeComment(comment.comment_id);
            setLiked(!liked);
            setLikeCount(liked ? likeCount - 1 : likeCount + 1);
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    const handleReport = () => {
        if (!isAuthenticated) {
            Alert.alert('Login Required', 'Please login to report comments');
            return;
        }

        Alert.prompt(
            'Report Comment',
            'Please provide a reason for reporting this comment:',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Report',
                    onPress: async (reason) => {
                        if (!reason) return;
                        try {
                            await commentsAPI.reportComment(comment.comment_id, reason);
                            Alert.alert('Success', 'Comment reported. Thank you.');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to report comment.');
                        }
                    }
                }
            ]
        );
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Comment',
            'Are you sure you want to delete this comment?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await commentsAPI.deleteComment(comment.comment_id);
                            if (onDelete) onDelete(comment.comment_id);
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete comment.');
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={[styles.container, level > 0 && styles.nested]}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {comment.username?.charAt(0).toUpperCase()}
                    </Text>
                </View>
                <View style={styles.userInfo}>
                    <Text style={styles.username}>{comment.username}</Text>
                    <Text style={styles.date}>{formatRelativeTime(comment.created_at)}</Text>
                </View>
                {isAuthor && (
                    <TouchableOpacity onPress={handleDelete}>
                        <Trash2 size={16} color={colors.text.tertiary} />
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.content}>{comment.content}</Text>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
                    <Heart
                        size={16}
                        color={liked ? colors.status.error : colors.text.secondary}
                        fill={liked ? colors.status.error : 'none'}
                    />
                    <Text style={[styles.actionText, liked && { color: colors.status.error }]}>
                        {likeCount}
                    </Text>
                </TouchableOpacity>

                {canReply && (
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => setShowReplyForm(!showReplyForm)}
                    >
                        <MessageCircle size={16} color={colors.text.secondary} />
                        <Text style={styles.actionText}>Reply</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.actionBtn} onPress={handleReport}>
                    <Flag size={16} color={colors.text.secondary} />
                    <Text style={styles.actionText}>Report</Text>
                </TouchableOpacity>
            </View>

            {showReplyForm && (
                <View style={styles.replyFormWrapper}>
                    <CommentForm
                        articleId={comment.article_id}
                        parentId={comment.comment_id}
                        onSuccess={() => {
                            setShowReplyForm(false);
                            if (onUpdate) onUpdate();
                        }}
                        onCancel={() => setShowReplyForm(false)}
                    />
                </View>
            )}

            {comment.replies && comment.replies.length > 0 && (
                <View style={styles.repliesList}>
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.comment_id}
                            comment={reply}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                            level={level + 1}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.tertiary,
    },
    nested: {
        marginLeft: 16,
        borderBottomWidth: 0,
        borderLeftWidth: 2,
        borderLeftColor: colors.border.primary,
        paddingLeft: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.primary[100],
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    avatarText: {
        color: colors.primary[600],
        fontWeight: 'bold',
        fontSize: 14,
    },
    userInfo: {
        flex: 1,
    },
    username: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.text.primary,
    },
    date: {
        fontSize: 12,
        color: colors.text.tertiary,
    },
    content: {
        fontSize: 15,
        color: colors.text.secondary,
        lineHeight: 22,
        marginBottom: 10,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    actionText: {
        fontSize: 13,
        color: colors.text.secondary,
        marginLeft: 6,
        fontWeight: '500',
    },
    replyFormWrapper: {
        marginTop: 12,
    },
    repliesList: {
        marginTop: 8,
    }
});

export default CommentItem;
