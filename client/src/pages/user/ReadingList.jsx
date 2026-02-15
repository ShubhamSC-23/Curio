import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookMarked, Trash2, Check, Clock } from "lucide-react";
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
  const [filter, setFilter] = useState("all"); // all, unread, read

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
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setReadingList(
        readingList.map((item) =>
          item.article_id === articleId
            ? { ...item, is_read: !item.is_read }
            : item,
        ),
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

      setReadingList(
        readingList.filter((item) => item.article_id !== articleId),
      );
      toast.success("Removed from reading list");
    } catch (error) {
      console.error("Error removing from list:", error);
      toast.error("Failed to remove");
    }
  };

  const filteredList = readingList.filter((item) => {
    if (filter === "unread") return !item.is_read;
    if (filter === "read") return item.is_read;
    return true;
  });

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
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
              <BookMarked className="h-10 w-10 mr-3 text-primary-600" />
              Reading List
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Articles you plan to read later
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex gap-2">
            <Button
              variant={filter === "all" ? "primary" : "outline"}
              onClick={() => setFilter("all")}
              size="sm"
            >
              All ({readingList.length})
            </Button>
            <Button
              variant={filter === "unread" ? "primary" : "outline"}
              onClick={() => setFilter("unread")}
              size="sm"
            >
              <Clock className="h-4 w-4 mr-1" />
              Unread ({readingList.filter((i) => !i.is_read).length})
            </Button>
            <Button
              variant={filter === "read" ? "primary" : "outline"}
              onClick={() => setFilter("read")}
              size="sm"
            >
              <Check className="h-4 w-4 mr-1" />
              Read ({readingList.filter((i) => i.is_read).length})
            </Button>
          </div>

          {/* Reading List */}
          {filteredList.length === 0 ? (
            <Card>
              <CardBody className="text-center py-20">
                <BookMarked className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {filter === "all"
                    ? "No articles in your reading list"
                    : `No ${filter} articles`}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Add articles to read them later
                </p>
                <Link to="/articles">
                  <Button variant="primary">Browse Articles</Button>
                </Link>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredList.map((item, index) => (
                <motion.div
                  key={item.article_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card hover className={item.is_read ? "opacity-60" : ""}>
                    <CardBody>
                      <div className="flex gap-4">
                        {/* Status Indicator */}
                        <div className="flex-shrink-0 pt-1">
                          <button
                            onClick={() => handleMarkAsRead(item.article_id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                              item.is_read
                                ? "bg-green-500 border-green-500"
                                : "border-gray-300 hover:border-primary-500"
                            }`}
                          >
                            {item.is_read && (
                              <Check className="h-4 w-4 text-white" />
                            )}
                          </button>
                        </div>

                        {/* Featured Image */}
                        {item.featured_image && (
                          <Link
                            to={`/articles/${item.slug}`}
                            className="flex-shrink-0"
                          >
                            <img
                                                                      src={getImageUrl(item.featured_image)}
                                                                      alt={item.title}
                                                                      className="w-60 h-auto rounded-lg mb-8 shadow-lg"
                                                                    />
                          </Link>
                        )}

                        {/* Content */}
                        <div className="flex-1">
                          <Link to={`/articles/${item.slug}`}>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-primary-600">
                              {item.title}
                            </h3>
                          </Link>

                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                            {item.excerpt}
                          </p>

                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-medium">{item.username}</span>
                            <span>•</span>
                            <span>{item.reading_time} min read</span>
                            <span>•</span>
                            <span>
                              Added {formatRelativeTime(item.added_at)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex-shrink-0 flex flex-col gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(item.article_id)}
                            className="whitespace-nowrap"
                          >
                            {item.is_read ? "Mark Unread" : "Mark Read"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(item.article_id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </Container>
    </div>
  );
};

export default ReadingList;
