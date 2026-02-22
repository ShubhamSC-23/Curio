import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    FlatList
} from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { commentsAPI } from '../api/comments';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

const CommentList = ({ articleId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetchComments();
    }, [articleId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const data = await commentsAPI.getComments(articleId);
            const allComments = data.data || [];
            setTotalCount(allComments.length);

            // Organize comments into tree structure
            const commentMap = {};
            const rootComments = [];

            allComments.forEach((comment) => {
                commentMap[comment.comment_id] = { ...comment, replies: [] };
            });

            allComments.forEach((comment) => {
                if (comment.parent_comment_id) {
                    if (commentMap[comment.parent_comment_id]) {
                        commentMap[comment.parent_comment_id].replies.push(
                            commentMap[comment.comment_id]
                        );
                    }
                } else {
                    rootComments.push(commentMap[comment.comment_id]);
                }
            });

            setComments(rootComments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCommentDeleted = (commentId) => {
        // Basic flat filter if we don't want to re-fetch the entire tree
        // In many cases, re-fetching is safer for complex trees
        fetchComments();
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="small" color={colors.primary[600]} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <MessageCircle size={20} color={colors.text.primary} />
                <Text style={styles.title}>Comments ({totalCount})</Text>
            </View>

            <CommentForm articleId={articleId} onSuccess={fetchComments} />

            {comments.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No comments yet. Be the first to join the conversation!</Text>
                </View>
            ) : (
                <View style={styles.list}>
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.comment_id}
                            comment={comment}
                            onUpdate={fetchComments}
                            onDelete={handleCommentDeleted}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.text.primary,
        marginLeft: 10,
    },
    loader: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyContainer: {
        paddingVertical: 32,
        alignItems: 'center',
        backgroundColor: colors.background.tertiary,
        borderRadius: 12,
        marginTop: 12,
    },
    emptyText: {
        color: colors.text.tertiary,
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 32,
    },
    list: {
        marginTop: 8,
    }
});

export default CommentList;
