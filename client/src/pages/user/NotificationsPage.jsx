import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  UserPlus,
  MessageSquare,
  Heart,
  FileCheck,
  FileX,
  FileText,
  Inbox,
} from "lucide-react";
import axios from "axios";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import { formatRelativeTime } from "../../utils/formatDate";
import toast from "react-hot-toast";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      const params = new URLSearchParams();
      if (filter === "unread") {
        params.append("unread_only", "true");
      }

      const response = await axios.get(
        `${API_URL}/notifications?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications(response.data.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications(
        notifications.map((n) =>
          n.notification_id === notificationId ? { ...n, is_read: true } : n
        )
      );
    } catch (error) {
      console.error("Error marking as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/notifications/read-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      setDeleting(notificationId);
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(
        notifications.filter((n) => n.notification_id !== notificationId)
      );
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    } finally {
      setDeleting(null);
    }
  };

  const clearReadNotifications = async () => {
    if (!window.confirm("Delete all read notifications?")) return;

    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/notifications/clear-read`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(notifications.filter((n) => !n.is_read));
      toast.success("Read notifications cleared");
    } catch (error) {
      console.error("Error clearing notifications:", error);
      toast.error("Failed to clear notifications");
    }
  };

  const getNotificationIcon = (type) => {
    const iconProps = { className: "h-6 w-6" };

    switch (type) {
      case "follow":
        return (
          <UserPlus
            {...iconProps}
            className="h-6 w-6 text-blue-600 dark:text-blue-400"
          />
        );
      case "comment":
      case "reply":
        return (
          <MessageSquare
            {...iconProps}
            className="h-6 w-6 text-green-600 dark:text-green-400"
          />
        );
      case "like":
        return (
          <Heart
            {...iconProps}
            className="h-6 w-6 text-red-600 dark:text-red-400"
          />
        );
      case "article_approved":
        return (
          <FileCheck
            {...iconProps}
            className="h-6 w-6 text-green-600 dark:text-green-400"
          />
        );
      case "article_rejected":
        return (
          <FileX
            {...iconProps}
            className="h-6 w-6 text-red-600 dark:text-red-400"
          />
        );
      case "article_published":
        return (
          <FileText
            {...iconProps}
            className="h-6 w-6 text-purple-600 dark:text-purple-400"
          />
        );
      default:
        return (
          <Bell
            {...iconProps}
            className="h-6 w-6 text-gray-600 dark:text-gray-400"
          />
        );
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "follow":
        return "bg-blue-100 dark:bg-blue-900/30";
      case "comment":
      case "reply":
        return "bg-green-100 dark:bg-green-900/30";
      case "like":
        return "bg-red-100 dark:bg-red-900/30";
      case "article_approved":
        return "bg-green-100 dark:bg-green-900/30";
      case "article_rejected":
        return "bg-red-100 dark:bg-red-900/30";
      case "article_published":
        return "bg-purple-100 dark:bg-purple-900/30";
      default:
        return "bg-gray-100 dark:bg-gray-800";
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

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
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Notifications
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Stay updated with your activity
            </p>
          </div>

          {/* Filters & Actions */}
          <Card className="mb-6">
            <CardBody className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Filter Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      filter === "all"
                        ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    onClick={() => setFilter("unread")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      filter === "unread"
                        ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={markAllAsRead}
                    >
                      <CheckCheck className="h-4 w-4 mr-2" />
                      Mark All Read
                    </Button>
                  )}
                  {notifications.filter((n) => n.is_read).length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearReadNotifications}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Read
                    </Button>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <Card>
              <CardBody className="p-12">
                <div className="flex flex-col items-center justify-center">
                  <Inbox className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No notifications
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    {filter === "unread"
                      ? "You're all caught up!"
                      : "We'll notify you when something happens"}
                  </p>
                </div>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.notification_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    hover
                    className={`relative ${
                      !notification.is_read
                        ? "ring-2 ring-primary-200 dark:ring-primary-800"
                        : ""
                    }`}
                  >
                    <CardBody className="p-6">
                      <div className="flex gap-4">
                        {/* Icon */}
                        <div
                          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getNotificationColor(
                            notification.type
                          )}`}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                {notification.title}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-4">
                                <p className="text-sm text-gray-500 dark:text-gray-500">
                                  {formatRelativeTime(notification.created_at)}
                                </p>
                                {notification.link && (
                                  <Link
                                    to={notification.link}
                                    onClick={() => {
                                      if (!notification.is_read) {
                                        markAsRead(notification.notification_id);
                                      }
                                    }}
                                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                                  >
                                    View →
                                  </Link>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              {!notification.is_read && (
                                <button
                                  onClick={() =>
                                    markAsRead(notification.notification_id)
                                  }
                                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                                  title="Mark as read"
                                >
                                  <Check className="h-5 w-5" />
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  deleteNotification(notification.notification_id)
                                }
                                disabled={deleting === notification.notification_id}
                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition disabled:opacity-50"
                                title="Delete"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Unread Indicator */}
                      {!notification.is_read && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-16 bg-primary-500 rounded-r"></div>
                      )}
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

export default NotificationsPage;
