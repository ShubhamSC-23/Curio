import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, FileText, Users, UserPlus, UserMinus, Eye } from "lucide-react";
import api from "../../api/axios";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import { PageLoader } from "../../components/common/Spinner";
import { useAuthStore } from "../../store/authStore";
import { getImageUrl } from "../../utils/imageUtils";
import toast from "react-hot-toast";

const DiscoverAuthors = () => {
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingIds, setFollowingIds] = useState(new Set());
  const [filter, setFilter] = useState("all"); // all, popular, new

  useEffect(() => {
    fetchAuthors();
    if (isAuthenticated) {
      fetchFollowingStatus();
    }
  }, [filter]);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/authors", {
        params: { filter },
      });
      setAuthors(response.data.data || []);
    } catch (error) {
      console.error("Error fetching authors:", error);
      toast.error("Failed to load authors");
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowingStatus = async () => {
    try {
      const response = await api.get("/users/me/following");
      const followingSet = new Set(response.data.data.map((u) => u.user_id));
      setFollowingIds(followingSet);
    } catch (error) {
      console.error("Error fetching following status:", error);
    }
  };

  const handleFollow = async (authorId) => {
    if (!isAuthenticated) {
      toast.error("Please login to follow authors");
      return;
    }

    try {
      if (followingIds.has(authorId)) {
        // Unfollow
        await api.delete(`/users/${authorId}/follow`);
        setFollowingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(authorId);
          return newSet;
        });
        toast.success("Unfollowed author");
      } else {
        // Follow
        await api.post(`/users/${authorId}/follow`);
        setFollowingIds((prev) => new Set([...prev, authorId]));
        toast.success("Following author");
      }

      // Refresh authors to update follower counts
      fetchAuthors();
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast.error("Failed to update follow status");
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Discover Authors
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Find and follow amazing writers
            </p>

            {/* Filters */}
            <div className="flex justify-center gap-4 flex-wrap">
              <Button
                variant={filter === "all" ? "primary" : "outline"}
                onClick={() => setFilter("all")}
                size="sm"
              >
                All Authors
              </Button>
              <Button
                variant={filter === "popular" ? "primary" : "outline"}
                onClick={() => setFilter("popular")}
                size="sm"
              >
                Most Popular
              </Button>
              <Button
                variant={filter === "new" ? "primary" : "outline"}
                onClick={() => setFilter("new")}
                size="sm"
              >
                New Authors
              </Button>
              <Button
                variant={filter === "active" ? "primary" : "outline"}
                onClick={() => setFilter("active")}
                size="sm"
              >
                Most Active
              </Button>
            </div>
          </div>

          {/* Authors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map((author) => {
              const isFollowing = followingIds.has(author.user_id);
              const isCurrentUser = currentUser?.user_id === author.user_id;

              return (
                <Card key={author.user_id} hover className="h-full">
                  <CardBody className="p-6">
                    <div className="flex flex-col items-center text-center">
                      {/* Profile Image */}
                      <Link to={`/user/${author.username}`}>
                        {author.profile_image ? (
                          <img
                            src={getImageUrl(author.profile_image)}
                            alt={author.username}
                            className="h-24 w-24 rounded-full object-cover mb-4 hover:ring-4 ring-primary-500 transition"
                          />
                        ) : (
                          <div className="h-24 w-24 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4 hover:ring-4 ring-primary-500 transition">
                            <User className="h-12 w-12 text-primary-600 dark:text-primary-400" />
                          </div>
                        )}
                      </Link>

                      {/* Name & Username */}
                      <Link to={`/user/${author.username}`}>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 hover:text-primary-600 dark:hover:text-primary-400">
                          {author.full_name || author.username}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        @{author.username}
                      </p>

                      {/* Bio */}
                      {author.bio && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                          {author.bio}
                        </p>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-center gap-6 mb-6 w-full">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-gray-900 dark:text-white font-semibold">
                            <FileText className="h-4 w-4" />
                            <span>{author.article_count || 0}</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Articles
                          </p>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-gray-900 dark:text-white font-semibold">
                            <Users className="h-4 w-4" />
                            <span>{author.follower_count || 0}</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Followers
                          </p>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-gray-900 dark:text-white font-semibold">
                            <Eye className="h-4 w-4" />
                            <span>{author.total_views || 0}</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Views
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 w-full">
                        {!isCurrentUser && (
                          <Button
                            variant={isFollowing ? "outline" : "primary"}
                            onClick={() => handleFollow(author.user_id)}
                            fullWidth
                            className={
                              isFollowing
                                ? "border-gray-300 dark:border-gray-600"
                                : ""
                            }
                          >
                            {isFollowing ? (
                              <>
                                <UserMinus className="h-4 w-4 mr-2" />
                                Unfollow
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Follow
                              </>
                            )}
                          </Button>
                        )}

                        <Link
                          to={`/user/${author.username}`}
                          className={isCurrentUser ? "w-full" : "flex-1"}
                        >
                          <Button variant="outline" fullWidth>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {authors.length === 0 && (
            <div className="text-center py-12">
              <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Authors Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try changing the filter or check back later
              </p>
            </div>
          )}
        </motion.div>
      </Container>
    </div>
  );
};

export default DiscoverAuthors;
