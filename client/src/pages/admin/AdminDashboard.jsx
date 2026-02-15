import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  FileText,
  MessageSquare,
  Eye,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Activity,
  Shield,
  Settings,
  RefreshCw,
  Filter,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Flag,
  UserPlus,
  FileCheck,
  Ban,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "axios";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Spinner from "../../components/common/Spinner";
import { formatNumber } from "../../utils/formatNumber";
import { formatRelativeTime } from "../../utils/formatDate";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState("week");

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setRefreshing(true);

      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats(response.data.data.statistics || {});
      setRecentArticles(response.data.data.recentArticles || []);
      setRecentUsers(response.data.data.recentUsers || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (!silent) toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Skeleton loader component
  const StatSkeleton = () => (
    <Card>
      <CardBody className="p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </CardBody>
    </Card>
  );

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
        <Container>
          <div className="mb-8">
            <div className="w-64 h-10 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
            <div className="w-96 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </div>
        </Container>
      </div>
    );
  }

  // Main stats cards with improved design
  const statsCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "blue",
      bgColor: "bg-blue-500",
      link: "/admin/users",
      change: 12.5,
      changeType: "increase",
      subtitle: `+${stats?.newUsersToday || 0} today`,
    },
    {
      title: "Total Articles",
      value: stats?.totalArticles || 0,
      icon: FileText,
      color: "green",
      bgColor: "bg-green-500",
      link: "/admin/articles",
      change: 8.2,
      changeType: "increase",
      subtitle: `${stats?.publishedArticles || 0} published`,
    },
    {
      title: "Total Comments",
      value: stats?.totalComments || 0,
      icon: MessageSquare,
      color: "purple",
      bgColor: "bg-purple-500",
      link: "/admin/comments",
      change: 15.3,
      changeType: "increase",
      subtitle: `${stats?.pendingComments || 0} pending`,
    },
    {
      title: "Pending Items",
      value: (stats?.pendingArticles || 0) + (stats?.pendingAuthors || 0),
      icon: Clock,
      color: "orange",
      bgColor: "bg-orange-500",
      link: "/admin/articles?status=pending",
      change: 0,
      changeType: "neutral",
      subtitle: "Need attention",
    },
  ];

  // Alert cards for urgent items
  const alertCards = [
    {
      title: "Pending Articles",
      value: stats?.pendingArticles || 0,
      icon: Clock,
      color: "yellow",
      link: "/admin/articles?status=pending",
      urgent: stats?.pendingArticles > 5,
    },
    {
      title: "Reported Content",
      value: (stats?.reportedArticles || 0) + (stats?.reportedComments || 0),
      icon: Flag,
      color: "red",
      link: "/admin/articles?status=reported",
      urgent:
        (stats?.reportedArticles || 0) + (stats?.reportedComments || 0) > 0,
    },
    {
      title: "Pending Authors",
      value: stats?.pendingAuthors || 0,
      icon: UserPlus,
      color: "blue",
      link: "/admin/authors/pending",
      urgent: stats?.pendingAuthors > 3,
    },
    {
      title: "Banned Users",
      value: stats?.bannedUsers || 0,
      icon: Ban,
      color: "gray",
      link: "/admin/users?status=banned",
      urgent: false,
    },
  ];

  // Sample chart data (in production, this would come from backend)
  const activityData = [
    { name: "Mon", users: 45, articles: 12, comments: 89 },
    { name: "Tue", users: 52, articles: 18, comments: 102 },
    { name: "Wed", users: 61, articles: 15, comments: 95 },
    { name: "Thu", users: 58, articles: 22, comments: 118 },
    { name: "Fri", users: 70, articles: 20, comments: 134 },
    { name: "Sat", users: 48, articles: 8, comments: 67 },
    { name: "Sun", users: 42, articles: 10, comments: 73 },
  ];

  const contentDistribution = [
    {
      name: "Published",
      value: stats?.publishedArticles || 0,
      color: "#10b981",
    },
    { name: "Pending", value: stats?.pendingArticles || 0, color: "#f59e0b" },
    { name: "Draft", value: stats?.draftArticles || 0, color: "#6b7280" },
    { name: "Rejected", value: stats?.rejectedArticles || 0, color: "#ef4444" },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header with actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back! Here's what's happening today.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => fetchDashboardData(true)}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition border border-gray-200 dark:border-gray-700"
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <Link to="/admin/settings">
                <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon;
              const TrendIcon =
                stat.changeType === "increase"
                  ? TrendingUp
                  : stat.changeType === "decrease"
                    ? TrendingDown
                    : Activity;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={stat.link}>
                    <Card hover className="relative overflow-hidden">
                      <CardBody className="p-6">
                        {/* Background decoration */}
                        <div
                          className={`absolute top-0 right-0 w-32 h-32 ${stat.bgColor} opacity-10 rounded-full -mr-16 -mt-16`}
                        ></div>

                        <div className="relative">
                          <div className="flex items-center justify-between mb-4">
                            <div
                              className={`p-3 rounded-xl ${stat.bgColor} bg-opacity-10`}
                            >
                              <Icon
                                className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`}
                                style={{
                                  color: stat.bgColor.replace("bg-", ""),
                                }}
                              />
                            </div>
                            {stat.change !== 0 && (
                              <div
                                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                  stat.changeType === "increase"
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    : stat.changeType === "decrease"
                                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                }`}
                              >
                                <TrendIcon className="h-3 w-3" />
                                {stat.change}%
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              {stat.title}
                            </p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                              {typeof stat.value === "number"
                                ? formatNumber(stat.value)
                                : stat.value}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {stat.subtitle}
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Alert Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {alertCards.map((alert, index) => {
              const Icon = alert.icon;
              const colorClasses = {
                yellow:
                  "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
                red: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
                blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
                gray: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
              };
              const iconColors = {
                yellow: "text-yellow-600 dark:text-yellow-400",
                red: "text-red-600 dark:text-red-400",
                blue: "text-blue-600 dark:text-blue-400",
                gray: "text-gray-600 dark:text-gray-400",
              };

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  <Link to={alert.link}>
                    <Card
                      hover
                      className={`border-2 ${colorClasses[alert.color]} ${alert.urgent ? "ring-2 ring-offset-2 ring-red-500 dark:ring-offset-gray-900" : ""}`}
                    >
                      <CardBody className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${colorClasses[alert.color]}`}
                            >
                              <Icon
                                className={`h-5 w-5 ${iconColors[alert.color]}`}
                              />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {alert.title}
                              </p>
                              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {alert.value}
                              </p>
                            </div>
                          </div>
                          {alert.urgent && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
                              <Zap className="h-3 w-3" />
                              Urgent
                            </div>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Activity Chart */}
            <Card className="lg:col-span-2">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Weekly Activity
                  </h2>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                      Week
                    </button>
                    <button className="px-3 py-1 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition">
                      Month
                    </button>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient
                        id="colorUsers"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorArticles"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorComments"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8b5cf6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#374151"
                      opacity={0.1}
                    />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorUsers)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="articles"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorArticles)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="comments"
                      stroke="#8b5cf6"
                      fillOpacity={1}
                      fill="url(#colorComments)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Users
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Articles
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Comments
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Content Distribution */}
            <Card>
              <CardBody className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Content Status
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={contentDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {contentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {contentDistribution.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Recent Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Articles */}
            <Card>
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Recent Articles
                  </h2>
                  <Link
                    to="/admin/articles"
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1"
                  >
                    View All
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
                {recentArticles.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No recent articles
                  </p>
                ) : (
                  <div className="space-y-4">
                    {recentArticles.slice(0, 5).map((article, index) => (
                      <motion.div
                        key={article.article_id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            article.status === "published"
                              ? "bg-green-100 dark:bg-green-900/30"
                              : article.status === "pending"
                                ? "bg-yellow-100 dark:bg-yellow-900/30"
                                : "bg-gray-100 dark:bg-gray-800"
                          }`}
                        >
                          <FileText
                            className={`h-4 w-4 ${
                              article.status === "published"
                                ? "text-green-600 dark:text-green-400"
                                : article.status === "pending"
                                  ? "text-yellow-600 dark:text-yellow-400"
                                  : "text-gray-600 dark:text-gray-400"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/articles/${article.slug}`}
                            className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition line-clamp-1"
                          >
                            {article.title}
                          </Link>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            by {article.username} •{" "}
                            {formatRelativeTime(article.created_at)}
                          </p>
                          <span
                            className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                              article.status === "published"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : article.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                            }`}
                          >
                            {article.status}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Recent Users */}
            <Card>
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Recent Users
                  </h2>
                  <Link
                    to="/admin/users"
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1"
                  >
                    View All
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
                {recentUsers.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No recent users
                  </p>
                ) : (
                  <div className="space-y-4">
                    {recentUsers.slice(0, 5).map((user, index) => (
                      <motion.div
                        key={user.user_id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/admin/users`}
                            className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition"
                          >
                            {user.full_name || user.username}
                          </Link>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                user.role === "admin"
                                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                  : user.role === "author"
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                              }`}
                            >
                              {user.role}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatRelativeTime(user.created_at)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Quick Actions Grid */}
          <Card>
            <CardBody className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <Link
                  to="/admin/users"
                  className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl hover:shadow-lg transition-all group"
                >
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
                    Manage Users
                  </span>
                </Link>

                <Link
                  to="/admin/articles"
                  className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl hover:shadow-lg transition-all group"
                >
                  <FileText className="h-8 w-8 text-green-600 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
                    Articles
                  </span>
                </Link>

                <Link
                  to="/admin/comments"
                  className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl hover:shadow-lg transition-all group"
                >
                  <MessageSquare className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
                    Comments
                  </span>
                </Link>

                <Link
                  to="/admin/articles?status=pending"
                  className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl hover:shadow-lg transition-all group"
                >
                  <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
                    Pending
                  </span>
                </Link>

                <Link
                  to="/admin/articles?status=reported"
                  className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl hover:shadow-lg transition-all group"
                >
                  <Flag className="h-8 w-8 text-red-600 dark:text-red-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
                    Reported
                  </span>
                </Link>

                <Link
                  to="/admin/settings"
                  className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl hover:shadow-lg transition-all group"
                >
                  <Settings className="h-8 w-8 text-gray-600 dark:text-gray-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
                    Settings
                  </span>
                </Link>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
};

export default AdminDashboard;
