import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, UserPlus } from "lucide-react";
import axios from "axios";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import { GridSkeleton } from "../../components/common/LodingSkeletons";
import { EmptyState } from "../../components/error/ErrorComponents";
import { formatRelativeTime } from "../../utils/formatDate";
import toast from "react-hot-toast";
import { getImageUrl } from "../../utils/imageUtils";

const FollowingFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchFollowingFeed();
  }, []);

  const fetchFollowingFeed = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/articles/following-feed`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setArticles(response.data.data || []);
    } catch (error) {
      console.error("Error fetching following feed:", error);
      toast.error("Failed to load feed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
        <Container>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Following Feed
          </h1>
          <GridSkeleton count={6} />
        </Container>
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
          {/* Header with Discover Button - ALWAYS VISIBLE */}
          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                <Users className="h-10 w-10 mr-3 text-primary-600 dark:text-primary-400" />
                Following Feed
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Latest articles from authors you follow
              </p>
            </div>

            {/* ✅ ALWAYS SHOW DISCOVER AUTHORS BUTTON */}
            <Button
              onClick={() => navigate("/discover-authors")}
              variant="primary"
              className="flex items-center"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Discover Authors
            </Button>
          </div>

          {/* Articles */}
          {articles.length === 0 ? (
            <EmptyState
              icon={UserPlus}
              title="No articles in your feed"
              description="Start following authors to see their articles here"
              action={
                <Button onClick={() => navigate("/discover-authors")}>
                  Discover More Authors
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <motion.div
                  key={article.article_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/articles/${article.slug}`}>
                    <Card hover>
                      {article.featured_image && (
                        <img
                          src={getImageUrl(article.featured_image)}
                          alt={article.title}
                          className="w-full h-48 object-cover"
                        />
                      )}

                      <CardBody>
                        {article.category_name && (
                          <span className="inline-block px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-medium rounded mb-2">
                            {article.category_name}
                          </span>
                        )}
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-t dark:border-gray-700 pt-3">
                          <Link
                            to={`/user/${article.username}`}
                            className="font-medium hover:text-primary-600 dark:hover:text-primary-400"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {article.username}
                          </Link>
                          <span>
                            {formatRelativeTime(article.published_at)}
                          </span>
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </Container>
    </div>
  );
};

export default FollowingFeed;
