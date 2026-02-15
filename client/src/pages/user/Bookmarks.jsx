import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bookmark, Trash2, Heart, Eye } from "lucide-react";
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
        { headers: { Authorization: `Bearer ${token}` } },
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
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
              <Bookmark className="h-8 w-8 mr-3 text-primary-600" />
              My Bookmarks
            </h1>
            <p className="text-gray-600">
              {bookmarks.length} saved article
              {bookmarks.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Bookmarks List */}
          {bookmarks.length === 0 ? (
            <Card>
              <CardBody className="text-center py-20">
                <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No bookmarks yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Save articles to read them later
                </p>
                <Link to="/articles">
                  <Button variant="primary">Browse Articles</Button>
                </Link>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookmarks.map((article, index) => (
                <motion.div
                  key={article.article_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card hover>
                    <CardBody>
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Featured Image */}
                        {article.featured_image && (
                          <Link
                            to={`/articles/${article.slug}`}
                            className="flex-shrink-0"
                          >
                            <img
                                          src={getImageUrl(article.featured_image)}
                                          alt={article.title}
                                          className="w-60 h-auto rounded-lg mb-8 shadow-lg"
                                        />
                          </Link>
                        )}

                        {/* Content */}
                        <div className="flex-1">
                          {article.category_name && (
                            <span className="inline-block px-2 py-1 bg-primary-100 text-primary-600 text-xs font-medium rounded mb-2">
                              {article.category_name}
                            </span>
                          )}

                          <Link to={`/articles/${article.slug}`}>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary-600 transition">
                              {article.title}
                            </h3>
                          </Link>

                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {article.excerpt}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span className="font-medium">
                              {article.username}
                            </span>
                            <span>•</span>
                            <span>
                              {formatRelativeTime(article.published_at)}
                            </span>
                            <span>•</span>
                            <span>{article.reading_time} min read</span>
                            <span className="flex items-center">
                              <Heart className="h-4 w-4 mr-1" />
                              {article.like_count || 0}
                            </span>
                            <span className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {article.view_count || 0}
                            </span>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <div className="flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRemoveBookmark(article.article_id)
                            }
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

export default Bookmarks;
