import React, { useEffect, useState } from "react";
import { commentsAPI } from "../../api/comments";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import Spinner from "../common/Spinner";
import { MessageCircle } from "lucide-react";

const CommentList = ({ articleId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await commentsAPI.getComments(articleId);

      // Organize comments into tree structure
      const commentMap = {};
      const rootComments = [];

      // First pass: create map of all comments
      data.data.forEach((comment) => {
        commentMap[comment.comment_id] = { ...comment, replies: [] };
      });

      // Second pass: organize into tree
      data.data.forEach((comment) => {
        if (comment.parent_comment_id) {
          // This is a reply
          if (commentMap[comment.parent_comment_id]) {
            commentMap[comment.parent_comment_id].replies.push(
              commentMap[comment.comment_id],
            );
          }
        } else {
          // This is a root comment
          rootComments.push(commentMap[comment.comment_id]);
        }
      });

      setComments(rootComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentDeleted = (commentId) => {
    setComments((prevComments) =>
      prevComments.filter((c) => c.comment_id !== commentId),
    );
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <MessageCircle className="h-6 w-6 mr-2" />
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <div className="mb-8">
        <CommentForm articleId={articleId} onSuccess={fetchComments} />
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">
            No comments yet. Be the first to comment!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.comment_id}
              comment={comment}
              onUpdate={fetchComments}
              onDelete={handleCommentDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList;
