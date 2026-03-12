import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // ← Added
import { motion } from "framer-motion";
import {
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  Heart,
  MessageCircle,
  BarChart3,
  FileText,
  Clock,
  CheckCircle,
  Languages,
  Globe,
} from "lucide-react";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import TranslationStatsWidget from "../../components/dashboard/TranslationStatsWidget";
import { formatDate, formatRelativeTime } from "../../utils/formatDate";
import { getImageUrl } from "../../utils/imageUtils";
import toast from "react-hot-toast";

const AuthorDashboard = () => {
  const { t } = useTranslation(); // ← Added
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, published, draft

  useEffect(() => {
    fetchDashboardData();
  }, [filter]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const API_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";
      const token = localStorage.getItem("token");

      // Fetch dashboard statistics
      const dashboardRes = await axios.get(`${API_URL}/author/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats(dashboardRes.data.data.statistics);

      // Fetch author's articles
      const articlesRes = await axios.get(`${API_URL}/author/articles`, {
        params: {
          status: filter === "all" ? undefined : filter,
          limit: 50,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      setArticles(articlesRes.data.data || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error(t("dashboard.error.loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug, title) => {
    if (!window.confirm(t("dashboard.deleteConfirm", { title }))) {
      return;
    }

    try {
      const API_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/articles/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(t("dashboard.deleteSuccess"));
      fetchDashboardData();
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error(t("dashboard.error.deleteFailed"));
    }
  };

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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {t("dashboard.title")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {t("dashboard.subtitle")}
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/dashboard/translations">
                <Button variant="outline">
                  <Globe className="h-4 w-4 mr-2" />
                  {t("dashboard.buttons.translations")}
                </Button>
              </Link>
              <Link to="/dashboard/articles/create">
                <Button variant="primary">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {t("dashboard.buttons.newArticle")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards - 4 columns */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardBody className="text-center py-6">
                  <FileText className="h-8 w-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stats.total || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t("dashboard.stats.totalArticles")}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {stats.published || 0} {t("dashboard.stats.published")} •{" "}
                    {stats.draft || 0} {t("dashboard.stats.drafts")}
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="text-center py-6">
                  <Eye className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stats.totalViews || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t("dashboard.stats.totalViews")}
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="text-center py-6">
                  <Heart className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stats.totalLikes || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t("dashboard.stats.totalLikes")}
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="text-center py-6">
                  <MessageCircle className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stats.totalComments || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t("dashboard.stats.totalComments")}
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {/* Translation Widget - Horizontal below stats */}
          <div className="mb-8">
            <TranslationStatsWidget horizontal={true} />
          </div>

          {/* Filters */}
          <div className="mb-6 flex gap-2">
            <Button
              variant={filter === "all" ? "primary" : "outline"}
              onClick={() => setFilter("all")}
              size="sm"
            >
              {t("dashboard.filters.all")}
            </Button>
            <Button
              variant={filter === "published" ? "primary" : "outline"}
              onClick={() => setFilter("published")}
              size="sm"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              {t("dashboard.filters.published")}
            </Button>
            <Button
              variant={filter === "draft" ? "primary" : "outline"}
              onClick={() => setFilter("draft")}
              size="sm"
            >
              <Clock className="h-4 w-4 mr-1" />
              {t("dashboard.filters.drafts")}
            </Button>
          </div>

          {/* Articles List */}
          {articles.length === 0 ? (
            <Card>
              <CardBody className="text-center py-20">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {t("dashboard.empty.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {filter === "draft"
                    ? t("dashboard.empty.noDrafts")
                    : t("dashboard.empty.noArticles")}
                </p>
                <Link to="/dashboard/articles/create">
                  <Button variant="primary">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    {t("dashboard.buttons.createArticle")}
                  </Button>
                </Link>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <Card key={article.article_id} hover>
                  <CardBody className="p-6">
                    <div className="flex gap-6">
                      {/* Featured Image */}
                      {article.featured_image && (
                        <Link
                          to={`/articles/${article.slug}`}
                          className="flex-shrink-0"
                        >
                          <img
                            src={getImageUrl(article.featured_image)}
                            alt={article.title}
                            className="w-32 h-24 object-cover rounded-lg"
                          />
                        </Link>
                      )}

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <Link to={`/articles/${article.slug}`}>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition">
                                {article.title}
                              </h3>
                            </Link>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                              {article.excerpt}
                            </p>
                          </div>

                          {/* Status Badge */}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                              article.status === "published"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : article.status === "draft"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                            }`}
                          >
                            {t(`dashboard.status.${article.status}`)}
                          </span>
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <span className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {article.view_count || 0}{" "}
                            {t("dashboard.meta.views")}
                          </span>
                          <span className="flex items-center">
                            <Heart className="h-4 w-4 mr-1" />
                            {article.like_count || 0}{" "}
                            {t("dashboard.meta.likes")}
                          </span>
                          <span className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {article.comment_count || 0}{" "}
                            {t("dashboard.meta.comments")}
                          </span>
                          <span>•</span>
                          <span>
                            {article.status === "published" &&
                            article.published_at
                              ? `${t("dashboard.meta.published")} ${formatRelativeTime(article.published_at)}`
                              : `${t("dashboard.meta.updated")} ${formatRelativeTime(article.updated_at)}`}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                          <Link to={`/articles/${article.slug}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              {t("dashboard.actions.view")}
                            </Button>
                          </Link>
                          <Link to={`/dashboard/articles/edit/${article.slug}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              {t("dashboard.actions.edit")}
                            </Button>
                          </Link>
                          <Link
                            to={`/dashboard/translations?article=${article.article_id}`}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                            >
                              <Languages className="h-4 w-4 mr-1" />
                              {t("dashboard.actions.translate")}
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDelete(article.slug, article.title)
                            }
                            className="text-red-600 hover:text-red-700 hover:border-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            {t("dashboard.actions.delete")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </Container>
    </div>
  );
};

export default AuthorDashboard;
