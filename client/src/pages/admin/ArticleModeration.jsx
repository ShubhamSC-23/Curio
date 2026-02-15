import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Clock,
  Filter,
  Flag,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import { formatDate, formatRelativeTime } from "../../utils/formatDate";
import { getImageUrl } from "../../utils/imageUtils";
import toast from "react-hot-toast";

const ArticleModeration = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reportedArticles, setReportedArticles] = useState([]);

  useEffect(() => {
    fetchArticles();
    fetchReportedArticles();
  }, [statusFilter]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      const params = {};
      if (statusFilter !== "all" && statusFilter !== "reported") {
        params.status = statusFilter;
      }

      const response = await axios.get(`${API_URL}/admin/articles`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setArticles(response.data.data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch reported articles
  const fetchReportedArticles = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/admin/reports/articles`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReportedArticles(response.data.data || []);
    } catch (error) {
      console.error("Error fetching reported articles:", error);
    }
  };

  const handleApprove = async (articleId, title) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/admin/articles/${articleId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(`"${title}" approved`);
      fetchArticles();
    } catch (error) {
      console.error("Error approving article:", error);
      toast.error("Failed to approve article");
    }
  };

  const handleReject = async (articleId, title) => {
    const reason = window.prompt("Rejection reason:");
    if (!reason) return;

    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/admin/articles/${articleId}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(`"${title}" rejected`);
      fetchArticles();
    } catch (error) {
      console.error("Error rejecting article:", error);
      toast.error("Failed to reject article");
    }
  };

  const handleDelete = async (articleId, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;

    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/admin/articles/${articleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(`"${title}" deleted`);
      fetchArticles();
      fetchReportedArticles();
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article");
    }
  };

  // ✅ FIXED: Dismiss ALL reports for an article
  const handleDismissAllReports = async (articleId) => {
    if (!window.confirm("Dismiss all reports for this article?")) return;

    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/admin/reports/articles/all/${articleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("All reports dismissed");
      fetchReportedArticles();
    } catch (error) {
      console.error("Error dismissing reports:", error);
      toast.error("Failed to dismiss reports");
    }
  };

  // ✅ Filter to show reported articles when "reported" filter is selected
  const displayArticles =
    statusFilter === "reported" ? reportedArticles : articles;

  const filteredArticles = displayArticles.filter((article) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      article.title?.toLowerCase().includes(searchLower) ||
      article.author_name?.toLowerCase().includes(searchLower)
    );
  });

  // ✅ Count reported articles
  const reportedCount = reportedArticles.length;

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
              Article Moderation
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Review and moderate submitted articles
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
                    placeholder="Search articles..."
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
                  <option value="all">All Status</option>
                  <option value="reported">
                    🚩 Reported ({reportedCount})
                  </option>
                  <option value="pending">Pending</option>
                  <option value="published">Published</option>
                  <option value="rejected">Rejected</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </CardBody>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardBody className="p-4 text-center">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {articles.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total
                </p>
              </CardBody>
            </Card>

            {/* ✅ Reported stat */}
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
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {articles.filter((a) => a.status === "pending").length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pending
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4 text-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {articles.filter((a) => a.status === "published").length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Published
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4 text-center">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {articles.filter((a) => a.status === "rejected").length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Rejected
                </p>
              </CardBody>
            </Card>
          </div>

          {/* Articles List */}
          <div className="space-y-4">
            {filteredArticles.length === 0 ? (
              <Card>
                <CardBody className="p-12 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {statusFilter === "reported"
                      ? "No reported articles"
                      : "No articles found"}
                  </p>
                </CardBody>
              </Card>
            ) : (
              filteredArticles.map((article) => (
                <Card
                  key={article.article_id}
                  hover
                  className={
                    article.report_count > 0
                      ? "border-2 border-red-200 dark:border-red-900"
                      : ""
                  }
                >
                  <CardBody className="p-6">
                    <div className="flex gap-6">
                      {/* Featured Image */}
                      {article.featured_image && (
                        <img
                          src={getImageUrl(article.featured_image)}
                          alt={article.title}
                          className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                        />
                      )}

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Link
                                to={`/articles/${article.slug}`}
                                className="text-xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition"
                              >
                                {article.title}
                              </Link>

                              {/* ✅ Report indicator */}
                              {article.report_count > 0 && (
                                <span className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded text-xs font-medium">
                                  <Flag className="h-3 w-3" />
                                  {article.report_count}{" "}
                                  {article.report_count === 1
                                    ? "report"
                                    : "reports"}
                                </span>
                              )}
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              by {article.author_name} •{" "}
                              {formatRelativeTime(article.created_at)}
                            </p>

                            {/* ✅ Show report details if viewing reported articles */}
                            {statusFilter === "reported" &&
                              article.reports &&
                              article.reports.length > 0 && (
                                <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                  <p className="text-sm font-semibold text-red-900 dark:text-red-300 mb-2">
                                    <AlertTriangle className="h-4 w-4 inline mr-1" />
                                    Reports:
                                  </p>
                                  {article.reports
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
                                  {article.reports.length > 3 && (
                                    <p className="text-xs text-red-600 dark:text-red-500 ml-5 mt-1">
                                      +{article.reports.length - 3} more reports
                                    </p>
                                  )}
                                </div>
                              )}
                          </div>

                          {/* Status Badge */}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                              article.status === "published"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : article.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  : article.status === "rejected"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                            }`}
                          >
                            {article.status.charAt(0).toUpperCase() +
                              article.status.slice(1)}
                          </span>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>

                        {/* Meta & Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {article.view_count || 0}
                            </span>
                            <span>•</span>
                            <span>{article.category_name}</span>
                          </div>

                          <div className="flex gap-2">
                            <Link to={`/articles/${article.slug}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </Link>

                            {article.status === "pending" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleApprove(
                                      article.article_id,
                                      article.title,
                                    )
                                  }
                                  className="text-green-600 hover:text-green-700 dark:text-green-400"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleReject(
                                      article.article_id,
                                      article.title,
                                    )
                                  }
                                  className="text-red-600 hover:text-red-700 dark:text-red-400"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}

                            {/* ✅ FIXED: Dismiss ALL reports button */}
                            {statusFilter === "reported" &&
                              article.reports &&
                              article.reports.length > 0 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDismissAllReports(article.article_id)
                                  }
                                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                >
                                  Dismiss All
                                </Button>
                              )}

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDelete(article.article_id, article.title)
                              }
                              className="text-red-600 hover:text-red-700 dark:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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

export default ArticleModeration;
