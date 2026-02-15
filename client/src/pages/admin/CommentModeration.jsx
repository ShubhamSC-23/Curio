import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  MessageSquare,
  CheckCircle,
  XCircle,
  Trash2,
  AlertTriangle,
  Eye,
  Flag,
} from "lucide-react";
import axios from "axios";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import { formatRelativeTime } from "../../utils/formatDate";
import { getImageUrl } from "../../utils/imageUtils";
import toast from "react-hot-toast";

const CommentModeration = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reportedComments, setReportedComments] = useState([]);

  useEffect(() => {
    fetchComments();
    fetchReportedComments();
  }, [statusFilter]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      const params = {};
      if (statusFilter !== "all" && statusFilter !== "reported") {
        params.status = statusFilter;
      }

      const response = await axios.get(`${API_URL}/admin/comments`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setComments(response.data.data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch reported comments with report details
  const fetchReportedComments = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/admin/reports/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReportedComments(response.data.data || []);
    } catch (error) {
      console.error("Error fetching reported comments:", error);
    }
  };

  const handleApprove = async (commentId) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/admin/comments/${commentId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Comment approved");
      fetchComments();
      fetchReportedComments();
    } catch (error) {
      console.error("Error approving comment:", error);
      toast.error("Failed to approve comment");
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/admin/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Comment deleted");
      fetchComments();
      fetchReportedComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  // ✅ Dismiss all reports for a comment
  const handleDismissReports = async (commentId) => {
    if (!window.confirm("Dismiss all reports for this comment?")) return;

    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/admin/reports/comments/all/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Reports dismissed");
      fetchComments();
      fetchReportedComments();
    } catch (error) {
      console.error("Error dismissing reports:", error);
      toast.error("Failed to dismiss reports");
    }
  };

  // ✅ Show reported comments when filter is "reported"
  const displayComments =
    statusFilter === "reported" ? reportedComments : comments;

  const filteredComments = displayComments.filter((comment) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      comment.content?.toLowerCase().includes(searchLower) ||
      comment.user_name?.toLowerCase().includes(searchLower)
    );
  });

  // ✅ FIXED: Count from reportedComments array, not comments array!
  const reportedCount = reportedComments.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Comment Moderation
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Review and moderate user comments
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardBody className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search comments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All Comments</option>
                  <option value="reported">
                    🚩 Reported ({reportedCount})
                  </option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                </select>
              </div>
            </CardBody>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardBody className="p-4 text-center">
                <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {comments.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total
                </p>
              </CardBody>
            </Card>

            {/* ✅ FIXED: Use reportedComments.length, not filtering! */}
            <Card className="border-2 border-red-200 dark:border-red-900">
              <CardBody className="p-4 text-center">
                <Flag className="h-6 w-6 text-red-600 dark:text-red-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {reportedCount}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Reported
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4 text-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {comments.filter((c) => c.is_approved).length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Approved
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4 text-center">
                <XCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {comments.filter((c) => !c.is_approved).length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pending
                </p>
              </CardBody>
            </Card>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {filteredComments.length === 0 ? (
              <Card>
                <CardBody className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {statusFilter === "reported"
                      ? "No reported comments"
                      : "No comments found"}
                  </p>
                </CardBody>
              </Card>
            ) : (
              filteredComments.map((comment) => (
                <Card
                  key={comment.comment_id}
                  hover
                  className={
                    comment.report_count > 0
                      ? "border-2 border-red-200 dark:border-red-900"
                      : ""
                  }
                >
                  <CardBody className="p-6">
                    <div className="flex gap-4">
                      {/* User Avatar */}
                      {comment.user_profile_image ? (
                        <img
                          src={getImageUrl(comment.user_profile_image)}
                          alt={comment.user_name}
                          className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </div>
                      )}

                      {/* Comment Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {comment.user_name}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                              {formatRelativeTime(comment.created_at)}
                            </span>

                            {/* ✅ Report count badge */}
                            {comment.report_count > 0 && (
                              <span className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded text-xs font-medium">
                                <Flag className="h-3 w-3" />
                                {comment.report_count}{" "}
                                {comment.report_count === 1
                                  ? "report"
                                  : "reports"}
                              </span>
                            )}
                          </div>

                          {/* Status Badge */}
                          <span
                            className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                              comment.is_approved
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            }`}
                          >
                            {comment.is_approved ? "Approved" : "Pending"}
                          </span>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          {comment.content}
                        </p>

                        {/* ✅ Show report details if viewing reported comments */}
                        {statusFilter === "reported" &&
                          comment.reports &&
                          comment.reports.length > 0 && (
                            <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-3">
                              <p className="text-sm font-semibold text-red-900 dark:text-red-300 mb-2">
                                <AlertTriangle className="h-4 w-4 inline mr-1" />
                                Reports:
                              </p>
                              {comment.reports
                                .slice(0, 3)
                                .map((report, idx) => (
                                  <div
                                    key={report.report_id}
                                    className="text-sm text-red-800 dark:text-red-400 ml-5 mb-1"
                                  >
                                    • {report.reason}
                                    <span className="text-gray-600 dark:text-gray-500 text-xs ml-2">
                                      (by {report.reporter_username})
                                    </span>
                                  </div>
                                ))}
                              {comment.reports.length > 3 && (
                                <p className="text-xs text-red-600 dark:text-red-500 ml-5 mt-1">
                                  +{comment.reports.length - 3} more reports
                                </p>
                              )}
                            </div>
                          )}

                        {/* Article Link */}
                        {comment.article_slug && (
                          <Link
                            to={`/articles/${comment.article_slug}`}
                            className="text-sm text-primary-600 dark:text-primary-400 hover:underline mb-3 inline-block"
                          >
                            on "{comment.article_title}"
                          </Link>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 flex-wrap">
                          {comment.article_slug && (
                            <Link to={`/articles/${comment.article_slug}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View Article
                              </Button>
                            </Link>
                          )}

                          {!comment.is_approved && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApprove(comment.comment_id)}
                              className="text-green-600 hover:text-green-700 dark:text-green-400"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          )}

                          {/* ✅ Dismiss Reports button */}
                          {statusFilter === "reported" &&
                            comment.reports &&
                            comment.reports.length > 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDismissReports(comment.comment_id)
                                }
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                              >
                                Dismiss Reports
                              </Button>
                            )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(comment.comment_id)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default CommentModeration;
