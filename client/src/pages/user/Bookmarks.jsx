import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  Trash2,
  Heart,
  Eye,
  Clock,
  Sparkles,
  BookOpen,
  Grid,
  List,
} from "lucide-react";
import axios from "axios";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import { formatRelativeTime } from "../../utils/formatDate";
import toast from "react-hot-toast";
import { getImageUrl } from "../../utils/imageUtils";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("list");

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/users/me/bookmarks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookmarks(response.data.data || []);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      toast.error("Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (articleId) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/articles/${articleId}/bookmark`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookmarks(bookmarks.filter((b) => b.article_id !== articleId));
      toast.success("Removed from bookmarks");
    } catch (error) {
      console.error("Error removing bookmark:", error);
      toast.error("Failed to remove bookmark");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-500 dark:text-gray-400 animate-pulse">
            Loading bookmarks…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 dark:from-primary-800 dark:via-primary-900 dark:to-secondary-900">
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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full text-white mb-6 border border-white/20"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Saved Articles</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              My
              <span className="block text-primary-200 dark:text-primary-300 mt-2">
                Bookmarks
              </span>
            </h1>

            <p className="text-xl text-primary-100 dark:text-primary-200 max-w-2xl mx-auto leading-relaxed">
              {bookmarks.length > 0
                ? `${bookmarks.length} article${bookmarks.length !== 1 ? "s" : ""} saved to your collection`
                : "Articles you've bookmarked for later"}
            </p>
          </motion.div>
        </Container>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-12 md:h-24 text-white dark:text-gray-900"
            viewBox="0 0 1440 120"
            fill="none"
          >
            <path
              d="M0,64 C360,120 1080,0 1440,64 L1440,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      <Container className="py-8 -mt-16 md:-mt-20 relative z-10">
        {/* ── Controls Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 shadow-xl dark:shadow-2xl">
            <CardBody className="p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {bookmarks.length}
                  </span>{" "}
                  saved article{bookmarks.length !== 1 ? "s" : ""}
                </p>

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
        {bookmarks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-50 dark:bg-primary-900/20 rounded-full mb-6 ring-8 ring-primary-50 dark:ring-primary-900/10">
              <Bookmark className="h-12 w-12 text-primary-400 dark:text-primary-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              No bookmarks yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              While reading, tap the bookmark icon on any article to save it here
            </p>
            <Link to="/articles">
              <Button variant="primary">
                <BookOpen className="h-4 w-4 mr-2" />
                Browse Articles
              </Button>
            </Link>
          </motion.div>
        ) : viewMode === "grid" ? (
          /* ── Grid View ── */
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bookmarks.map((article, index) => (
                <motion.div
                  key={article.article_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="group relative">
                    <Link
                      to={`/articles/${article.slug}`}
                      className="block h-full"
                    >
                      <Card className="h-full overflow-hidden bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300">
                        {article.featured_image && (
                          <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                            <img
                              src={getImageUrl(article.featured_image)}
                              alt={article.title}
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            {article.category_name && (
                              <div className="absolute top-3 left-3">
                                <span className="inline-block px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-primary-600 dark:text-primary-400 rounded-full text-xs font-semibold border border-primary-200 dark:border-primary-800">
                                  {article.category_name}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        <CardBody className="p-5">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                            {article.excerpt}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500 pt-3 border-t border-gray-100 dark:border-gray-700">
                            <span className="font-medium text-gray-600 dark:text-gray-300">
                              {article.username}
                            </span>
                            {article.reading_time && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {article.reading_time} min
                              </div>
                            )}
                            {article.like_count > 0 && (
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {article.like_count}
                              </div>
                            )}
                            {article.view_count > 0 && (
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {article.view_count}
                              </div>
                            )}
                          </div>
                        </CardBody>
                      </Card>
                    </Link>
                    {/* Remove button overlay */}
                    <button
                      onClick={() => handleRemoveBookmark(article.article_id)}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 border border-gray-200 dark:border-gray-600 shadow-sm transition-all opacity-0 group-hover:opacity-100"
                      title="Remove bookmark"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        ) : (
          /* ── List View ── */
          <AnimatePresence>
            <div className="space-y-4">
              {bookmarks.map((article, index) => (
                <motion.div
                  key={article.article_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300">
                    <CardBody className="p-5">
                      <div className="flex gap-4">
                        {/* Thumbnail */}
                        {article.featured_image && (
                          <Link
                            to={`/articles/${article.slug}`}
                            className="flex-shrink-0 hidden sm:block"
                          >
                            <div className="w-28 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                              <img
                                src={getImageUrl(article.featured_image)}
                                alt={article.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                            </div>
                          </Link>
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {article.category_name && (
                            <span className="inline-block px-2.5 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-xs font-semibold mb-2 border border-primary-200 dark:border-primary-800">
                              {article.category_name}
                            </span>
                          )}
                          <Link to={`/articles/${article.slug}`}>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2">
                              {article.title}
                            </h3>
                          </Link>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2 line-clamp-1">
                            {article.excerpt}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                            <span className="font-medium text-gray-600 dark:text-gray-300">
                              {article.username}
                            </span>
                            <span>{formatRelativeTime(article.published_at)}</span>
                            {article.reading_time && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {article.reading_time} min
                              </div>
                            )}
                            {article.like_count > 0 && (
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {article.like_count}
                              </div>
                            )}
                            {article.view_count > 0 && (
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {article.view_count}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Remove */}
                        <div className="flex-shrink-0">
                          <button
                            onClick={() => handleRemoveBookmark(article.article_id)}
                            className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-transparent hover:border-red-200 dark:hover:border-red-800 transition-all"
                            title="Remove bookmark"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </Container>
    </div>
  );
};

export default Bookmarks;
