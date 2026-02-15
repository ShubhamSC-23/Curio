import React from "react";
import {
  Award,
  Star,
  Zap,
  TrendingUp,
  Heart,
  MessageCircle,
  BookOpen,
  Users,
  Trophy,
  Target,
  Flame,
  Crown,
} from "lucide-react";

// Define all available badges
export const BADGES = {
  // Article Writing Badges
  FIRST_ARTICLE: {
    id: "first_article",
    name: "First Steps",
    description: "Published your first article",
    icon: BookOpen,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    requirement: { type: "articles_published", count: 1 },
  },
  PROLIFIC_WRITER: {
    id: "prolific_writer",
    name: "Prolific Writer",
    description: "Published 10 articles",
    icon: Zap,
    color: "text-yellow-500",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    requirement: { type: "articles_published", count: 10 },
  },
  MASTER_AUTHOR: {
    id: "master_author",
    name: "Master Author",
    description: "Published 50 articles",
    icon: Crown,
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    requirement: { type: "articles_published", count: 50 },
  },
  RISING_WRITER: {
    id: "rising_writer",
    name: "Rising Writer",
    description: "Published 5 articles",
    icon: Star,
    color: "text-indigo-500",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    requirement: { type: "articles_published", count: 5 },
  },

  LEGENDARY_AUTHOR: {
    id: "legendary_author",
    name: "Legendary Author",
    description: "Published 100 articles",
    icon: Crown,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    requirement: { type: "articles_published", count: 100 },
  },

  // Engagement Badges
  POPULAR: {
    id: "popular",
    name: "Popular",
    description: "Received 100 likes",
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    requirement: { type: "total_likes", count: 100 },
  },
  APPRECIATED: {
    id: "appreciated",
    name: "Appreciated",
    description: "Received 500 likes",
    icon: Heart,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    requirement: { type: "total_likes", count: 500 },
  },

  VIRAL: {
    id: "viral",
    name: "Viral",
    description: "Article with 1000+ views",
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    requirement: { type: "max_views", count: 1000 },
  },
  TRENDING_STAR: {
    id: "trending_star",
    name: "Trending Star",
    description: "Article with 5000+ views",
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    requirement: { type: "max_views", count: 5000 },
  },

  CONVERSATIONALIST: {
    id: "conversationalist",
    name: "Conversationalist",
    description: "Made 50 comments",
    icon: MessageCircle,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    requirement: { type: "comments_made", count: 50 },
  },

  // Community Badges
  INFLUENCER: {
    id: "influencer",
    name: "Influencer",
    description: "100 followers",
    icon: Users,
    color: "text-pink-500",
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
    requirement: { type: "followers", count: 100 },
  },
  NETWORKER: {
    id: "networker",
    name: "Networker",
    description: "Following 50 people",
    icon: Star,
    color: "text-indigo-500",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    requirement: { type: "following", count: 50 },
  },

  // Special Badges
  EARLY_ADOPTER: {
    id: "early_adopter",
    name: "Early Adopter",
    description: "Joined in the first month",
    icon: Trophy,
    color: "text-amber-500",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    requirement: { type: "joined_before", date: "2024-03-01" },
  },
  CONSISTENT: {
    id: "consistent",
    name: "Consistent",
    description: "7 day writing streak",
    icon: Flame,
    color: "text-orange-500",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    requirement: { type: "streak_days", count: 7 },
  },
  STREAK_MASTER: {
    id: "streak_master",
    name: "Streak Master",
    description: "30 day writing streak",
    icon: Flame,
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    requirement: { type: "streak_days", count: 30 },
  },

  PERFECTIONIST: {
    id: "perfectionist",
    name: "Perfectionist",
    description: "All articles above 90% quality",
    icon: Target,
    color: "text-teal-500",
    bgColor: "bg-teal-100 dark:bg-teal-900/30",
    requirement: { type: "quality_score", min: 90 },
  },
};

// Badge Component
export const Badge = ({ badge, earned = false, progress = null }) => {
  const Icon = badge.icon;

  return (
    <div
      className={`relative p-4 rounded-lg border-2 transition-all ${
        earned
          ? `${badge.bgColor} border-current ${badge.color}`
          : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-lg ${earned ? badge.bgColor : "bg-gray-100 dark:bg-gray-700"}`}
        >
          <Icon
            className={`h-6 w-6 ${earned ? badge.color : "text-gray-400"}`}
          />
        </div>

        <div className="flex-1">
          <h3
            className={`font-bold ${earned ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}
          >
            {badge.name}
          </h3>
          <p
            className={`text-sm ${earned ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`}
          >
            {badge.description}
          </p>

          {/* Progress Bar */}
          {!earned && progress !== null && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Progress</span>
                <span>{Math.min(100, Math.round(progress))}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${badge.bgColor} transition-all duration-500`}
                  style={{ width: `${Math.min(100, progress)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {earned && <Award className={`h-5 w-5 ${badge.color}`} />}
      </div>
    </div>
  );
};

// Badges Display Component
export const BadgesDisplay = ({ userBadges = [], userStats = {} }) => {
  // Calculate which badges are earned and progress
  const badgesList = Object.values(BADGES).map((badge) => {
    const earned = userBadges.includes(badge.id);
    let progress = 0;

    if (!earned && badge.requirement) {
      const { type, count } = badge.requirement;

      if (type === "articles_published") {
        progress = (userStats.articles_published / count) * 100;
      } else if (type === "total_likes") {
        progress = (userStats.total_likes / count) * 100;
      } else if (type === "max_views") {
        progress = (userStats.max_views / count) * 100;
      } else if (type === "comments_made") {
        progress = (userStats.comments_made / count) * 100;
      } else if (type === "followers") {
        progress = (userStats.followers / count) * 100;
      } else if (type === "following") {
        progress = (userStats.following / count) * 100;
      } else if (type === "streak_days") {
        progress = (userStats.streak_days / count) * 100;
      }
    }

    return { badge, earned, progress };
  });

  const earnedCount = badgesList.filter((b) => b.earned).length;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🏆 Achievements
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {earnedCount} of {badgesList.length} badges earned
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badgesList.map(({ badge, earned, progress }) => (
          <Badge
            key={badge.id}
            badge={badge}
            earned={earned}
            progress={progress}
          />
        ))}
      </div>
    </div>
  );
};

// Mini Badge Display (for profile)
export const MiniBadge = ({ badge }) => {
  if (!badge) return null; // ✅ prevent crash

  const Icon = badge.icon;

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bgColor} ${badge.color}`}
      title={badge.description}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {badge.name}
    </div>
  );
};


// Calculate earned badges based on user stats
export const calculateEarnedBadges = (userStats) => {
  const earned = [];

  Object.values(BADGES).forEach((badge) => {
    const { requirement } = badge;

    if (
      requirement.type === "articles_published" &&
      userStats.articles_published >= requirement.count
    ) {
      earned.push(badge.id);
    } else if (
      requirement.type === "total_likes" &&
      userStats.total_likes >= requirement.count
    ) {
      earned.push(badge.id);
    } else if (
      requirement.type === "max_views" &&
      userStats.max_views >= requirement.count
    ) {
      earned.push(badge.id);
    } else if (
      requirement.type === "comments_made" &&
      userStats.comments_made >= requirement.count
    ) {
      earned.push(badge.id);
    } else if (
      requirement.type === "followers" &&
      userStats.followers >= requirement.count
    ) {
      earned.push(badge.id);
    } else if (
      requirement.type === "following" &&
      userStats.following >= requirement.count
    ) {
      earned.push(badge.id);
    } else if (
      requirement.type === "streak_days" &&
      userStats.streak_days >= requirement.count
    ) {
      earned.push(badge.id);
    } else if (requirement.type === "joined_before") {
      const joinedDate = new Date(userStats.created_at);
      const cutoffDate = new Date(requirement.date);
      if (joinedDate <= cutoffDate) {
        earned.push(badge.id);
      }
    }
  });

  return earned;
};
