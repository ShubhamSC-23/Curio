import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  Clock,
  Eye,
  Heart,
  Sparkles,
  RefreshCw,
  Grid,
  List,
  BookOpen,
} from "lucide-react";
import axios from "axios";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import { GridSkeleton } from "../../components/common/LodingSkeletons";
import { formatRelativeTime } from "../../utils/formatDate";
import toast from "react-hot-toast";
import { getImageUrl } from "../../utils/imageUtils";

const FollowingFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const navigate = useNavigate();

  useEffect(() => {
    fetchFollowingFeed();
  }, []);

  const fetchFollowingFeed = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/articles/following-feed`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setArticles(response.data.data || []);
      if (isRefresh) toast.success("Feed refreshed!");
    } catch (error) {
      console.error("Error fetching following feed:", error);
      toast.error("Failed to load feed");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Hero skeleton */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 dark:from-primary-800 dark:via-primary-900 dark:to-secondary-900 py-20 md:py-28">
          <div className="absolute bottom-0 left-0 right-0">
            <svg className="w-full h-12 md:h-24 text-white dark:text-gray-900" viewBox="0 0 1440 120" fill="none">
              <path d="M0,64 C360,120 1080,0 1440,64 L1440,120 L0,120 Z" fill="currentColor" />
            </svg>
          </div>
        </div>
        <Container className="-mt-16 md:-mt-20 relative z-10 pb-12">
          <div className="mb-8 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-xl animate-pulse" />
          <GridSkeleton count={6} />
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* ── Hero Section ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 dark:from-primary-800 dark:via-primary-900 dark:to-secondary-900">
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 dark:to-black/30" />

        <Container className="relative py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full text-white mb-6 border border-white/20 dark:border-white/10"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Curated For You</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Your
              <span className="block text-primary-200 dark:text-primary-300 mt-2">
                Feed
              </span>
            </h1>

            <p className="text-xl text-primary-100 dark:text-primary-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              {articles.length > 0
                ? `${articles.length} fresh article${articles.length !== 1 ? "s" : ""} from authors you follow`
                : "Latest articles from authors you follow"}
            </p>

            {/* Hero actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-3"
            >
              <Button
                onClick={() => navigate("/discover-authors")}
                className="bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-lg"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Discover Authors
              </Button>
              <button
                onClick={() => fetchFollowingFeed(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 text-white border border-white/20 backdrop-blur-sm font-medium transition-all shadow-lg disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Refreshing…" : "Refresh"}
              </button>
            </motion.div>
          </motion.div>
        </Container>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-12 md:h-24 text-white dark:text-gray-900"
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,64 C360,120 1080,0 1440,64 L1440,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      <Container className="py-8 -mt-16 md:-mt-20 relative z-10">
        {/* ── Controls bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 shadow-xl dark:shadow-2xl">
            <CardBody className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Results count */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4 text-primary-500" />
                  {articles.length > 0 ? (
                    <span>
                      Showing{" "}
                      <span className="font-bold text-gray-900 dark:text-white">
                        {articles.length}
                      </span>{" "}
                      article{articles.length !== 1 ? "s" : ""} from followed authors
                    </span>
                  ) : (
                    <span>No articles yet — follow some authors!</span>
                  )}
                </div>

                {/* View toggle */}
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-900 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list"
                        ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* ── Empty State ── */}
        {articles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-50 dark:bg-primary-900/20 rounded-full mb-6 ring-8 ring-primary-50 dark:ring-primary-900/10">
              <BookOpen className="h-12 w-12 text-primary-400 dark:text-primary-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Your feed is empty
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
              Start following authors you enjoy to see their latest articles appear right here
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant="primary"
                onClick={() => navigate("/discover-authors")}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Discover Authors
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/articles")}
                className="border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Browse All Articles
              </Button>
            </div>
          </motion.div>
        ) : (
          /* ── Articles Grid / List ── */
          <AnimatePresence>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  : "space-y-6"
              }
            >
              {articles.map((article, index) => (
                <motion.div
                  key={article.article_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/articles/${article.slug}`}
                    className="group block h-full"
                  >
                    <Card
                      hover
                      className={`h-full overflow-hidden bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 ${
                        viewMode === "list" ? "flex flex-row" : ""
                      }`}
                    >
                      {/* Image */}
                      {article.featured_image && (
                        <div
                          className={`relative overflow-hidden bg-gray-100 dark:bg-gray-700 ${
                            viewMode === "grid"
                              ? "h-56"
                              : "w-64 h-full flex-shrink-0"
                          }`}
                        >
                          <img
                            src={getImageUrl(article.featured_image)}
                            alt={article.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {/* Category badge on image (grid only) */}
                          {article.category_name && viewMode === "grid" && (
                            <div className="absolute top-3 left-3">
                              <span className="inline-block px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-primary-600 dark:text-primary-400 rounded-full text-xs font-semibold border border-primary-200 dark:border-primary-800">
                                {article.category_name}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      <CardBody className="p-6 flex-1">
                        {/* Category badge for list or no-image */}
                        {article.category_name &&
                          (viewMode === "list" || !article.featured_image) && (
                            <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-xs font-semibold mb-3 border border-primary-200 dark:border-primary-800">
                              {article.category_name}
                            </span>
                          )}

                        <h3
                          className={`font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 ${
                            viewMode === "grid" ? "text-xl" : "text-2xl"
                          }`}
                        >
                          {article.title}
                        </h3>

                        {article.excerpt && (
                          <p
                            className={`text-gray-600 dark:text-gray-400 mb-4 leading-relaxed ${
                              viewMode === "grid"
                                ? "text-sm line-clamp-3"
                                : "text-base line-clamp-2"
                            }`}
                          >
                            {article.excerpt}
                          </p>
                        )}

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-3 text-sm pt-4 border-t border-gray-100 dark:border-gray-700">
                          <Link
                            to={`/user/${article.username}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-medium text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          >
                            @{article.username}
                          </Link>

                          <div className="flex items-center gap-3 ml-auto text-gray-500 dark:text-gray-400">
                            {article.reading_time && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{article.reading_time} min</span>
                              </div>
                            )}
                            {article.view_count > 0 && (
                              <div className="flex items-center gap-1">
                                <Eye className="h-3.5 w-3.5" />
                                <span>{article.view_count}</span>
                              </div>
                            )}
                            {article.likes_count > 0 && (
                              <div className="flex items-center gap-1">
                                <Heart className="h-3.5 w-3.5" />
                                <span>{article.likes_count}</span>
                              </div>
                            )}
                            <span>{formatRelativeTime(article.published_at)}</span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </Container>
    </div>
  );
};

export default FollowingFeed;
