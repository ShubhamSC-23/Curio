import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookMarked,
  Trash2,
  Check,
  Clock,
  Sparkles,
  BookOpen,
  Eye,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import { formatRelativeTime } from "../../utils/formatDate";
import toast from "react-hot-toast";
import { getImageUrl } from "../../utils/imageUtils";

const ReadingList = () => {
  const [readingList, setReadingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | unread | read

  useEffect(() => {
    fetchReadingList();
  }, []);

  const fetchReadingList = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/reading-list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReadingList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching reading list:", error);
      toast.error("Failed to load reading list");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (articleId) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/reading-list/${articleId}/mark-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReadingList(
        readingList.map((item) =>
          item.article_id === articleId
            ? { ...item, is_read: !item.is_read }
            : item
        )
      );
      toast.success("Status updated");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleRemove = async (articleId) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/reading-list/${articleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReadingList(readingList.filter((item) => item.article_id !== articleId));
      toast.success("Removed from reading list");
    } catch (error) {
      console.error("Error removing from list:", error);
      toast.error("Failed to remove");
    }
  };

  const unreadCount = readingList.filter((i) => !i.is_read).length;
  const readCount = readingList.filter((i) => i.is_read).length;

  const filteredList = readingList.filter((item) => {
    if (filter === "unread") return !item.is_read;
    if (filter === "read") return item.is_read;
    return true;
  });

  const filterTabs = [
    { id: "all", label: "All", count: readingList.length, icon: BookMarked },
    { id: "unread", label: "Unread", count: unreadCount, icon: Clock },
    { id: "read", label: "Read", count: readCount, icon: CheckCircle2 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-500 dark:text-gray-400 animate-pulse">
            Loading your reading list…
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
              <span className="text-sm font-medium">Save for Later</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Reading
              <span className="block text-primary-200 dark:text-primary-300 mt-2">
                List
              </span>
            </h1>

            <p className="text-xl text-primary-100 dark:text-primary-200 max-w-2xl mx-auto leading-relaxed">
              {readingList.length > 0
                ? `${unreadCount} article${unreadCount !== 1 ? "s" : ""} left to read · ${readCount} completed`
                : "Your saved articles for later reading"}
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
        {/* ── Filter Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 shadow-xl dark:shadow-2xl">
            <CardBody className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                {filterTabs.map(({ id, label, count, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setFilter(id)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                      filter === id
                        ? "bg-primary-600 dark:bg-primary-700 text-white border-primary-600 dark:border-primary-700 shadow-md"
                        : "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                        filter === id
                          ? "bg-white/20 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* ── List ── */}
        {filteredList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-50 dark:bg-primary-900/20 rounded-full mb-6 ring-8 ring-primary-50 dark:ring-primary-900/10">
              <BookMarked className="h-12 w-12 text-primary-400 dark:text-primary-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {filter === "all"
                ? "Your reading list is empty"
                : `No ${filter} articles`}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {filter === "all"
                ? "Browse articles and save them to read later"
                : `You have no ${filter} articles right now`}
            </p>
            <Link to="/articles">
              <Button variant="primary">
                <BookOpen className="h-4 w-4 mr-2" />
                Browse Articles
              </Button>
            </Link>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="space-y-4">
              {filteredList.map((item, index) => (
                <motion.div
                  key={item.article_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`overflow-hidden bg-white dark:bg-gray-800 border-2 transition-all duration-300 ${
                      item.is_read
                        ? "border-gray-100 dark:border-gray-700 opacity-70"
                        : "border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800"
                    }`}
                  >
                    <CardBody className="p-5">
                      <div className="flex gap-4">
                        {/* Read toggle circle */}
                        <div className="flex-shrink-0 pt-1">
                          <button
                            onClick={() => handleMarkAsRead(item.article_id)}
                            className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                              item.is_read
                                ? "bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-200 dark:shadow-emerald-900/30"
                                : "border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400"
                            }`}
                            title={item.is_read ? "Mark as unread" : "Mark as read"}
                          >
                            {item.is_read && (
                              <Check className="h-4 w-4 text-white" />
                            )}
                          </button>
                        </div>

                        {/* Thumbnail */}
                        {item.featured_image && (
                          <Link
                            to={`/articles/${item.slug}`}
                            className="flex-shrink-0 hidden sm:block"
                          >
                            <img
                              src={getImageUrl(item.featured_image)}
                              alt={item.title}
                              className="w-28 h-20 object-cover rounded-lg border border-gray-100 dark:border-gray-700"
                            />
                          </Link>
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {item.category_name && (
                            <span className="inline-block px-2.5 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-xs font-semibold mb-2 border border-primary-200 dark:border-primary-800">
                              {item.category_name}
                            </span>
                          )}

                          <Link to={`/articles/${item.slug}`}>
                            <h3
                              className={`text-lg font-bold mb-1.5 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2 ${
                                item.is_read
                                  ? "text-gray-500 dark:text-gray-400 line-through decoration-gray-300 dark:decoration-gray-600"
                                  : "text-gray-900 dark:text-white"
                              }`}
                            >
                              {item.title}
                            </h3>
                          </Link>

                          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2 line-clamp-1">
                            {item.excerpt}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                            <span className="font-medium text-gray-600 dark:text-gray-300">
                              {item.username}
                            </span>
                            {item.reading_time && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{item.reading_time} min</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>Added {formatRelativeTime(item.added_at)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex-shrink-0 flex flex-col gap-2">
                          <button
                            onClick={() => handleMarkAsRead(item.article_id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-400 border border-gray-200 dark:border-gray-600 transition-all whitespace-nowrap"
                          >
                            {item.is_read ? "Unread" : "Mark Read"}
                          </button>
                          <button
                            onClick={() => handleRemove(item.article_id)}
                            className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center justify-center"
                            title="Remove"
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

export default ReadingList;
