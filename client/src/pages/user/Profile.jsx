import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  Settings,
  BookOpen,
  Heart,
  Eye,
  MessageCircle,
  Users,
  Flame,
  Edit3,
  Award,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import {
  BadgesDisplay,
  calculateEarnedBadges,
  BADGES,
} from "../../components/badges/BadgesSystem";
import { formatDate } from "../../utils/formatDate";
import { getImageUrl } from "../../utils/imageUtils";

/* ─── Stat card data builder ─────────────────────────────────── */
const buildStatCards = (stats) => [
  {
    label: "Articles Published",
    value: stats.articles_published ?? 0,
    icon: BookOpen,
    gradient: "from-primary-500 to-primary-700",
    bg: "bg-primary-50 dark:bg-primary-900/20",
    iconColor: "text-primary-600 dark:text-primary-400",
    ring: "ring-primary-200 dark:ring-primary-800",
  },
  {
    label: "Total Likes",
    value: stats.total_likes ?? 0,
    icon: Heart,
    gradient: "from-rose-500 to-pink-600",
    bg: "bg-rose-50 dark:bg-rose-900/20",
    iconColor: "text-rose-500 dark:text-rose-400",
    ring: "ring-rose-200 dark:ring-rose-800",
  },
  {
    label: "Total Views",
    value: stats.total_views ?? 0,
    icon: Eye,
    gradient: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    ring: "ring-emerald-200 dark:ring-emerald-800",
  },
  {
    label: "Comments",
    value: stats.comments_made ?? 0,
    icon: MessageCircle,
    gradient: "from-violet-500 to-purple-700",
    bg: "bg-violet-50 dark:bg-violet-900/20",
    iconColor: "text-violet-600 dark:text-violet-400",
    ring: "ring-violet-200 dark:ring-violet-800",
  },
  {
    label: "Followers",
    value: stats.followers ?? 0,
    icon: Users,
    gradient: "from-amber-500 to-orange-600",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    iconColor: "text-amber-600 dark:text-amber-400",
    ring: "ring-amber-200 dark:ring-amber-800",
  },
  {
    label: "Writing Streak",
    value: `${stats.streak_days ?? 0}d`,
    icon: Flame,
    gradient: "from-orange-500 to-red-600",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    iconColor: "text-orange-600 dark:text-orange-400",
    ring: "ring-orange-200 dark:ring-orange-800",
  },
];

/* ─── Component ──────────────────────────────────────────────── */
const Profile = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchUserStats();
  }, [user]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const userId = user?.user_id || user?.id;
      if (!userId) throw new Error("User ID is missing");

      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await axios.get(`${API_URL}/users/${userId}/stats`);
      setUserStats(response.data.data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
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

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-500 dark:text-gray-400 animate-pulse">
            Loading your profile…
          </p>
        </div>
      </div>
    );
  }

  /* ── Guard ── */
  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <Container className="py-20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-full mb-6">
            <User className="h-10 w-10 text-primary-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            You're not logged in
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Please sign in to view your profile
          </p>
          <Button variant="primary" onClick={() => navigate("/login")}>
            Go to Login
          </Button>
        </Container>
      </div>
    );
  }

  const statCards = userStats ? buildStatCards(userStats) : [];
  const earnedBadges = userStats ? calculateEarnedBadges(userStats) : [];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* ── Hero / Banner ── */}
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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 dark:to-black/40" />

        <Container className="relative pt-16 pb-32 md:pt-20 md:pb-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full text-white mb-6 border border-white/20 dark:border-white/10"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">My Profile</span>
            </motion.div>

            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, type: "spring", stiffness: 200 }}
              className="relative mb-5"
            >
              {user?.profile_image ? (
                <img
                  src={getImageUrl(user.profile_image)}
                  alt={user.full_name}
                  className="h-28 w-28 rounded-full object-cover ring-4 ring-white/40 shadow-2xl"
                />
              ) : (
                <div className="h-28 w-28 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-sm ring-4 ring-white/40 shadow-2xl flex items-center justify-center">
                  <User className="h-14 w-14 text-white/80" />
                </div>
              )}
              {/* Online indicator */}
              <span className="absolute bottom-1.5 right-1.5 h-4 w-4 bg-emerald-400 border-2 border-white rounded-full shadow" />
            </motion.div>

            {/* Name & handle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                {user?.full_name || user?.username}
              </h1>
              <p className="text-primary-200 dark:text-primary-300 text-lg mb-3">
                @{user?.username}
              </p>
              {user?.bio && (
                <p className="text-white/80 max-w-lg mx-auto leading-relaxed text-sm md:text-base">
                  {user.bio}
                </p>
              )}
            </motion.div>

            {/* Meta row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="flex flex-wrap justify-center gap-5 mt-5 text-sm text-white/70"
            >
              <div className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>Joined {formatDate(user?.created_at)}</span>
              </div>
              {userStats && (
                <>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    <span>{userStats.articles_published} Articles</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="h-4 w-4" />
                    <span>{earnedBadges.length} Badges</span>
                  </div>
                </>
              )}
            </motion.div>

            {/* Edit Profile button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6"
            >
              <Button
                variant="outline"
                onClick={() => navigate("/settings")}
                className="border-white/40 text-white hover:bg-white/10 dark:hover:bg-white/5 backdrop-blur-sm transition-all"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </motion.div>
          </motion.div>
        </Container>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-12 md:h-20 text-white dark:text-gray-900"
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      <Container className="py-8 -mt-6 relative z-10">
        {/* ── Stat Cards ── */}
        {userStats && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10"
          >
            {statCards.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.07 }}
                >
                  <Card className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 h-full">
                    <CardBody className="p-5 flex flex-col items-center text-center">
                      <div
                        className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${stat.bg} ring-4 ${stat.ring} mb-3`}
                      >
                        <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-0.5">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                        {stat.label}
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ── Achievements / Badges ── */}
        {userStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <Card className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 shadow-lg dark:shadow-2xl">
              <CardBody className="p-6 md:p-8">
                {/* Section header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="inline-flex items-center justify-center w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                        <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Achievements
                      </h2>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm ml-10">
                      {earnedBadges.length} of{" "}
                      {Object.keys(BADGES).length}{" "}
                      badges earned — keep writing to unlock more!
                    </p>
                  </div>

                  {earnedBadges.length > 0 && (
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium border border-amber-200 dark:border-amber-800">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {earnedBadges.length} earned
                    </div>
                  )}
                </div>

                {/* Badges grid */}
                <BadgesDisplay
                  userBadges={earnedBadges}
                  userStats={userStats}
                />
              </CardBody>
            </Card>
          </motion.div>
        )}
      </Container>
    </div>
  );
};

export default Profile;
