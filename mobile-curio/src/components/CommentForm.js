import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import { Send } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useAuthStore } from '../store/authStore';
import { commentsAPI } from '../api/comments';
import Button from './Button';

const CommentForm = ({ articleId, parentId = null, onSuccess, onCancel }) => {
    const { isAuthenticated, isLoading: authLoading } = useAuthStore();
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            await commentsAPI.createComment({
                article_id: articleId,
                parent_comment_id: parentId,
                content: content.trim(),
            });

            setContent('');
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error posting comment:', error);
            Alert.alert('Error', 'Failed to post comment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <View style={styles.authPrompt}>
                <Text style={styles.authText}>Please login to participate in the discussion</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.input, parentId && styles.replyInput]}
                placeholder={parentId ? "Write a reply..." : "Share your thoughts..."}
                placeholderTextColor={colors.text.tertiary}
                multiline
                value={content}
                onChangeText={setContent}
                maxLength={500}
            />
            <View style={styles.footer}>
                {onCancel && (
                    <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={[styles.submitBtn, !content.trim() && styles.submitBtnDisabled]}
                    onPress={handleSubmit}
                    disabled={isSubmitting || !content.trim()}
                >
                    {isSubmitting ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <>
                            <Text style={styles.submitText}>{parentId ? 'Reply' : 'Post'}</Text>
                            <Send size={16} color="#fff" style={styles.icon} />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background.primary,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border.primary,
        padding: 12,
        marginBottom: 16,
    },
    input: {
        color: colors.text.primary,
        fontSize: 15,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    replyInput: {
        minHeight: 60,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 8,
        borderTopWidth: 1,
        borderTopColor: colors.border.tertiary,
        paddingTop: 8,
    },
    submitBtn: {
        backgroundColor: colors.primary[600],
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    submitBtnDisabled: {
        backgroundColor: colors.text.tertiary,
    },
    submitText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    cancelBtn: {
        marginRight: 16,
    },
    cancelText: {
        color: colors.text.secondary,
        fontSize: 14,
        fontWeight: '600',
    },
    icon: {
        marginLeft: 6,
    },
    authPrompt: {
        padding: 20,
        backgroundColor: colors.background.secondary,
        borderRadius: 12,
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: colors.border.primary,
    },
    authText: {
        color: colors.text.secondary,
        fontSize: 14,
        textAlign: 'center',
    }
});

export default CommentForm;
