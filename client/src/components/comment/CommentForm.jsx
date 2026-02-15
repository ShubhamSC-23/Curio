import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { commentsAPI } from "../../api/comments";
import Button from "../common/Button";
import { Send } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const CommentForm = ({ articleId, parentId = null, onSuccess, onCancel }) => {
  const { isAuthenticated } = useAuthStore();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await commentsAPI.createComment({
        article_id: articleId,
        parent_comment_id: parentId,
        content: content.trim(),
      });

      toast.success("Comment posted!");
      setContent("");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600 mb-4">Please login to comment</p>
        <Link to="/login">
          <Button variant="primary">Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentId ? "Write a reply..." : "Write a comment..."}
        rows={parentId ? 3 : 4}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        required
      />
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={!content.trim()}
        >
          <Send className="h-4 w-4 mr-2" />
          {parentId ? "Reply" : "Post Comment"}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
