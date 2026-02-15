import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Settings, BookOpen, Heart } from "lucide-react";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import {
  BadgesDisplay,
  calculateEarnedBadges,
} from "../../components/badges/BadgesSystem";
import { formatDate } from "../../utils/formatDate";
import { getImageUrl } from "../../utils/imageUtils";

const Profile = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);

      // Get user ID - check multiple possible fields
      const userId = user?.user_id || user?.id;

      if (!userId) {
        console.error("User ID not found. User object:", user);
        throw new Error("User ID is missing");
      }

      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      console.log("Fetching stats for user ID:", userId);

      const response = await axios.get(
        `${API_URL}/users/${userId}/stats`,
      );
      setUserStats(response.data.data);
    } catch (error) {
      console.error("Error fetching user stats:", error);

      // Set default stats if error (so badges still work)
      const userId = user?.user_id || user?.id;
      setUserStats({
        user_id: userId,
        username: user?.username,
        created_at: user?.created_at,
        articles_published: 0,
        total_likes: 0,
        total_views: 0,
        max_views: 0,
        comments_made: 0,
        followers: 0,
        following: 0,
        streak_days: 0,
        quality_score: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Please log in
        </h1>
        <Button onClick={() => navigate("/login")} className="mt-4">
          Go to Login
        </Button>
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
                  {user?.profile_image ? (
                    <img
                      src={getImageUrl(user.profile_image)}
                      alt={user.full_name}
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
                    {user?.full_name || user?.username}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    @{user?.username}
                  </p>

                  {user?.bio && (
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {user.bio}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Joined {formatDate(user?.created_at)}</span>
                    </div>
                    {userStats && (
                      <>
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          <span>{userStats.articles_published} Articles</span>
                        </div>
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          <span>{userStats.total_likes} Likes</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/settings")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Statistics Cards */}
          {userStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardBody className="text-center py-6">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                    {userStats.articles_published}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Articles Published
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="text-center py-6">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                    {userStats.total_likes}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Likes
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="text-center py-6">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {userStats.total_views}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Views
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {/* Badges Section */}
          {userStats && (
            <BadgesDisplay
              userBadges={calculateEarnedBadges(userStats)}
              userStats={userStats}
            />
          )}
        </motion.div>
      </Container>
    </div>
  );
};

export default Profile;
