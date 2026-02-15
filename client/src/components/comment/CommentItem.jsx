import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Trash2, Edit, Flag } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { commentsAPI } from "../../api/comments";
import { formatRelativeTime } from "../../utils/formatDate";
import Button from "../common/Button";
import CommentForm from "./CommentForm";
import toast from "react-hot-toast";
import api from "../../api/axios";

const CommentItem = ({ comment, onUpdate, onDelete, level = 0 }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.like_count || 0);

  const isAuthor = user?.user_id === comment.user_id;
  const canReply = level < 3; // Max 3 levels of nesting

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to like comments");
      return;
    }

    try {
      await commentsAPI.likeComment(comment.comment_id);
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleEdit = async () => {
    try {
      await commentsAPI.updateComment(comment.comment_id, {
        content: editContent,
      });
      toast.success("Comment updated");
      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      await commentsAPI.deleteComment(comment.comment_id);
      toast.success("Comment deleted");
      if (onDelete) onDelete(comment.comment_id);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // ✅ NEW: Handle Report Comment
  const handleReport = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to report comments");
      return;
    }

    const reason = window.prompt(
      "Please provide a reason for reporting this comment:",
    );
    if (!reason || !reason.trim()) return;

    try {
      await api.post(`/comments/${comment.comment_id}/report`, {
        reason: reason.trim(),
      });
      toast.success(
        "Comment reported. Thank you for helping keep our community safe.",
      );
    } catch (error) {
      console.error("Error reporting comment:", error);
      toast.error(error.response?.data?.message || "Failed to report comment");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${level > 0 ? "ml-8 mt-4" : "mt-4"}`}
    >
      <div className="flex space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
            <span className="text-primary-600 dark:text-primary-400 font-semibold">
              {comment.username?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Comment Content */}
        <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="font-medium text-gray-900 dark:text-white">
                {comment.username}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                {formatRelativeTime(comment.created_at)}
              </span>
            </div>

            {isAuthor && !isEditing && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows="3"
              />
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleEdit}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {comment.content}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-4 mt-3">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 text-sm ${
                liked
                  ? "text-red-600 dark:text-red-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              }`}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
              <span>{likeCount}</span>
            </button>

            {canReply && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Reply</span>
              </button>
            )}

            {/* ✅ NEW: Report Button */}
            <button
              onClick={handleReport}
              className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            >
              <Flag className="h-4 w-4" />
              <span>Report</span>
            </button>
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-4">
              <CommentForm
                articleId={comment.article_id}
                parentId={comment.comment_id}
                onCommentAdded={() => {
                  setShowReplyForm(false);
                  if (onUpdate) onUpdate();
                }}
                onCancel={() => setShowReplyForm(false)}
              />
            </div>
          )}

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.comment_id}
                  comment={reply}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CommentItem;
