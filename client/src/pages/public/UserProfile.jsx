import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Calendar,
  Heart,
  BookOpen,
  Users,
  UserPlus,
  UserMinus,
} from "lucide-react";
import axios from "axios";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import {
  MiniBadge,
  BADGES,
  calculateEarnedBadges,
} from "../../components/badges/BadgesSystem";
import { useAuthStore } from "../../store/authStore";
import { formatDate, formatRelativeTime } from "../../utils/formatDate";
import toast from "react-hot-toast";

const UserProfile = () => {
  const { username } = useParams();
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [articles, setArticles] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    fetchUserProfile();
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL;

      // Fetch user profile
      const profileRes = await axios.get(`${API_URL}/users/${username}`);
      setProfile(profileRes.data.data);

      // Fetch user stats for badges
      if (profileRes.data.data.user_id) {
        try {
          const userId =
            profileRes.data.data.user_id || profileRes.data.data.id;
          const statsRes = await axios.get(
            `${API_URL}/users/${userId}/stats`,
          );
          setUserStats(statsRes.data.data);
        } catch (error) {
          console.error("Error fetching stats:", error);
          // Set default stats
          setUserStats({
            user_id: profileRes.data.data.user_id,
            username: profileRes.data.data.username,
            created_at: profileRes.data.data.created_at,
            articles_published: profileRes.data.data.article_count || 0,
            total_likes: 0,
            total_views: 0,
            max_views: 0,
            comments_made: 0,
            followers: profileRes.data.data.follower_count || 0,
            following: 0,
          });
        }
      }

      // Fetch user's articles
      const articlesRes = await axios.get(`${API_URL}/articles`, {
        params: { author: username, status: "published" },
      });
      setArticles(articlesRes.data.data || []);

      // Check if following (if authenticated)
      if (isAuthenticated && !isOwnProfile) {
        // TODO: Check if following from backend
        // For now, we'll handle it client-side
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to follow users");
      return;
    }

    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/users/${profile.user_id}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setIsFollowing(!isFollowing);

      // Update follower count locally
      if (userStats) {
        setUserStats({
          ...userStats,
          followers: isFollowing
            ? userStats.followers - 1
            : userStats.followers + 1,
        });
      }

      toast.success(isFollowing ? "Unfollowed" : "Following!");
    } catch (error) {
      console.error("Error following user:", error);
      toast.error("Failed to follow user");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          User not found
        </h1>
        <Link
          to="/"
          className="text-primary-600 hover:text-primary-700 mt-4 inline-block"
        >
          ← Back to home
        </Link>
      </Container>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Profile Header */}
          <Card className="mb-8">
            <CardBody className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {profile.profile_image ? (
                    <img
                      src={profile.profile_image}
                      alt={profile.full_name}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-primary-200 dark:bg-primary-800 flex items-center justify-center">
                      <User className="h-12 w-12 text-primary-600 dark:text-primary-400" />
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {profile.full_name || profile.username}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    @{profile.username}
                  </p>

                  {profile.bio && (
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {profile.bio}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>{articles.length} Articles</span>
                    </div>
                    {userStats && (
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{userStats.followers || 0} Followers</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Joined {formatDate(profile.created_at)}</span>
                    </div>
                  </div>

                  {/* Mini Badges */}
                  {userStats && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {calculateEarnedBadges(userStats)
                        .slice(0, 3)
                        .map((badgeId) => (
                          <MiniBadge key={badgeId} badge={BADGES[badgeId]} />
                        ))}
                      {calculateEarnedBadges(userStats).length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          +{calculateEarnedBadges(userStats).length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex-shrink-0">
                  {isOwnProfile ? (
                    <Link to="/settings">
                      <Button variant="outline">Edit Profile</Button>
                    </Link>
                  ) : (
                    <Button
                      variant={isFollowing ? "outline" : "primary"}
                      onClick={handleFollow}
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
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Articles Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Published Articles ({articles.length})
            </h2>

            {articles.length === 0 ? (
              <Card>
                <CardBody className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No articles published yet
                  </p>
                </CardBody>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article) => (
                  <Link
                    key={article.article_id}
                    to={`/articles/${article.slug}`}
                  >
                    <Card hover>
                      {article.featured_image && (
                        <img
                          src={article.featured_image}
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
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-t pt-3">
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center">
                              <Heart className="h-4 w-4 mr-1" />
                              {article.like_count || 0}
                            </span>
                            <span>{article.reading_time} min read</span>
                          </div>
                          <span>
                            {formatRelativeTime(article.published_at)}
                          </span>
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default UserProfile;
